// import React, { useState } from 'react';
// import { CheckCircle, Calendar, User, Mail, Phone, Store, MapPin, DollarSign, Package } from 'lucide-react';
//
// export default function AfterSales() {
//     const SPRING_API_URL = 'http://127.0.0.1:8080';
//
//     const [isSubmitting, setIsSubmitting] = useState(false);
//
//     // Extract all data from URL parameters
//     const params = new URLSearchParams(window.location.search);
//
//     const emailData = {
//         // Customer Information
//         customerFirstName: params.get('customerFirstName') || '',
//         customerLastName: params.get('customerLastName') || '',
//         customerEmail: params.get('customerEmail') || '',
//         customerPhoneNumber: params.get('customerPhoneNumber') || '',
//         customerLoanRef: params.get('customerLoanRef') || '',
//         customerLoanDuration: params.get('customerLoanDuration') || '',
//
//         // Agent Information
//         agentName: params.get('agentName') || '',
//         agentId: params.get('agentId') || '',
//         agentEmail: params.get('agentEmail') || '',
//         agentNumber: params.get('agentNumber') || '',
//
//         // Store & Payment Details
//         storeName: params.get('storeName') || '',
//         storeLocation: params.get('storeLocation') || '',
//         initialInstalment: params.get('initialInstalment') || '',
//         paymentDate: params.get('paymentDate') || '',
//
//         // Product Information
//         productName: params.get('productName') || '',
//         productBrand: params.get('productBrand') || '',
//         productSize: params.get('productSize') || ''
//     };
//
//     const [formData, setFormData] = useState({
//         paygo_configuration_date: new Date().toISOString().split('T')[0],
//         paygo_configured_by: ''
//     });
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
//
//     const validateForm = () => {
//         if (!formData.paygo_configuration_date) {
//             alert('Please select Paygo configuration date');
//             return false;
//         }
//         if (!formData.paygo_configured_by.trim()) {
//             alert('Please enter who configured the Paygo unit');
//             return false;
//         }
//         return true;
//     };
//
//     const handleSubmit = async () => {
//         if (!validateForm()) return;
//
//         setIsSubmitting(true);
//
//         try {
//             const payload = {
//                 // Include all email data
//                 ...emailData,
//                 // Add paygo configuration fields
//                 paygoConfigurationDate: formData.paygo_configuration_date,
//                 paygoConfiguredBy: formData.paygo_configured_by
//             };
//
//             console.log('Submitting paygo configuration:', payload);
//
//             const response = await fetch(`${SPRING_API_URL}/v1/api/confirm-paygo-config`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(payload)
//             });
//
//             const data = await response.json();
//
//             if (response.ok) {
//                 alert('Paygo configuration confirmed successfully!');
//                 window.close(); // Close the form window
//             } else {
//                 throw new Error(data.message || 'Failed to confirm paygo configuration');
//             }
//         } catch (error) {
//             console.error('Submission error:', error);
//             alert(error.message || 'Failed to confirm paygo configuration. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     // Check if we have the required data
//     if (!emailData.customerLoanRef) {
//         return (
//             <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
//                 <div className="bg-black rounded-lg p-8 text-white text-center">
//                     <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
//                     <p>Unable to load paygo configuration information. Please click the link from the email.</p>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
//                         <CheckCircle className="w-8 h-8 text-white" />
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
//                         Paygo Configuration Form
//                     </h1>
//                     <p className="text-sm sm:text-base text-gray-400">
//                         Confirm Paygo unit configuration for customer
//                     </p>
//                 </div>
//
//                 <div className="space-y-6">
//                     {/* Customer Information */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Customer Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <User className="w-4 h-4 mr-2" />
//                                     Full Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={`${emailData.customerFirstName} ${emailData.customerLastName}`}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Mail className="w-4 h-4 mr-2" />
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     value={emailData.customerEmail}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Phone className="w-4 h-4 mr-2" />
//                                     Phone Number
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     value={emailData.customerPhoneNumber}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     Loan Reference
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.customerLoanRef}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div className="md:col-span-2">
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     Loan Duration
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={`${emailData.customerLoanDuration} months`}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Agent Information */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Agent Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <User className="w-4 h-4 mr-2" />
//                                     Agent Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.agentName}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     Agent ID
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.agentId}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Mail className="w-4 h-4 mr-2" />
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     value={emailData.agentEmail}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Phone className="w-4 h-4 mr-2" />
//                                     Phone Number
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     value={emailData.agentNumber}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Store & Payment Information */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Store & Payment Details</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Store className="w-4 h-4 mr-2" />
//                                     Store Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.storeName}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <MapPin className="w-4 h-4 mr-2" />
//                                     Store Location
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.storeLocation}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <DollarSign className="w-4 h-4 mr-2" />
//                                     Loan Amount
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={`₦${emailData.initialInstalment}`}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Calendar className="w-4 h-4 mr-2" />
//                                     Payment Date
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.paymentDate}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Product Information */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Product Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Package className="w-4 h-4 mr-2" />
//                                     Product Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.productName}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     Brand
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.productBrand}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     Size
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={emailData.productSize}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Paygo Configuration Fields */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Paygo Configuration</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <Calendar className="w-4 h-4 mr-2" />
//                                     Paygo Configuration Date *
//                                 </label>
//                                 <input
//                                     type="date"
//                                     name="paygo_configuration_date"
//                                     value={formData.paygo_configuration_date}
//                                     onChange={handleChange}
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <User className="w-4 h-4 mr-2" />
//                                     Paygo Configured By *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="paygo_configured_by"
//                                     value={formData.paygo_configured_by}
//                                     onChange={handleChange}
//                                     placeholder="Enter name of person who configured the unit"
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                         </div>
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
//                                 Submitting...
//                             </>
//                         ) : (
//                             <>
//                                 <CheckCircle className="w-5 h-5" />
//                                 Confirm Paygo Configuration
//                             </>
//                         )}
//                     </button>
//
//                     <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
//                         <p className="text-xs text-gray-400">
//                             <span className="font-semibold text-white">⚡ Note:</span> Please ensure all paygo configuration details are correct before submitting.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }










