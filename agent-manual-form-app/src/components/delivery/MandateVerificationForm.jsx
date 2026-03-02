// import React, { useState } from 'react';
// import { ChevronDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
//
//
// function MandateVerificationForm() {
//     const [verificationType, setVerificationType] = useState('');
//     const [verificationValue, setVerificationValue] = useState('');
//     const [orderId, setOrderId] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState(false);
//     const [responseMessage, setResponseMessage] = useState('');
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [validationError, setValidationError] = useState('');
//     const [requiresVerification, setRequiresVerification] = useState(false);
//     const [transferDestinations, setTransferDestinations] = useState([]);
//
//     const [mandateId, setMandateId] = useState('');
//     const [transferConfirmed, setTransferConfirmed] = useState(false);
//     const [isConfirmingTransfer, setIsConfirmingTransfer] = useState(false);
//
//     const BACKEND_API_URL = 'http://localhost:8080/v1/api';
//
//     const verificationOptions = [
//         { value: 'bvn', label: 'BVN (Bank Verification Number)' },
//         { value: 'email', label: 'Email Address' },
//         { value: 'phone', label: 'Phone Number' }
//     ];
//
//     // Get placeholder text based on verification type
//     const getPlaceholder = () => {
//         switch (verificationType) {
//             case 'bvn':
//                 return 'Enter 11-digit BVN';
//             case 'email':
//                 return 'Enter your email address';
//             case 'phone':
//                 return 'Enter 11-digit phone number';
//             default:
//                 return 'Select verification method first';
//         }
//     };
//
//     // Get input type based on verification type
//     const getInputType = () => {
//         return verificationType === 'email' ? 'email' : 'text';
//     };
//
//     // Validate input based on type
//     const validateInput = (value) => {
//         setValidationError('');
//
//         if (!value) {
//             return true; // Allow empty for now
//         }
//
//         switch (verificationType) {
//             case 'bvn':
//                 const bvnDigits = value.replace(/\D/g, '');
//                 if (bvnDigits.length > 11) {
//                     setValidationError('BVN must be exactly 11 digits');
//                     return false;
//                 }
//                 if (value.length === 11 && !/^\d{11}$/.test(value)) {
//                     setValidationError('BVN must contain only numbers');
//                     return false;
//                 }
//                 return true;
//
//             case 'phone':
//                 const phoneDigits = value.replace(/\D/g, '');
//                 if (phoneDigits.length > 11) {
//                     setValidationError('Phone number must be exactly 11 digits');
//                     return false;
//                 }
//                 if (value.length === 11 && !/^\d{11}$/.test(value)) {
//                     setValidationError('Phone number must contain only numbers');
//                     return false;
//                 }
//                 return true;
//
//             case 'email':
//                 if (value && !value.includes('@')) {
//                     setValidationError('Please enter a valid email address');
//                     return false;
//                 }
//                 // Basic email validation
//                 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                 if (value && !emailRegex.test(value)) {
//                     setValidationError('Please enter a valid email address');
//                     return false;
//                 }
//                 return true;
//
//             default:
//                 return true;
//         }
//     };
//
//     // Handle input change
//     const handleInputChange = (e) => {
//         let value = e.target.value;
//
//         // For BVN and phone, only allow digits and limit to 11
//         if (verificationType === 'bvn' || verificationType === 'phone') {
//             value = value.replace(/\D/g, ''); // Remove non-digits
//             value = value.slice(0, 11); // Limit to 11 digits
//         }
//
//         setVerificationValue(value);
//         validateInput(value);
//         setError('');
//     };
//
//     // Handle verification type selection
//     const handleTypeSelect = (type) => {
//         setVerificationType(type);
//         setShowDropdown(false);
//         setVerificationValue('');
//         setValidationError('');
//         setError('');
//     };
//
//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         setError('');
//         setSuccess(false);
//         setResponseMessage('');
//         setRequiresVerification(false);
//         setTransferDestinations([]);
//
//         // Validation
//         if (!verificationType) {
//             setError('Please select a verification method');
//             return;
//         }
//
//         if (!verificationValue) {
//             setError('Please enter your ' + verificationType.toUpperCase());
//             return;
//         }
//
//         if (!orderId) {
//             setError('Please enter your Order ID');
//             return;
//         }
//
//         // Final validation check
//         if (!validateInput(verificationValue)) {
//             return;
//         }
//
//         // Additional length validation for BVN and phone
//         if ((verificationType === 'bvn' || verificationType === 'phone') && verificationValue.length !== 11) {
//             setValidationError(`${verificationType.toUpperCase()} must be exactly 11 digits`);
//             return;
//         }
//
//         // Email validation
//         if (verificationType === 'email' && !verificationValue.includes('@')) {
//             setValidationError('Please enter a valid email address');
//             return;
//         }
//
//         setIsSubmitting(true);
//
//         try {
//             const response = await fetch(`${BACKEND_API_URL}/verify-installation-mandate`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     verificationType: verificationType,
//                     verificationValue: verificationValue,
//                     orderId: orderId
//                 })
//             });
//
//             const data = await response.json();
//
//             if (data.success) {
//                 setSuccess(true);
//                 setResponseMessage(data.message);
//                 setMandateId(data.mandateId || '');  // ← capture it
//
//                 // Check if mandate requires verification
//                 if (data.requiresVerification && data.transferDestinations) {
//                     setRequiresVerification(true);
//                     setTransferDestinations(data.transferDestinations);
//                 }
//             } else {
//                 setError(data.message || 'Verification failed. Please check your details.');
//
//                 if (data.requiresVerification) {
//                     setRequiresVerification(true);
//                 }
//             }
//
//         } catch (err) {
//             console.error('Error submitting verification:', err);
//             setError('Unable to connect to server. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//
//
//
//     };
//
//     const handleTransferCompleted = async () => {
//         setIsConfirmingTransfer(true);
//         setError('');
//
//         try {
//             const response = await fetch(`${BACKEND_API_URL}/confirm-transfer-completed`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ mandateId, orderId })
//             });
//
//             const data = await response.json();
//
//             if (data.success) {
//                 setTransferConfirmed(true);
//             } else {
//                 setError(data.message || 'Failed to confirm transfer.');
//             }
//         } catch (err) {
//             setError('Unable to connect. Please try again.');
//         } finally {
//             setIsConfirmingTransfer(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-md bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
//                         <span className="text-3xl">🔐</span>
//                     </div>
//                     <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
//                         Installation Verification
//                     </h1>
//                     <p className="text-gray-400 text-sm sm:text-base">
//                         Verify your mandate to receive installation PIN
//                     </p>
//                 </div>
//
//                 {/* Success Message */}
//                 {success && !requiresVerification && (
//                     <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
//                         <div className="flex items-start space-x-3">
//                             <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
//                             <div>
//                                 <p className="text-green-400 font-medium">{responseMessage}</p>
//                                 <p className="text-green-300 text-sm mt-1">
//                                     Please check your email and SMS for the installation PIN.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Verification Required Message */}
//                 {requiresVerification && transferDestinations.length > 0 && (
//                     <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
//                         <div className="flex items-start space-x-3">
//                             <AlertCircle size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
//                             <div className="flex-1">
//                                 <p className="text-yellow-400 font-medium mb-3">Mandate Verification Required</p>
//                                 <p className="text-yellow-300 text-sm mb-4">
//                                     Please transfer N50.00 to any of these accounts to verify your mandate:
//                                 </p>
//                                 {/*<div className="space-y-2">*/}
//                                 {/*    {transferDestinations.map((dest, index) => (*/}
//                                 {/*        <div key={index} className="bg-gray-900 p-3 rounded-lg">*/}
//                                 {/*            <p className="text-white font-medium">{dest.bankName}</p>*/}
//                                 {/*            <p className="text-gray-300 text-sm">Account: {dest.accountNumber}</p>*/}
//                                 {/*        </div>*/}
//                                 {/*    ))}*/}
//                                 {/*</div>*/}
//
//
//
//
//                                 {/*<div className="space-y-2">*/}
//                                 {/*    {transferDestinations.map((dest, index) => (*/}
//                                 {/*        <div key={index} className="bg-gray-900 p-3 rounded-lg border border-yellow-700/30">*/}
//                                 {/*            <p className="text-white font-semibold text-sm">*/}
//                                 {/*                {dest.bankName || dest.bank || dest.bank_name || 'Bank'}*/}
//                                 {/*            </p>*/}
//                                 {/*            <div className="flex items-center justify-between mt-1">*/}
//                                 {/*                <p className="text-gray-300 text-sm">*/}
//                                 {/*                    {dest.accountNumber || dest.account_number || dest.account || 'N/A'}*/}
//                                 {/*                </p>*/}
//                                 {/*                <button*/}
//                                 {/*                    type="button"*/}
//                                 {/*                    onClick={() => navigator.clipboard.writeText(dest.accountNumber || dest.account_number || dest.account || '')}*/}
//                                 {/*                    className="text-xs text-yellow-400 hover:text-yellow-300 transition ml-2"*/}
//                                 {/*                >*/}
//                                 {/*                    Copy*/}
//                                 {/*                </button>*/}
//                                 {/*            </div>*/}
//                                 {/*        </div>*/}
//                                 {/*    ))}*/}
//                                 {/*</div>*/}
//
//
//
//
//
//
//
//                                 <div className="space-y-2">
//                                     {transferDestinations.map((dest, index) => (
//                                         <div key={index} className="bg-gray-900 p-3 rounded-lg border border-yellow-700/30">
//                                             <div className="flex items-center justify-between">
//                                                 {/* Left: Logo + Bank Name + Account */}
//                                                 <div className="flex items-center space-x-3">
//                                                     {/* Bank Logo */}
//                                                     {(dest.icon || dest.bank_icon) && (
//                                                         <img
//                                                             src={dest.icon || dest.bank_icon}
//                                                             alt={dest.bankName || dest.bank_name}
//                                                             className="w-8 h-8 rounded-full object-contain bg-white p-0.5"
//                                                             onError={(e) => e.target.style.display = 'none'} // hide if logo fails to load
//                                                         />
//                                                     )}
//                                                     <div>
//                                                         <p className="text-white font-semibold text-sm">
//                                                             {dest.bankName || dest.bank_name}
//                                                         </p>
//                                                         <p className="text-gray-400 text-xs">
//                                                             {dest.accountNumber || dest.account_number}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//
//                                                 {/* Right: Copy button */}
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => navigator.clipboard.writeText(
//                                                         String(dest.accountNumber || dest.account_number || '')
//                                                     )}
//                                                     className="text-xs text-yellow-400 hover:text-yellow-300 transition px-2 py-1 border border-yellow-700/50 rounded"
//                                                 >
//                                                     Copy
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Order ID */}
//                     <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                             Order ID *
//                         </label>
//                         <input
//                             type="text"
//                             value={orderId}
//                             onChange={(e) => {
//                                 setOrderId(e.target.value);
//                                 setError('');
//                             }}
//                             disabled={isSubmitting}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="Enter your order ID"
//                         />
//                     </div>
//
//                     {/* Verification Type Selection */}
//                     <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                             Verification Method *
//                         </label>
//                         <div className="relative">
//                             <button
//                                 type="button"
//                                 onClick={() => setShowDropdown(!showDropdown)}
//                                 disabled={isSubmitting}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-left flex items-center justify-between focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                 onBlur={(e) => setTimeout(() => e.target.style.borderColor = '#374151', 200)}
//                             >
//                                 <span className={verificationType ? 'text-white' : 'text-gray-400'}>
//                                     {verificationType
//                                         ? verificationOptions.find(opt => opt.value === verificationType)?.label
//                                         : 'Choose verification method'}
//                                 </span>
//                                 <ChevronDown size={20} className="text-gray-400" />
//                             </button>
//
//                             {/* Dropdown Menu */}
//                             {showDropdown && (
//                                 <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
//                                     {verificationOptions.map((option) => (
//                                         <button
//                                             key={option.value}
//                                             type="button"
//                                             onClick={() => handleTypeSelect(option.value)}
//                                             className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition border-b border-gray-800 last:border-b-0"
//                                         >
//                                             {option.label}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Verification Value Input */}
//                     {verificationType && (
//                         <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                                 {verificationOptions.find(opt => opt.value === verificationType)?.label} *
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type={getInputType()}
//                                     value={verificationValue}
//                                     onChange={handleInputChange}
//                                     disabled={isSubmitting}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                     placeholder={getPlaceholder()}
//                                     maxLength={verificationType === 'bvn' || verificationType === 'phone' ? 11 : undefined}
//                                 />
//                                 {/* Character count for BVN and Phone */}
//                                 {(verificationType === 'bvn' || verificationType === 'phone') && verificationValue && (
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                         <span className={`text-xs ${verificationValue.length === 11 ? 'text-green-400' : 'text-gray-400'}`}>
//                                             {verificationValue.length}/11
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>
//
//                             {/* Validation Error */}
//                             {validationError && (
//                                 <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
//                                     <AlertCircle size={14} />
//                                     <span>{validationError}</span>
//                                 </p>
//                             )}
//
//                             {/* Success indicator */}
//                             {!validationError && verificationValue && (
//                                 ((verificationType === 'bvn' || verificationType === 'phone') && verificationValue.length === 11) ||
//                                 (verificationType === 'email' && verificationValue.includes('@'))
//                             ) && (
//                                 <p className="mt-2 text-green-400 text-sm flex items-center space-x-1">
//                                     <CheckCircle size={14} />
//                                     <span>Valid {verificationType.toUpperCase()}</span>
//                                 </p>
//                             )}
//                         </div>
//                     )}
//
//                     {/* Error Message */}
//                     {error && (
//                         <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
//                             <p className="text-red-400 text-sm">{error}</p>
//                         </div>
//                     )}
//
//                     {/* Submit Button */}
//
//                     {/* Submit Button — changes based on state */}
//                     {!requiresVerification && !transferConfirmed && (
//                         <button
//                             type="submit"
//                             disabled={isSubmitting || !verificationType || !verificationValue || !orderId || !!validationError}
//                             className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                             {isSubmitting ? (
//                                 <span className="flex items-center justify-center space-x-2">
//                 <Loader2 className="animate-spin" size={20} />
//                 <span>Verifying...</span>
//             </span>
//                             ) : 'Verify & Get PIN'}
//                         </button>
//                     )}
//
//                     {/* Transfer Completed button — shown after requiresVerification */}
//                     {requiresVerification && !transferConfirmed && (
//                         <button
//                             type="button"
//                             onClick={handleTransferCompleted}
//                             disabled={isConfirmingTransfer}
//                             className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                             {isConfirmingTransfer ? (
//                                 <span className="flex items-center justify-center space-x-2">
//                 <Loader2 className="animate-spin" size={20} />
//                 <span>Confirming...</span>
//             </span>
//                             ) : '✅ Transfer Completed'}
//                         </button>
//                     )}
//
//                     {/* Success state after transfer confirmed */}
//                     {transferConfirmed && (
//                         <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
//                             <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
//                             <p className="text-green-400 font-bold text-lg">Transfer Confirmed!</p>
//                             <p className="text-green-300 text-sm mt-1">
//                                 We're verifying your mandate. You'll receive your installation PIN via email and SMS once approved. This may take up to 10 minutes.
//                             </p>
//                         </div>
//                     )}
//
//
//
//
//                     {/*<button*/}
//                     {/*    type="submit"*/}
//                     {/*    disabled={isSubmitting || !verificationType || !verificationValue || !orderId || !!validationError}*/}
//                     {/*    className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"*/}
//                     {/*    style={{ backgroundColor: '#f7623b' }}*/}
//                     {/*    onMouseEnter={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '0.9')}*/}
//                     {/*    onMouseLeave={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '1')}*/}
//                     {/*>*/}
//                     {/*    {isSubmitting ? (*/}
//                     {/*        <span className="flex items-center justify-center space-x-2">*/}
//                     {/*            <Loader2 className="animate-spin" size={20} />*/}
//                     {/*            <span>Verifying...</span>*/}
//                     {/*        </span>*/}
//                     {/*    ) : (*/}
//                     {/*        'Verify & Get PIN'*/}
//                     {/*    )}*/}
//                     {/*</button>*/}
//                 </form>
//
//                 {/* Info Box */}
//                 <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
//                     <h3 className="text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                         ℹ️ What happens next?
//                     </h3>
//                     <ul className="text-gray-400 text-xs space-y-1">
//                         <li>• We'll verify your details with our records</li>
//                         <li>• Your mandate will be created (if not already done)</li>
//                         <li>• You'll receive the installation PIN via email and SMS</li>
//                         <li>• Provide the PIN to the installer to complete installation</li>
//                     </ul>
//                 </div>
//             </div>
//
//             {/* Loading Overlay */}
//             {isSubmitting && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                     <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
//                         <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
//                         <p className="text-white font-medium">Verifying your details...</p>
//                         <p className="text-gray-400 text-sm">This may take a moment</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default MandateVerificationForm;




