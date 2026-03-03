import React, { useState } from 'react';
import { CheckCircle, Calendar, User, Mail, Phone, Store, MapPin, Package, Truck, Hash, Clock } from 'lucide-react';

export default function DeliveryScheduling() {
    const DJANGO_API_URL = 'https://koolkredit-payment-integration-production.up.railway.app';

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
        agentEmail: params.get('agentEmail') || '',
        agentNumber: params.get('agentNumber') || '',
        storeName: params.get('storeName') || '',
        storeLocation: params.get('storeLocation') || '',
        productName: params.get('productName') || '',
        productBrand: params.get('productBrand') || '',
        productSize: params.get('productSize') || '',
        initialInstalment: params.get('initialInstalment') || '',
        paymentDate: params.get('paymentDate') || '',
        paygoConfigurationDate: params.get('paygoConfigurationDate') || '',
        stockConfirmationDate: params.get('stockConfirmationDate') || ''
    };

    const [formData, setFormData] = useState({
        unit_serial_number: '',
        delivery_date: '',
        delivery_time: '',
        confirmed_with_customer: false,
        confirmed_with_agent: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.unit_serial_number.trim()) {
            alert('Please enter unit serial number');
            return false;
        }
        if (!formData.delivery_date) {
            alert('Please select delivery date');
            return false;
        }
        if (!formData.delivery_time) {
            alert('Please select delivery time');
            return false;
        }
        if (!formData.confirmed_with_customer || !formData.confirmed_with_agent) {
            alert('Please confirm delivery schedule with both customer and agent');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                // Order ID
                orderId: orderData.orderId,

                // Customer Information
                customerFirstName: orderData.customerFirstName,
                customerLastName: orderData.customerLastName,
                customerEmail: orderData.customerEmail,
                customerPhoneNumber: orderData.customerPhoneNumber,
                customerLoanRef: orderData.customerLoanRef,
                customerLoanDuration: parseInt(orderData.customerLoanDuration),

                // Agent Information
                agentName: orderData.agentName,
                agentId: orderData.agentId,
                agentEmail: orderData.agentEmail,
                agentNumber: orderData.agentNumber,

                // Store & Product
                storeName: orderData.storeName,
                storeLocation: orderData.storeLocation,
                productName: orderData.productName,
                productBrand: orderData.productBrand,
                productSize: orderData.productSize,
                initialInstalment: parseFloat(orderData.initialInstalment),
                paymentDate: orderData.paymentDate,
                paygoConfigurationDate: orderData.paygoConfigurationDate,
                stockConfirmationDate: orderData.stockConfirmationDate,

                // Delivery Details
                unitSerialNumber: formData.unit_serial_number,
                deliveryDate: formData.delivery_date,
                deliveryTime: formData.delivery_time,
                confirmedWithCustomer: formData.confirmed_with_customer,
                confirmedWithAgent: formData.confirmed_with_agent
            };

            console.log('Scheduling delivery:', payload);

            const response = await fetch(`${DJANGO_API_URL}/v1/api/schedule-delivery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(`✅ Delivery Scheduled Successfully!\n\n` +
                    `Unit: ${formData.unit_serial_number}\n` +
                    `Date: ${formData.delivery_date} at ${formData.delivery_time}\n\n` +
                    `✓ Customer notified\n` +
                    `✓ Agent notified\n` +
                    `✓ Installation team notified`);
                window.close();
            } else {
                throw new Error(data.message || 'Failed to schedule delivery');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(error.message || 'Failed to schedule delivery. Please try again.');
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
                        <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                        Delivery Scheduling Form
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Schedule delivery and assign unit to order
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
                                    Loan Reference
                                </label>
                                <input
                                    type="text"
                                    value={orderData.customerLoanRef}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Delivery Address</h2>
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

                    {/* Agent Contact */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Agent Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <Phone className="w-4 h-4 mr-2" />
                                    Agent Phone
                                </label>
                                <input
                                    type="tel"
                                    value={orderData.agentNumber}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Scheduling Fields */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Delivery Scheduling</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Hash className="w-4 h-4 mr-2" />
                                    Unit Serial Number *
                                </label>
                                <input
                                    type="text"
                                    name="unit_serial_number"
                                    value={formData.unit_serial_number}
                                    onChange={handleChange}
                                    placeholder="Enter unit serial number"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Delivery Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="delivery_date"
                                        value={formData.delivery_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Delivery Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="delivery_time"
                                        value={formData.delivery_time}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="confirmed_with_customer"
                                        checked={formData.confirmed_with_customer}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-[#f7623b] bg-gray-800 border-gray-600 rounded focus:ring-[#f7623b] focus:ring-2"
                                    />
                                    <label className="ml-3 text-white font-medium">
                                        ✅ Delivery date & time confirmed with Customer
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="confirmed_with_agent"
                                        checked={formData.confirmed_with_agent}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-[#f7623b] bg-gray-800 border-gray-600 rounded focus:ring-[#f7623b] focus:ring-2"
                                    />
                                    <label className="ml-3 text-white font-medium">
                                        ✅ Delivery date & time confirmed with Agent
                                    </label>
                                </div>
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
                                Updating...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Update Delivery Status
                            </>
                        )}
                    </button>

                    <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">🚚 Note:</span> After submitting, customer, agent, and installation team will be notified of the delivery schedule.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}