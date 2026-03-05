import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Lock, User, Phone, Mail } from 'lucide-react';

export default function BNPLPaymentForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        payment_description: '',
        mobile_number: '',
        email: '',
        amount: '',
        loan_ref: '',
        agent_id: '',
        subsequent_payment: '',
        product_brand: ''   // 👈 NEW
    });

    // Extract amount and ref from URL params on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const amount = urlParams.get('amount') || '';
        const ref = urlParams.get('ref') || '';

        setFormData(prev => ({
            ...prev,
            amount: amount,
            loan_ref: ref
        }));
    }, []);

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

        if (name === 'agent_id' && value.length > 11) {
            return;
        }

        // Only allow digits for subsequent_payment
        if (name === 'subsequent_payment' && value && !/^\d*$/.test(value)) {
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

        if (!formData.payment_description.trim()) {
            alert('Please enter payment description');
            return false;
        }

        if (formData.mobile_number.length !== 11) {
            alert('Mobile number must be exactly 11 digits');
            return false;
        }

        // if (formData.agent_id.length !== 0 || formData.agent_id.length === 11 ) {
        //     alert('Enter a valid agent ID');
        //     return false;
        // }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        if (!formData.product_brand) {
            alert('Please select a product brand');
            return false;
        }


        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Submit to Django backend
            const response = await fetch('https://koolkredit-payment-integration-production.up.railway.app/v1/api/bnpl-payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: formData.customer_name,
                    payment_description: formData.payment_description,
                    mobile_number: formData.mobile_number,
                    email: formData.email,
                    amount: parseInt(formData.amount),
                    agent_id:formData.agent_id,
                    loan_ref: formData.loan_ref,
                    product_brand: formData.product_brand, // 👈 NEW
                    subsequent_payment: formData.subsequent_payment ? parseInt(formData.subsequent_payment) : null
                }),
            });

            const data = await response.json();

            if (response.ok && data.ref) {
                // Initialize Paystack payment
                initializePaystack(data);
            } else {
                throw new Error(data.message || 'Failed to create payment');
            }
        } catch (error) {
            console.error('Payment creation error:', error);
            alert(error.message || 'Failed to create payment. Please try again.');
            setIsLoading(false);
        }
    };

    const initializePaystack = (paymentData) => {
        // Check if Paystack script is loaded
        if (typeof window.PaystackPop === 'undefined') {
            alert('Payment gateway is loading. Please try again in a moment.');
            setIsLoading(false);
            return;
        }

        //const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
        const PUBLIC_KEY = 'pk_test_6ed8e074eccbd6d8798bf9e674928cf38b62a66c';


        const handler = window.PaystackPop.setup({
            key: PUBLIC_KEY, // Replace with your actual key
            email: paymentData.email,
            amount: paymentData.amount_value, // Amount in kobo (smallest currency unit)
            ref: paymentData.ref,
            currency: 'NGN',
            callback: function(response) {
                // Payment successful - redirect to verification
                window.location.href = `https://koolkredit-payment-integration-production.up.railway.app/v1/verify-payment/${paymentData.ref}/`;
            },
            onClose: function() {
                setIsLoading(false);
                alert('Payment window closed. You can try again when ready.');
            }
        });

        handler.openIframe();
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
            <div className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                        <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                        Complete Payment
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Secure payment for your loan application
                    </p>
                </div>

                {/* Payment Amount Display */}
                {formData.amount && (
                    <div className="bg-gray-900 rounded-lg p-6 mb-6 border-2 border-[#f7623b]">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-2">Total Amount to Pay</p>
                            <div className="flex items-center justify-center gap-2">
                                <DollarSign className="w-6 h-6 text-[#f7623b]" />
                                <h2 className="text-3xl font-bold text-white">
                                    ₦{Number(formData.amount).toLocaleString()}
                                </h2>
                            </div>
                            {formData.loan_ref && (
                                <p className="text-xs text-gray-500 mt-3">
                                    Reference: {formData.loan_ref}
                                </p>
                            )}
                        </div>
                    </div>
                )}

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
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                        />
                    </div>

                    {/* Payment Description */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Payment Description *
                        </label>
                        <input
                            type="text"
                            name="payment_description"
                            value={formData.payment_description}
                            onChange={handleChange}
                            placeholder="e.g., Down payment for loan"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
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
                            placeholder="your.email@example.com"
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
                            name="amount"
                            value={formData.amount ? `₦${Number(formData.amount).toLocaleString()}` : ''}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Agent ID
                        </label>
                        <input
                            type="text"
                            name="agent_id"
                            value={formData.agent_id}
                            onChange={handleChange}
                            placeholder="Enter AgentID if any"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                        />
                    </div>

                    {/* Loan Reference (Readonly) */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <Lock className="w-4 h-4 mr-2" />
                            Loan Reference *
                        </label>
                        <input
                            type="text"
                            name="loan_ref"
                            value={formData.loan_ref}
                            readOnly
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Product Brand */}
                    <div>
                        <label className="text-sm font-medium mb-3 block text-[#f7623b]">
                            Product Brand *
                        </label>

                        <div className="space-y-4">

                            {/* Koolbuy */}
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="product_brand"
                                    value="koolbuy"
                                    checked={formData.product_brand === 'koolbuy'}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="text-white font-medium">Koolbuy</p>
                                    <p className="text-xs text-yellow-400">
                                        Choose Koolbuy if the product brand is NOT Koolboks or Koolenergies
                                    </p>
                                </div>
                            </label>

                            {/* Koolboks / Koolenergies */}
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="product_brand"
                                    value="koolboks"
                                    checked={formData.product_brand === 'koolboks'}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="text-white font-medium">Koolboks / Koolenergies</p>
                                    <p className="text-xs text-yellow-400">
                                        Choose this option if the product brand is Koolboks or Koolenergies
                                    </p>
                                </div>
                            </label>

                        </div>
                    </div>


                    {/* Subsequent Payment (Optional) */}
                    <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Subsequent Payment Amount (Optional)
                        </label>
                        <input
                            type="text"
                            name="subsequent_payment"
                            value={formData.subsequent_payment}
                            onChange={handleChange}
                            placeholder="Enter amount if applicable"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full font-bold py-4 text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#f7623b' }}
                    >
                        {isLoading ? (
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