import React, { useState } from 'react';
import { ChevronDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

function MandateVerificationForm() {
    const [verificationType, setVerificationType] = useState('');
    const [verificationValue, setVerificationValue] = useState('');
    const [orderId, setOrderId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [requiresVerification, setRequiresVerification] = useState(false);
    const [transferDestinations, setTransferDestinations] = useState([]);
    const [mandateId, setMandateId] = useState('');
    const [transferConfirmed, setTransferConfirmed] = useState(false);
    const [isConfirmingTransfer, setIsConfirmingTransfer] = useState(false);

    const BACKEND_API_URL = 'https://koolkredit-bnpl-backend-gqbj.onrender.com/v1/api';

    const verificationOptions = [
        { value: 'bvn', label: 'BVN (Bank Verification Number)' },
        { value: 'email', label: 'Email Address' },
        { value: 'phone', label: 'Phone Number' }
    ];

    const getPlaceholder = () => {
        switch (verificationType) {
            case 'bvn': return 'Enter 11-digit BVN';
            case 'email': return 'Enter your email address';
            case 'phone': return 'Enter 11-digit phone number';
            default: return 'Select verification method first';
        }
    };

    const getInputType = () => verificationType === 'email' ? 'email' : 'text';

    const validateInput = (value) => {
        setValidationError('');
        if (!value) return true;

        switch (verificationType) {
            case 'bvn':
                if (value.replace(/\D/g, '').length > 11) {
                    setValidationError('BVN must be exactly 11 digits');
                    return false;
                }
                if (value.length === 11 && !/^\d{11}$/.test(value)) {
                    setValidationError('BVN must contain only numbers');
                    return false;
                }
                return true;

            case 'phone':
                if (value.replace(/\D/g, '').length > 11) {
                    setValidationError('Phone number must be exactly 11 digits');
                    return false;
                }
                if (value.length === 11 && !/^\d{11}$/.test(value)) {
                    setValidationError('Phone number must contain only numbers');
                    return false;
                }
                return true;

            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    setValidationError('Please enter a valid email address');
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (verificationType === 'bvn' || verificationType === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 11);
        }
        setVerificationValue(value);
        validateInput(value);
        setError('');
    };

    const handleTypeSelect = (type) => {
        setVerificationType(type);
        setShowDropdown(false);
        setVerificationValue('');
        setValidationError('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setResponseMessage('');
        setRequiresVerification(false);
        setTransferDestinations([]);

        if (!verificationType) { setError('Please select a verification method'); return; }
        if (!verificationValue) { setError('Please enter your ' + verificationType.toUpperCase()); return; }
        if (!orderId) { setError('Please enter your Order ID'); return; }
        if (!validateInput(verificationValue)) return;

        if ((verificationType === 'bvn' || verificationType === 'phone') && verificationValue.length !== 11) {
            setValidationError(`${verificationType.toUpperCase()} must be exactly 11 digits`);
            return;
        }
        if (verificationType === 'email' && !verificationValue.includes('@')) {
            setValidationError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${BACKEND_API_URL}/verify-installation-mandate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verificationType, verificationValue, orderId })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setResponseMessage(data.message);
                setMandateId(data.mandateId || '');

                if (data.requiresVerification && data.transferDestinations) {
                    setRequiresVerification(true);
                    setTransferDestinations(data.transferDestinations);
                }
            } else {
                setError(data.message || 'Verification failed. Please check your details.');
                if (data.requiresVerification) setRequiresVerification(true);
            }
        } catch (err) {
            console.error('Error submitting verification:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTransferCompleted = async () => {
        setIsConfirmingTransfer(true);
        setError('');
        try {
            const response = await fetch(`${BACKEND_API_URL}/confirm-transfer-completed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mandateId, orderId })
            });

            const data = await response.json();
            if (data.success) {
                setTransferConfirmed(true);
            } else {
                setError(data.message || 'Failed to confirm transfer.');
            }
        } catch (err) {
            setError('Unable to connect. Please try again.');
        } finally {
            setIsConfirmingTransfer(false);
        }
    };

    const isValidInput =
        (verificationType === 'bvn' || verificationType === 'phone')
            ? verificationValue.length === 11
            : verificationType === 'email'
                ? verificationValue.includes('@')
                : false;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
             style={{ backgroundColor: '#f7623b' }}>
            <div className="w-full max-w-md bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
                        Installation Verification
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Verify your mandate to receive installation PIN
                    </p>
                </div>

                {/* PIN Sent Success */}
                {success && !requiresVerification && (
                    <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-green-400 font-medium">{responseMessage}</p>
                                <p className="text-green-300 text-sm mt-1">
                                    Please check your email and SMS for the installation PIN.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transfer Destinations */}
                {requiresVerification && transferDestinations.length > 0 && !transferConfirmed && (
                    <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <AlertCircle size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-yellow-400 font-medium mb-3">Mandate Verification Required</p>
                                <p className="text-yellow-300 text-sm mb-4">
                                    Please transfer ₦50.00 to any of these accounts to verify your mandate:
                                </p>
                                <div className="space-y-2">
                                    {transferDestinations.map((dest, index) => (
                                        <div key={index}
                                             className="bg-gray-900 p-3 rounded-lg border border-yellow-700/30">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {(dest.icon || dest.bank_icon) && (
                                                        <img
                                                            src={dest.icon || dest.bank_icon}
                                                            alt={dest.bankName || dest.bank_name}
                                                            className="w-8 h-8 rounded-full object-contain bg-white p-0.5"
                                                            onError={(e) => e.target.style.display = 'none'}
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-white font-semibold text-sm">
                                                            {dest.bankName || dest.bank_name}
                                                        </p>
                                                        <p className="text-gray-400 text-xs">
                                                            {dest.accountNumber || dest.account_number}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => navigator.clipboard.writeText(
                                                        String(dest.accountNumber || dest.account_number || '')
                                                    )}
                                                    className="text-xs text-yellow-400 hover:text-yellow-300 transition px-2 py-1 border border-yellow-700/50 rounded"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transfer Confirmed Success */}
                {transferConfirmed && (
                    <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
                        <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 font-bold text-lg">Transfer Confirmed!</p>
                        <p className="text-green-300 text-sm mt-1">
                            We're verifying your mandate. You'll receive your installation PIN via
                            email and SMS once approved. This may take up to 10 minutes.
                        </p>
                    </div>
                )}

                {/* Form — hidden once transfer is confirmed */}
                {!transferConfirmed && (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Order ID */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                                Order ID *
                            </label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => { setOrderId(e.target.value); setError(''); }}
                                disabled={isSubmitting || requiresVerification}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                onBlur={(e) => e.target.style.borderColor = '#374151'}
                                placeholder="Enter your order ID"
                            />
                        </div>

                        {/* Verification Method */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                                Verification Method *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    disabled={isSubmitting || requiresVerification}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-left flex items-center justify-between focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                    onBlur={(e) => setTimeout(() => e.target.style.borderColor = '#374151', 200)}
                                >
                                    <span className={verificationType ? 'text-white' : 'text-gray-400'}>
                                        {verificationType
                                            ? verificationOptions.find(opt => opt.value === verificationType)?.label
                                            : 'Choose verification method'}
                                    </span>
                                    <ChevronDown size={20} className="text-gray-400" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                                        {verificationOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleTypeSelect(option.value)}
                                                className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition border-b border-gray-800 last:border-b-0"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Value */}
                        {verificationType && (
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                                    {verificationOptions.find(opt => opt.value === verificationType)?.label} *
                                </label>
                                <div className="relative">
                                    <input
                                        type={getInputType()}
                                        value={verificationValue}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting || requiresVerification}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                        onBlur={(e) => e.target.style.borderColor = '#374151'}
                                        placeholder={getPlaceholder()}
                                        maxLength={(verificationType === 'bvn' || verificationType === 'phone') ? 11 : undefined}
                                    />
                                    {(verificationType === 'bvn' || verificationType === 'phone') && verificationValue && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span className={`text-xs ${verificationValue.length === 11 ? 'text-green-400' : 'text-gray-400'}`}>
                                                {verificationValue.length}/11
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {validationError && (
                                    <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                                        <AlertCircle size={14} />
                                        <span>{validationError}</span>
                                    </p>
                                )}

                                {!validationError && isValidInput && (
                                    <p className="mt-2 text-green-400 text-sm flex items-center space-x-1">
                                        <CheckCircle size={14} />
                                        <span>Valid {verificationType.toUpperCase()}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Verify & Get PIN button */}
                        {!requiresVerification && (
                            <button
                                type="submit"
                                disabled={isSubmitting || !verificationType || !verificationValue || !orderId || !!validationError}
                                className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#f7623b' }}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Verifying...</span>
                                    </span>
                                ) : 'Verify & Get PIN'}
                            </button>
                        )}

                        {/* Transfer Completed button */}
                        {requiresVerification && (
                            <button
                                type="button"
                                onClick={handleTransferCompleted}
                                disabled={isConfirmingTransfer}
                                className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#f7623b' }}
                            >
                                {isConfirmingTransfer ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Confirming...</span>
                                    </span>
                                ) : '✅ Transfer Completed'}
                            </button>
                        )}

                    </form>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <h3 className="text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                        ℹ️ What happens next?
                    </h3>
                    <ul className="text-gray-400 text-xs space-y-1">
                        <li>• We'll verify your details with our records</li>
                        <li>• Your mandate will be created (if not already done)</li>
                        <li>• You'll receive the installation PIN via email and SMS</li>
                        <li>• Provide the PIN to the installer to complete installation</li>
                    </ul>
                </div>
            </div>

            {/* Loading Overlay */}
            {(isSubmitting || isConfirmingTransfer) && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
                        <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
                        <p className="text-white font-medium">
                            {isSubmitting ? 'Verifying your details...' : 'Confirming transfer...'}
                        </p>
                        <p className="text-gray-400 text-sm">This may take a moment</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MandateVerificationForm;