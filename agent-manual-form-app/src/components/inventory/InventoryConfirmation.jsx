import React, { useState } from 'react';
import { CheckCircle, Calendar, User, Mail, Phone, Store, MapPin, Package, Box } from 'lucide-react';

export default function InventoryConfirmation() {
    const DJANGO_API_URL = 'http://127.0.0.1:8000';

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract all data from URL parameters
    const params = new URLSearchParams(window.location.search);

    const orderData = {
        orderId: params.get('orderId') || '',
        customerFirstName: params.get('customerFirstName') || '',
        customerLastName: params.get('customerLastName') || '',
        customerEmail: params.get('customerEmail') || '',
        customerPhoneNumber: params.get('customerPhoneNumber') || '',
        customerLoanRef: params.get('customerLoanRef') || '',
        customerLoanDuration: params.get('customerLoanDuration') || '',
        agentName: params.get('agentName') || '',
        agentId: params.get('agentId') || '',
        storeName: params.get('storeName') || '',
        storeLocation: params.get('storeLocation') || '',
        productName: params.get('productName') || '',
        productBrand: params.get('productBrand') || '',
        productSize: params.get('productSize') || '',
        initialInstalment: params.get('initialInstalment') || '',
        paymentDate: params.get('paymentDate') || ''
    };

    const [formData, setFormData] = useState({
        stock_confirmation_date: new Date().toISOString().split('T')[0],
        stock_confirmed_by: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.stock_confirmation_date) {
            alert('Please select stock confirmation date');
            return false;
        }
        if (!formData.stock_confirmed_by.trim()) {
            alert('Please enter who confirmed the stock');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                orderId: orderData.orderId,
                stockConfirmationDate: formData.stock_confirmation_date,
                stockConfirmedBy: formData.stock_confirmed_by
            };

            console.log('Confirming stock:', payload);

            const response = await fetch(`${DJANGO_API_URL}/v1/api/confirm-stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Stock confirmed successfully!');
                window.close();
            } else {
                throw new Error(data.message || 'Failed to confirm stock');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(error.message || 'Failed to confirm stock. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!orderData.orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
                <div className="bg-black rounded-lg p-8 text-white text-center">
                    <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
                    <p>Unable to load order information. Please click the link from the email.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
            <div className="max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                        <Box className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                        Stock Confirmation Form
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Confirm stock availability and allocate unit to order
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Order ID - Prominent Display */}
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
                                    Loan Reference
                                </label>
                                <input
                                    type="text"
                                    value={orderData.customerLoanRef}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    Loan Duration
                                </label>
                                <input
                                    type="text"
                                    value={`${orderData.customerLoanDuration} months`}
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
                                    Size
                                </label>
                                <input
                                    type="text"
                                    value={orderData.productSize}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Store & Agent Information */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Store & Agent Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Store className="w-4 h-4 mr-2" />
                                    Store Name
                                </label>
                                <input
                                    type="text"
                                    value={orderData.storeName}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Store Location
                                </label>
                                <input
                                    type="text"
                                    value={orderData.storeLocation}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <User className="w-4 h-4 mr-2" />
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    value={orderData.agentName}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    Agent ID
                                </label>
                                <input
                                    type="text"
                                    value={orderData.agentId}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Confirmation Fields */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Stock Confirmation</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Stock Confirmation Date *
                                </label>
                                <input
                                    type="date"
                                    name="stock_confirmation_date"
                                    value={formData.stock_confirmation_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <User className="w-4 h-4 mr-2" />
                                    Stock Confirmed By *
                                </label>
                                <input
                                    type="text"
                                    name="stock_confirmed_by"
                                    value={formData.stock_confirmed_by}
                                    onChange={handleChange}
                                    placeholder="Enter name of person confirming stock"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
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
                                Confirming...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Confirm Stock & Allocate Unit
                            </>
                        )}
                    </button>

                    <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">📦 Note:</span> By confirming, you verify that stock is available and the unit has been allocated to this order.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}