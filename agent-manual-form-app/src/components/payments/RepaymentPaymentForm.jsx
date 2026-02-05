import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Lock, User, Phone, Mail, AlertCircle } from 'lucide-react';

export default function RepaymentPaymentForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [tokenError, setTokenError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);

    const [formData, setFormData] = useState({
        customer_name: '',
        payment_description: '',
        mobile_number: '',
        email: '',
        amount: '',
        loan_ref: '',
        instalment_number: 0,
        token: '',
        product_brand: 'koolboks' // ✅ Use existing valid choice
    });

    // Extract token from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            setTokenError('invalid');
            setIsLoading(false);
            return;
        }

        // Validate token with Django
        validateToken(token);
    }, []);

    const validateToken = async (token) => {
        try {
            //const response = await fetch(`http://127.0.0.1:8000/v1/api/validate-payment-token/${token}`);
            const response = await fetch(`http://127.0.0.1:8080/v1/api/payment-tokens/validate/${token}`);
            const data = await response.json();

            if (response.ok && data.valid) {
                // Token is valid - pre-fill form
                const instalmentOrdinal = getOrdinal(data.instalmentNumber);

                setFormData({
                    customer_name: data.customerName,
                    payment_description: `${instalmentOrdinal} Instalment`,
                    mobile_number: data.phone,
                    email: data.email,
                    amount: data.amount,
                    loan_ref: data.loanReference,
                    instalment_number: data.instalmentNumber,
                    token: token,
                    product_brand: 'koolboks' // ✅ Use existing valid choice
                });

                setTokenValid(true);
            } else {
                setTokenError(data.error || 'invalid');
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setTokenError('server_error');
        } finally {
            setIsLoading(false);
        }
    };

    const getOrdinal = (n) => {
        if (n >= 11 && n <= 13) return `${n}th`;
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Only allow digits for mobile number
        if (name === 'mobile_number' && !/^\d*$/.test(value)) {
            return;
        }

        // Limit mobile number to 11 digits
        if (name === 'mobile_number' && value.length > 11) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.customer_name.trim()) {
            alert('Please enter your name');
            return false;
        }

        if (formData.mobile_number.length !== 11) {
            alert('Mobile number must be exactly 11 digits');
            return false;
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // ✅ Loan Repayment payload for CreateLoanRepaymentPaymentView
            const payload = {
                customer_name: formData.customer_name,
                email: formData.email,
                mobile_number: formData.mobile_number,
                token: formData.token,  // ✅ Required by CreateLoanRepaymentPaymentView
                // Note: loan_ref, instalment_number, amount come from token validation
            };

            console.log('📤 Sending payload:', payload);

            // Submit to Django backend - LOAN REPAYMENT endpoint
            const response = await fetch('http://127.0.0.1:8000/v1/api/loan-repayment-payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            console.log('📥 Full Django Response:', JSON.stringify(data, null, 2));

            if (response.ok && data.ref) {
                // Initialize Paystack payment
                initializePaystack(data);
            } else {
                // ✅ Better error handling - show full details
                console.error('Server response:', data);
                console.error('Full error details:', JSON.stringify(data, null, 2));

                // Extract specific error messages
                let errorMsg = 'Failed to create payment';

                if (data.errors) {
                    // Django REST Framework validation errors
                    const errorFields = Object.keys(data.errors);
                    errorMsg = errorFields.map(field => {
                        const fieldErrors = Array.isArray(data.errors[field])
                            ? data.errors[field].join(', ')
                            : data.errors[field];
                        return `${field}: ${fieldErrors}`;
                    }).join('\n');
                } else if (data.agent_id) {
                    errorMsg = Array.isArray(data.agent_id) ? data.agent_id[0] : data.agent_id;
                } else if (data.message) {
                    errorMsg = data.message;
                }

                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Payment creation error:', error);
            alert(error.message || 'Failed to create payment. Please try again.');
            setIsSubmitting(false);
        }
    };

    const initializePaystack = (paymentData) => {
        if (typeof window.PaystackPop === 'undefined') {
            alert('Payment gateway is loading. Please try again in a moment.');
            setIsSubmitting(false);
            return;
        }

        const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

        // ✅ FIX: Ensure amount is in kobo (integer)
        // Django might return 'amount_in_kobo' or 'amount_value'
        let amountInKobo;

        if (paymentData.amount_in_kobo) {
            amountInKobo = parseInt(paymentData.amount_in_kobo);
        } else if (paymentData.amount_value) {
            amountInKobo = parseInt(paymentData.amount_value);
        } else if (paymentData.amount) {
            // If only amount is provided, convert Naira to kobo
            amountInKobo = parseInt(paymentData.amount) * 100;
        } else {
            alert('Invalid payment amount. Please try again.');
            setIsSubmitting(false);
            return;
        }

        console.log('💰 Paystack amount (kobo):', amountInKobo);
        console.log('💳 Paystack reference:', paymentData.ref);
        console.log('📧 Paystack email:', paymentData.email);

        const handler = window.PaystackPop.setup({
            key: PUBLIC_KEY,
            email: paymentData.email,
            amount: amountInKobo,  // ✅ Must be integer in kobo
            ref: paymentData.ref,
            currency: 'NGN',
            callback: function(response) {
                // Payment successful
                handlePaymentSuccess(response.reference);
            },
            onClose: function() {
                setIsSubmitting(false);
                alert('Payment window closed. You can try again when ready.');
            }
        });

        handler.openIframe();
    };

    const handlePaymentSuccess = async (paymentReference) => {
        try {
            // Mark token as used
            await fetch(`http://127.0.0.1:8080/v1/api/payment-tokens/mark-used/${formData.token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentReference: paymentReference
                })
            });

            // Set payment details for success page
            setPaymentDetails({
                instalmentNumber: formData.instalment_number,
                instalmentOrdinal: getOrdinal(formData.instalment_number),
                amount: formData.amount,
                loanRef: formData.loan_ref,
                paymentReference: paymentReference,
                customerName: formData.customer_name
            });

            // Show success page with fireworks!
            setPaymentSuccess(true);

        } catch (error) {
            console.error('Error marking token as used:', error);
            // Still show success since payment went through
            setPaymentSuccess(true);
        }
    };

    // Load Paystack script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7623b' }}>
                <div className="bg-black rounded-lg p-8 text-white text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                    <p>Validating payment link...</p>
                </div>
            </div>
        );
    }

    // Token Error States
    if (tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
                <div className="bg-black rounded-2xl p-8 max-w-md text-white text-center">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold mb-4">
                        {tokenError === 'used' && '❌ Payment Already Made'}
                        {tokenError === 'expired' && '⏰ Payment Link Expired'}
                        {tokenError === 'invalid' && '🚫 Invalid Payment Link'}
                        {tokenError === 'server_error' && '⚠️ Server Error'}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {tokenError === 'used' && 'This instalment has already been paid.'}
                        {tokenError === 'expired' && 'This payment link has expired. Please contact support.'}
                        {tokenError === 'invalid' && 'This payment link is invalid or has been removed.'}
                        {tokenError === 'server_error' && 'Unable to validate payment link. Please try again.'}
                    </p>
                    <p className="text-sm text-gray-500">
                        For assistance, contact support@koolboks.com
                    </p>
                </div>
            </div>
        );
    }

    // Success Page with FIREWORKS! 🎆
    if (paymentSuccess && paymentDetails) {
        return <SuccessPageWithFireworks paymentDetails={paymentDetails} />;
    }

    // Payment Form
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
            <div className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                        <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                        Loan Repayment
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        {formData.payment_description} Payment
                    </p>
                </div>

                {/* Payment Amount Display */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6 border-2 border-[#f7623b]">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-2">Amount Due</p>
                        <div className="flex items-center justify-center gap-2">
                            <DollarSign className="w-6 h-6 text-[#f7623b]" />
                            <h2 className="text-3xl font-bold text-white">
                                ₦{Number(formData.amount).toLocaleString()}
                            </h2>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            Loan Reference: {formData.loan_ref}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Customer Name */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <User className="w-4 h-4 mr-2" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                        />
                    </div>

                    {/* Payment Description (Read-only) */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Payment Description
                        </label>
                        <input
                            type="text"
                            value={formData.payment_description}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <Phone className="w-4 h-4 mr-2" />
                            Mobile Number *
                        </label>
                        <input
                            type="tel"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            placeholder="08012345678"
                            maxLength={11}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.mobile_number.length}/11 digits
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                        />
                    </div>

                    {/* Amount (Readonly) */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <Lock className="w-4 h-4 mr-2" />
                            Amount *
                        </label>
                        <input
                            type="text"
                            value={`₦${Number(formData.amount).toLocaleString()}`}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Loan Reference (Readonly) */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <Lock className="w-4 h-4 mr-2" />
                            Loan Reference
                        </label>
                        <input
                            type="text"
                            value={formData.loan_ref}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full font-bold py-4 text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#f7623b' }}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Make Payment
                            </>
                        )}
                    </button>

                    {/* Security Notice */}
                    <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded mt-4">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">🔒 Secure Payment:</span> Your payment is
                            processed securely through Paystack. Your card information is never stored on our servers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ================================================================
// SUCCESS PAGE WITH CONTINUOUS FIREWORKS! 🎆🎇🎆
// ================================================================

function SuccessPageWithFireworks({ paymentDetails }) {
    useEffect(() => {
        // Continuous fireworks!
        const interval = setInterval(() => {
            launchFirework();
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const launchFirework = () => {
        const firework = document.createElement('div');
        firework.className = 'firework';

        // Random position
        const left = Math.random() * 100;
        firework.style.left = `${left}%`;

        document.getElementById('fireworks-container').appendChild(firework);

        // Remove after animation
        setTimeout(() => {
            firework.remove();
        }, 2000);
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
            {/* Fireworks Container */}
            <div id="fireworks-container" className="absolute inset-0 pointer-events-none">
                <style>{`
                    @keyframes firework {
                        0% {
                            transform: translateY(100vh) scale(0);
                            opacity: 1;
                        }
                        50% {
                            transform: translateY(30vh) scale(1);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(30vh) scale(1);
                            opacity: 0;
                        }
                    }
                    
                    .firework {
                        position: absolute;
                        bottom: 0;
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        animation: firework 2s ease-out;
                    }
                    
                    .firework::before,
                    .firework::after {
                        content: '';
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                    }
                    
                    .firework::before {
                        box-shadow: 
                            0 0 10px 5px #ff0,
                            0 0 20px 10px #f0f,
                            0 0 30px 15px #0ff,
                            10px 0 10px 5px #ff0,
                            -10px 0 10px 5px #0ff,
                            0 10px 10px 5px #f0f,
                            0 -10px 10px 5px #ff0,
                            15px 15px 10px 5px #0ff,
                            -15px 15px 10px 5px #f0f;
                    }
                    
                    .firework::after {
                        box-shadow: 
                            20px 20px 10px 5px #f7623b,
                            -20px 20px 10px 5px #ff8c42,
                            20px -20px 10px 5px #ffc107,
                            -20px -20px 10px 5px #28a745;
                    }
                `}</style>
            </div>

            {/* Success Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-8 border-4 border-[#f7623b]">

                    {/* Animated Success Icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#28a745] to-[#20c997] rounded-full mb-6 animate-bounce">
                            <span className="text-6xl">✅</span>
                        </div>

                        <h1 className="text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
                            🎉 Payment Successful! 🎉
                        </h1>

                        <p className="text-2xl text-white mb-2">
                            {paymentDetails.instalmentOrdinal} Instalment Paid
                        </p>

                        <div className="inline-block bg-gradient-to-r from-[#f7623b] to-[#ff8c42] px-6 py-3 rounded-lg mt-4">
                            <p className="text-3xl font-bold text-black">
                                ₦{Number(paymentDetails.amount).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-black rounded-lg p-6 mb-6 border-2 border-[#f7623b]">
                        <h3 className="text-xl font-bold text-[#f7623b] mb-4">Payment Details</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Customer:</span>
                                <span className="text-white font-semibold">{paymentDetails.customerName}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Instalment:</span>
                                <span className="text-white font-semibold">{paymentDetails.instalmentOrdinal}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Loan Reference:</span>
                                <span className="text-white font-semibold">{paymentDetails.loanRef}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Payment Reference:</span>
                                <span className="text-white font-semibold text-sm">{paymentDetails.paymentReference}</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-lg p-6 border-2 border-green-500">
                        <h3 className="text-lg font-bold text-white mb-3">✨ What's Next?</h3>
                        <ul className="text-white space-y-2 text-sm">
                            <li>✅ A payment confirmation has been sent to your email</li>
                            <li>✅ Your guarantor and agent have been notified</li>
                            <li>📅 You'll receive a reminder for your next payment 7 days before it's due</li>
                            <li>📊 Your loan progress has been updated</li>
                        </ul>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => window.close()}
                        className="w-full mt-6 py-4 bg-[#f7623b] text-white font-bold rounded-lg hover:opacity-90 transition"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        </div>
    );
}



































// import React, { useState, useEffect } from 'react';
// import { CreditCard, DollarSign, Lock, User, Phone, Mail, AlertCircle } from 'lucide-react';
//
// export default function RepaymentPaymentForm() {
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [tokenError, setTokenError] = useState(null);
//
//     const [formData, setFormData] = useState({
//         customer_name: '',
//         payment_description: '',
//         mobile_number: '',
//         email: '',
//         amount: '',
//         loan_ref: '',
//         instalment_number: 0,
//         token: '',
//         has_late_fee: false,
//         late_fee: 0
//     });
//
//     // Extract token from URL
//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const token = urlParams.get('token');
//
//         if (!token) {
//             setTokenError('invalid');
//             setIsLoading(false);
//             return;
//         }
//
//         // Validate token with Spring Boot
//         validateToken(token);
//     }, []);
//
//     const validateToken = async (token) => {
//         try {
//
//             console.log('=== VALIDATING TOKEN ===');
//             console.log('Token from URL:', token);
//             // Call Spring Boot to validate token
//             const response = await fetch(`http://127.0.0.1:8080/v1/api/payment-tokens/validate/${token}`);
//             const data = await response.json();
//
//             if (response.ok && data.valid) {
//                 // Token is valid - pre-fill form
//                 const instalmentOrdinal = getOrdinal(data.instalmentNumber);
//
//                 setFormData({
//                     customer_name: data.customerName,
//                     payment_description: `${instalmentOrdinal} Instalment${data.hasLateFee ? ' (with late fee)' : ''}`,
//                     mobile_number: data.phone,
//                     email: data.email,
//                     amount: data.amount,  // Current amount (includes late fee if applicable)
//                     loan_ref: data.loanReference,
//                     instalment_number: data.instalmentNumber,
//                     payment_token: token,
//                     has_late_fee: data.hasLateFee || false,
//                     late_fee: data.lateFee || 0
//                 });
//
//                 setIsLoading(false);
//             } else {
//                 setTokenError(data.error || 'invalid');
//                 setIsLoading(false);
//             }
//         } catch (error) {
//             console.error('Token validation error:', error);
//             setTokenError('server_error');
//             setIsLoading(false);
//         }
//     };
//
//     const getOrdinal = (n) => {
//         if (n >= 11 && n <= 13) return `${n}th`;
//         switch (n % 10) {
//             case 1: return `${n}st`;
//             case 2: return `${n}nd`;
//             case 3: return `${n}rd`;
//             default: return `${n}th`;
//         }
//     };
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//
//         // Only allow digits for mobile number
//         if (name === 'mobile_number' && !/^\d*$/.test(value)) {
//             return;
//         }
//
//         // Limit mobile number to 11 digits
//         if (name === 'mobile_number' && value.length > 11) {
//             return;
//         }
//
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
//
//     const validateForm = () => {
//         if (!formData.customer_name.trim()) {
//             alert('Please enter your name');
//             return false;
//         }
//
//         if (formData.mobile_number.length !== 11) {
//             alert('Mobile number must be exactly 11 digits');
//             return false;
//         }
//
//         if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             alert('Please enter a valid email address');
//             return false;
//         }
//
//         return true;
//     };
//
//     const handleSubmit = async () => {
//         if (!validateForm()) return;
//
//         setIsSubmitting(true);
//
//         // Get token directly from URL
//         const urlParams = new URLSearchParams(window.location.search);
//         const token = urlParams.get('token');
//
//         console.log('=== SUBMITTING PAYMENT ===');
//         console.log('Token from URL:', token);
//         console.log('Customer Name:', formData.customer_name);
//         console.log('Email:', formData.email);
//         console.log('Mobile:', formData.mobile_number);
//
//         try {
//             const payload = {
//                 customer_name: formData.customer_name,
//                 mobile_number: formData.mobile_number,
//                 email: formData.email,
//                 token: token  // ✅ Using token directly from URL
//             };
//
//             console.log('📤 Sending payload:', payload);
//
//             const response = await fetch('http://127.0.0.1:8000/v1/api/loan-repayment-payment/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload),
//             });
//
//             const data = await response.json();
//
//             console.log('📥 Response:', data);
//
//             if (response.ok && data.ref) {
//                 initializePaystack(data);
//             } else {
//                 throw new Error(data.message || 'Failed to create payment');
//             }
//         } catch (error) {
//             console.error('Payment creation error:', error);
//             alert(error.message || 'Failed to create payment. Please try again.');
//             setIsSubmitting(false);
//         }
//     };
//     // const handleSubmit = async () => {
//     //     if (!validateForm()) return;
//     //
//     //     setIsSubmitting(true);
//     //
//     //
//     //     // ADD THESE DEBUG LOGS:
//     //     console.log('=== SUBMITTING PAYMENT ===');
//     //     console.log('Token:', formData.token);
//     //     console.log('Customer Name:', formData.customer_name);
//     //     console.log('Email:', formData.email);
//     //     console.log('Mobile:', formData.mobile_number);
//     //
//     //     try {
//     //         // Call the LOAN REPAYMENT endpoint
//     //         const response = await fetch('http://127.0.0.1:8000/v1/api/loan-repayment-payment/', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //             body: JSON.stringify({
//     //                 customer_name: formData.customer_name,
//     //                 mobile_number: formData.mobile_number,
//     //                 email: formData.email,
//     //                 payment_token: formData.token
//     //             }),
//     //         });
//     //
//     //
//     //
//     //         const data = await response.json();
//     //
//     //         console.log(data)
//     //
//     //         // console.log('Submitting payment with token:', formData.token);
//     //         // console.log('Request body:', {
//     //         //     customer_name: formData.customer_name,
//     //         //     mobile_number: formData.mobile_number,
//     //         //     email: formData.email,
//     //         //     payment_token: formData.token});
//     //
//     //         if (response.ok && data.ref) {
//     //             // Initialize Paystack payment
//     //             initializePaystack(data);
//     //         } else {
//     //             throw new Error(data.message || 'Failed to create payment');
//     //         }
//     //     } catch (error) {
//     //         console.error('Payment creation error:', error);
//     //         console.error('Full response:', await response?.text());  // See full error
//     //         alert(error.message || 'Failed to create payment. Please try again.');
//     //         setIsSubmitting(false);
//     //     }
//     // };
//
//     const initializePaystack = (paymentData) => {
//         if (typeof window.PaystackPop === 'undefined') {
//             alert('Payment gateway is loading. Please try again in a moment.');
//             setIsSubmitting(false);
//             return;
//         }
//
//         const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
//
//         const handler = window.PaystackPop.setup({
//             key: PUBLIC_KEY,
//             email: paymentData.email,
//             amount: paymentData.amount_value,
//             ref: paymentData.ref,
//             currency: 'NGN',
//             callback: function(response) {
//                 // Payment successful - Redirect to Django verification
//                 window.location.href = `http://127.0.0.1:8000/v1/verify-loan-repayment/${response.reference}`;
//             },
//             onClose: function() {
//                 setIsSubmitting(false);
//                 alert('Payment window closed. You can try again when ready.');
//             }
//         });
//
//         handler.openIframe();
//     };
//
//     // Load Paystack script
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://js.paystack.co/v1/inline.js';
//         script.async = true;
//         document.body.appendChild(script);
//
//         return () => {
//             if (document.body.contains(script)) {
//                 document.body.removeChild(script);
//             }
//         };
//     }, []);
//
//     // Loading State
//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7623b' }}>
//                 <div className="bg-black rounded-lg p-8 text-white text-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
//                     <p>Validating payment link...</p>
//                 </div>
//             </div>
//         );
//     }
//
//     // Token Error States
//     if (tokenError) {
//         return (
//             <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
//                 <div className="bg-black rounded-2xl p-8 max-w-md text-white text-center">
//                     <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
//                     <h2 className="text-2xl font-bold mb-4">
//                         {tokenError === 'used' && '❌ Payment Already Made'}
//                         {tokenError === 'expired' && '⏰ Payment Link Expired'}
//                         {tokenError === 'invalid' && '🚫 Invalid Payment Link'}
//                         {tokenError === 'server_error' && '⚠️ Server Error'}
//                     </h2>
//                     <p className="text-gray-400 mb-6">
//                         {tokenError === 'used' && 'This instalment has already been paid.'}
//                         {tokenError === 'expired' && 'This payment link has expired. A new link with late fees will be sent to you.'}
//                         {tokenError === 'invalid' && 'This payment link is invalid or has been removed.'}
//                         {tokenError === 'server_error' && 'Unable to validate payment link. Please try again.'}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                         For assistance, contact support@koolboks.com
//                     </p>
//                 </div>
//             </div>
//         );
//     }
//
//     // Payment Form
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
//                         <CreditCard className="w-8 h-8 text-white" />
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
//                         Loan Repayment
//                     </h1>
//                     <p className="text-sm sm:text-base text-gray-400">
//                         {formData.payment_description} Payment
//                     </p>
//                 </div>
//
//                 {/* Late Fee Warning */}
//                 {formData.has_late_fee && (
//                     <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6 rounded">
//                         <div className="flex items-start">
//                             <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
//                             <div>
//                                 <p className="text-red-200 font-semibold">Late Payment Fee Applied</p>
//                                 <p className="text-red-300 text-sm mt-1">
//                                     A 2.5% late fee of ₦{Number(formData.late_fee).toLocaleString()} has been added to your payment amount.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Payment Amount Display */}
//                 <div className="bg-gray-900 rounded-lg p-6 mb-6 border-2 border-[#f7623b]">
//                     <div className="text-center">
//                         <p className="text-gray-400 text-sm mb-2">Amount Due</p>
//                         <div className="flex items-center justify-center gap-2">
//                             <DollarSign className="w-6 h-6 text-[#f7623b]" />
//                             <h2 className="text-3xl font-bold text-white">
//                                 ₦{Number(formData.amount).toLocaleString()}
//                             </h2>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-3">
//                             Loan Reference: {formData.loan_ref}
//                         </p>
//                     </div>
//                 </div>
//
//                 {/* Form */}
//                 <div className="space-y-6">
//                     {/* Customer Name */}
//                     <div>
//                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                             <User className="w-4 h-4 mr-2" />
//                             Full Name *
//                         </label>
//                         <input
//                             type="text"
//                             name="customer_name"
//                             value={formData.customer_name}
//                             onChange={handleChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                         />
//                     </div>
//
//                     {/* Payment Description (Read-only) */}
//                     <div>
//                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                             <CreditCard className="w-4 h-4 mr-2" />
//                             Payment Description
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.payment_description}
//                             readOnly
//                             className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                         />
//                     </div>
//
//                     {/* Mobile Number */}
//                     <div>
//                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                             <Phone className="w-4 h-4 mr-2" />
//                             Mobile Number *
//                         </label>
//                         <input
//                             type="tel"
//                             name="mobile_number"
//                             value={formData.mobile_number}
//                             onChange={handleChange}
//                             placeholder="08012345678"
//                             maxLength={11}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             {formData.mobile_number.length}/11 digits
//                         </p>
//                     </div>
//
//                     {/* Email */}
//                     <div>
//                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                             <Mail className="w-4 h-4 mr-2" />
//                             Email Address *
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                         />
//                     </div>
//
//                     {/* Amount (Readonly) */}
//                     <div>
//                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                             <Lock className="w-4 h-4 mr-2" />
//                             Amount *
//                         </label>
//                         <input
//                             type="text"
//                             value={`₦${Number(formData.amount).toLocaleString()}`}
//                             readOnly
//                             className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                         />
//                     </div>
//
//                     {/* Loan Reference (Readonly) */}
//                     <div>
//                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                             <Lock className="w-4 h-4 mr-2" />
//                             Loan Reference
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.loan_ref}
//                             readOnly
//                             className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                         />
//                     </div>
//
//                     {/* Submit Button */}
//                     <button
//                         onClick={handleSubmit}
//                         disabled={isSubmitting}
//                         className="w-full font-bold py-4 text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
//                         style={{ backgroundColor: '#f7623b' }}
//                     >
//                         {isSubmitting ? (
//                             <>
//                                 <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                                 Processing...
//                             </>
//                         ) : (
//                             <>
//                                 <Lock className="w-5 h-5" />
//                                 Make Payment
//                             </>
//                         )}
//                     </button>
//
//                     {/* Security Notice */}
//                     <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded mt-4">
//                         <p className="text-xs text-gray-400">
//                             <span className="font-semibold text-white">🔒 Secure Payment:</span> Your payment is
//                             processed securely through Paystack. Your card information is never stored on our servers.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// // import React, { useState, useEffect } from 'react';
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// // import { CreditCard, DollarSign, Lock, User, Phone, Mail, AlertCircle } from 'lucide-react';
// //
// // export default function RepaymentPaymentForm() {
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //     const [tokenValid, setTokenValid] = useState(false);
// //     const [tokenError, setTokenError] = useState(null);
// //     const [paymentSuccess, setPaymentSuccess] = useState(false);
// //     const [paymentDetails, setPaymentDetails] = useState(null);
// //
// //     const [formData, setFormData] = useState({
// //         customer_name: '',
// //         payment_description: '',
// //         mobile_number: '',
// //         email: '',
// //         amount: '',
// //         loan_ref: '',
// //         instalment_number: 0,
// //         token: ''
// //     });
// //
// //     // Extract token from URL
// //     useEffect(() => {
// //         const urlParams = new URLSearchParams(window.location.search);
// //         const token = urlParams.get('token');
// //
// //         if (!token) {
// //             setTokenError('invalid');
// //             setIsLoading(false);
// //             return;
// //         }
// //
// //         // Validate token with Django
// //         validateToken(token);
// //     }, []);
// //
// //     const validateToken = async (token) => {
// //         try {
// //             //const response = await fetch(`http://127.0.0.1:8000/v1/api/validate-payment-token/${token}`);
// //             const response = await fetch(`http://127.0.0.1:8080/v1/api/payment-tokens/validate/${token}`);
// //             const data = await response.json();
// //
// //             if (response.ok && data.valid) {
// //                 // Token is valid - pre-fill form
// //                 const instalmentOrdinal = getOrdinal(data.instalmentNumber);
// //
// //                 setFormData({
// //                     customer_name: data.customerName,
// //                     payment_description: `${instalmentOrdinal} Instalment`,
// //                     mobile_number: data.phone,
// //                     email: data.email,
// //                     amount: data.amount,
// //                     loan_ref: data.loanReference,
// //                     instalment_number: data.instalmentNumber,
// //                     token: token
// //                 });
// //
// //                 setTokenValid(true);
// //             } else {
// //                 setTokenError(data.error || 'invalid');
// //             }
// //         } catch (error) {
// //             console.error('Token validation error:', error);
// //             setTokenError('server_error');
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };
// //
// //     const getOrdinal = (n) => {
// //         if (n >= 11 && n <= 13) return `${n}th`;
// //         switch (n % 10) {
// //             case 1: return `${n}st`;
// //             case 2: return `${n}nd`;
// //             case 3: return `${n}rd`;
// //             default: return `${n}th`;
// //         }
// //     };
// //
// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //
// //         // Only allow digits for mobile number
// //         if (name === 'mobile_number' && !/^\d*$/.test(value)) {
// //             return;
// //         }
// //
// //         // Limit mobile number to 11 digits
// //         if (name === 'mobile_number' && value.length > 11) {
// //             return;
// //         }
// //
// //         setFormData(prev => ({
// //             ...prev,
// //             [name]: value
// //         }));
// //     };
// //
// //     const validateForm = () => {
// //         if (!formData.customer_name.trim()) {
// //             alert('Please enter your name');
// //             return false;
// //         }
// //
// //         if (formData.mobile_number.length !== 11) {
// //             alert('Mobile number must be exactly 11 digits');
// //             return false;
// //         }
// //
// //         if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
// //             alert('Please enter a valid email address');
// //             return false;
// //         }
// //
// //         return true;
// //     };
// //
// //     const handleSubmit = async () => {
// //         if (!validateForm()) return;
// //
// //         setIsSubmitting(true);
// //
// //         try {
// //             // Submit to Django backend (using existing payment system)
// //             const response = await fetch('http://127.0.0.1:8000/v1/api/loan-repayment-payment/', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({
// //                     customer_name: formData.customer_name,
// //                     payment_description: formData.payment_description,
// //                     mobile_number: formData.mobile_number,
// //                     email: formData.email,
// //                     amount: parseInt(formData.amount),
// //                     loan_ref: formData.loan_ref,
// //                     agent_id: null, // Not needed for repayment
// //                     product_brand: formData.product_brand, // Default
// //                     subsequent_payment: null
// //                 }),
// //             });
// //
// //             const data = await response.json();
// //
// //             if (response.ok && data.ref) {
// //                 // Initialize Paystack payment
// //                 initializePaystack(data);
// //             } else {
// //                 throw new Error(data.message || 'Failed to create payment');
// //             }
// //         } catch (error) {
// //             console.error('Payment creation error:', error);
// //             alert(error.message || 'Failed to create payment. Please try again.');
// //             setIsSubmitting(false);
// //         }
// //     };
// //
// //     const initializePaystack = (paymentData) => {
// //         if (typeof window.PaystackPop === 'undefined') {
// //             alert('Payment gateway is loading. Please try again in a moment.');
// //             setIsSubmitting(false);
// //             return;
// //         }
// //
// //         const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
// //
// //         const handler = window.PaystackPop.setup({
// //             key: PUBLIC_KEY,
// //             email: paymentData.email,
// //             amount: paymentData.amount_value,
// //             ref: paymentData.ref,
// //             currency: 'NGN',
// //             callback: function(response) {
// //                 // Payment successful
// //                 handlePaymentSuccess(response.reference);
// //             },
// //             onClose: function() {
// //                 setIsSubmitting(false);
// //                 alert('Payment window closed. You can try again when ready.');
// //             }
// //         });
// //
// //         handler.openIframe();
// //     };
// //
// //     const handlePaymentSuccess = async (paymentReference) => {
// //         try {
// //             // Mark token as used
// //             await fetch(`http://127.0.0.1:8080/v1/api/payment-tokens/mark-used/${formData.token}`, {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({
// //                     paymentReference: paymentReference
// //                 })
// //             });
// //
// //             // Set payment details for success page
// //             setPaymentDetails({
// //                 instalmentNumber: formData.instalment_number,
// //                 instalmentOrdinal: getOrdinal(formData.instalment_number),
// //                 amount: formData.amount,
// //                 loanRef: formData.loan_ref,
// //                 paymentReference: paymentReference,
// //                 customerName: formData.customer_name
// //             });
// //
// //             // Show success page with fireworks!
// //             setPaymentSuccess(true);
// //
// //         } catch (error) {
// //             console.error('Error marking token as used:', error);
// //             // Still show success since payment went through
// //             setPaymentSuccess(true);
// //         }
// //     };
// //
// //     // Load Paystack script
// //     useEffect(() => {
// //         const script = document.createElement('script');
// //         script.src = 'https://js.paystack.co/v1/inline.js';
// //         script.async = true;
// //         document.body.appendChild(script);
// //
// //         return () => {
// //             document.body.removeChild(script);
// //         };
// //     }, []);
// //
// //     // Loading State
// //     if (isLoading) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7623b' }}>
// //                 <div className="bg-black rounded-lg p-8 text-white text-center">
// //                     <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
// //                     <p>Validating payment link...</p>
// //                 </div>
// //             </div>
// //         );
// //     }
// //
// //     // Token Error States
// //     if (tokenError) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
// //                 <div className="bg-black rounded-2xl p-8 max-w-md text-white text-center">
// //                     <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
// //                     <h2 className="text-2xl font-bold mb-4">
// //                         {tokenError === 'used' && '❌ Payment Already Made'}
// //                         {tokenError === 'expired' && '⏰ Payment Link Expired'}
// //                         {tokenError === 'invalid' && '🚫 Invalid Payment Link'}
// //                         {tokenError === 'server_error' && '⚠️ Server Error'}
// //                     </h2>
// //                     <p className="text-gray-400 mb-6">
// //                         {tokenError === 'used' && 'This instalment has already been paid.'}
// //                         {tokenError === 'expired' && 'This payment link has expired. Please contact support.'}
// //                         {tokenError === 'invalid' && 'This payment link is invalid or has been removed.'}
// //                         {tokenError === 'server_error' && 'Unable to validate payment link. Please try again.'}
// //                     </p>
// //                     <p className="text-sm text-gray-500">
// //                         For assistance, contact support@koolboks.com
// //                     </p>
// //                 </div>
// //             </div>
// //         );
// //     }
// //
// //     // Success Page with FIREWORKS! 🎆
// //     if (paymentSuccess && paymentDetails) {
// //         return <SuccessPageWithFireworks paymentDetails={paymentDetails} />;
// //     }
// //
// //     // Payment Form
// //     return (
// //         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
// //             <div className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
// //                 {/* Header */}
// //                 <div className="text-center mb-8">
// //                     <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
// //                         <CreditCard className="w-8 h-8 text-white" />
// //                     </div>
// //                     <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
// //                         Loan Repayment
// //                     </h1>
// //                     <p className="text-sm sm:text-base text-gray-400">
// //                         {formData.payment_description} Payment
// //                     </p>
// //                 </div>
// //
// //                 {/* Payment Amount Display */}
// //                 <div className="bg-gray-900 rounded-lg p-6 mb-6 border-2 border-[#f7623b]">
// //                     <div className="text-center">
// //                         <p className="text-gray-400 text-sm mb-2">Amount Due</p>
// //                         <div className="flex items-center justify-center gap-2">
// //                             <DollarSign className="w-6 h-6 text-[#f7623b]" />
// //                             <h2 className="text-3xl font-bold text-white">
// //                                 ₦{Number(formData.amount).toLocaleString()}
// //                             </h2>
// //                         </div>
// //                         <p className="text-xs text-gray-500 mt-3">
// //                             Loan Reference: {formData.loan_ref}
// //                         </p>
// //                     </div>
// //                 </div>
// //
// //                 {/* Form */}
// //                 <div className="space-y-6">
// //                     {/* Customer Name */}
// //                     <div>
// //                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
// //                             <User className="w-4 h-4 mr-2" />
// //                             Full Name *
// //                         </label>
// //                         <input
// //                             type="text"
// //                             name="customer_name"
// //                             value={formData.customer_name}
// //                             onChange={handleChange}
// //                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
// //                         />
// //                     </div>
// //
// //                     {/* Payment Description (Read-only) */}
// //                     <div>
// //                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
// //                             <CreditCard className="w-4 h-4 mr-2" />
// //                             Payment Description
// //                         </label>
// //                         <input
// //                             type="text"
// //                             value={formData.payment_description}
// //                             readOnly
// //                             className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
// //                         />
// //                     </div>
// //
// //                     {/* Mobile Number */}
// //                     <div>
// //                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
// //                             <Phone className="w-4 h-4 mr-2" />
// //                             Mobile Number *
// //                         </label>
// //                         <input
// //                             type="tel"
// //                             name="mobile_number"
// //                             value={formData.mobile_number}
// //                             onChange={handleChange}
// //                             placeholder="08012345678"
// //                             maxLength={11}
// //                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
// //                         />
// //                         <p className="text-xs text-gray-500 mt-1">
// //                             {formData.mobile_number.length}/11 digits
// //                         </p>
// //                     </div>
// //
// //                     {/* Email */}
// //                     <div>
// //                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
// //                             <Mail className="w-4 h-4 mr-2" />
// //                             Email Address *
// //                         </label>
// //                         <input
// //                             type="email"
// //                             name="email"
// //                             value={formData.email}
// //                             onChange={handleChange}
// //                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
// //                         />
// //                     </div>
// //
// //                     {/* Amount (Readonly) */}
// //                     <div>
// //                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
// //                             <Lock className="w-4 h-4 mr-2" />
// //                             Amount *
// //                         </label>
// //                         <input
// //                             type="text"
// //                             value={`₦${Number(formData.amount).toLocaleString()}`}
// //                             readOnly
// //                             className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
// //                         />
// //                     </div>
// //
// //                     {/* Loan Reference (Readonly) */}
// //                     <div>
// //                         <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
// //                             <Lock className="w-4 h-4 mr-2" />
// //                             Loan Reference
// //                         </label>
// //                         <input
// //                             type="text"
// //                             value={formData.loan_ref}
// //                             readOnly
// //                             className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
// //                         />
// //                     </div>
// //
// //                     {/* Submit Button */}
// //                     <button
// //                         onClick={handleSubmit}
// //                         disabled={isSubmitting}
// //                         className="w-full font-bold py-4 text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
// //                         style={{ backgroundColor: '#f7623b' }}
// //                     >
// //                         {isSubmitting ? (
// //                             <>
// //                                 <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
// //                                 Processing...
// //                             </>
// //                         ) : (
// //                             <>
// //                                 <Lock className="w-5 h-5" />
// //                                 Make Payment
// //                             </>
// //                         )}
// //                     </button>
// //
// //                     {/* Security Notice */}
// //                     <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded mt-4">
// //                         <p className="text-xs text-gray-400">
// //                             <span className="font-semibold text-white">🔒 Secure Payment:</span> Your payment is
// //                             processed securely through Paystack. Your card information is never stored on our servers.
// //                         </p>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// //
// // // ================================================================
// // // SUCCESS PAGE WITH CONTINUOUS FIREWORKS! 🎆🎇🎆
// // // ================================================================
// //
// // function SuccessPageWithFireworks({ paymentDetails }) {
// //     useEffect(() => {
// //         // Continuous fireworks!
// //         const interval = setInterval(() => {
// //             launchFirework();
// //         }, 800);
// //
// //         return () => clearInterval(interval);
// //     }, []);
// //
// //     const launchFirework = () => {
// //         const firework = document.createElement('div');
// //         firework.className = 'firework';
// //
// //         // Random position
// //         const left = Math.random() * 100;
// //         firework.style.left = `${left}%`;
// //
// //         document.getElementById('fireworks-container').appendChild(firework);
// //
// //         // Remove after animation
// //         setTimeout(() => {
// //             firework.remove();
// //         }, 2000);
// //     };
// //
// //     return (
// //         <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
// //             {/* Fireworks Container */}
// //             <div id="fireworks-container" className="absolute inset-0 pointer-events-none">
// //                 <style>{`
// //                     @keyframes firework {
// //                         0% {
// //                             transform: translateY(100vh) scale(0);
// //                             opacity: 1;
// //                         }
// //                         50% {
// //                             transform: translateY(30vh) scale(1);
// //                             opacity: 1;
// //                         }
// //                         100% {
// //                             transform: translateY(30vh) scale(1);
// //                             opacity: 0;
// //                         }
// //                     }
// //
// //                     .firework {
// //                         position: absolute;
// //                         bottom: 0;
// //                         width: 4px;
// //                         height: 4px;
// //                         border-radius: 50%;
// //                         animation: firework 2s ease-out;
// //                     }
// //
// //                     .firework::before,
// //                     .firework::after {
// //                         content: '';
// //                         position: absolute;
// //                         width: 4px;
// //                         height: 4px;
// //                         border-radius: 50%;
// //                     }
// //
// //                     .firework::before {
// //                         box-shadow:
// //                             0 0 10px 5px #ff0,
// //                             0 0 20px 10px #f0f,
// //                             0 0 30px 15px #0ff,
// //                             10px 0 10px 5px #ff0,
// //                             -10px 0 10px 5px #0ff,
// //                             0 10px 10px 5px #f0f,
// //                             0 -10px 10px 5px #ff0,
// //                             15px 15px 10px 5px #0ff,
// //                             -15px 15px 10px 5px #f0f;
// //                     }
// //
// //                     .firework::after {
// //                         box-shadow:
// //                             20px 20px 10px 5px #f7623b,
// //                             -20px 20px 10px 5px #ff8c42,
// //                             20px -20px 10px 5px #ffc107,
// //                             -20px -20px 10px 5px #28a745;
// //                     }
// //                 `}</style>
// //             </div>
// //
// //             {/* Success Content */}
// //             <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
// //                 <div className="max-w-2xl w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-8 border-4 border-[#f7623b]">
// //
// //                     {/* Animated Success Icon */}
// //                     <div className="text-center mb-8">
// //                         <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#28a745] to-[#20c997] rounded-full mb-6 animate-bounce">
// //                             <span className="text-6xl">✅</span>
// //                         </div>
// //
// //                         <h1 className="text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
// //                             🎉 Payment Successful! 🎉
// //                         </h1>
// //
// //                         <p className="text-2xl text-white mb-2">
// //                             {paymentDetails.instalmentOrdinal} Instalment Paid
// //                         </p>
// //
// //                         <div className="inline-block bg-gradient-to-r from-[#f7623b] to-[#ff8c42] px-6 py-3 rounded-lg mt-4">
// //                             <p className="text-3xl font-bold text-black">
// //                                 ₦{Number(paymentDetails.amount).toLocaleString()}
// //                             </p>
// //                         </div>
// //                     </div>
// //
// //                     {/* Payment Details */}
// //                     <div className="bg-black rounded-lg p-6 mb-6 border-2 border-[#f7623b]">
// //                         <h3 className="text-xl font-bold text-[#f7623b] mb-4">Payment Details</h3>
// //
// //                         <div className="space-y-3">
// //                             <div className="flex justify-between">
// //                                 <span className="text-gray-400">Customer:</span>
// //                                 <span className="text-white font-semibold">{paymentDetails.customerName}</span>
// //                             </div>
// //
// //                             <div className="flex justify-between">
// //                                 <span className="text-gray-400">Instalment:</span>
// //                                 <span className="text-white font-semibold">{paymentDetails.instalmentOrdinal}</span>
// //                             </div>
// //
// //                             <div className="flex justify-between">
// //                                 <span className="text-gray-400">Loan Reference:</span>
// //                                 <span className="text-white font-semibold">{paymentDetails.loanRef}</span>
// //                             </div>
// //
// //                             <div className="flex justify-between">
// //                                 <span className="text-gray-400">Payment Reference:</span>
// //                                 <span className="text-white font-semibold text-sm">{paymentDetails.paymentReference}</span>
// //                             </div>
// //                         </div>
// //                     </div>
// //
// //                     {/* Next Steps */}
// //                     <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-lg p-6 border-2 border-green-500">
// //                         <h3 className="text-lg font-bold text-white mb-3">✨ What's Next?</h3>
// //                         <ul className="text-white space-y-2 text-sm">
// //                             <li>✅ A payment confirmation has been sent to your email</li>
// //                             <li>✅ Your guarantor and agent have been notified</li>
// //                             <li>📅 You'll receive a reminder for your next payment 7 days before it's due</li>
// //                             <li>📊 Your loan progress has been updated</li>
// //                         </ul>
// //                     </div>
// //
// //                     {/* Close Button */}
// //                     <button
// //                         onClick={() => window.close()}
// //                         className="w-full mt-6 py-4 bg-[#f7623b] text-white font-bold rounded-lg hover:opacity-90 transition"
// //                     >
// //                         Close Window
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }