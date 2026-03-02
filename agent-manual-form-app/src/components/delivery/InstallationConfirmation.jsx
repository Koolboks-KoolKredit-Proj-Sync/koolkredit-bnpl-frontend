// import React, { useState } from 'react';
// import { CheckCircle, Calendar, User, Mail, Phone, Package, Camera, Hash, AlertCircle } from 'lucide-react';
//
// export default function InstallationConfirmation() {
//     const DJANGO_API_URL = 'http://127.0.0.1:8000';
//
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showPinModal, setShowPinModal] = useState(false);
//     const [pinCode, setPinCode] = useState('');
//     const [verificationData, setVerificationData] = useState(null);
//
//     // Extract all data from URL parameters
//     const params = new URLSearchParams(window.location.search);
//
//     const orderData = {
//         orderId: params.get('orderId') || '',
//         unitSerialNumber: params.get('unitSerialNumber') || '',
//         customerFirstName: params.get('customerFirstName') || '',
//         customerLastName: params.get('customerLastName') || '',
//         customerEmail: params.get('customerEmail') || '',
//         customerPhoneNumber: params.get('customerPhoneNumber') || '',
//         deliveryDate: params.get('deliveryDate') || '',
//         productName: params.get('productName') || '',
//         productBrand: params.get('productBrand') || '',
//         productSize: params.get('productSize') || ''
//     };
//
//     const [formData, setFormData] = useState({
//         installation_date: new Date().toISOString().split('T')[0],
//         installer_name: '',
//         installer_phone: '',
//         customer_photo: null
//     });
//
//     const [photoPreview, setPhotoPreview] = useState(null);
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
//
//     const handlePhotoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) { // 5MB limit
//                 alert('Image size should be less than 5MB');
//                 return;
//             }
//
//             // Convert to base64
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setFormData(prev => ({
//                     ...prev,
//                     customer_photo: reader.result
//                 }));
//                 setPhotoPreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//
//     const validateForm = () => {
//         if (!formData.installation_date) {
//             alert('Please select installation date');
//             return false;
//         }
//         if (!formData.installer_name.trim()) {
//             alert('Please enter installer name');
//             return false;
//         }
//         if (!formData.installer_phone.trim()) {
//             alert('Please enter installer phone number');
//             return false;
//         }
//         if (!formData.customer_photo) {
//             alert('Please take a photo of customer with the installed product');
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
//             // Step 1: Request verification PIN
//             const requestPayload = {
//                 orderId: orderData.orderId,
//                 customerEmail: orderData.customerEmail,
//                 customerPhoneNumber: orderData.customerPhoneNumber,
//                 agentEmail: params.get('agentEmail') || '',
//                 installationDate: formData.installation_date,
//                 installerName: formData.installer_name,
//                 installerPhone: formData.installer_phone,
//                 customerPhoto: formData.customer_photo
//             };
//
//             const response = await fetch(`${DJANGO_API_URL}/v1/api/request-installation-pin`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(requestPayload)
//             });
//
//             const data = await response.json();
//
//             if (response.ok && data.success) {
//                 // Store verification data for final submission
//                 setVerificationData(requestPayload);
//
//                 // Show PIN modal
//                 setShowPinModal(true);
//
//                 alert('📧 Verification PIN has been sent to:\n\n' +
//                     `✓ Customer Email: ${orderData.customerEmail}\n` +
//                     `✓ Customer Phone: ${orderData.customerPhoneNumber}\n` +
//                     `✓ Agent Email\n\n` +
//                     'Please ask the customer for the PIN to complete installation.');
//             } else {
//                 throw new Error(data.message || 'Failed to request verification PIN');
//             }
//         } catch (error) {
//             console.error('Submission error:', error);
//             alert(error.message || 'Failed to request verification PIN. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     const handlePinSubmit = async () => {
//         if (pinCode.length !== 6) {
//             alert('Please enter the complete 6-digit PIN');
//             return;
//         }
//
//         setIsSubmitting(true);
//
//         try {
//             const finalPayload = {
//                 ...verificationData,
//                 pinCode: pinCode
//             };
//
//             const response = await fetch(`${DJANGO_API_URL}/v1/api/confirm-installation`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(finalPayload)
//             });
//
//             const data = await response.json();
//
//             if (response.ok && data.success) {
//                 alert('✅ Installation Confirmed Successfully!\n\n' +
//                     'The installation has been recorded in the system.\n' +
//                     'Thank you for completing the installation!');
//                 window.close();
//             } else {
//                 throw new Error(data.message || 'Invalid PIN. Please try again.');
//             }
//         } catch (error) {
//             console.error('PIN verification error:', error);
//             alert(error.message || 'Failed to verify PIN. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     if (!orderData.orderId) {
//         return (
//             <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
//                 <div className="bg-black rounded-lg p-8 text-white text-center">
//                     <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
//                     <p>Unable to load installation information. Please click the link from the email.</p>
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
//                         Installation Confirmation Form
//                     </h1>
//                     <p className="text-sm sm:text-base text-gray-400">
//                         Confirm on-site installation completion
//                     </p>
//                 </div>
//
//                 <div className="space-y-6">
//                     {/* Order ID Display */}
//                     <div className="bg-gradient-to-r from-[#f7623b] to-[#ff8c42] rounded-lg p-6 text-center">
//                         <p className="text-sm font-medium text-black mb-2">ORDER ID</p>
//                         <h2 className="text-3xl font-bold text-black">{orderData.orderId}</h2>
//                     </div>
//
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
//                                     value={`${orderData.customerFirstName} ${orderData.customerLastName}`}
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
//                                     value={orderData.customerEmail}
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
//                                     value={orderData.customerPhoneNumber}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     Delivery Date
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={orderData.deliveryDate}
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
//                                     value={orderData.productName}
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
//                                     value={orderData.productBrand}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Hash className="w-4 h-4 mr-2" />
//                                     Serial Number
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={orderData.unitSerialNumber}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Installation Details */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Installation Details</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <Calendar className="w-4 h-4 mr-2" />
//                                     Installation Date *
//                                 </label>
//                                 <input
//                                     type="date"
//                                     name="installation_date"
//                                     value={formData.installation_date}
//                                     onChange={handleChange}
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <User className="w-4 h-4 mr-2" />
//                                     Installer Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="installer_name"
//                                     value={formData.installer_name}
//                                     onChange={handleChange}
//                                     placeholder="Enter installer's full name"
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <Phone className="w-4 h-4 mr-2" />
//                                     Installer Phone Number *
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     name="installer_phone"
//                                     value={formData.installer_phone}
//                                     onChange={handleChange}
//                                     placeholder="Enter installer's phone number"
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <Camera className="w-4 h-4 mr-2" />
//                                     Customer Photo with Installed Product *
//                                 </label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     capture="environment"
//                                     onChange={handlePhotoChange}
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                                 {photoPreview && (
//                                     <div className="mt-4">
//                                         <p className="text-sm text-gray-400 mb-2">Preview:</p>
//                                         <img
//                                             src={photoPreview}
//                                             alt="Customer with product"
//                                             className="w-full max-w-md rounded-lg border-2 border-[#f7623b]"
//                                         />
//                                     </div>
//                                 )}
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
//                                 Processing...
//                             </>
//                         ) : (
//                             <>
//                                 <CheckCircle className="w-5 h-5" />
//                                 Request Verification PIN
//                             </>
//                         )}
//                     </button>
//
//                     <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
//                         <p className="text-xs text-gray-400">
//                             <span className="font-semibold text-white">🔐 Note:</span> After submitting, a 6-digit PIN will be sent to the customer's email and phone. You'll need this PIN to complete the installation confirmation.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//
//             {/* PIN Verification Modal */}
//             {showPinModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
//                     <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-[#f7623b]">
//                         <div className="text-center mb-6">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
//                                 <Hash className="w-8 h-8 text-white" />
//                             </div>
//                             <h2 className="text-2xl font-bold text-[#f7623b] mb-2">Enter Verification PIN</h2>
//                             <p className="text-gray-400 text-sm">
//                                 Ask the customer for the 6-digit PIN sent to their email and phone
//                             </p>
//                         </div>
//
//                         <div className="mb-6">
//                             <input
//                                 type="text"
//                                 maxLength="6"
//                                 value={pinCode}
//                                 onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
//                                 placeholder="Enter 6-digit PIN"
//                                 className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#f7623b] transition"
//                             />
//                         </div>
//
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowPinModal(false);
//                                     setPinCode('');
//                                 }}
//                                 className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handlePinSubmit}
//                                 disabled={isSubmitting || pinCode.length !== 6}
//                                 className="flex-1 px-6 py-3 bg-[#f7623b] text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {isSubmitting ? 'Verifying...' : 'Confirm Installation'}
//                             </button>
//                         </div>
//
//                         <div className="mt-4 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 p-3 rounded">
//                             <p className="text-xs text-yellow-200 flex items-start gap-2">
//                                 <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
//                                 <span>The PIN was sent to the customer's email and phone number. Please ask the customer to provide the code.</span>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }






// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { Loader2, CheckCircle, Send, AlertCircle } from 'lucide-react';
//
// function InstallationConfirmation() {
//     const [searchParams] = useSearchParams();
//     const [isSendingLink, setIsSendingLink] = useState(false);
//     const [linkSent, setLinkSent] = useState(false);
//     const [error, setError] = useState('');
//     const [pinCode, setPinCode] = useState('');
//     const [isVerifyingPin, setIsVerifyingPin] = useState(false);
//     const [pinVerified, setPinVerified] = useState(false);
//
//     const BACKEND_API_URL = 'http://localhost:8080/v1/api';
//
//     // Extract data from URL params
//     const orderData = {
//         orderId: searchParams.get('orderId'),
//         unitSerialNumber: searchParams.get('unitSerialNumber'),
//         customerFirstName: searchParams.get('customerFirstName'),
//         customerLastName: searchParams.get('customerLastName'),
//         customerEmail: searchParams.get('customerEmail'),
//         customerPhoneNumber: searchParams.get('customerPhoneNumber'),
//         deliveryDate: searchParams.get('deliveryDate'),
//         productName: searchParams.get('productName'),
//         productBrand: searchParams.get('productBrand'),
//         productSize: searchParams.get('productSize'),
//     };
//
//     // Send verification link to customer
//     const handleSendVerificationLink = async () => {
//         setIsSendingLink(true);
//         setError('');
//
//         try {
//             const response = await fetch(`${BACKEND_API_URL}/send-verification-link`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData)
//             });
//
//             const data = await response.json();
//
//             if (data.success) {
//                 setLinkSent(true);
//             } else {
//                 setError(data.message || 'Failed to send verification link');
//             }
//
//         } catch (err) {
//             console.error('Error sending verification link:', err);
//             setError('Unable to connect to server. Please try again.');
//         } finally {
//             setIsSendingLink(false);
//         }
//     };
//
//     // Verify PIN
//     const handleVerifyPin = async (e) => {
//         e.preventDefault();
//
//         if (!pinCode || pinCode.length !== 6) {
//             setError('Please enter a valid 6-digit PIN');
//             return;
//         }
//
//         setIsVerifyingPin(true);
//         setError('');
//
//         try {
//             const response = await fetch(`${BACKEND_API_URL}/verify-installation-pin`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     orderId: orderData.orderId,
//                     pinCode: pinCode
//                 })
//             });
//
//             const data = await response.json();
//
//             if (data.success) {
//                 setPinVerified(true);
//             } else {
//                 setError(data.message || 'Invalid PIN. Please try again.');
//             }
//
//         } catch (err) {
//             console.error('Error verifying PIN:', err);
//             setError('Unable to verify PIN. Please try again.');
//         } finally {
//             setIsVerifyingPin(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-2xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
//                         <span className="text-3xl">🔧</span>
//                     </div>
//                     <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
//                         Installation Confirmation
//                     </h1>
//                     <p className="text-gray-400 text-sm sm:text-base">
//                         Order ID: {orderData.orderId}
//                     </p>
//                 </div>
//
//                 {/* Order Details */}
//                 <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
//                     <h3 className="text-lg font-medium mb-3" style={{ color: '#f7623b' }}>
//                         Installation Details
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                         <p className="text-gray-300">
//                             <span className="text-gray-400">Customer:</span> {orderData.customerFirstName} {orderData.customerLastName}
//                         </p>
//                         <p className="text-gray-300">
//                             <span className="text-gray-400">Email:</span> {orderData.customerEmail}
//                         </p>
//                         <p className="text-gray-300">
//                             <span className="text-gray-400">Phone:</span> {orderData.customerPhoneNumber}
//                         </p>
//                         <p className="text-gray-300">
//                             <span className="text-gray-400">Product:</span> {orderData.productName}
//                         </p>
//                         <p className="text-gray-300">
//                             <span className="text-gray-400">Serial Number:</span> {orderData.unitSerialNumber}
//                         </p>
//                     </div>
//                 </div>
//
//                 {/* Step 1: Send Verification Link */}
//                 {!linkSent && !pinVerified && (
//                     <div className="mb-6">
//                         <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg mb-4">
//                             <p className="text-yellow-400 text-sm">
//                                 <strong>Step 1:</strong> Send verification link to customer to verify their mandate and receive the installation PIN.
//                             </p>
//                         </div>
//
//                         <button
//                             onClick={handleSendVerificationLink}
//                             disabled={isSendingLink}
//                             className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                             {isSendingLink ? (
//                                 <>
//                                     <Loader2 className="animate-spin" size={20} />
//                                     <span>Sending Link...</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Send size={20} />
//                                     <span>Send Verification Link to Customer</span>
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 )}
//
//                 {/* Step 2: Link Sent - Wait for PIN */}
//                 {linkSent && !pinVerified && (
//                     <div className="mb-6">
//                         <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg mb-6">
//                             <div className="flex items-start space-x-3">
//                                 <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
//                                 <div>
//                                     <p className="text-green-400 font-medium">Verification link sent successfully!</p>
//                                     <p className="text-green-300 text-sm mt-1">
//                                         The customer will receive the installation PIN after completing mandate verification.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg mb-4">
//                             <p className="text-gray-300 text-sm mb-2">
//                                 <strong className="text-white">Next Steps:</strong>
//                             </p>
//                             <ol className="text-gray-400 text-sm space-y-1 pl-4">
//                                 <li>1. Customer will verify their mandate via the link</li>
//                                 <li>2. Customer will receive a 6-digit PIN via email and SMS</li>
//                                 <li>3. Ask the customer for their PIN</li>
//                                 <li>4. Enter the PIN below to confirm installation</li>
//                             </ol>
//                         </div>
//
//                         {/* PIN Entry Form */}
//                         <form onSubmit={handleVerifyPin} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                                     Enter Customer's Installation PIN
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={pinCode}
//                                     onChange={(e) => {
//                                         const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                                         setPinCode(value);
//                                         setError('');
//                                     }}
//                                     maxLength="6"
//                                     disabled={isVerifyingPin}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest font-mono focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                     placeholder="000000"
//                                 />
//                                 {pinCode && (
//                                     <p className="mt-2 text-sm text-gray-400 text-center">
//                                         {pinCode.length}/6 digits
//                                     </p>
//                                 )}
//                             </div>
//
//                             <button
//                                 type="submit"
//                                 disabled={isVerifyingPin || pinCode.length !== 6}
//                                 className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                                 style={{ backgroundColor: '#f7623b' }}
//                             >
//                                 {isVerifyingPin ? (
//                                     <span className="flex items-center justify-center space-x-2">
//                                         <Loader2 className="animate-spin" size={20} />
//                                         <span>Verifying PIN...</span>
//                                     </span>
//                                 ) : (
//                                     'Confirm Installation'
//                                 )}
//                             </button>
//                         </form>
//                     </div>
//                 )}
//
//                 {/* Success - PIN Verified */}
//                 {pinVerified && (
//                     <div className="p-6 bg-green-900/20 border border-green-500/50 rounded-lg">
//                         <div className="text-center">
//                             <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
//                                 <CheckCircle size={32} className="text-white" />
//                             </div>
//                             <h2 className="text-2xl font-bold text-green-400 mb-2">
//                                 Installation Confirmed!
//                             </h2>
//                             <p className="text-green-300">
//                                 The installation has been successfully verified and confirmed.
//                             </p>
//                             <p className="text-gray-400 text-sm mt-4">
//                                 Order ID: {orderData.orderId}
//                             </p>
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Error Message */}
//                 {error && (
//                     <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start space-x-2">
//                         <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
//                         <p className="text-red-400 text-sm">{error}</p>
//                     </div>
//                 )}
//
//                 {/* Checklist */}
//                 {!pinVerified && (
//                     <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
//                         <h3 className="text-sm font-medium mb-3" style={{ color: '#f7623b' }}>
//                             📋 Installation Checklist
//                         </h3>
//                         <ul className="text-gray-400 text-xs space-y-1.5">
//                             <li>✓ Verify unit serial number: {orderData.unitSerialNumber}</li>
//                             <li>✓ Complete on-site installation</li>
//                             <li>✓ Test unit functionality</li>
//                             <li>✓ Train customer on usage</li>
//                             <li>✓ Get customer's verification PIN</li>
//                         </ul>
//                     </div>
//                 )}
//             </div>
//
//             {/* Loading Overlay */}
//             {(isSendingLink || isVerifyingPin) && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                     <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
//                         <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
//                         <p className="text-white font-medium">
//                             {isSendingLink ? 'Sending verification link...' : 'Verifying PIN...'}
//                         </p>
//                         <p className="text-gray-400 text-sm">Please wait</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default InstallationConfirmation;














// import React, { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { Loader2, CheckCircle, Send, AlertCircle, Camera } from 'lucide-react';
//
// function InstallationConfirmation() {
//     const [searchParams] = useSearchParams();
//     const [isSendingLink, setIsSendingLink] = useState(false);
//     const [linkSent, setLinkSent] = useState(false);
//     const [error, setError] = useState('');
//     const [pinCode, setPinCode] = useState('');
//     const [isVerifyingPin, setIsVerifyingPin] = useState(false);
//     const [pinVerified, setPinVerified] = useState(false);
//     const [photoPreview, setPhotoPreview] = useState(null);
//     const [photoBase64, setPhotoBase64] = useState(null);
//     const [isSubmittingInstallation, setIsSubmittingInstallation] = useState(false);
//     const [installationConfirmed, setInstallationConfirmed] = useState(false);
//
//     const BACKEND_API_URL = 'http://localhost:8080/v1/api';
//
//     const orderData = {
//         orderId: searchParams.get('orderId'),
//         unitSerialNumber: searchParams.get('unitSerialNumber'),
//         customerFirstName: searchParams.get('customerFirstName'),
//         customerLastName: searchParams.get('customerLastName'),
//         customerEmail: searchParams.get('customerEmail'),
//         customerPhoneNumber: searchParams.get('customerPhoneNumber'),
//         deliveryDate: searchParams.get('deliveryDate'),
//         productName: searchParams.get('productName'),
//         productBrand: searchParams.get('productBrand'),
//         productSize: searchParams.get('productSize'),
//     };
//
//     const handleSendVerificationLink = async () => {
//         setIsSendingLink(true);
//         setError('');
//         try {
//             const response = await fetch(`${BACKEND_API_URL}/send-verification-link`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(orderData)
//             });
//             const data = await response.json();
//             if (data.success) setLinkSent(true);
//             else setError(data.message || 'Failed to send verification link');
//         } catch (err) {
//             setError('Unable to connect to server. Please try again.');
//         } finally {
//             setIsSendingLink(false);
//         }
//     };
//
//     const handleVerifyPin = async (e) => {
//         e.preventDefault();
//         if (!pinCode || pinCode.length !== 6) {
//             setError('Please enter a valid 6-digit PIN');
//             return;
//         }
//         setIsVerifyingPin(true);
//         setError('');
//         try {
//             const response = await fetch(`${BACKEND_API_URL}/verify-installation-pin`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ orderId: orderData.orderId, pinCode })
//             });
//             const data = await response.json();
//             if (data.success) setPinVerified(true);
//             else setError(data.message || 'Invalid PIN. Please try again.');
//         } catch (err) {
//             setError('Unable to verify PIN. Please try again.');
//         } finally {
//             setIsVerifyingPin(false);
//         }
//     };
//
//     const handlePhotoCapture = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         if (file.size > 5 * 1024 * 1024) {
//             setError('Image must be under 5MB');
//             return;
//         }
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPhotoBase64(reader.result);
//             setPhotoPreview(reader.result);
//         };
//         reader.readAsDataURL(file);
//     };
//
//     const handleConfirmInstallation = async () => {
//         if (!photoBase64) {
//             setError('Please take a photo of the customer with the installed product');
//             return;
//         }
//         setIsSubmittingInstallation(true);
//         setError('');
//         try {
//             const response = await fetch(`${BACKEND_API_URL}/confirm-installation`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     orderId: orderData.orderId,
//                     pinCode,
//                     customerEmail: orderData.customerEmail,
//                     customerFirstName: orderData.customerFirstName,
//                     customerLastName: orderData.customerLastName,
//                     productName: orderData.productName,
//                     installationDate: new Date().toISOString().split('T')[0],
//                     customerPhoto: photoBase64
//                 })
//             });
//             const data = await response.json();
//             if (data.success) setInstallationConfirmed(true);
//             else setError(data.message || 'Failed to confirm installation.');
//         } catch (err) {
//             setError('Unable to confirm installation. Please try again.');
//         } finally {
//             setIsSubmittingInstallation(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
//              style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-2xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
//
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
//                         <span className="text-3xl">🔧</span>
//                     </div>
//                     <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
//                         Installation Confirmation
//                     </h1>
//                     <p className="text-gray-400 text-sm">Order ID: {orderData.orderId}</p>
//                 </div>
//
//                 {/* Order Details */}
//                 <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
//                     <h3 className="text-lg font-medium mb-3" style={{ color: '#f7623b' }}>
//                         Installation Details
//                     </h3>
//                     <div className="space-y-2 text-sm">
//                         <p className="text-gray-300"><span className="text-gray-400">Customer:</span> {orderData.customerFirstName} {orderData.customerLastName}</p>
//                         <p className="text-gray-300"><span className="text-gray-400">Email:</span> {orderData.customerEmail}</p>
//                         <p className="text-gray-300"><span className="text-gray-400">Phone:</span> {orderData.customerPhoneNumber}</p>
//                         <p className="text-gray-300"><span className="text-gray-400">Product:</span> {orderData.productName}</p>
//                         <p className="text-gray-300"><span className="text-gray-400">Serial:</span> {orderData.unitSerialNumber}</p>
//                     </div>
//                 </div>
//
//                 {/* Step 1: Send Verification Link */}
//                 {!linkSent && !installationConfirmed && (
//                     <div className="mb-6">
//                         <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg mb-4">
//                             <p className="text-yellow-400 text-sm">
//                                 <strong>Step 1:</strong> Send verification link to customer to verify their mandate and receive the installation PIN.
//                             </p>
//                         </div>
//                         <button
//                             onClick={handleSendVerificationLink}
//                             disabled={isSendingLink}
//                             className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                             {isSendingLink ? <><Loader2 className="animate-spin" size={20} /><span>Sending...</span></>
//                                 : <><Send size={20} /><span>Send Verification Link to Customer</span></>}
//                         </button>
//                     </div>
//                 )}
//
//                 {/* Step 2: PIN Entry */}
//                 {linkSent && !pinVerified && !installationConfirmed && (
//                     <div className="mb-6">
//                         <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg mb-4">
//                             <div className="flex items-start space-x-3">
//                                 <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
//                                 <p className="text-green-400 font-medium">
//                                     Verification link sent! Ask the customer to complete mandate verification and share their PIN with you.
//                                 </p>
//                             </div>
//                         </div>
//                         <form onSubmit={handleVerifyPin} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                                     Enter Customer's 6-Digit PIN
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={pinCode}
//                                     onChange={(e) => {
//                                         setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6));
//                                         setError('');
//                                     }}
//                                     disabled={isVerifyingPin}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest font-mono focus:outline-none transition"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                     placeholder="000000"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 disabled={isVerifyingPin || pinCode.length !== 6}
//                                 className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                                 style={{ backgroundColor: '#f7623b' }}
//                             >
//                                 {isVerifyingPin ? (
//                                     <span className="flex items-center justify-center space-x-2">
//                                         <Loader2 className="animate-spin" size={20} />
//                                         <span>Verifying PIN...</span>
//                                     </span>
//                                 ) : 'Verify PIN'}
//                             </button>
//                         </form>
//                     </div>
//                 )}
//
//                 {/* Step 3: Photo + Confirm Installation */}
//                 {pinVerified && !installationConfirmed && (
//                     <div className="mb-6 space-y-4">
//                         <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
//                                 <p className="text-green-400 font-medium">PIN verified! Now take a photo to confirm installation.</p>
//                             </div>
//                         </div>
//
//                         <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                                 📸 Take Photo of Customer with Installed Product *
//                             </label>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 capture="environment"
//                                 onChange={handlePhotoCapture}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             />
//                             {photoPreview && (
//                                 <div className="mt-3">
//                                     <img
//                                         src={photoPreview}
//                                         alt="Installation photo"
//                                         className="w-full rounded-lg border-2 max-h-64 object-cover"
//                                         style={{ borderColor: '#f7623b' }}
//                                     />
//                                 </div>
//                             )}
//                         </div>
//
//                         <button
//                             onClick={handleConfirmInstallation}
//                             disabled={isSubmittingInstallation || !photoBase64}
//                             className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                             {isSubmittingInstallation ? (
//                                 <><Loader2 className="animate-spin" size={20} /><span>Confirming Installation...</span></>
//                             ) : (
//                                 <><CheckCircle size={20} /><span>Confirm Installation & Activate Loan</span></>
//                             )}
//                         </button>
//                     </div>
//                 )}
//
//                 {/* Final Success */}
//                 {installationConfirmed && (
//                     <div className="p-6 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
//                         <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
//                             <CheckCircle size={32} className="text-white" />
//                         </div>
//                         <h2 className="text-2xl font-bold text-green-400 mb-2">Installation Confirmed!</h2>
//                         <p className="text-green-300">The loan has been activated. The customer will receive a confirmation email.</p>
//                         <p className="text-gray-400 text-sm mt-4">Order ID: {orderData.orderId}</p>
//                     </div>
//                 )}
//
//                 {/* Error */}
//                 {error && (
//                     <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start space-x-2">
//                         <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
//                         <p className="text-red-400 text-sm">{error}</p>
//                     </div>
//                 )}
//             </div>
//
//             {/* Loading Overlay */}
//             {(isSendingLink || isVerifyingPin || isSubmittingInstallation) && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                     <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
//                         <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
//                         <p className="text-white font-medium">
//                             {isSendingLink ? 'Sending verification link...'
//                                 : isVerifyingPin ? 'Verifying PIN...'
//                                     : 'Confirming installation...'}
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default InstallationConfirmation;








import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, Send, AlertCircle } from 'lucide-react';

function InstallationConfirmation() {
    const [searchParams] = useSearchParams();
    const [isSendingLink, setIsSendingLink] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [error, setError] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [isVerifyingPin, setIsVerifyingPin] = useState(false);
    const [pinVerified, setPinVerified] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoBase64, setPhotoBase64] = useState(null);
    const [isSubmittingInstallation, setIsSubmittingInstallation] = useState(false);
    const [installationConfirmed, setInstallationConfirmed] = useState(false);

    // NEW: PIN readiness polling state
    const [pinReady, setPinReady] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const pollingRef = useRef(null);

    const BACKEND_API_URL = 'http://localhost:8080/v1/api';

    const orderData = {
        orderId: searchParams.get('orderId'),
        unitSerialNumber: searchParams.get('unitSerialNumber'),
        customerFirstName: searchParams.get('customerFirstName'),
        customerLastName: searchParams.get('customerLastName'),
        customerEmail: searchParams.get('customerEmail'),
        customerPhoneNumber: searchParams.get('customerPhoneNumber'),
        deliveryDate: searchParams.get('deliveryDate'),
        productName: searchParams.get('productName'),
        productBrand: searchParams.get('productBrand'),
        productSize: searchParams.get('productSize'),
    };

    // NEW: Start polling when link is sent
    useEffect(() => {
        if (linkSent && !pinReady) {
            setIsPolling(true);
            pollingRef.current = setInterval(async () => {
                try {
                    const res = await fetch(
                        `${BACKEND_API_URL}/check-pin-ready/${orderData.orderId}`
                    );
                    const data = await res.json();
                    if (data.pinReady) {
                        setPinReady(true);
                        setIsPolling(false);
                        clearInterval(pollingRef.current);
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 5000); // poll every 5 seconds
        }

        return () => clearInterval(pollingRef.current);
    }, [linkSent, pinReady]);

    const handleSendVerificationLink = async () => {
        setIsSendingLink(true);
        setError('');
        try {
            const response = await fetch(`${BACKEND_API_URL}/send-verification-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (data.success) setLinkSent(true);
            else setError(data.message || 'Failed to send verification link');
        } catch (err) {
            setError('Unable to connect to server. Please try again.');
        } finally {
            setIsSendingLink(false);
        }
    };

    const handleVerifyPin = async (e) => {
        e.preventDefault();
        if (!pinCode || pinCode.length !== 6) {
            setError('Please enter a valid 6-digit PIN');
            return;
        }
        setIsVerifyingPin(true);
        setError('');
        try {
            const response = await fetch(`${BACKEND_API_URL}/verify-installation-pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderData.orderId, pinCode })
            });
            const data = await response.json();
            if (data.success) setPinVerified(true);
            else setError(data.message || 'Invalid PIN. Please try again.');
        } catch (err) {
            setError('Unable to verify PIN. Please try again.');
        } finally {
            setIsVerifyingPin(false);
        }
    };

    const handlePhotoCapture = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoBase64(reader.result);
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirmInstallation = async () => {
        if (!photoBase64) {
            setError('Please take a photo of the customer with the installed product');
            return;
        }
        setIsSubmittingInstallation(true);
        setError('');
        try {
            const response = await fetch(`${BACKEND_API_URL}/confirm-installation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderData.orderId,
                    pinCode,
                    customerEmail: orderData.customerEmail,
                    customerFirstName: orderData.customerFirstName,
                    customerLastName: orderData.customerLastName,
                    productName: orderData.productName,
                    installationDate: new Date().toISOString().split('T')[0],
                    customerPhoto: photoBase64
                })
            });
            const data = await response.json();
            if (data.success) setInstallationConfirmed(true);
            else setError(data.message || 'Failed to confirm installation.');
        } catch (err) {
            setError('Unable to confirm installation. Please try again.');
        } finally {
            setIsSubmittingInstallation(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
             style={{ backgroundColor: '#f7623b' }}>
            <div className="w-full max-w-2xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🔧</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
                        Installation Confirmation
                    </h1>
                    <p className="text-gray-400 text-sm">Order ID: {orderData.orderId}</p>
                </div>

                {/* Order Details */}
                <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium mb-3" style={{ color: '#f7623b' }}>
                        Installation Details
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p className="text-gray-300"><span className="text-gray-400">Customer:</span> {orderData.customerFirstName} {orderData.customerLastName}</p>
                        <p className="text-gray-300"><span className="text-gray-400">Email:</span> {orderData.customerEmail}</p>
                        <p className="text-gray-300"><span className="text-gray-400">Phone:</span> {orderData.customerPhoneNumber}</p>
                        <p className="text-gray-300"><span className="text-gray-400">Product:</span> {orderData.productName}</p>
                        <p className="text-gray-300"><span className="text-gray-400">Serial:</span> {orderData.unitSerialNumber}</p>
                    </div>
                </div>

                {/* Step 1: Send Verification Link */}
                {!linkSent && !installationConfirmed && (
                    <div className="mb-6">
                        <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg mb-4">
                            <p className="text-yellow-400 text-sm">
                                <strong>Step 1:</strong> Send verification link to customer to verify their mandate and receive the installation PIN.
                            </p>
                        </div>
                        <button
                            onClick={handleSendVerificationLink}
                            disabled={isSendingLink}
                            className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            style={{ backgroundColor: '#f7623b' }}
                        >
                            {isSendingLink
                                ? <><Loader2 className="animate-spin" size={20} /><span>Sending...</span></>
                                : <><Send size={20} /><span>Send Verification Link to Customer</span></>}
                        </button>
                    </div>
                )}

                {/* Step 2: Waiting for customer to complete mandate + PIN to be generated */}
                {linkSent && !pinReady && !pinVerified && !installationConfirmed && (
                    <div className="mb-6">
                        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg mb-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <p className="text-green-400 font-medium">
                                    Verification link sent! Waiting for the customer to complete mandate verification...
                                </p>
                            </div>
                        </div>
                        {/* Polling indicator */}
                        <div className="flex items-center justify-center space-x-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <Loader2 className="animate-spin text-orange-400" size={20} />
                            <p className="text-gray-400 text-sm">
                                Checking for PIN every 5 seconds... Ask the customer to open the link and complete verification.
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 3: PIN Entry — only shown once PIN is confirmed ready */}
                {linkSent && pinReady && !pinVerified && !installationConfirmed && (
                    <div className="mb-6">
                        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg mb-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <p className="text-green-400 font-medium">
                                    ✅ Customer has verified their mandate! Ask them for their PIN.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleVerifyPin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                                    Enter Customer's 6-Digit PIN
                                </label>
                                <input
                                    type="text"
                                    value={pinCode}
                                    onChange={(e) => {
                                        setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        setError('');
                                    }}
                                    disabled={isVerifyingPin}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest font-mono focus:outline-none transition"
                                    onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                                    placeholder="000000"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isVerifyingPin || pinCode.length !== 6}
                                className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#f7623b' }}
                            >
                                {isVerifyingPin ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Verifying PIN...</span>
                                    </span>
                                ) : 'Verify PIN'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 4: Photo + Confirm Installation */}
                {pinVerified && !installationConfirmed && (
                    <div className="mb-6 space-y-4">
                        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                                <p className="text-green-400 font-medium">PIN verified! Now take a photo to confirm installation.</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                                📸 Take Photo of Customer with Installed Product *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handlePhotoCapture}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            />
                            {photoPreview && (
                                <div className="mt-3">
                                    <img
                                        src={photoPreview}
                                        alt="Installation photo"
                                        className="w-full rounded-lg border-2 max-h-64 object-cover"
                                        style={{ borderColor: '#f7623b' }}
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleConfirmInstallation}
                            disabled={isSubmittingInstallation || !photoBase64}
                            className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            style={{ backgroundColor: '#f7623b' }}
                        >
                            {isSubmittingInstallation ? (
                                <><Loader2 className="animate-spin" size={20} /><span>Confirming Installation...</span></>
                            ) : (
                                <><CheckCircle size={20} /><span>Confirm Installation & Activate Loan</span></>
                            )}
                        </button>
                    </div>
                )}

                {/* Final Success */}
                {installationConfirmed && (
                    <div className="p-6 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
                        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-400 mb-2">Installation Confirmed!</h2>
                        <p className="text-green-300">The loan has been activated. The customer will receive a confirmation email.</p>
                        <p className="text-gray-400 text-sm mt-4">Order ID: {orderData.orderId}</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start space-x-2">
                        <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {(isSendingLink || isVerifyingPin || isSubmittingInstallation) && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
                        <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
                        <p className="text-white font-medium">
                            {isSendingLink ? 'Sending verification link...'
                                : isVerifyingPin ? 'Verifying PIN...'
                                    : 'Confirming installation...'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InstallationConfirmation;