import React, { useState } from 'react';
import { CheckCircle, Calendar, User, Mail, Phone, Store, MapPin, DollarSign, Package } from 'lucide-react';

export default function AfterSales() {
    const DJANGO_API_URL = 'http://127.0.0.1:8000';

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract all data from URL parameters
    const params = new URLSearchParams(window.location.search);

    const emailData = {
        // Customer Information
        customerFirstName: params.get('customerFirstName') || '',
        customerLastName: params.get('customerLastName') || '',
        customerEmail: params.get('customerEmail') || '',
        customerPhoneNumber: params.get('customerPhoneNumber') || '',
        customerLoanRef: params.get('customerLoanRef') || '',
        customerLoanDuration: params.get('customerLoanDuration') || '',

        // Agent Information
        agentName: params.get('agentName') || '',
        agentId: params.get('agentId') || '',
        agentEmail: params.get('agentEmail') || '',
        agentNumber: params.get('agentNumber') || '',

        // Store & Payment Details
        storeName: params.get('storeName') || '',
        storeLocation: params.get('storeLocation') || '',
        initialInstalment: params.get('initialInstalment') || '',
        paymentDate: params.get('paymentDate') || '',

        // Product Information
        productName: params.get('productName') || '',
        productBrand: params.get('productBrand') || '',
        productSize: params.get('productSize') || ''
    };

    const [formData, setFormData] = useState({
        paygo_configuration_date: new Date().toISOString().split('T')[0],
        paygo_configured_by: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.paygo_configuration_date) {
            alert('Please select Paygo configuration date');
            return false;
        }
        if (!formData.paygo_configured_by.trim()) {
            alert('Please enter who configured the Paygo unit');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                // Customer Information
                customer_first_name: emailData.customerFirstName,
                customer_last_name: emailData.customerLastName,
                customer_email: emailData.customerEmail,
                customer_phone_number: emailData.customerPhoneNumber,
                customer_loan_ref: emailData.customerLoanRef,
                customer_loan_duration: parseInt(emailData.customerLoanDuration),

                // Agent Information
                agent_name: emailData.agentName,
                agent_id: emailData.agentId,
                agent_email: emailData.agentEmail,
                agent_number: emailData.agentNumber,

                // Store & Payment Details
                store_name: emailData.storeName,
                store_location: emailData.storeLocation,
                initial_instalment: parseFloat(emailData.initialInstalment),
                payment_date: emailData.paymentDate,

                // Product Information
                product_name: emailData.productName,
                product_brand: emailData.productBrand,
                product_size: emailData.productSize,

                // Paygo Configuration
                paygo_configuration_date: formData.paygo_configuration_date,
                paygo_configured_by: formData.paygo_configured_by
            };

            console.log('Submitting paygo configuration to Django:', payload);

            // Submit to Django (which triggers Spring Boot actions)
            const response = await fetch(`${DJANGO_API_URL}/v1/api/save-paygo-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(`✅ Paygo Configuration Successful!\n\n` +
                    `Order ID: ${data.orderId}\n\n` +
                    `✓ Data saved to database\n` +
                    `✓ Sales Order PDF sent to agent\n` +
                    `✓ Inventory team notified`);
                window.close();
            } else {
                throw new Error(data.message || 'Failed to confirm paygo configuration');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(error.message || 'Failed to confirm paygo configuration. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if we have the required data
    if (!emailData.customerLoanRef) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
                <div className="bg-black rounded-lg p-8 text-white text-center">
                    <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
                    <p>Unable to load paygo configuration information. Please click the link from the email.</p>
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
                        Paygo Configuration Form
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Confirm Paygo unit configuration for customer
                    </p>
                </div>

                <div className="space-y-6">
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
                                    value={`${emailData.customerFirstName} ${emailData.customerLastName}`}
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
                                    value={emailData.customerEmail}
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
                                    value={emailData.customerPhoneNumber}
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
                                    value={emailData.customerLoanRef}
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
                                    value={`${emailData.customerLoanDuration} months`}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Agent Information */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Agent Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <User className="w-4 h-4 mr-2" />
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    value={emailData.agentName}
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
                                    value={emailData.agentId}
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
                                    value={emailData.agentEmail}
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
                                    value={emailData.agentNumber}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Store & Payment Information */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Store & Payment Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Store className="w-4 h-4 mr-2" />
                                    Store Name
                                </label>
                                <input
                                    type="text"
                                    value={emailData.storeName}
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
                                    value={emailData.storeLocation}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Initial Installment
                                </label>
                                <input
                                    type="text"
                                    value={`₦${emailData.initialInstalment}`}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Payment Date
                                </label>
                                <input
                                    type="text"
                                    value={emailData.paymentDate}
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
                                    value={emailData.productName}
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
                                    value={emailData.productBrand}
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
                                    value={emailData.productSize}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Paygo Configuration Fields */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Paygo Configuration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Paygo Configuration Date *
                                </label>
                                <input
                                    type="date"
                                    name="paygo_configuration_date"
                                    value={formData.paygo_configuration_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <User className="w-4 h-4 mr-2" />
                                    Paygo Configured By *
                                </label>
                                <input
                                    type="text"
                                    name="paygo_configured_by"
                                    value={formData.paygo_configured_by}
                                    onChange={handleChange}
                                    placeholder="Enter name of person who configured the unit"
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
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Confirm Paygo Configuration
                            </>
                        )}
                    </button>

                    <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">⚡ Note:</span> Please ensure all paygo configuration details are correct before submitting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}