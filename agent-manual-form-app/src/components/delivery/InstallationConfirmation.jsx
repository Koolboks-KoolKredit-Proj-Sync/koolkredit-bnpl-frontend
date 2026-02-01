import React, { useState } from 'react';
import { CheckCircle, Calendar, User, Mail, Phone, Package, Camera, Hash, AlertCircle } from 'lucide-react';

export default function InstallationConfirmation() {
    const DJANGO_API_URL = 'http://127.0.0.1:8000';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinCode, setPinCode] = useState('');
    const [verificationData, setVerificationData] = useState(null);

    // Extract all data from URL parameters
    const params = new URLSearchParams(window.location.search);

    const orderData = {
        orderId: params.get('orderId') || '',
        unitSerialNumber: params.get('unitSerialNumber') || '',
        customerFirstName: params.get('customerFirstName') || '',
        customerLastName: params.get('customerLastName') || '',
        customerEmail: params.get('customerEmail') || '',
        customerPhoneNumber: params.get('customerPhoneNumber') || '',
        deliveryDate: params.get('deliveryDate') || '',
        productName: params.get('productName') || '',
        productBrand: params.get('productBrand') || '',
        productSize: params.get('productSize') || ''
    };

    const [formData, setFormData] = useState({
        installation_date: new Date().toISOString().split('T')[0],
        installer_name: '',
        installer_phone: '',
        customer_photo: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Image size should be less than 5MB');
                return;
            }

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    customer_photo: reader.result
                }));
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!formData.installation_date) {
            alert('Please select installation date');
            return false;
        }
        if (!formData.installer_name.trim()) {
            alert('Please enter installer name');
            return false;
        }
        if (!formData.installer_phone.trim()) {
            alert('Please enter installer phone number');
            return false;
        }
        if (!formData.customer_photo) {
            alert('Please take a photo of customer with the installed product');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Step 1: Request verification PIN
            const requestPayload = {
                orderId: orderData.orderId,
                customerEmail: orderData.customerEmail,
                customerPhoneNumber: orderData.customerPhoneNumber,
                agentEmail: params.get('agentEmail') || '',
                installationDate: formData.installation_date,
                installerName: formData.installer_name,
                installerPhone: formData.installer_phone,
                customerPhoto: formData.customer_photo
            };

            const response = await fetch(`${DJANGO_API_URL}/v1/api/request-installation-pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store verification data for final submission
                setVerificationData(requestPayload);

                // Show PIN modal
                setShowPinModal(true);

                alert('📧 Verification PIN has been sent to:\n\n' +
                    `✓ Customer Email: ${orderData.customerEmail}\n` +
                    `✓ Customer Phone: ${orderData.customerPhoneNumber}\n` +
                    `✓ Agent Email\n\n` +
                    'Please ask the customer for the PIN to complete installation.');
            } else {
                throw new Error(data.message || 'Failed to request verification PIN');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(error.message || 'Failed to request verification PIN. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePinSubmit = async () => {
        if (pinCode.length !== 6) {
            alert('Please enter the complete 6-digit PIN');
            return;
        }

        setIsSubmitting(true);

        try {
            const finalPayload = {
                ...verificationData,
                pinCode: pinCode
            };

            const response = await fetch(`${DJANGO_API_URL}/v1/api/confirm-installation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalPayload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('✅ Installation Confirmed Successfully!\n\n' +
                    'The installation has been recorded in the system.\n' +
                    'Thank you for completing the installation!');
                window.close();
            } else {
                throw new Error(data.message || 'Invalid PIN. Please try again.');
            }
        } catch (error) {
            console.error('PIN verification error:', error);
            alert(error.message || 'Failed to verify PIN. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!orderData.orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
                <div className="bg-black rounded-lg p-8 text-white text-center">
                    <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
                    <p>Unable to load installation information. Please click the link from the email.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
            <div className="max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                        Installation Confirmation Form
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Confirm on-site installation completion
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Order ID Display */}
                    <div className="bg-gradient-to-r from-[#f7623b] to-[#ff8c42] rounded-lg p-6 text-center">
                        <p className="text-sm font-medium text-black mb-2">ORDER ID</p>
                        <h2 className="text-3xl font-bold text-black">{orderData.orderId}</h2>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <User className="w-4 h-4 mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={`${orderData.customerFirstName} ${orderData.customerLastName}`}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={orderData.customerEmail}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={orderData.customerPhoneNumber}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    Delivery Date
                                </label>
                                <input
                                    type="text"
                                    value={orderData.deliveryDate}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Product Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Package className="w-4 h-4 mr-2" />
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={orderData.productName}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    value={orderData.productBrand}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Hash className="w-4 h-4 mr-2" />
                                    Serial Number
                                </label>
                                <input
                                    type="text"
                                    value={orderData.unitSerialNumber}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Installation Details */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Installation Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Installation Date *
                                </label>
                                <input
                                    type="date"
                                    name="installation_date"
                                    value={formData.installation_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <User className="w-4 h-4 mr-2" />
                                    Installer Name *
                                </label>
                                <input
                                    type="text"
                                    name="installer_name"
                                    value={formData.installer_name}
                                    onChange={handleChange}
                                    placeholder="Enter installer's full name"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Installer Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="installer_phone"
                                    value={formData.installer_phone}
                                    onChange={handleChange}
                                    placeholder="Enter installer's phone number"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Camera className="w-4 h-4 mr-2" />
                                    Customer Photo with Installed Product *
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handlePhotoChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                                {photoPreview && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-400 mb-2">Preview:</p>
                                        <img
                                            src={photoPreview}
                                            alt="Customer with product"
                                            className="w-full max-w-md rounded-lg border-2 border-[#f7623b]"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
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
                                <CheckCircle className="w-5 h-5" />
                                Request Verification PIN
                            </>
                        )}
                    </button>

                    <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">🔐 Note:</span> After submitting, a 6-digit PIN will be sent to the customer's email and phone. You'll need this PIN to complete the installation confirmation.
                        </p>
                    </div>
                </div>
            </div>

            {/* PIN Verification Modal */}
            {showPinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-[#f7623b]">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                                <Hash className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#f7623b] mb-2">Enter Verification PIN</h2>
                            <p className="text-gray-400 text-sm">
                                Ask the customer for the 6-digit PIN sent to their email and phone
                            </p>
                        </div>

                        <div className="mb-6">
                            <input
                                type="text"
                                maxLength="6"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="Enter 6-digit PIN"
                                className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#f7623b] transition"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPinModal(false);
                                    setPinCode('');
                                }}
                                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePinSubmit}
                                disabled={isSubmitting || pinCode.length !== 6}
                                className="flex-1 px-6 py-3 bg-[#f7623b] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Verifying...' : 'Confirm Installation'}
                            </button>
                        </div>

                        <div className="mt-4 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 p-3 rounded">
                            <p className="text-xs text-yellow-200 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>The PIN was sent to the customer's email and phone number. Please ask the customer to provide the code.</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}