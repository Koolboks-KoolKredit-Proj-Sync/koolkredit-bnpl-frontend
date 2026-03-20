// import React, { useState, useRef } from 'react';
// import { Camera, Upload, FileText, X, RefreshCw } from 'lucide-react';
// import Swal from 'sweetalert2';
// import { useNavigate } from "react-router-dom";
//
//
//
// function AgentEntryForm() {
//
// const navigate = useNavigate();
//
//
//
// const handleSubmit = async () => {
//     // Validate required fields
//     const requiredFields = [
//       'productName', 'brand', 'size', 'price', 'firstName', 'lastName',
//       'dateOfBirth', 'maritalStatus', 'gender', 'bvn', 'nin', 'mobileNumber', 'plan'
//     ];
//
//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Missing Field',
//           text: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
//         });
//         return;
//       }
//     }
//
//     // if (!formData.passport) {
//     //   Swal.fire({
//     //     icon: 'warning',
//     //     title: 'Passport Required',
//     //     text: 'Please capture a passport photo.'
//     //   });
//     //   return;
//     // }
//
//     if ((formData.plan === 'Easy 35' || formData.plan === 'Easy 20') && !formData.installmentDuration) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Missing Duration',
//         text: 'Please select an installment duration.'
//       });
//       return;
//     }
//
//     if (formData.plan === 'Omolope' && !formData.omolopeDays) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Missing Omolope Duration',
//         text: 'Please enter the duration in days for Omolope plan.'
//       });
//       return;
//     }
//
//     // Create FormData for multipart/form-data submission
//     const formDataToSend = new FormData();
//     formDataToSend.append('productName', formData.productName);
//     formDataToSend.append('brand', formData.brand);
//     formDataToSend.append('size', formData.size);
//     formDataToSend.append('price', formData.price);
//     formDataToSend.append('firstName', formData.firstName);
//     if (formData.middleName) {
//       formDataToSend.append('middleName', formData.middleName);
//     }
//     formDataToSend.append('lastName', formData.lastName);
//     formDataToSend.append('dateOfBirth', formData.dateOfBirth);
//     formDataToSend.append('maritalStatus', formData.maritalStatus);
//     formDataToSend.append('gender', formData.gender);
//     formDataToSend.append('bvn', formData.bvn);
//     formDataToSend.append('nin', formData.nin);
//     formDataToSend.append('mobileNumber', formData.mobileNumber);
//     formDataToSend.append('passport', formData.passport);
//     formDataToSend.append('plan', formData.plan);
//
//     if (formData.installmentDuration) {
//       formDataToSend.append('installmentDuration', formData.installmentDuration);
//     }
//     if (formData.omolopeDays) {
//       formDataToSend.append('omolopeDays', formData.omolopeDays);
//     }
//     if (formData.bankStatementMethod) {
//       formDataToSend.append('bankStatementMethod', formData.bankStatementMethod);
//     }
//
//     try {
//       // Show loading state
//       Swal.fire({
//         title: 'Submitting...',
//         text: 'Verifying documents, please wait.',
//         allowOutsideClick: false,
//         didOpen: () => Swal.showLoading()
//       });
//
//       const response = await fetch('http://localhost:8080/api/agent-entry', {
//         method: 'POST',
//         body: formDataToSend
//       });
//
//       const result = await response.json();
//
//       if (result.success) {
//         if (result.verified) {
//
//
//
//           Swal.fire({
//             icon: 'success',
//             title: 'Success!',
//             text: 'Documents authenticated and verified successfully. Check your email for confirmation.'
//           }).then(() => {
//             // 1. SAVE TO SESSION STORAGE IMMEDIATELY
//             // This is the "Safety Net"
//             sessionStorage.setItem("customerData", JSON.stringify(formData));
//             // Navigate to follow-up form with entryData
//
//             // Store data in window for next form
//             window.agentEntryData = formData;
//
//             navigate('/agent-followup', { state: formData });
//         });
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Verification Failed',
//             text: result.message
//             // text: 'Documents do not match. Check your email for details.'
//           }).then(() => {
//             // Navigate to follow-up form with entryData
//             navigate('/agent-followup', { state: formData });
//         });
//         }
//
//
//         // resetForm();
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: result.message
//         });
//         resetForm()
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Submission Failed',
//         text: 'Error submitting form. Please ensure the backend server is running.'
//       });
//     }
//   };
//
//   //reset function
//   const resetForm = () => {
//     setFormData({
//       productName: '',
//       brand: '',
//       size: '',
//       price: '',
//       firstName: '',
//       middleName: '',
//       lastName: '',
//       dateOfBirth: '',
//       maritalStatus: '',
//       gender: '',
//       bvn: '',
//       nin: '',
//       mobileNumber: '',
//       passport: null,
//       plan: '',
//       installmentDuration: '',
//       omolopeDays: '',
//       bankStatementMethod: ''
//     });
//     setPassportPreview(null);
//   };
//
//
//
//
//
//   const [formData, setFormData] = useState({
//     productName: '',
//     brand: '',
//     size: '',
//     price: '',
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     dateOfBirth: '',
//     maritalStatus: '',
//     gender: '',
//     bvn: '',
//     nin: '',
//     mobileNumber: '',
//     passport: null,
//     plan: '',
//     installmentDuration: '',
//     omolopeDays: '',
//     bankStatementMethod: ''
//   });
//
//   const [passportPreview, setPassportPreview] = useState(null);
//   const [showCameraModal, setShowCameraModal] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [facingMode, setFacingMode] = useState('user'); // 'user' for front, 'environment' for back
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const startCamera = async (preferredFacingMode = 'user') => {
//     setCameraError('');
//
//     // Stop any existing stream first
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//
//     try {
//       // Request specific device camera, not virtual cameras
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: preferredFacingMode },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           // These constraints help avoid virtual cameras
//           aspectRatio: { ideal: 1.777777778 },
//           frameRate: { ideal: 30 }
//         },
//         audio: false
//       });
//
//       setStream(mediaStream);
//       setFacingMode(preferredFacingMode);
//       setShowCameraModal(true);
//
//       // Wait a bit for modal to render, then attach stream
//       setTimeout(() => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//           videoRef.current.play().catch(err => {
//             console.error('Error playing video:', err);
//             setCameraError('Could not start video playback');
//           });
//         }
//       }, 100);
//     } catch (err) {
//       console.error('Camera error:', err);
//       setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
//       alert('Unable to access camera. Please check your browser permissions and ensure you have a physical camera connected.');
//     }
//   };
//
//   const flipCamera = () => {
//     const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
//     startCamera(newFacingMode);
//   };
//
//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//
//     if (!canvas || !video) {
//       alert('Camera not ready. Please try again.');
//       return;
//     }
//
//     if (video.readyState !== video.HAVE_ENOUGH_DATA) {
//       alert('Video is still loading. Please wait a moment and try again.');
//       return;
//     }
//
//     try {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//
//       // Only flip if using front camera
//       if (facingMode === 'user') {
//         ctx.translate(canvas.width, 0);
//         ctx.scale(-1, 1);
//       }
//       ctx.drawImage(video, 0, 0);
//
//       // Play camera shutter sound
//       const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zO/ckTsKFmS56+mjUBAKRp/f8r5sIQUugc3y2Ik2Bxhkuezqn08RC0ul4fG5ZRwFN43U7859KQUnfszv3JE7ChZkuevsn1AQC0ae3vK+bB8FLoHM8tmJNgcYY7ns6qBPEQtLpeHxuWUcBTeN1O/OfSkFJ37M79yROwkWZLnr7J9PEAtGnt7yvmwfBS6BzPLZiTYHGGK57OqgThELS6Xh8blkHAU3jdTvzn0oBSd+zO/ckToJFmO56+yfTxALRp7d8r1sHwUtgczy2Yk1Bxhiuevrn04RC0ql4fG5ZBwFN4zU787+KAUnfczv3JE6CRVjuevsnk4QC0ae3fK9bB8FLYHLctmJNQYYYrns6p9OEQpKpeHwuWQcBTaM1O/PfigFJn3M79uSOwkVY7jr7J5OEAJY2djYzw==');
//       audio.play().catch(e => console.log('Audio play failed:', e));
//
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const url = URL.createObjectURL(blob);
//           setPassportPreview(url);
//           setFormData(prev => ({ ...prev, passport: blob }));
//           console.log('Photo captured successfully:', blob);
//           stopCamera();
//         } else {
//           alert('Failed to capture photo. Please try again.');
//         }
//       }, 'image/jpeg', 0.95);
//     } catch (error) {
//       console.error('Capture error:', error);
//       alert('Error capturing photo. Please try again.');
//     }
//   };
//
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     setShowCameraModal(false);
//   };
//
//   const retakePhoto = () => {
//     if (window.confirm('Are you sure you want to retake the passport photo? This will replace the current photo.')) {
//       setPassportPreview(null);
//       setFormData(prev => ({ ...prev, passport: null }));
//       startCamera();
//     }
//   };
//
// //   const handleSubmit = () => {
// //     // Validate required fields
// //     const requiredFields = [
// //       'productName', 'brand', 'size', 'price', 'firstName', 'lastName',
// //       'dateOfBirth', 'maritalStatus', 'gender', 'bvn', 'nin', 'mobileNumber', 'plan'
// //     ];
//
// //     for (let field of requiredFields) {
// //       if (!formData[field]) {
// //         alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
// //         return;
// //       }
// //     }
//
// //     if (!formData.passport) {
// //       alert('Please capture a passport photo.');
// //       return;
// //     }
//
// //     if ((formData.plan === 'Easy 35' || formData.plan === 'Easy 20') && !formData.installmentDuration) {
// //       alert('Please select an installment duration.');
// //       return;
// //     }
//
// //     if (formData.plan === 'Omolope' && !formData.omolopeDays) {
// //       alert('Please enter the duration in days for Omolope plan.');
// //       return;
// //     }
//
// //     console.log('Form submitted:', formData);
// //     alert('Agent entry submitted successfully!');
// //   };
//
//   const planOptions = ['OutrightFlex', 'Easy 35', 'Easy 20', 'Omolope'];
//   const installmentMonths = [1, 2, 5, 11, 17, 23];
//   const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
//   const genderOptions = ['Male', 'Female', 'Other'];
//
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//       <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: '#f7623b' }}>
//           Agent Manual Entry
//         </h1>
//         <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">Complete customer registration and product details</p>
//
//         <div className="space-y-6 sm:space-y-8">
//           {/* Product Details Section */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//               Product Details
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="productName"
//                   value={formData.productName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Enter product name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Brand *
//                 </label>
//                 <input
//                   type="text"
//                   name="brand"
//                   value={formData.brand}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Enter brand"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Size *
//                 </label>
//                 <input
//                   type="text"
//                   name="size"
//                   value={formData.size}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Enter size"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Price (₦) *
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   min="0"
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Enter price"
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//
//           {/* Personal Information Section */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//               Personal Information
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="First name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Middle Name
//                 </label>
//                 <input
//                   type="text"
//                   name="middleName"
//                   value={formData.middleName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Middle name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Last name"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Date of Birth *
//                 </label>
//                 <input
//                   type="date"
//                   name="dateOfBirth"
//                   value={formData.dateOfBirth}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Marital Status *
//                 </label>
//                 <select
//                   name="maritalStatus"
//                   value={formData.maritalStatus}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   required
//                 >
//                   <option value="">Select status</option>
//                   {maritalStatusOptions.map(status => (
//                     <option key={status} value={status}>{status}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Gender *
//                 </label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   required
//                 >
//                   <option value="">Select gender</option>
//                   {genderOptions.map(gender => (
//                     <option key={gender} value={gender}>{gender}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//
//           {/* Verification Details Section */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//               Verification Details
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   BVN *
//                 </label>
//                 <input
//                   type="text"
//                   name="bvn"
//                   value={formData.bvn}
//                   onChange={handleInputChange}
//                   maxLength="11"
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Enter 11-digit BVN"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   NIN *
//                 </label>
//                 <input
//                   type="text"
//                   name="nin"
//                   value={formData.nin}
//                   onChange={handleInputChange}
//                   maxLength="11"
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Enter 11-digit NIN"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Mobile Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="mobileNumber"
//                   value={formData.mobileNumber}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                   onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                   onBlur={(e) => e.target.style.borderColor = '#374151'}
//                   placeholder="Enter mobile number"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                   Passport Photo *
//                 </label>
//                 {!passportPreview ? (
//                   <button
//                     type="button"
//                     onClick={startCamera}
//                     className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm sm:text-base hover:text-white cursor-pointer transition"
//                     style={{ borderColor: '#374151' }}
//                     onMouseEnter={(e) => e.target.style.borderColor = '#f7623b'}
//                     onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
//                   >
//                     <Camera className="mr-2" size={20} />
//                     Capture Live Photo
//                   </button>
//                 ) : (
//                   <div className="relative">
//                     <img
//                       src={passportPreview}
//                       alt="Passport preview"
//                       className="w-full h-24 sm:h-32 object-cover rounded-lg border"
//                       style={{ borderColor: '#f7623b' }}
//                     />
//                     <button
//                       type="button"
//                       onClick={retakePhoto}
//                       className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full text-white"
//                       style={{ backgroundColor: '#f7623b' }}
//                     >
//                       <Camera size={14} className="sm:w-4 sm:h-4" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//
//           {/* Payment Plan Section */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//               Select Plan *
//             </h2>
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
//               {planOptions.map(plan => (
//                 <button
//                   key={plan}
//                   type="button"
//                   onClick={() => setFormData(prev => ({ ...prev, plan }))}
//                   className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition"
//                   style={{
//                     backgroundColor: formData.plan === plan ? '#f7623b' : '#111827',
//                     color: formData.plan === plan ? 'white' : '#9ca3af',
//                     border: formData.plan === plan ? 'none' : '1px solid #374151'
//                   }}
//                 >
//                   {plan}
//                 </button>
//               ))}
//             </div>
//           </div>
//
//           {/* Installment Duration Section */}
//           {(formData.plan === 'Easy 35' || formData.plan === 'Easy 20') && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Installment Duration *
//               </h2>
//               <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
//                 {installmentMonths.map(month => (
//                   <button
//                     key={month}
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, installmentDuration: month }))}
//                     className="px-4 py-3 rounded-lg font-medium transition"
//                     style={{
//                       backgroundColor: formData.installmentDuration === month ? '#f7623b' : '#111827',
//                       color: formData.installmentDuration === month ? 'white' : '#9ca3af',
//                       border: formData.installmentDuration === month ? 'none' : '1px solid #374151'
//                     }}
//                   >
//                     {month} {month === 1 ? 'Month' : 'Months'}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//
//           {formData.plan === 'Omolope' && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Duration (Days) *
//               </h2>
//               <input
//                 type="number"
//                 name="omolopeDays"
//                 value={formData.omolopeDays}
//                 onChange={handleInputChange}
//                 min="1"
//                                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                 onBlur={(e) => e.target.style.borderColor = '#374151'}
//                 placeholder="Enter number of days"
//                 required
//               />
//             </div>
//           )}
//
//           {/* Bank Statement Section */}
//           <div className="pb-4 sm:pb-6">
//             <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//               Request Bank Statement
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'Mono' }))}
//                 className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition"
//                 style={{
//                   backgroundColor: formData.bankStatementMethod === 'Mono' ? '#f7623b' : '#111827',
//                   color: formData.bankStatementMethod === 'Mono' ? 'white' : '#9ca3af',
//                   border: formData.bankStatementMethod === 'Mono' ? 'none' : '1px solid #374151'
//                 }}
//               >
//                 <FileText className="mr-2" size={20} />
//                 Mono
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'MBS' }))}
//                 className="flex items-center justify-center px-6 py-4 rounded-lg font-medium transition"
//                 style={{
//                   backgroundColor: formData.bankStatementMethod === 'MBS' ? '#f7623b' : '#111827',
//                   color: formData.bankStatementMethod === 'MBS' ? 'white' : '#9ca3af',
//                   border: formData.bankStatementMethod === 'MBS' ? 'none' : '1px solid #374151'
//                 }}
//               >
//                 <Upload className="mr-2" size={20} />
//                 MBS
//               </button>
//             </div>
//           </div>
//
//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition duration-200 shadow-lg text-white"
//             style={{ backgroundColor: '#f7623b' }}
//             onMouseEnter={(e) => e.target.style.opacity = '0.9'}
//             onMouseLeave={(e) => e.target.style.opacity = '1'}
//           >
//             Submit Agent Entry
//           </button>
//         </div>
//       </div>
//
//       {/* Camera Modal */}
//       {showCameraModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
//             <div className="flex justify-between items-center mb-3 sm:mb-4">
//               <h3 className="text-lg sm:text-2xl font-bold text-white">Capture Passport Photo</h3>
//               <button
//                 onClick={stopCamera}
//                 className="p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition"
//               >
//                 <X className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//               </button>
//             </div>
//
//             <div className="relative mb-3 sm:mb-4">
//               <div className="relative overflow-hidden rounded-lg bg-gray-800">
//                 {cameraError && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10">
//                     {cameraError}
//                   </div>
//                 )}
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   muted
//                   className="w-full rounded-lg"
//                   style={{
//                     transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//                     minHeight: '300px',
//                     maxHeight: '500px',
//                     objectFit: 'cover'
//                   }}
//                 />
//                 {/* Oval overlay guide */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <div
//                     className="border-4 rounded-full bg-transparent"
//                     style={{
//                       width: '280px',
//                       height: '350px',
//                       borderColor: '#f7623b',
//                       boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
//                     }}
//                   />
//                 </div>
//
//                 {/* Flip Camera Button */}
//                 <button
//                   onClick={flipCamera}
//                   className="absolute top-4 right-4 p-3 rounded-full text-white shadow-lg transition hover:opacity-80"
//                   style={{ backgroundColor: '#f7623b' }}
//                   title="Flip camera"
//                 >
//                   <RefreshCw size={20} />
//                 </button>
//               </div>
//               <p className="text-center text-gray-400 text-sm mt-2">
//                 Position your face within the oval • Use the flip button to switch cameras
//               </p>
//             </div>
//
//             <button
//               onClick={capturePhoto}
//               className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition text-white"
//               style={{ backgroundColor: '#f7623b' }}
//             >
//               <Camera className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
//               Capture Photo
//             </button>
//             <canvas ref={canvasRef} className="hidden" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//
// export default AgentEntryForm














// import React, { useState, useRef } from 'react';
// import { Camera, Upload, FileText, X, RefreshCw, Plus, Trash2 } from 'lucide-react';
// import Swal from 'sweetalert2';
// import { useNavigate } from "react-router-dom";
//
//
// function AgentEntryForm() {
//
//   const navigate = useNavigate();
//
//   const koolboksProducts = [
//     { size: '208L', name: 'Koolboks Solar Freezer (DC)', price: 684000 },
//     { size: '538L', name: 'Koolboks Solar Freezer (DC)', price: 997000 },
//     { size: '358L', name: 'Koolboks Upright Chiller (DC)', price: 1282000 },
//     { size: '195L', name: 'Koolboks Icemaker (DC)', price: 1136000 },
//     { size: '128L', name: 'Combo Fridge DC (Battery + 275W Solar Panel)', price: 652000 },
//     { size: '200L', name: 'AC Inverter Freezer', price: 682000 },
//     { size: '198L', name: 'AC Inverter Freezer', price: 706000 },
//     { size: '208L', name: 'AC Inverter Freezer', price: 756000 },
//     { size: '530L', name: 'AC Inverter Freezer', price: 1123000 },
//     { size: '600L', name: 'AC Inverter Freezer', price: 1106000 },
//     { size: '750L', name: 'AC Inverter Freezer', price: 1392000 }
//   ];
//
//   const koolEnergiesProducts = [
//     { size: '1 KVA', name: '1 KVA Premium Solar', price: 569000 },
//     { size: '1.5 KVA', name: '1.5 KVA Premium Solar', price: 652000 },
//     { size: '2 KVA', name: '2 KVA Premium Solar', price: 836000 },
//     { size: '3.5 KVA', name: '3.5 KVA Premium Solar', price: 2164781.25 },
//     { size: '5 KVA', name: '5 KVA Premium Solar', price: 4670875 },
//     { size: '7.5 KVA', name: '7.5 KVA Premium Solar', price: 6569593.75 },
//     { size: '10 KVA', name: '10 KVA Premium Solar', price: 9841625 },
//     { size: '200W', name: '200W Solar Generator (without panels)', price: 428656.25 },
//     { size: '200W', name: '200W Solar Generator (+ panels)', price: 519941.67 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (without panels)', price: 348000 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (+ panels)', price: 501000 }
//   ];
//
//   const [businessType, setBusinessType] = useState('');
//   const [products, setProducts] = useState([
//     { productName: '', size: '', price: '', quantity: 1 }
//   ]);
//
//   const [formData, setFormData] = useState({
//     brand: '',
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     dateOfBirth: '',
//     maritalStatus: '',
//     gender: '',
//     bvn: '',
//     nin: '',
//     mobileNumber: '',
//     passport: null,
//     plan: '',
//     installmentDuration: '',
//     omolopeDays: '',
//     bankStatementMethod: '',
//     spouseName: '',
//     spousePhone: '',
//     nextOfKinName: '',
//     nextOfKinPhone: '',
//     nextOfKinRelationship: ''
//   });
//
//   const [passportPreview, setPassportPreview] = useState(null);
//   const [showCameraModal, setShowCameraModal] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [facingMode, setFacingMode] = useState('user');
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//
//   const handleBusinessTypeChange = (type) => {
//     setBusinessType(type);
//     if (type === 'Koolboks') {
//       setFormData(prev => ({ ...prev, brand: 'Koolboks' }));
//     } else if (type === 'KoolEnergies') {
//       setFormData(prev => ({ ...prev, brand: 'KoolEnergies' }));
//     } else if (type === 'Koolbuy') {
//       setFormData(prev => ({ ...prev, brand: 'Koolbuy' }));
//     }
//     // Reset products when changing business type
//     setProducts([{ productName: '', size: '', price: '', quantity: 1 }]);
//   };
//
//   const handleProductChange = (index, productName) => {
//     const newProducts = [...products];
//
//     if (businessType === 'Koolboks') {
//       const selectedProduct = koolboksProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1
//         };
//       }
//     } else if (businessType === 'KoolEnergies') {
//       const selectedProduct = koolEnergiesProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1
//         };
//       }
//     }
//
//     setProducts(newProducts);
//   };
//
//   const handleQuantityChange = (index, increment) => {
//     const newProducts = [...products];
//     const currentQuantity = newProducts[index].quantity || 1;
//     const newQuantity = currentQuantity + increment;
//
//     if (newQuantity >= 1) {
//       newProducts[index].quantity = newQuantity;
//       setProducts(newProducts);
//     }
//   };
//
//   const addProduct = () => {
//     setProducts([...products, { productName: '', size: '', price: '', quantity: 1 }]);
//   };
//
//   const removeProduct = (index) => {
//     if (products.length > 1) {
//       const newProducts = products.filter((_, i) => i !== index);
//       setProducts(newProducts);
//     }
//   };
//
//   const getTotalPrice = () => {
//     return products.reduce((total, product) => {
//       const price = parseFloat(product.price) || 0;
//       const quantity = parseInt(product.quantity) || 1;
//       return total + (price * quantity);
//     }, 0);
//   };
//
//   const getConcatenatedProductNames = () => {
//     return products
//         .filter(p => p.productName)
//         .map(p => {
//           const qty = p.quantity > 1 ? ` (x${p.quantity})` : '';
//           return `${p.productName}${qty}`;
//         })
//         .join(' + ');
//   };
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const startCamera = async (preferredFacingMode = 'user') => {
//     setCameraError('');
//
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: preferredFacingMode },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           aspectRatio: { ideal: 1.777777778 },
//           frameRate: { ideal: 30 }
//         },
//         audio: false
//       });
//
//       setStream(mediaStream);
//       setFacingMode(preferredFacingMode);
//       setShowCameraModal(true);
//
//       setTimeout(() => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//           videoRef.current.play().catch(err => {
//             console.error('Error playing video:', err);
//             setCameraError('Could not start video playback');
//           });
//         }
//       }, 100);
//     } catch (err) {
//       console.error('Camera error:', err);
//       setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
//       alert('Unable to access camera. Please check your browser permissions and ensure you have a physical camera connected.');
//     }
//   };
//
//   const flipCamera = () => {
//     const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
//     startCamera(newFacingMode);
//   };
//
//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//
//     if (!canvas || !video) {
//       alert('Camera not ready. Please try again.');
//       return;
//     }
//
//     if (video.readyState !== video.HAVE_ENOUGH_DATA) {
//       alert('Video is still loading. Please wait a moment and try again.');
//       return;
//     }
//
//     try {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//
//       if (facingMode === 'user') {
//         ctx.translate(canvas.width, 0);
//         ctx.scale(-1, 1);
//       }
//       ctx.drawImage(video, 0, 0);
//
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const url = URL.createObjectURL(blob);
//           setPassportPreview(url);
//           setFormData(prev => ({ ...prev, passport: blob }));
//           console.log('Photo captured successfully:', blob);
//           stopCamera();
//         } else {
//           alert('Failed to capture photo. Please try again.');
//         }
//       }, 'image/jpeg', 0.95);
//     } catch (error) {
//       console.error('Capture error:', error);
//       alert('Error capturing photo. Please try again.');
//     }
//   };
//
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     setShowCameraModal(false);
//   };
//
//   const retakePhoto = () => {
//     if (window.confirm('Are you sure you want to retake the passport photo? This will replace the current photo.')) {
//       setPassportPreview(null);
//       setFormData(prev => ({ ...prev, passport: null }));
//       startCamera();
//     }
//   };
//
//   // const handleSubmit = async () => {
//   //   if (!businessType) {
//   //     alert('Please select a business type (Koolboks, KoolEnergies, or Koolbuy).');
//   //     return;
//   //   }
//   //
//   //   const requiredFields = [
//   //     'firstName', 'lastName', 'dateOfBirth', 'maritalStatus', 'gender',
//   //     'bvn', 'nin', 'mobileNumber', 'plan'
//   //   ];
//   //
//   //   for (let field of requiredFields) {
//   //     if (!formData[field]) {
//   //       alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
//   //       return;
//   //     }
//   //   }
//   //
//   //   if (businessType !== 'Koolbuy') {
//   //     const hasEmptyProduct = products.some(p => !p.productName);
//   //     if (hasEmptyProduct) {
//   //       alert('Please select all product names.');
//   //       return;
//   //     }
//   //   }
//   //
//   //   if ((formData.plan === 'Easy 35' || formData.plan === 'Easy 20') && !formData.installmentDuration) {
//   //     alert('Please select an installment duration.');
//   //     return;
//   //   }
//   //
//   //   if (formData.plan === 'Omolope' && !formData.omolopeDays) {
//   //     alert('Please enter the duration in days for Omolope plan.');
//   //     return;
//   //   }
//   //
//   //   const submissionData = {
//   //     ...formData,
//   //     businessType,
//   //     products,
//   //     totalPrice: getTotalPrice(),
//   //     concatenatedProductNames: getConcatenatedProductNames()
//   //   };
//   //
//   //   console.log('Form submitted:', submissionData);
//   //   alert('Agent entry submitted successfully!');
//   // };
//
//
//   const handleSubmit = async () => {
//     if (!businessType) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Missing Business Type',
//         text: 'Please select a business type (Koolboks, KoolEnergies, or Koolbuy).'
//       });
//       return;
//     }
//
//     const requiredFields = [
//       'firstName', 'lastName', 'dateOfBirth', 'maritalStatus', 'gender',
//       'bvn', 'nin', 'mobileNumber', 'plan'
//     ];
//
//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Incomplete Form',
//           text: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
//         });
//         return;
//       }
//     }
//
//     if (businessType !== 'Koolbuy') {
//       const hasEmptyProduct = products.some(p => !p.productName);
//       if (hasEmptyProduct) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Product Missing',
//           text: 'Please select all product names.'
//         });
//         return;
//       }
//     }
//
//     if (
//         (formData.plan === 'Easy 35' || formData.plan === 'Easy 20') &&
//         !formData.installmentDuration
//     ) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Installment Required',
//         text: 'Please select an installment duration.'
//       });
//       return;
//     }
//
//     if (formData.plan === 'Omolope' && !formData.omolopeDays) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Duration Required',
//         text: 'Please enter the duration in days for Omolope plan.'
//       });
//       return;
//     }
//
//     const formDataToSend = new FormData();
//     formDataToSend.append('businessType', businessType);
//     formDataToSend.append('productName', getConcatenatedProductNames());
//     formDataToSend.append('brand', formData.brand);
//     formDataToSend.append('size', products.map(p => p.size).join(', '));
//     formDataToSend.append('price', products.map(p => p.price).join(', '));
//     formDataToSend.append('totalPrice', getTotalPrice().toString());
//     formDataToSend.append('firstName', formData.firstName);
//
//     if (formData.middleName) formDataToSend.append('middleName', formData.middleName);
//
//     formDataToSend.append('lastName', formData.lastName);
//     formDataToSend.append('dateOfBirth', formData.dateOfBirth);
//     formDataToSend.append('maritalStatus', formData.maritalStatus);
//     formDataToSend.append('gender', formData.gender);
//
//     if (formData.spouseName) formDataToSend.append('spouseName', formData.spouseName);
//     if (formData.spousePhone) formDataToSend.append('spousePhone', formData.spousePhone);
//     if (formData.nextOfKinName) formDataToSend.append('nextOfKinName', formData.nextOfKinName);
//     if (formData.nextOfKinPhone) formDataToSend.append('nextOfKinPhone', formData.nextOfKinPhone);
//     if (formData.nextOfKinRelationship) {
//       formDataToSend.append('nextOfKinRelationship', formData.nextOfKinRelationship);
//     }
//
//     formDataToSend.append('bvn', formData.bvn);
//     formDataToSend.append('nin', formData.nin);
//     formDataToSend.append('mobileNumber', formData.mobileNumber);
//     formDataToSend.append('passport', formData.passport);
//     formDataToSend.append('plan', formData.plan);
//
//     if (formData.installmentDuration) {
//       formDataToSend.append('installmentDuration', formData.installmentDuration);
//     }
//     if (formData.omolopeDays) {
//       formDataToSend.append('omolopeDays', formData.omolopeDays);
//     }
//     if (formData.bankStatementMethod) {
//       formDataToSend.append('bankStatementMethod', formData.bankStatementMethod);
//     }
//
//     try {
//       const response = await fetch('http://localhost:8080/api/agent-entry', {
//         method: 'POST',
//         body: formDataToSend
//       });
//
//       const result = await response.json();
//
//       if (result.success) {
//         if (result.verified) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Verified',
//             text: 'Documents authenticated and verified successfully. Check your email for confirmation.'
//           }).then(() => {
//             // ✅ CREATE COMPLETE DATA OBJECT WITH ALL PRODUCT INFO
//             const completeData = {
//               ...formData,
//               productName: getConcatenatedProductNames(),
//               brand: formData.brand,
//               size: products.map(p => p.size).join(', '),
//               price: products.map(p => p.price).join(', '),
//               totalPrice: getTotalPrice().toString(),
//               businessType: businessType
//             };
//
//             // Save to session storage
//             sessionStorage.setItem("customerData", JSON.stringify(completeData));
//
//             // Store data in window
//             window.agentEntryData = completeData;
//
//             // ✅ NAVIGATE WITH COMPLETE DATA
//             navigate('/agent-followup', { state: completeData });
//           });
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Verification Failed',
//             text: result.message
//           });
//         }
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Submission Error',
//         text: 'Error submitting form. Please ensure the backend server is running.'
//       });
//     }
//   };
//
//
//
//
//
//   // const handleSubmit = async () => {
//   //
//   //
//   //
//   //   if (!businessType) {
//   //     Swal.fire({
//   //       icon: 'warning',
//   //       title: 'Missing Business Type',
//   //       text: 'Please select a business type (Koolboks, KoolEnergies, or Koolbuy).'
//   //     });
//   //     return;
//   //   }
//   //
//   //   const requiredFields = [
//   //     'firstName', 'lastName', 'dateOfBirth', 'maritalStatus', 'gender',
//   //     'bvn', 'nin', 'mobileNumber', 'plan'
//   //   ];
//   //
//   //   for (let field of requiredFields) {
//   //     if (!formData[field]) {
//   //       Swal.fire({
//   //         icon: 'warning',
//   //         title: 'Incomplete Form',
//   //         text: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
//   //       });
//   //       return;
//   //     }
//   //   }
//   //
//   //   if (businessType !== 'Koolbuy') {
//   //     const hasEmptyProduct = products.some(p => !p.productName);
//   //     if (hasEmptyProduct) {
//   //       Swal.fire({
//   //         icon: 'warning',
//   //         title: 'Product Missing',
//   //         text: 'Please select all product names.'
//   //       });
//   //       return;
//   //     }
//   //   }
//   //
//   //   if (
//   //       (formData.plan === 'Easy 35' || formData.plan === 'Easy 20') &&
//   //       !formData.installmentDuration
//   //   ) {
//   //     Swal.fire({
//   //       icon: 'warning',
//   //       title: 'Installment Required',
//   //       text: 'Please select an installment duration.'
//   //     });
//   //     return;
//   //   }
//   //
//   //   if (formData.plan === 'Omolope' && !formData.omolopeDays) {
//   //     Swal.fire({
//   //       icon: 'warning',
//   //       title: 'Duration Required',
//   //       text: 'Please enter the duration in days for Omolope plan.'
//   //     });
//   //     return;
//   //   }
//   //
//   //   const formDataToSend = new FormData();
//   //   formDataToSend.append('businessType', businessType);
//   //   formDataToSend.append('productName', getConcatenatedProductNames());
//   //   formDataToSend.append('brand', formData.brand);
//   //   formDataToSend.append('size', products.map(p => p.size).join(', '));
//   //   formDataToSend.append('price', products.map(p => p.price).join(', '));
//   //   formDataToSend.append('totalPrice', getTotalPrice().toString());
//   //   formDataToSend.append('firstName', formData.firstName);
//   //
//   //   if (formData.middleName) formDataToSend.append('middleName', formData.middleName);
//   //
//   //   formDataToSend.append('lastName', formData.lastName);
//   //   formDataToSend.append('dateOfBirth', formData.dateOfBirth);
//   //   formDataToSend.append('maritalStatus', formData.maritalStatus);
//   //   formDataToSend.append('gender', formData.gender);
//   //
//   //   if (formData.spouseName) formDataToSend.append('spouseName', formData.spouseName);
//   //   if (formData.spousePhone) formDataToSend.append('spousePhone', formData.spousePhone);
//   //   if (formData.nextOfKinName) formDataToSend.append('nextOfKinName', formData.nextOfKinName);
//   //   if (formData.nextOfKinPhone) formDataToSend.append('nextOfKinPhone', formData.nextOfKinPhone);
//   //   if (formData.nextOfKinRelationship) {
//   //     formDataToSend.append('nextOfKinRelationship', formData.nextOfKinRelationship);
//   //   }
//   //
//   //   formDataToSend.append('bvn', formData.bvn);
//   //   formDataToSend.append('nin', formData.nin);
//   //   formDataToSend.append('mobileNumber', formData.mobileNumber);
//   //   formDataToSend.append('passport', formData.passport);
//   //   formDataToSend.append('plan', formData.plan);
//   //
//   //   if (formData.installmentDuration) {
//   //     formDataToSend.append('installmentDuration', formData.installmentDuration);
//   //   }
//   //   if (formData.omolopeDays) {
//   //     formDataToSend.append('omolopeDays', formData.omolopeDays);
//   //   }
//   //   if (formData.bankStatementMethod) {
//   //     formDataToSend.append('bankStatementMethod', formData.bankStatementMethod);
//   //   }
//   //
//   //   try {
//   //     const response = await fetch('http://localhost:8080/api/agent-entry', {
//   //       method: 'POST',
//   //       body: formDataToSend
//   //     });
//   //
//   //     const result = await response.json();
//   //
//   //     if (result.success) {
//   //       if (result.verified) {
//   //         Swal.fire({
//   //           icon: 'success',
//   //           title: 'Verified',
//   //           text: 'Documents authenticated and verified successfully. Check your email for confirmation.'
//   //         }).then(() => {
//   //           // 1. SAVE TO SESSION STORAGE IMMEDIATELY
//   //           // This is the "Safety Net"
//   //           sessionStorage.setItem("customerData", JSON.stringify(formData));
//   //           // Navigate to follow-up form with entryData
//   //
//   //           // Store data in window for next form
//   //           window.agentEntryData = formData;
//   //
//   //           navigate('/agent-followup', { state: formData });
//   //       });
//   //       } else {
//   //         Swal.fire({
//   //           icon: 'error',
//   //           title: 'Verification Failed',
//   //           text: result.message
//   //         });
//   //       }
//   //     } else {
//   //       Swal.fire({
//   //         icon: 'error',
//   //         title: 'Error',
//   //         text: result.message
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error('Submission error:', error);
//   //     Swal.fire({
//   //       icon: 'error',
//   //       title: 'Submission Error',
//   //       text: 'Error submitting form. Please ensure the backend server is running.'
//   //     });
//   //   }
//   // };
//
//
//   const resetForm = () => {
//     setBusinessType('');
//     setProducts([{ productName: '', size: '', price: '', quantity: 1 }]);
//     setFormData({
//       brand: '',
//       firstName: '',
//       middleName: '',
//       lastName: '',
//       dateOfBirth: '',
//       maritalStatus: '',
//       gender: '',
//       bvn: '',
//       nin: '',
//       mobileNumber: '',
//       passport: null,
//       plan: '',
//       installmentDuration: '',
//       omolopeDays: '',
//       bankStatementMethod: '',
//       spouseName: '',
//       spousePhone: '',
//       nextOfKinName: '',
//       nextOfKinPhone: '',
//       nextOfKinRelationship: ''
//     });
//     setPassportPreview(null);
//   };
//
//   const planOptions = ['OutrightFlex', 'Easy 35', 'Easy 20', 'Omolope'];
//   const installmentMonths = [1, 2, 5, 11, 17, 23];
//   const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
//   const genderOptions = ['Male', 'Female', 'Other'];
//
//   return (
//       <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//         <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">
//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: '#f7623b' }}>
//             Agent Manual Entry
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">Complete customer registration and product details</p>
//
//           <div className="space-y-6 sm:space-y-8">
//             {/* Business Type Selection */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Select Business Type *
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 {['Koolboks', 'KoolEnergies', 'Koolbuy'].map(type => (
//                     <label key={type} className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition"
//                            style={{
//                              backgroundColor: businessType === type ? '#f7623b' : '#111827',
//                              borderColor: businessType === type ? '#f7623b' : '#374151'
//                            }}>
//                       <input
//                           type="radio"
//                           name="businessType"
//                           value={type}
//                           checked={businessType === type}
//                           onChange={(e) => handleBusinessTypeChange(e.target.value)}
//                           className="w-4 h-4"
//                       />
//                       <span className="text-white font-medium">{type}</span>
//                     </label>
//                 ))}
//               </div>
//             </div>
//
//             {/* Product Details Section */}
//             {businessType && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <div className="flex justify-between items-center mb-3 sm:mb-4">
//                     <h2 className="text-xl sm:text-2xl font-semibold text-white">
//                       Product Details
//                     </h2>
//                     {businessType !== 'Koolbuy' && (
//                         <button
//                             type="button"
//                             onClick={addProduct}
//                             className="flex items-center px-3 py-2 rounded-lg text-white text-sm transition"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                           <Plus size={16} className="mr-1" />
//                           Add Item
//                         </button>
//                     )}
//                   </div>
//
//                   {products.map((product, index) => (
//                       <div key={index} className="mb-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-lg font-semibold text-white">Item {index + 1}</h3>
//                           {products.length > 1 && (
//                               <button
//                                   type="button"
//                                   onClick={() => removeProduct(index)}
//                                   className="p-2 rounded-lg text-red-400 hover:bg-red-900 transition"
//                               >
//                                 <Trash2 size={18} />
//                               </button>
//                           )}
//                         </div>
//
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Brand
//                             </label>
//                             <input
//                                 type="text"
//                                 value={formData.brand}
//                                 readOnly
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                             />
//                           </div>
//
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Product Name *
//                             </label>
//                             {businessType === 'Koolbuy' ? (
//                                 <input
//                                     type="text"
//                                     value={product.productName}
//                                     onChange={(e) => {
//                                       const newProducts = [...products];
//                                       newProducts[index].productName = e.target.value;
//                                       setProducts(newProducts);
//                                     }}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                     placeholder="Enter product name"
//                                 />
//                             ) : (
//                                 <select
//                                     value={product.productName}
//                                     onChange={(e) => handleProductChange(index, e.target.value)}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 >
//                                   <option value="">Select product</option>
//                                   {(businessType === 'Koolboks' ? koolboksProducts : koolEnergiesProducts).map((p, i) => (
//                                       <option key={i} value={p.name}>{p.name}</option>
//                                   ))}
//                                 </select>
//                             )}
//                           </div>
//
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Size
//                             </label>
//                             <input
//                                 type="text"
//                                 value={product.size}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].size = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                                 placeholder={businessType === 'Koolbuy' ? 'Enter size' : ''}
//                             />
//                           </div>
//
//                           <div className="sm:col-span-3">
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Price (₦)
//                             </label>
//                             <input
//                                 type="number"
//                                 value={product.price}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].price = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                                 placeholder={businessType === 'Koolbuy' ? 'Enter price' : ''}
//                             />
//                           </div>
//
//                           <div className="sm:col-span-3">
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Quantity
//                             </label>
//                             <div className="flex items-center space-x-3">
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, -1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition"
//                                   style={{ backgroundColor: '#f7623b' }}
//                                   disabled={product.quantity <= 1}
//                               >
//                                 -
//                               </button>
//                               <input
//                                   type="number"
//                                   value={product.quantity || 1}
//                                   readOnly
//                                   className="w-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center"
//                               />
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, 1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition"
//                                   style={{ backgroundColor: '#f7623b' }}
//                               >
//                                 +
//                               </button>
//                               <span className="text-gray-400 ml-4">
//                           Subtotal: <span className="text-white font-semibold">₦{((parseFloat(product.price) || 0) * (parseInt(product.quantity) || 1)).toLocaleString()}</span>
//                         </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                   ))}
//
//                   {/* Total Price Display */}
//                   <div className="mt-4 p-4 rounded-lg bg-gray-900 border-2" style={{ borderColor: '#f7623b' }}>
//                     <div className="flex justify-between items-center">
//                       <span className="text-lg font-semibold text-white">Total Price:</span>
//                       <span className="text-2xl font-bold" style={{ color: '#f7623b' }}>
//                     ₦{getTotalPrice().toLocaleString()}
//                   </span>
//                     </div>
//                     {products.filter(p => p.productName).length > 0 && (
//                         <div className="mt-2">
//                           <span className="text-sm text-gray-400">Products: </span>
//                           <span className="text-sm text-white">{getConcatenatedProductNames()}</span>
//                         </div>
//                     )}
//                   </div>
//                 </div>
//             )}
//
//             {/* Personal Information Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Personal Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     First Name *
//                   </label>
//                   <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="First name"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Middle Name
//                   </label>
//                   <input
//                       type="text"
//                       name="middleName"
//                       value={formData.middleName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Middle name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Last Name *
//                   </label>
//                   <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Last name"
//                       required
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Date of Birth *
//                   </label>
//                   <input
//                       type="date"
//                       name="dateOfBirth"
//                       value={formData.dateOfBirth}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Marital Status *
//                   </label>
//                   <select
//                       name="maritalStatus"
//                       value={formData.maritalStatus}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   >
//                     <option value="">Select status</option>
//                     {maritalStatusOptions.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Gender *
//                   </label>
//                   <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   >
//                     <option value="">Select gender</option>
//                     {genderOptions.map(gender => (
//                         <option key={gender} value={gender}>{gender}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//
//             {/* Spouse Information */}
//             {formData.maritalStatus === 'Married' && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Spouse Information
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                         Spouse Name
//                       </label>
//                       <input
//                           type="text"
//                           name="spouseName"
//                           value={formData.spouseName}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                           onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                           onBlur={(e) => e.target.style.borderColor = '#374151'}
//                           placeholder="Enter spouse name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                         Spouse Phone
//                       </label>
//                       <input
//                           type="tel"
//                           name="spousePhone"
//                           value={formData.spousePhone}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                           onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                           onBlur={(e) => e.target.style.borderColor = '#374151'}
//                           placeholder="Enter spouse phone number"
//                       />
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {/* Next of Kin Information */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Next of Kin Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Next of Kin Name
//                   </label>
//                   <input
//                       type="text"
//                       name="nextOfKinName"
//                       value={formData.nextOfKinName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter next of kin name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Next of Kin Phone
//                   </label>
//                   <input
//                       type="tel"
//                       name="nextOfKinPhone"
//                       value={formData.nextOfKinPhone}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter next of kin phone"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Relationship
//                   </label>
//                   <input
//                       type="text"
//                       name="nextOfKinRelationship"
//                       value={formData.nextOfKinRelationship}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="e.g., Brother, Sister, Friend"
//                   />
//                 </div>
//               </div>
//             </div>
//
//             {/* Verification Details Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Verification Details
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     BVN *
//                   </label>
//                   <input
//                       type="text"
//                       name="bvn"
//                       value={formData.bvn}
//                       onChange={handleInputChange}
//                       maxLength="11"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter 11-digit BVN"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     NIN *
//                   </label>
//                   <input
//                       type="text"
//                       name="nin"
//                       value={formData.nin}
//                       onChange={handleInputChange}
//                       maxLength="11"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter 11-digit NIN"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Mobile Number *
//                   </label>
//                   <input
//                       type="tel"
//                       name="mobileNumber"
//                       value={formData.mobileNumber}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter mobile number"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Passport Photo *
//                   </label>
//                   {!passportPreview ? (
//                       <button
//                           type="button"
//                           onClick={startCamera}
//                           className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm sm:text-base hover:text-white cursor-pointer transition"
//                           style={{ borderColor: '#374151' }}
//                           onMouseEnter={(e) => e.target.style.borderColor = '#f7623b'}
//                           onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
//                       >
//                         <Camera className="mr-2" size={20} />
//                         Capture Live Photo
//                       </button>
//                   ) : (
//                       <div className="relative">
//                         <img
//                             src={passportPreview}
//                             alt="Passport preview"
//                             className="w-full h-24 sm:h-32 object-cover rounded-lg border"
//                             style={{ borderColor: '#f7623b' }}
//                         />
//                         <button
//                             type="button"
//                             onClick={retakePhoto}
//                             className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full text-white"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                           <Camera size={14} className="sm:w-4 sm:h-4" />
//                         </button>
//                       </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//
//             {/* Payment Plan Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Select Plan *
//               </h2>
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
//                 {planOptions.map(plan => (
//                     <button
//                         key={plan}
//                         type="button"
//                         onClick={() => setFormData(prev => ({ ...prev, plan }))}
//                         className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition"
//                         style={{
//                           backgroundColor: formData.plan === plan ? '#f7623b' : '#111827',
//                           color: formData.plan === plan ? 'white' : '#9ca3af',
//                           border: formData.plan === plan ? 'none' : '1px solid #374151'
//                         }}
//                     >
//                       {plan}
//                     </button>
//                 ))}
//               </div>
//             </div>
//
//             {/* Installment Duration Section */}
//             {(formData.plan === 'Easy 35' || formData.plan === 'Easy 20') && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Installment Duration *
//                   </h2>
//                   <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
//                     {installmentMonths.map(month => (
//                         <button
//                             key={month}
//                             type="button"
//                             onClick={() => setFormData(prev => ({ ...prev, installmentDuration: month }))}
//                             className="px-4 py-3 rounded-lg font-medium transition"
//                             style={{
//                               backgroundColor: formData.installmentDuration === month ? '#f7623b' : '#111827',
//                               color: formData.installmentDuration === month ? 'white' : '#9ca3af',
//                               border: formData.installmentDuration === month ? 'none' : '1px solid #374151'
//                             }}
//                         >
//                           {month} {month === 1 ? 'Month' : 'Months'}
//                         </button>
//                     ))}
//                   </div>
//                 </div>
//             )}
//
//             {formData.plan === 'Omolope' && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Duration (Days) *
//                   </h2>
//                   <input
//                       type="number"
//                       name="omolopeDays"
//                       value={formData.omolopeDays}
//                       onChange={handleInputChange}
//                       min="1"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter number of days"
//                       required
//                   />
//                 </div>
//             )}
//
//             {/* Bank Statement Section */}
//             <div className="pb-4 sm:pb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Request Bank Statement
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <button
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'Mono' }))}
//                     className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition"
//                     style={{
//                       backgroundColor: formData.bankStatementMethod === 'Mono' ? '#f7623b' : '#111827',
//                       color: formData.bankStatementMethod === 'Mono' ? 'white' : '#9ca3af',
//                       border: formData.bankStatementMethod === 'Mono' ? 'none' : '1px solid #374151'
//                     }}
//                 >
//                   <FileText className="mr-2" size={20} />
//                   Mono
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'MBS' }))}
//                     className="flex items-center justify-center px-6 py-4 rounded-lg font-medium transition"
//                     style={{
//                       backgroundColor: formData.bankStatementMethod === 'MBS' ? '#f7623b' : '#111827',
//                       color: formData.bankStatementMethod === 'MBS' ? 'white' : '#9ca3af',
//                       border: formData.bankStatementMethod === 'MBS' ? 'none' : '1px solid #374151'
//                     }}
//                 >
//                   <Upload className="mr-2" size={20} />
//                   MBS
//                 </button>
//               </div>
//             </div>
//
//             {/* Submit Button */}
//             <button
//                 onClick={handleSubmit}
//                 className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition duration-200 shadow-lg text-white"
//                 style={{ backgroundColor: '#f7623b' }}
//                 onMouseEnter={(e) => e.target.style.opacity = '0.9'}
//                 onMouseLeave={(e) => e.target.style.opacity = '1'}
//             >
//               Submit Agent Entry
//             </button>
//           </div>
//         </div>
//
//         {/* Camera Modal */}
//         {showCameraModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
//               <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
//                 <div className="flex justify-between items-center mb-3 sm:mb-4">
//                   <h3 className="text-lg sm:text-2xl font-bold text-white">Capture Passport Photo</h3>
//                   <button
//                       onClick={stopCamera}
//                       className="p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition"
//                   >
//                     <X className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//                   </button>
//                 </div>
//
//                 <div className="relative mb-3 sm:mb-4">
//                   <div className="relative overflow-hidden rounded-lg bg-gray-800">
//                     {cameraError && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10">
//                           {cameraError}
//                         </div>
//                     )}
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full rounded-lg"
//                         style={{
//                           transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//                           minHeight: '300px',
//                           maxHeight: '500px',
//                           objectFit: 'cover'
//                         }}
//                     />
//                     {/* Oval overlay guide */}
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <div
//                           className="border-4 rounded-full bg-transparent"
//                           style={{
//                             width: '280px',
//                             height: '350px',
//                             borderColor: '#f7623b',
//                             boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
//                           }}
//                       />
//                     </div>
//
//                     {/* Flip Camera Button */}
//                     <button
//                         onClick={flipCamera}
//                         className="absolute top-4 right-4 p-3 rounded-full text-white shadow-lg transition hover:opacity-80"
//                         style={{ backgroundColor: '#f7623b' }}
//                         title="Flip camera"
//                     >
//                       <RefreshCw size={20} />
//                     </button>
//                   </div>
//                   <p className="text-center text-gray-400 text-sm mt-2">
//                     Position your face within the oval • Use the flip button to switch cameras
//                   </p>
//                 </div>
//
//                 <button
//                     onClick={capturePhoto}
//                     className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition text-white"
//                     style={{ backgroundColor: '#f7623b' }}
//                 >
//                   <Camera className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
//                   Capture Photo
//                 </button>
//                 <canvas ref={canvasRef} className="hidden" />
//               </div>
//             </div>
//         )}
//       </div>
//   );
// }
//
// export default AgentEntryForm;











// import React, { useState, useRef, useEffect } from 'react';
// import { Camera, Upload, FileText, X, RefreshCw, Plus, Trash2 } from 'lucide-react';
// import Swal from 'sweetalert2';
// import { useNavigate, useLocation } from "react-router-dom";
// import Logo from "../LogoWithVariant.jsx";
//
// function AgentEntryForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//
//   // Get pre-filled data from navigation state
//   const preFilledData = location.state || {};
//
//   const koolboksProducts = [
//     { size: '208L', name: 'Koolboks Solar Freezer (DC)', price: 684000 },
//     { size: '538L', name: 'Koolboks Solar Freezer (DC)', price: 997000 },
//     { size: '358L', name: 'Koolboks Upright Chiller (DC)', price: 1282000 },
//     { size: '195L', name: 'Koolboks Icemaker (DC)', price: 1136000 },
//     { size: '128L', name: 'Combo Fridge DC (Battery + 275W Solar Panel)', price: 652000 },
//     { size: '200L', name: 'AC Inverter Freezer', price: 682000 },
//     { size: '198L', name: 'AC Inverter Freezer', price: 706000 },
//     { size: '208L', name: 'AC Inverter Freezer', price: 756000 },
//     { size: '530L', name: 'AC Inverter Freezer', price: 1123000 },
//     { size: '600L', name: 'AC Inverter Freezer', price: 1106000 },
//     { size: '750L', name: 'AC Inverter Freezer', price: 1392000 }
//   ];
//
//   const koolEnergiesProducts = [
//     { size: '1 KVA', name: '1 KVA Premium Solar', price: 569000 },
//     { size: '1.5 KVA', name: '1.5 KVA Premium Solar', price: 652000 },
//     { size: '2 KVA', name: '2 KVA Premium Solar', price: 836000 },
//     { size: '3.5 KVA', name: '3.5 KVA Premium Solar', price: 2164781.25 },
//     { size: '5 KVA', name: '5 KVA Premium Solar', price: 4670875 },
//     { size: '7.5 KVA', name: '7.5 KVA Premium Solar', price: 6569593.75 },
//     { size: '10 KVA', name: '10 KVA Premium Solar', price: 9841625 },
//     { size: '200W', name: '200W Solar Generator (without panels)', price: 428656.25 },
//     { size: '200W', name: '200W Solar Generator (+ panels)', price: 519941.67 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (without panels)', price: 348000 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (+ panels)', price: 501000 }
//   ];
//
//   const [businessType, setBusinessType] = useState('');
//   const [products, setProducts] = useState([
//     { productName: '', size: '', price: '', quantity: 1 }
//   ]);
//
//   const [formData, setFormData] = useState({
//     brand: '',
//     firstName: preFilledData.firstName || '',
//     middleName: preFilledData.middleName || '',
//     lastName: preFilledData.lastName || '',
//     dateOfBirth: '',
//     maritalStatus: '',
//     gender: '',
//     bvn: '',
//     nin: '',
//     mobileNumber: '',
//     passport: null,
//     plan: '',
//     installmentDuration: '',
//     omolopeDays: '',
//     bankStatementMethod: '',
//     spouseName: '',
//     spousePhone: '',
//     nextOfKinName: '',
//     nextOfKinPhone: '',
//     nextOfKinRelationship: ''
//   });
//
//   const [passportPreview, setPassportPreview] = useState(null);
//   const [showCameraModal, setShowCameraModal] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [facingMode, setFacingMode] = useState('user');
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//
//   // Check if data was pre-filled from home page
//   const isPreFilled = !!(preFilledData.firstName || preFilledData.lastName);
//
//   const handleBusinessTypeChange = (type) => {
//     setBusinessType(type);
//     if (type === 'Koolboks') {
//       setFormData(prev => ({ ...prev, brand: 'Koolboks' }));
//     } else if (type === 'KoolEnergies') {
//       setFormData(prev => ({ ...prev, brand: 'KoolEnergies' }));
//     } else if (type === 'Koolbuy') {
//       setFormData(prev => ({ ...prev, brand: 'Koolbuy' }));
//     }
//     setProducts([{ productName: '', size: '', price: '', quantity: 1 }]);
//   };
//
//   const handleProductChange = (index, productName) => {
//     const newProducts = [...products];
//
//     if (businessType === 'Koolboks') {
//       const selectedProduct = koolboksProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1
//         };
//       }
//     } else if (businessType === 'KoolEnergies') {
//       const selectedProduct = koolEnergiesProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1
//         };
//       }
//     }
//
//     setProducts(newProducts);
//   };
//
//   const handleQuantityChange = (index, increment) => {
//     const newProducts = [...products];
//     const currentQuantity = newProducts[index].quantity || 1;
//     const newQuantity = currentQuantity + increment;
//
//     if (newQuantity >= 1) {
//       newProducts[index].quantity = newQuantity;
//       setProducts(newProducts);
//     }
//   };
//
//   const addProduct = () => {
//     setProducts([...products, { productName: '', size: '', price: '', quantity: 1 }]);
//   };
//
//   const removeProduct = (index) => {
//     if (products.length > 1) {
//       const newProducts = products.filter((_, i) => i !== index);
//       setProducts(newProducts);
//     }
//   };
//
//   const getTotalPrice = () => {
//     return products.reduce((total, product) => {
//       const price = parseFloat(product.price) || 0;
//       const quantity = parseInt(product.quantity) || 1;
//       return total + (price * quantity);
//     }, 0);
//   };
//
//   const getConcatenatedProductNames = () => {
//     return products
//         .filter(p => p.productName)
//         .map(p => {
//           const qty = p.quantity > 1 ? ` (x${p.quantity})` : '';
//           return `${p.productName}${qty}`;
//         })
//         .join(' + ');
//   };
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const startCamera = async (preferredFacingMode = 'user') => {
//     setCameraError('');
//
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: preferredFacingMode },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           aspectRatio: { ideal: 1.777777778 },
//           frameRate: { ideal: 30 }
//         },
//         audio: false
//       });
//
//       setStream(mediaStream);
//       setFacingMode(preferredFacingMode);
//       setShowCameraModal(true);
//
//       setTimeout(() => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//           videoRef.current.play().catch(err => {
//             console.error('Error playing video:', err);
//             setCameraError('Could not start video playback');
//           });
//         }
//       }, 100);
//     } catch (err) {
//       console.error('Camera error:', err);
//       setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
//       alert('Unable to access camera. Please check your browser permissions and ensure you have a physical camera connected.');
//     }
//   };
//
//   const flipCamera = () => {
//     const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
//     startCamera(newFacingMode);
//   };
//
//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//
//     if (!canvas || !video) {
//       alert('Camera not ready. Please try again.');
//       return;
//     }
//
//     if (video.readyState !== video.HAVE_ENOUGH_DATA) {
//       alert('Video is still loading. Please wait a moment and try again.');
//       return;
//     }
//
//     try {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//
//       if (facingMode === 'user') {
//         ctx.translate(canvas.width, 0);
//         ctx.scale(-1, 1);
//       }
//       ctx.drawImage(video, 0, 0);
//
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const url = URL.createObjectURL(blob);
//           setPassportPreview(url);
//           setFormData(prev => ({ ...prev, passport: blob }));
//           console.log('Photo captured successfully:', blob);
//           stopCamera();
//         } else {
//           alert('Failed to capture photo. Please try again.');
//         }
//       }, 'image/jpeg', 0.95);
//     } catch (error) {
//       console.error('Capture error:', error);
//       alert('Error capturing photo. Please try again.');
//     }
//   };
//
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     setShowCameraModal(false);
//   };
//
//   const retakePhoto = () => {
//     if (window.confirm('Are you sure you want to retake the passport photo? This will replace the current photo.')) {
//       setPassportPreview(null);
//       setFormData(prev => ({ ...prev, passport: null }));
//       startCamera();
//     }
//   };
//
//   const handleSubmit = async () => {
//     if (!businessType) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Missing Business Type',
//         text: 'Please select a business type (Koolboks, KoolEnergies, or Koolbuy).'
//       });
//       return;
//     }
//
//     const requiredFields = [
//       'firstName', 'lastName', 'dateOfBirth', 'maritalStatus', 'gender',
//       'bvn', 'nin', 'mobileNumber', 'plan'
//     ];
//
//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Incomplete Form',
//           text: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
//         });
//         return;
//       }
//     }
//
//     if (businessType !== 'Koolbuy') {
//       const hasEmptyProduct = products.some(p => !p.productName);
//       if (hasEmptyProduct) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Product Missing',
//           text: 'Please select all product names.'
//         });
//         return;
//       }
//     }
//
//     if (
//         (formData.plan === 'Easy 35' || formData.plan === 'Easy 20') &&
//         !formData.installmentDuration
//     ) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Installment Required',
//         text: 'Please select an installment duration.'
//       });
//       return;
//     }
//
//     if (formData.plan === 'Omolope' && !formData.omolopeDays) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Duration Required',
//         text: 'Please enter the duration in days for Omolope plan.'
//       });
//       return;
//     }
//
//     const formDataToSend = new FormData();
//     formDataToSend.append('businessType', businessType);
//     formDataToSend.append('productName', getConcatenatedProductNames());
//     formDataToSend.append('brand', formData.brand);
//     formDataToSend.append('size', products.map(p => p.size).join(', '));
//     formDataToSend.append('price', products.map(p => p.price).join(', '));
//     formDataToSend.append('totalPrice', getTotalPrice().toString());
//     formDataToSend.append('firstName', formData.firstName);
//
//     if (formData.middleName) formDataToSend.append('middleName', formData.middleName);
//
//     formDataToSend.append('lastName', formData.lastName);
//     formDataToSend.append('dateOfBirth', formData.dateOfBirth);
//     formDataToSend.append('maritalStatus', formData.maritalStatus);
//     formDataToSend.append('gender', formData.gender);
//
//     if (formData.spouseName) formDataToSend.append('spouseName', formData.spouseName);
//     if (formData.spousePhone) formDataToSend.append('spousePhone', formData.spousePhone);
//     if (formData.nextOfKinName) formDataToSend.append('nextOfKinName', formData.nextOfKinName);
//     if (formData.nextOfKinPhone) formDataToSend.append('nextOfKinPhone', formData.nextOfKinPhone);
//     if (formData.nextOfKinRelationship) {
//       formDataToSend.append('nextOfKinRelationship', formData.nextOfKinRelationship);
//     }
//
//     formDataToSend.append('bvn', formData.bvn);
//     formDataToSend.append('nin', formData.nin);
//     formDataToSend.append('mobileNumber', formData.mobileNumber);
//     formDataToSend.append('passport', formData.passport);
//     formDataToSend.append('plan', formData.plan);
//
//     if (formData.installmentDuration) {
//       formDataToSend.append('installmentDuration', formData.installmentDuration);
//     }
//     if (formData.omolopeDays) {
//       formDataToSend.append('omolopeDays', formData.omolopeDays);
//     }
//     if (formData.bankStatementMethod) {
//       formDataToSend.append('bankStatementMethod', formData.bankStatementMethod);
//     }
//
//     try {
//       const response = await fetch('http://localhost:8080/api/agent-entry', {
//         method: 'POST',
//         body: formDataToSend
//       });
//
//       const result = await response.json();
//
//       if (result.success) {
//         if (result.verified) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Verified',
//             text: 'Documents authenticated and verified successfully. Check your email for confirmation.'
//           }).then(() => {
//             const completeData = {
//               ...formData,
//               productName: getConcatenatedProductNames(),
//               brand: formData.brand,
//               size: products.map(p => p.size).join(', '),
//               price: products.map(p => p.price).join(', '),
//               totalPrice: getTotalPrice().toString(),
//               businessType: businessType
//             };
//
//             sessionStorage.setItem("customerData", JSON.stringify(completeData));
//             window.agentEntryData = completeData;
//             navigate('/agent-followup', { state: completeData });
//           });
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Verification Failed',
//             text: result.message
//           });
//         }
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Submission Error',
//         text: 'Error submitting form. Please ensure the backend server is running.'
//       });
//     }
//   };
//
//   const resetForm = () => {
//     setBusinessType('');
//     setProducts([{ productName: '', size: '', price: '', quantity: 1 }]);
//     setFormData({
//       brand: '',
//       firstName: '',
//       middleName: '',
//       lastName: '',
//       dateOfBirth: '',
//       maritalStatus: '',
//       gender: '',
//       bvn: '',
//       nin: '',
//       mobileNumber: '',
//       passport: null,
//       plan: '',
//       installmentDuration: '',
//       omolopeDays: '',
//       bankStatementMethod: '',
//       spouseName: '',
//       spousePhone: '',
//       nextOfKinName: '',
//       nextOfKinPhone: '',
//       nextOfKinRelationship: ''
//     });
//     setPassportPreview(null);
//   };
//
//   const planOptions = ['OutrightFlex', 'Easy 35', 'Easy 20', 'Omolope'];
//   const installmentMonths = [1, 2, 5, 11, 17, 23];
//   const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
//   const genderOptions = ['Male', 'Female', 'Other'];
//
//   return (
//       <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//         <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">
//           <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
//             <Logo size="large" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: '#f7623b' }}>
//             Agent Manual Entry
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">Complete customer registration and product details</p>
//
//           {/* Show notification if data was pre-filled */}
//           {isPreFilled && (
//               <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
//                 <p className="text-green-400 text-sm text-center">
//                   ✓ Account verified - Customer details pre-filled
//                 </p>
//               </div>
//           )}
//
//           <div className="space-y-6 sm:space-y-8">
//             {/* Business Type Selection */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Select Business Type *
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 {['Koolboks', 'KoolEnergies', 'Koolbuy'].map(type => (
//                     <label key={type} className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition"
//                            style={{
//                              backgroundColor: businessType === type ? '#f7623b' : '#111827',
//                              borderColor: businessType === type ? '#f7623b' : '#374151'
//                            }}>
//                       <input
//                           type="radio"
//                           name="businessType"
//                           value={type}
//                           checked={businessType === type}
//                           onChange={(e) => handleBusinessTypeChange(e.target.value)}
//                           className="w-4 h-4"
//                       />
//                       <span className="text-white font-medium">{type}</span>
//                     </label>
//                 ))}
//               </div>
//             </div>
//
//             {/* Product Details Section */}
//             {businessType && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <div className="flex justify-between items-center mb-3 sm:mb-4">
//                     <h2 className="text-xl sm:text-2xl font-semibold text-white">
//                       Product Details
//                     </h2>
//                     {businessType !== 'Koolbuy' && (
//                         <button
//                             type="button"
//                             onClick={addProduct}
//                             className="flex items-center px-3 py-2 rounded-lg text-white text-sm transition"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                           <Plus size={16} className="mr-1" />
//                           Add Item
//                         </button>
//                     )}
//                   </div>
//
//                   {products.map((product, index) => (
//                       <div key={index} className="mb-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-lg font-semibold text-white">Item {index + 1}</h3>
//                           {products.length > 1 && (
//                               <button
//                                   type="button"
//                                   onClick={() => removeProduct(index)}
//                                   className="p-2 rounded-lg text-red-400 hover:bg-red-900 transition"
//                               >
//                                 <Trash2 size={18} />
//                               </button>
//                           )}
//                         </div>
//
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Brand
//                             </label>
//                             <input
//                                 type="text"
//                                 value={formData.brand}
//                                 readOnly
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                             />
//                           </div>
//
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Product Name *
//                             </label>
//                             {businessType === 'Koolbuy' ? (
//                                 <input
//                                     type="text"
//                                     value={product.productName}
//                                     onChange={(e) => {
//                                       const newProducts = [...products];
//                                       newProducts[index].productName = e.target.value;
//                                       setProducts(newProducts);
//                                     }}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                     placeholder="Enter product name"
//                                 />
//                             ) : (
//                                 <select
//                                     value={product.productName}
//                                     onChange={(e) => handleProductChange(index, e.target.value)}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 >
//                                   <option value="">Select product</option>
//                                   {(businessType === 'Koolboks' ? koolboksProducts : koolEnergiesProducts).map((p, i) => (
//                                       <option key={i} value={p.name}>{p.name}</option>
//                                   ))}
//                                 </select>
//                             )}
//                           </div>
//
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Size
//                             </label>
//                             <input
//                                 type="text"
//                                 value={product.size}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].size = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                                 placeholder={businessType === 'Koolbuy' ? 'Enter size' : ''}
//                             />
//                           </div>
//
//                           <div className="sm:col-span-3">
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Price (₦)
//                             </label>
//                             <input
//                                 type="number"
//                                 value={product.price}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].price = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                                 placeholder={businessType === 'Koolbuy' ? 'Enter price' : ''}
//                             />
//                           </div>
//
//                           <div className="sm:col-span-3">
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Quantity
//                             </label>
//                             <div className="flex items-center space-x-3">
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, -1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition"
//                                   style={{ backgroundColor: '#f7623b' }}
//                                   disabled={product.quantity <= 1}
//                               >
//                                 -
//                               </button>
//                               <input
//                                   type="number"
//                                   value={product.quantity || 1}
//                                   readOnly
//                                   className="w-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center"
//                               />
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, 1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition"
//                                   style={{ backgroundColor: '#f7623b' }}
//                               >
//                                 +
//                               </button>
//                               <span className="text-gray-400 ml-4">
//                           Subtotal: <span className="text-white font-semibold">₦{((parseFloat(product.price) || 0) * (parseInt(product.quantity) || 1)).toLocaleString()}</span>
//                         </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                   ))}
//
//                   {/* Total Price Display */}
//                   <div className="mt-4 p-4 rounded-lg bg-gray-900 border-2" style={{ borderColor: '#f7623b' }}>
//                     <div className="flex justify-between items-center">
//                       <span className="text-lg font-semibold text-white">Total Price:</span>
//                       <span className="text-2xl font-bold" style={{ color: '#f7623b' }}>
//                     ₦{getTotalPrice().toLocaleString()}
//                   </span>
//                     </div>
//                     {products.filter(p => p.productName).length > 0 && (
//                         <div className="mt-2">
//                           <span className="text-sm text-gray-400">Products: </span>
//                           <span className="text-sm text-white">{getConcatenatedProductNames()}</span>
//                         </div>
//                     )}
//                   </div>
//                 </div>
//             )}
//
//             {/* Personal Information Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Personal Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     First Name *
//                   </label>
//                   <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       readOnly={isPreFilled}
//                       className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                       onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                       onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                       placeholder="First name"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Middle Name
//                   </label>
//                   <input
//                       type="text"
//                       name="middleName"
//                       value={formData.middleName}
//                       onChange={handleInputChange}
//                       readOnly={isPreFilled}
//                       className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                       onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                       onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                       placeholder="Middle name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Last Name *
//                   </label>
//                   <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       readOnly={isPreFilled}
//                       className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                       onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                       onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                       placeholder="Last name"
//                       required
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Date of Birth *
//                   </label>
//                   <input
//                       type="date"
//                       name="dateOfBirth"
//                       value={formData.dateOfBirth}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Marital Status *
//                   </label>
//                   <select
//                       name="maritalStatus"
//                       value={formData.maritalStatus}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   >
//                     <option value="">Select status</option>
//                     {maritalStatusOptions.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Gender *
//                   </label>
//                   <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   >
//                     <option value="">Select gender</option>
//                     {genderOptions.map(gender => (
//                         <option key={gender} value={gender}>{gender}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//
//             {/* Spouse Information */}
//             {formData.maritalStatus === 'Married' && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Spouse Information
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                         Spouse Name
//                       </label>
//                       <input
//                           type="text"
//                           name="spouseName"
//                           value={formData.spouseName}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                           onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                           onBlur={(e) => e.target.style.borderColor = '#374151'}
//                           placeholder="Enter spouse name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                         Spouse Phone
//                       </label>
//                       <input
//                           type="tel"
//                           name="spousePhone"
//                           value={formData.spousePhone}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                           onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                           onBlur={(e) => e.target.style.borderColor = '#374151'}
//                           placeholder="Enter spouse phone number"
//                       />
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {/* Next of Kin Information */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Next of Kin Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Next of Kin Name
//                   </label>
//                   <input
//                       type="text"
//                       name="nextOfKinName"
//                       value={formData.nextOfKinName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter next of kin name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Next of Kin Phone
//                   </label>
//                   <input
//                       type="tel"
//                       name="nextOfKinPhone"
//                       value={formData.nextOfKinPhone}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter next of kin phone"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Relationship
//                   </label>
//                   <input
//                       type="text"
//                       name="nextOfKinRelationship"
//                       value={formData.nextOfKinRelationship}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="e.g., Brother, Sister, Friend"
//                   />
//                 </div>
//               </div>
//             </div>
//
//             {/* Verification Details Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Verification Details
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     BVN *
//                   </label>
//                   <input
//                       type="text"
//                       name="bvn"
//                       value={formData.bvn}
//                       onChange={handleInputChange}
//                       maxLength="11"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter 11-digit BVN"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     NIN *
//                   </label>
//                   <input
//                       type="text"
//                       name="nin"
//                       value={formData.nin}
//                       onChange={handleInputChange}
//                       maxLength="11"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter 11-digit NIN"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Mobile Number *
//                   </label>
//                   <input
//                       type="tel"
//                       name="mobileNumber"
//                       value={formData.mobileNumber}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter mobile number"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Passport Photo *
//                   </label>
//                   {!passportPreview ? (
//                       <button
//                           type="button"
//                           onClick={startCamera}
//                           className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm sm:text-base hover:text-white cursor-pointer transition"
//                           style={{ borderColor: '#374151' }}
//                           onMouseEnter={(e) => e.target.style.borderColor = '#f7623b'}
//                           onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
//                       >
//                         <Camera className="mr-2" size={20} />
//                         Capture Live Photo
//                       </button>
//                   ) : (
//                       <div className="relative">
//                         <img
//                             src={passportPreview}
//                             alt="Passport preview"
//                             className="w-full h-24 sm:h-32 object-cover rounded-lg border"
//                             style={{ borderColor: '#f7623b' }}
//                         />
//                         <button
//                             type="button"
//                             onClick={retakePhoto}
//                             className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full text-white"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                           <Camera size={14} className="sm:w-4 sm:h-4" />
//                         </button>
//                       </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//
//             {/* Payment Plan Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Select Plan *
//               </h2>
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
//                 {planOptions.map(plan => (
//                     <button
//                         key={plan}
//                         type="button"
//                         onClick={() => setFormData(prev => ({ ...prev, plan }))}
//                         className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition"
//                         style={{
//                           backgroundColor: formData.plan === plan ? '#f7623b' : '#111827',
//                           color: formData.plan === plan ? 'white' : '#9ca3af',
//                           border: formData.plan === plan ? 'none' : '1px solid #374151'
//                         }}
//                     >
//                       {plan}
//                     </button>
//                 ))}
//               </div>
//             </div>
//
//             {/* Installment Duration Section */}
//             {(formData.plan === 'Easy 35' || formData.plan === 'Easy 20') && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Installment Duration *
//                   </h2>
//                   <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
//                     {installmentMonths.map(month => (
//                         <button
//                             key={month}
//                             type="button"
//                             onClick={() => setFormData(prev => ({ ...prev, installmentDuration: month }))}
//                             className="px-4 py-3 rounded-lg font-medium transition"
//                             style={{
//                               backgroundColor: formData.installmentDuration === month ? '#f7623b' : '#111827',
//                               color: formData.installmentDuration === month ? 'white' : '#9ca3af',
//                               border: formData.installmentDuration === month ? 'none' : '1px solid #374151'
//                             }}
//                         >
//                           {month} {month === 1 ? 'Month' : 'Months'}
//                         </button>
//                     ))}
//                   </div>
//                 </div>
//             )}
//
//             {formData.plan === 'Omolope' && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Duration (Days) *
//                   </h2>
//                   <input
//                       type="number"
//                       name="omolopeDays"
//                       value={formData.omolopeDays}
//                       onChange={handleInputChange}
//                       min="1"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter number of days"
//                       required
//                   />
//                 </div>
//             )}
//
//             {/* Bank Statement Section */}
//             <div className="pb-4 sm:pb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Request Bank Statement
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <button
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'Mono' }))}
//                     className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition"
//                     style={{
//                       backgroundColor: formData.bankStatementMethod === 'Mono' ? '#f7623b' : '#111827',
//                       color: formData.bankStatementMethod === 'Mono' ? 'white' : '#9ca3af',
//                       border: formData.bankStatementMethod === 'Mono' ? 'none' : '1px solid #374151'
//                     }}
//                 >
//                   <FileText className="mr-2" size={20} />
//                   Mono
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'MBS' }))}
//                     className="flex items-center justify-center px-6 py-4 rounded-lg font-medium transition"
//                     style={{
//                       backgroundColor: formData.bankStatementMethod === 'MBS' ? '#f7623b' : '#111827',
//                       color: formData.bankStatementMethod === 'MBS' ? 'white' : '#9ca3af',
//                       border: formData.bankStatementMethod === 'MBS' ? 'none' : '1px solid #374151'
//                     }}
//                 >
//                   <Upload className="mr-2" size={20} />
//                   MBS
//                 </button>
//               </div>
//             </div>
//
//             {/* Submit Button */}
//             <button
//                 onClick={handleSubmit}
//                 className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition duration-200 shadow-lg text-white"
//                 style={{ backgroundColor: '#f7623b' }}
//                 onMouseEnter={(e) => e.target.style.opacity = '0.9'}
//                 onMouseLeave={(e) => e.target.style.opacity = '1'}
//             >
//               Submit Agent Entry
//             </button>
//           </div>
//         </div>
//
//         {/* Camera Modal */}
//         {showCameraModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
//               <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
//                 <div className="flex justify-between items-center mb-3 sm:mb-4">
//                   <h3 className="text-lg sm:text-2xl font-bold text-white">Capture Passport Photo</h3>
//                   <button
//                       onClick={stopCamera}
//                       className="p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition"
//                   >
//                     <X className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//                   </button>
//                 </div>
//
//                 <div className="relative mb-3 sm:mb-4">
//                   <div className="relative overflow-hidden rounded-lg bg-gray-800">
//                     {cameraError && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10">
//                           {cameraError}
//                         </div>
//                     )}
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full rounded-lg"
//                         style={{
//                           transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//                           minHeight: '300px',
//                           maxHeight: '500px',
//                           objectFit: 'cover'
//                         }}
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <div
//                           className="border-4 rounded-full bg-transparent"
//                           style={{
//                             width: '280px',
//                             height: '350px',
//                             borderColor: '#f7623b',
//                             boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
//                           }}
//                       />
//                     </div>
//
//                     <button
//                         onClick={flipCamera}
//                         className="absolute top-4 right-4 p-3 rounded-full text-white shadow-lg transition hover:opacity-80"
//                         style={{ backgroundColor: '#f7623b' }}
//                         title="Flip camera"
//                     >
//                       <RefreshCw size={20} />
//                     </button>
//                   </div>
//                   <p className="text-center text-gray-400 text-sm mt-2">
//                     Position your face within the oval • Use the flip button to switch cameras
//                   </p>
//                 </div>
//
//                 <button
//                     onClick={capturePhoto}
//                     className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition text-white"
//                     style={{ backgroundColor: '#f7623b' }}
//                 >
//                   <Camera className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
//                   Capture Photo
//                 </button>
//                 <canvas ref={canvasRef} className="hidden" />
//               </div>
//             </div>
//         )}
//       </div>
//   );
// }
//
// export default AgentEntryForm;













// import React, { useState, useRef, useEffect } from 'react';
// // import { Camera, Upload, FileText, X, RefreshCw, Plus, Trash2, Loader2 } from 'lucide-react';
// import { Camera, Upload, FileText, X, RefreshCw, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
//
// import Swal from 'sweetalert2';
// import { useNavigate, useLocation } from "react-router-dom";
// import Logo from "../LogoWithVariant.jsx";
//
// function AgentEntryForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//
//   // Get pre-filled data from navigation state
//   const preFilledData = location.state || {};
//
//   const koolboksProducts = [
//     { size: '208L', name: 'Koolboks Solar Freezer (DC)', price: 684000 },
//     { size: '538L', name: 'Koolboks Solar Freezer (DC)', price: 997000 },
//     { size: '358L', name: 'Koolboks Upright Chiller (DC)', price: 1282000 },
//     { size: '195L', name: 'Koolboks Icemaker (DC)', price: 1136000 },
//     { size: '128L', name: 'Combo Fridge DC (Battery + 275W Solar Panel)', price: 652000 },
//     { size: '200L', name: 'AC Inverter Freezer', price: 682000 },
//     { size: '198L', name: 'AC Inverter Freezer', price: 706000 },
//     { size: '208L', name: 'AC Inverter Freezer', price: 756000 },
//     { size: '530L', name: 'AC Inverter Freezer', price: 1123000 },
//     { size: '600L', name: 'AC Inverter Freezer', price: 1106000 },
//     { size: '750L', name: 'AC Inverter Freezer', price: 1392000 }
//   ];
//
//   const koolEnergiesProducts = [
//     { size: '1 KVA', name: '1 KVA Premium Solar', price: 569000 },
//     { size: '1.5 KVA', name: '1.5 KVA Premium Solar', price: 652000 },
//     { size: '2 KVA', name: '2 KVA Premium Solar', price: 836000 },
//     { size: '3.5 KVA', name: '3.5 KVA Premium Solar', price: 2164781.25 },
//     { size: '5 KVA', name: '5 KVA Premium Solar', price: 4670875 },
//     { size: '7.5 KVA', name: '7.5 KVA Premium Solar', price: 6569593.75 },
//     { size: '10 KVA', name: '10 KVA Premium Solar', price: 9841625 },
//     { size: '200W', name: '200W Solar Generator (without panels)', price: 428656.25 },
//     { size: '200W', name: '200W Solar Generator (+ panels)', price: 519941.67 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (without panels)', price: 348000 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (+ panels)', price: 501000 }
//   ];
//
//   const [businessType, setBusinessType] = useState('');
//   const [products, setProducts] = useState([
//     { productName: '', size: '', price: '', quantity: 1 }
//   ]);
//
//   const [formData, setFormData] = useState({
//     brand: '',
//     firstName: preFilledData.firstName || '',
//     middleName: preFilledData.middleName || '',
//     lastName: preFilledData.lastName || '',
//     dateOfBirth: '',
//     maritalStatus: '',
//     gender: '',
//     bvn: '',
//     nin: '',
//     mobileNumber: '',
//     passport: null,
//     plan: '',
//     installmentDuration: '',
//     omolopeDays: '',
//     bankStatementMethod: '',
//     spouseName: '',
//     spousePhone: '',
//     nextOfKinName: '',
//     nextOfKinPhone: '',
//     nextOfKinRelationship: ''
//   });
//
//   const [passportPreview, setPassportPreview] = useState(null);
//   const [showCameraModal, setShowCameraModal] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [facingMode, setFacingMode] = useState('user');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//
//   // Check if data was pre-filled from home page
//   const isPreFilled = !!(preFilledData.firstName || preFilledData.lastName);
//
//   const hasMandateReference = !!(preFilledData.mandateReference);
//
//   const handleBusinessTypeChange = (type) => {
//     setBusinessType(type);
//     if (type === 'Koolboks') {
//       setFormData(prev => ({ ...prev, brand: 'Koolboks' }));
//     } else if (type === 'KoolEnergies') {
//       setFormData(prev => ({ ...prev, brand: 'KoolEnergies' }));
//     } else if (type === 'Koolbuy') {
//       setFormData(prev => ({ ...prev, brand: 'Koolbuy' }));
//     }
//     setProducts([{ productName: '', size: '', price: '', quantity: 1 }]);
//   };
//
//   const handleProductChange = (index, productName) => {
//     const newProducts = [...products];
//
//     if (businessType === 'Koolboks') {
//       const selectedProduct = koolboksProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1
//         };
//       }
//     } else if (businessType === 'KoolEnergies') {
//       const selectedProduct = koolEnergiesProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1
//         };
//       }
//     }
//
//     setProducts(newProducts);
//   };
//
//   const handleQuantityChange = (index, increment) => {
//     const newProducts = [...products];
//     const currentQuantity = newProducts[index].quantity || 1;
//     const newQuantity = currentQuantity + increment;
//
//     if (newQuantity >= 1) {
//       newProducts[index].quantity = newQuantity;
//       setProducts(newProducts);
//     }
//   };
//
//   const addProduct = () => {
//     setProducts([...products, { productName: '', size: '', price: '', quantity: 1 }]);
//   };
//
//   const removeProduct = (index) => {
//     if (products.length > 1) {
//       const newProducts = products.filter((_, i) => i !== index);
//       setProducts(newProducts);
//     }
//   };
//
//   const getTotalPrice = () => {
//     return products.reduce((total, product) => {
//       const price = parseFloat(product.price) || 0;
//       const quantity = parseInt(product.quantity) || 1;
//       return total + (price * quantity);
//     }, 0);
//   };
//
//   const getConcatenatedProductNames = () => {
//     return products
//         .filter(p => p.productName)
//         .map(p => {
//           const qty = p.quantity > 1 ? ` (x${p.quantity})` : '';
//           return `${p.productName}${qty}`;
//         })
//         .join(' + ');
//   };
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const startCamera = async (preferredFacingMode = 'user') => {
//     setCameraError('');
//
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: preferredFacingMode },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           aspectRatio: { ideal: 1.777777778 },
//           frameRate: { ideal: 30 }
//         },
//         audio: false
//       });
//
//       setStream(mediaStream);
//       setFacingMode(preferredFacingMode);
//       setShowCameraModal(true);
//
//       setTimeout(() => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//           videoRef.current.play().catch(err => {
//             console.error('Error playing video:', err);
//             setCameraError('Could not start video playback');
//           });
//         }
//       }, 100);
//     } catch (err) {
//       console.error('Camera error:', err);
//       setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
//       alert('Unable to access camera. Please check your browser permissions and ensure you have a physical camera connected.');
//     }
//   };
//
//   const flipCamera = () => {
//     const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
//     startCamera(newFacingMode);
//   };
//
//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//
//     if (!canvas || !video) {
//       alert('Camera not ready. Please try again.');
//       return;
//     }
//
//     if (video.readyState !== video.HAVE_ENOUGH_DATA) {
//       alert('Video is still loading. Please wait a moment and try again.');
//       return;
//     }
//
//     try {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//
//       if (facingMode === 'user') {
//         ctx.translate(canvas.width, 0);
//         ctx.scale(-1, 1);
//       }
//       ctx.drawImage(video, 0, 0);
//
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const url = URL.createObjectURL(blob);
//           setPassportPreview(url);
//           setFormData(prev => ({ ...prev, passport: blob }));
//           console.log('Photo captured successfully:', blob);
//           stopCamera();
//         } else {
//           alert('Failed to capture photo. Please try again.');
//         }
//       }, 'image/jpeg', 0.95);
//     } catch (error) {
//       console.error('Capture error:', error);
//       alert('Error capturing photo. Please try again.');
//     }
//   };
//
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     setShowCameraModal(false);
//   };
//
//   const retakePhoto = () => {
//     if (window.confirm('Are you sure you want to retake the passport photo? This will replace the current photo.')) {
//       setPassportPreview(null);
//       setFormData(prev => ({ ...prev, passport: null }));
//       startCamera();
//     }
//   };
//
//   const handleSubmit = async () => {
//     // Prevent double submission
//     if (isSubmitting) return;
//
//     if (!businessType) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Missing Business Type',
//         text: 'Please select a business type (Koolboks, KoolEnergies, or Koolbuy).'
//       });
//       return;
//     }
//
//     const requiredFields = [
//       'firstName', 'lastName', 'dateOfBirth', 'maritalStatus', 'gender',
//       'bvn', 'nin', 'mobileNumber', 'plan'
//     ];
//
//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Incomplete Form',
//           text: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
//         });
//         return;
//       }
//     }
//
//     if (businessType !== 'Koolbuy') {
//       const hasEmptyProduct = products.some(p => !p.productName);
//       if (hasEmptyProduct) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Product Missing',
//           text: 'Please select all product names.'
//         });
//         return;
//       }
//     }
//
//     if (
//         (formData.plan === 'Easy 35' || formData.plan === 'Easy 25') &&
//         !formData.installmentDuration
//     ) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Installment Required',
//         text: 'Please select an installment duration.'
//       });
//       return;
//     }
//
//     if (formData.plan === 'Omolope' && !formData.omolopeDays) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Duration Required',
//         text: 'Please enter the duration in days for Omolope plan.'
//       });
//       return;
//     }
//
//     setIsSubmitting(true);
//
//     const formDataToSend = new FormData();
//     formDataToSend.append('businessType', businessType);
//     formDataToSend.append('productName', getConcatenatedProductNames());
//     formDataToSend.append('brand', formData.brand);
//     formDataToSend.append('size', products.map(p => p.size).join(', '));
//     formDataToSend.append('price', products.map(p => p.price).join(', '));
//     formDataToSend.append('totalPrice', getTotalPrice().toString());
//     formDataToSend.append('firstName', formData.firstName);
//
//     if (formData.middleName) formDataToSend.append('middleName', formData.middleName);
//
//     formDataToSend.append('lastName', formData.lastName);
//     formDataToSend.append('dateOfBirth', formData.dateOfBirth);
//     formDataToSend.append('maritalStatus', formData.maritalStatus);
//     formDataToSend.append('gender', formData.gender);
//
//     if (formData.spouseName) formDataToSend.append('spouseName', formData.spouseName);
//     if (formData.spousePhone) formDataToSend.append('spousePhone', formData.spousePhone);
//     if (formData.nextOfKinName) formDataToSend.append('nextOfKinName', formData.nextOfKinName);
//     if (formData.nextOfKinPhone) formDataToSend.append('nextOfKinPhone', formData.nextOfKinPhone);
//     if (formData.nextOfKinRelationship) {
//       formDataToSend.append('nextOfKinRelationship', formData.nextOfKinRelationship);
//     }
//
//     formDataToSend.append('bvn', formData.bvn);
//     formDataToSend.append('nin', formData.nin);
//     formDataToSend.append('mobileNumber', formData.mobileNumber);
//     formDataToSend.append('passport', formData.passport);
//     formDataToSend.append('plan', formData.plan);
//
//     if (formData.installmentDuration) {
//       formDataToSend.append('installmentDuration', formData.installmentDuration);
//     }
//     if (formData.omolopeDays) {
//       formDataToSend.append('omolopeDays', formData.omolopeDays);
//     }
//     if (formData.bankStatementMethod) {
//       formDataToSend.append('bankStatementMethod', formData.bankStatementMethod);
//     }
//
//     try {
//       const response = await fetch('https://web-production-9f730.up.railway.app/api/agent-entry', {
//         method: 'POST',
//         body: formDataToSend
//       });
//
//       const result = await response.json();
//
//       if (result.success) {
//         if (result.verified) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Verified',
//             text: 'Documents authenticated and verified successfully. Check your email for confirmation.'
//           }).then(() => {
//             // const completeData = {
//             //   ...formData,
//             //   productName: getConcatenatedProductNames(),
//             //   brand: formData.brand,
//             //   size: products.map(p => p.size).join(', '),
//             //   price: products.map(p => p.price).join(', '),
//             //   totalPrice: getTotalPrice().toString(),
//             //   businessType: businessType
//             // };
//
//
//             const completeData = {
//               ...formData,
//               productName: getConcatenatedProductNames(),
//               brand: formData.brand,
//               size: products.map(p => p.size).join(', '),
//               price: products.map(p => p.price).join(', '),
//               totalPrice: getTotalPrice().toString(),
//               businessType: businessType,
//               // Pass through the mandate reference and other account verification data
//               mandateReference: preFilledData.mandateReference,
//               bankName: preFilledData.bankName,
//               accountNumber: preFilledData.accountNumber
//             };
//
//             sessionStorage.setItem("customerData", JSON.stringify(completeData));
//             window.agentEntryData = completeData;
//             navigate('/agent-followup', { state: completeData });
//           });
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Verification Failed',
//             text: result.message
//           });
//         }
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Submission Error',
//         text: 'Error submitting form. Please ensure the backend server is running.'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   const resetForm = () => {
//     setBusinessType('');
//     setProducts([{ productName: '', size: '', price: '', quantity: 1 }]);
//     setFormData({
//       brand: '',
//       firstName: '',
//       middleName: '',
//       lastName: '',
//       dateOfBirth: '',
//       maritalStatus: '',
//       gender: '',
//       bvn: '',
//       nin: '',
//       mobileNumber: '',
//       passport: null,
//       plan: '',
//       installmentDuration: '',
//       omolopeDays: '',
//       bankStatementMethod: '',
//       spouseName: '',
//       spousePhone: '',
//       nextOfKinName: '',
//       nextOfKinPhone: '',
//       nextOfKinRelationship: ''
//     });
//     setPassportPreview(null);
//   };
//
//   const planOptions = ['OutrightFlex', 'Easy 35', 'Easy 25', 'Omolope'];
//   const installmentMonths = [1, 2, 5, 11, 17, 23];
//   const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
//   const genderOptions = ['Male', 'Female', 'Other'];
//
//   return (
//       <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//         <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">
//           <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
//             <Logo size="large" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: '#f7623b' }}>
//             Agent Manual Entry
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">Complete customer registration and product details</p>
//
//           {/* Show notification if data was pre-filled */}
//           {/*{isPreFilled && (*/}
//           {/*    <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">*/}
//           {/*      <p className="text-green-400 text-sm text-center">*/}
//           {/*        ✓ Account verified - Customer details pre-filled*/}
//           {/*      </p>*/}
//           {/*    </div>*/}
//           {/*)}*/}
//           {/*            notification if data was pre-filled *!/*/}
//           {isPreFilled && (
//               <div className="mb-6 space-y-3">
//                 {/* Account Verified Badge */}
//                 <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
//                   <p className="text-green-400 text-sm text-center flex items-center justify-center">
//                     <CheckCircle size={16} className="mr-2" />
//                     Account verified - Customer details pre-filled
//                   </p>
//                 </div>
//
//                 {/* Mandate Reference Badge */}
//                 {hasMandateReference && (
//                     <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                         <div className="flex-1">
//                           <p className="text-xs text-gray-400 mb-1">Mandate Reference (UUID)</p>
//                           <p className="text-sm text-white font-mono break-all">{preFilledData.mandateReference}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                         <span className="px-3 py-1 bg-[#f7623b] text-white text-xs font-semibold rounded-full whitespace-nowrap">
//                           Verified
//                         </span>
//                         </div>
//                       </div>
//
//                       {/* Additional bank details if available */}
//                       {(preFilledData.bankName || preFilledData.accountNumber) && (
//                           <div className="mt-3 pt-3 border-t border-gray-700">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
//                               {preFilledData.bankName && (
//                                   <div>
//                                     <span className="text-gray-400">Bank: </span>
//                                     <span className="text-white">{preFilledData.bankName}</span>
//                                   </div>
//                               )}
//                               {preFilledData.accountNumber && (
//                                   <div>
//                                     <span className="text-gray-400">Account: </span>
//                                     <span className="text-white">{preFilledData.accountNumber}</span>
//                                   </div>
//                               )}
//                             </div>
//                           </div>
//                       )}
//                     </div>
//                 )}
//               </div>
//           )}
//
//
//           <div className="space-y-6 sm:space-y-8">
//             {/* Business Type Selection */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Select Business Type *
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 {['Koolboks', 'KoolEnergies', 'Koolbuy'].map(type => (
//                     <label key={type} className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition"
//                            style={{
//                              backgroundColor: businessType === type ? '#f7623b' : '#111827',
//                              borderColor: businessType === type ? '#f7623b' : '#374151'
//                            }}>
//                       <input
//                           type="radio"
//                           name="businessType"
//                           value={type}
//                           checked={businessType === type}
//                           onChange={(e) => handleBusinessTypeChange(e.target.value)}
//                           className="w-4 h-4 cursor-pointer"
//                       />
//                       <span className="text-white font-medium">{type}</span>
//                     </label>
//                 ))}
//               </div>
//             </div>
//
//             {/* Product Details Section */}
//             {businessType && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <div className="flex justify-between items-center mb-3 sm:mb-4">
//                     <h2 className="text-xl sm:text-2xl font-semibold text-white">
//                       Product Details
//                     </h2>
//                     {businessType !== 'Koolbuy' && (
//                         <button
//                             type="button"
//                             onClick={addProduct}
//                             className="flex items-center px-3 py-2 rounded-lg text-white text-sm transition cursor-pointer hover:opacity-90"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                           <Plus size={16} className="mr-1" />
//                           Add Item
//                         </button>
//                     )}
//                   </div>
//
//                   {products.map((product, index) => (
//                       <div key={index} className="mb-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-lg font-semibold text-white">Item {index + 1}</h3>
//                           {products.length > 1 && (
//                               <button
//                                   type="button"
//                                   onClick={() => removeProduct(index)}
//                                   className="p-2 rounded-lg text-red-400 hover:bg-red-900 transition cursor-pointer"
//                               >
//                                 <Trash2 size={18} />
//                               </button>
//                           )}
//                         </div>
//
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Brand
//                             </label>
//                             <input
//                                 type="text"
//                                 value={formData.brand}
//                                 readOnly
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                             />
//                           </div>
//
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Product Name *
//                             </label>
//                             {businessType === 'Koolbuy' ? (
//                                 <input
//                                     type="text"
//                                     value={product.productName}
//                                     onChange={(e) => {
//                                       const newProducts = [...products];
//                                       newProducts[index].productName = e.target.value;
//                                       setProducts(newProducts);
//                                     }}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                     placeholder="Enter product name"
//                                 />
//                             ) : (
//                                 <select
//                                     value={product.productName}
//                                     onChange={(e) => handleProductChange(index, e.target.value)}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 >
//                                   <option value="">Select product</option>
//                                   {(businessType === 'Koolboks' ? koolboksProducts : koolEnergiesProducts).map((p, i) => (
//                                       <option key={i} value={p.name}>{p.name}</option>
//                                   ))}
//                                 </select>
//                             )}
//                           </div>
//
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Size
//                             </label>
//                             <input
//                                 type="text"
//                                 value={product.size}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].size = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                                 placeholder={businessType === 'Koolbuy' ? 'Enter size' : ''}
//                             />
//                           </div>
//
//                           <div className="sm:col-span-3">
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Price (₦)
//                             </label>
//                             <input
//                                 type="number"
//                                 value={product.price}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].price = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                                 placeholder={businessType === 'Koolbuy' ? 'Enter price' : ''}
//                             />
//                           </div>
//
//                           <div className="sm:col-span-3">
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               Quantity
//                             </label>
//                             <div className="flex items-center space-x-3">
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, -1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition cursor-pointer hover:opacity-90"
//                                   style={{ backgroundColor: '#f7623b' }}
//                                   disabled={product.quantity <= 1}
//                               >
//                                 -
//                               </button>
//                               <input
//                                   type="number"
//                                   value={product.quantity || 1}
//                                   readOnly
//                                   className="w-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center"
//                               />
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, 1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition cursor-pointer hover:opacity-90"
//                                   style={{ backgroundColor: '#f7623b' }}
//                               >
//                                 +
//                               </button>
//                               <span className="text-gray-400 ml-4">
//                           Subtotal: <span className="text-white font-semibold">₦{((parseFloat(product.price) || 0) * (parseInt(product.quantity) || 1)).toLocaleString()}</span>
//                         </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                   ))}
//
//                   {/* Total Price Display */}
//                   <div className="mt-4 p-4 rounded-lg bg-gray-900 border-2" style={{ borderColor: '#f7623b' }}>
//                     <div className="flex justify-between items-center">
//                       <span className="text-lg font-semibold text-white">Total Price:</span>
//                       <span className="text-2xl font-bold" style={{ color: '#f7623b' }}>
//                     ₦{getTotalPrice().toLocaleString()}
//                   </span>
//                     </div>
//                     {products.filter(p => p.productName).length > 0 && (
//                         <div className="mt-2">
//                           <span className="text-sm text-gray-400">Products: </span>
//                           <span className="text-sm text-white">{getConcatenatedProductNames()}</span>
//                         </div>
//                     )}
//                   </div>
//                 </div>
//             )}
//
//             {/* Personal Information Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Personal Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     First Name *
//                   </label>
//                   <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       readOnly={isPreFilled}
//                       className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                       onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                       onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                       placeholder="First name"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Middle Name
//                   </label>
//                   <input
//                       type="text"
//                       name="middleName"
//                       value={formData.middleName}
//                       onChange={handleInputChange}
//                       readOnly={isPreFilled}
//                       className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                       onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                       onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                       placeholder="Middle name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Last Name *
//                   </label>
//                   <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       readOnly={isPreFilled}
//                       className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                       onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                       onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                       placeholder="Last name"
//                       required
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Date of Birth *
//                   </label>
//                   <input
//                       type="date"
//                       name="dateOfBirth"
//                       value={formData.dateOfBirth}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Marital Status *
//                   </label>
//                   <select
//                       name="maritalStatus"
//                       value={formData.maritalStatus}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   >
//                     <option value="">Select status</option>
//                     {maritalStatusOptions.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Gender *
//                   </label>
//                   <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       required
//                   >
//                     <option value="">Select gender</option>
//                     {genderOptions.map(gender => (
//                         <option key={gender} value={gender}>{gender}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//
//             {/* Spouse Information */}
//             {formData.maritalStatus === 'Married' && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Spouse Information
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                         Spouse Name
//                       </label>
//                       <input
//                           type="text"
//                           name="spouseName"
//                           value={formData.spouseName}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                           onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                           onBlur={(e) => e.target.style.borderColor = '#374151'}
//                           placeholder="Enter spouse name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                         Spouse Phone
//                       </label>
//                       <input
//                           type="tel"
//                           name="spousePhone"
//                           value={formData.spousePhone}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                           onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                           onBlur={(e) => e.target.style.borderColor = '#374151'}
//                           placeholder="Enter spouse phone number"
//                       />
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {/* Next of Kin Information */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Next of Kin Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Next of Kin Name
//                   </label>
//                   <input
//                       type="text"
//                       name="nextOfKinName"
//                       value={formData.nextOfKinName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter next of kin name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Next of Kin Phone
//                   </label>
//                   <input
//                       type="tel"
//                       name="nextOfKinPhone"
//                       value={formData.nextOfKinPhone}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter next of kin phone"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Relationship
//                   </label>
//                   <input
//                       type="text"
//                       name="nextOfKinRelationship"
//                       value={formData.nextOfKinRelationship}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="e.g., Brother, Sister, Friend"
//                   />
//                 </div>
//               </div>
//             </div>
//
//             {/* Verification Details Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Verification Details
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     BVN *
//                   </label>
//                   <input
//                       type="text"
//                       name="bvn"
//                       value={formData.bvn}
//                       onChange={handleInputChange}
//                       maxLength="11"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter 11-digit BVN"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     NIN *
//                   </label>
//                   <input
//                       type="text"
//                       name="nin"
//                       value={formData.nin}
//                       onChange={handleInputChange}
//                       maxLength="11"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter 11-digit NIN"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Mobile Number *
//                   </label>
//                   <input
//                       type="tel"
//                       name="mobileNumber"
//                       value={formData.mobileNumber}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter mobile number"
//                       required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                     Passport Photo *
//                   </label>
//                   {!passportPreview ? (
//                       <button
//                           type="button"
//                           onClick={startCamera}
//                           className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm sm:text-base hover:text-white cursor-pointer transition"
//                           style={{ borderColor: '#374151' }}
//                           onMouseEnter={(e) => e.target.style.borderColor = '#f7623b'}
//                           onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
//                       >
//                         <Camera className="mr-2" size={20} />
//                         Capture Live Photo
//                       </button>
//                   ) : (
//                       <div className="relative">
//                         <img
//                             src={passportPreview}
//                             alt="Passport preview"
//                             className="w-full h-24 sm:h-32 object-cover rounded-lg border"
//                             style={{ borderColor: '#f7623b' }}
//                         />
//                         <button
//                             type="button"
//                             onClick={retakePhoto}
//                             className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full text-white cursor-pointer hover:opacity-90"
//                             style={{ backgroundColor: '#f7623b' }}
//                         >
//                           <Camera size={14} className="sm:w-4 sm:h-4" />
//                         </button>
//                       </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//
//             {/* Payment Plan Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Select Plan *
//               </h2>
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
//                 {planOptions.map(plan => (
//                     <button
//                         key={plan}
//                         type="button"
//                         onClick={() => setFormData(prev => ({ ...prev, plan }))}
//                         className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition cursor-pointer hover:opacity-90"
//                         style={{
//                           backgroundColor: formData.plan === plan ? '#f7623b' : '#111827',
//                           color: formData.plan === plan ? 'white' : '#9ca3af',
//                           border: formData.plan === plan ? 'none' : '1px solid #374151'
//                         }}
//                     >
//                       {plan}
//                     </button>
//                 ))}
//               </div>
//             </div>
//
//             {/* Installment Duration Section */}
//             {(formData.plan === 'Easy 35' || formData.plan === 'Easy 25') && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Installment Duration *
//                   </h2>
//                   <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
//                     {installmentMonths.map(month => (
//                         <button
//                             key={month}
//                             type="button"
//                             onClick={() => setFormData(prev => ({ ...prev, installmentDuration: month }))}
//                             className="px-4 py-3 rounded-lg font-medium transition cursor-pointer hover:opacity-90"
//                             style={{
//                               backgroundColor: formData.installmentDuration === month ? '#f7623b' : '#111827',
//                               color: formData.installmentDuration === month ? 'white' : '#9ca3af',
//                               border: formData.installmentDuration === month ? 'none' : '1px solid #374151'
//                             }}
//                         >
//                           {month} {month === 1 ? 'Month' : 'Months'}
//                         </button>
//                     ))}
//                   </div>
//                 </div>
//             )}
//
//             {formData.plan === 'Omolope' && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                     Duration (Days) *
//                   </h2>
//                   <input
//                       type="number"
//                       name="omolopeDays"
//                       value={formData.omolopeDays}
//                       onChange={handleInputChange}
//                       min="1"
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                       onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                       onBlur={(e) => e.target.style.borderColor = '#374151'}
//                       placeholder="Enter number of days"
//                       required
//                   />
//                 </div>
//             )}
//
//             {/* Bank Statement Section */}
//             <div className="pb-4 sm:pb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Request Bank Statement
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <button
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'Mono' }))}
//                     className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition cursor-pointer hover:opacity-90"
//                     style={{
//                       backgroundColor: formData.bankStatementMethod === 'Mono' ? '#f7623b' : '#111827',
//                       color: formData.bankStatementMethod === 'Mono' ? 'white' : '#9ca3af',
//                       border: formData.bankStatementMethod === 'Mono' ? 'none' : '1px solid #374151'
//                     }}
//                 >
//                   <FileText className="mr-2" size={20} />
//                   Mono
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'MBS' }))}
//                     className="flex items-center justify-center px-6 py-4 rounded-lg font-medium transition cursor-pointer hover:opacity-90"
//                     style={{
//                       backgroundColor: formData.bankStatementMethod === 'MBS' ? '#f7623b' : '#111827',
//                       color: formData.bankStatementMethod === 'MBS' ? 'white' : '#9ca3af',
//                       border: formData.bankStatementMethod === 'MBS' ? 'none' : '1px solid #374151'
//                     }}
//                 >
//                   <Upload className="mr-2" size={20} />
//                   MBS
//                 </button>
//               </div>
//             </div>
//
//             {/* Submit Button */}
//             <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition duration-200 shadow-lg text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 style={{ backgroundColor: '#f7623b' }}
//                 onMouseEnter={(e) => !isSubmitting && (e.target.style.opacity = '0.9')}
//                 onMouseLeave={(e) => !isSubmitting && (e.target.style.opacity = '1')}
//             >
//               {isSubmitting ? (
//                   <>
//                     <Loader2 className="animate-spin mr-2" size={20} />
//                     Submitting...
//                   </>
//               ) : (
//                   'Submit Agent Entry'
//               )}
//             </button>
//           </div>
//         </div>
//
//         {/* Camera Modal */}
//         {showCameraModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
//               <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
//                 <div className="flex justify-between items-center mb-3 sm:mb-4">
//                   <h3 className="text-lg sm:text-2xl font-bold text-white">Capture Passport Photo</h3>
//                   <button
//                       onClick={stopCamera}
//                       className="p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition cursor-pointer"
//                   >
//                     <X className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//                   </button>
//                 </div>
//
//                 <div className="relative mb-3 sm:mb-4">
//                   <div className="relative overflow-hidden rounded-lg bg-gray-800">
//                     {cameraError && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10">
//                           {cameraError}
//                         </div>
//                     )}
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full rounded-lg"
//                         style={{
//                           transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//                           minHeight: '300px',
//                           maxHeight: '500px',
//                           objectFit: 'cover'
//                         }}
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <div
//                           className="border-4 rounded-full bg-transparent"
//                           style={{
//                             width: '280px',
//                             height: '350px',
//                             borderColor: '#f7623b',
//                             boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
//                           }}
//                       />
//                     </div>
//
//                     <button
//                         onClick={flipCamera}
//                         className="absolute top-4 right-4 p-3 rounded-full text-white shadow-lg transition hover:opacity-80 cursor-pointer"
//                         style={{ backgroundColor: '#f7623b' }}
//                         title="Flip camera"
//                     >
//                       <RefreshCw size={20} />
//                     </button>
//                   </div>
//                   <p className="text-center text-gray-400 text-sm mt-2">
//                     Position your face within the oval • Use the flip button to switch cameras
//                   </p>
//                 </div>
//
//                 <button
//                     onClick={capturePhoto}
//                     className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition text-white cursor-pointer hover:opacity-90"
//                     style={{ backgroundColor: '#f7623b' }}
//                 >
//                   <Camera className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
//                   Capture Photo
//                 </button>
//                 <canvas ref={canvasRef} className="hidden" />
//               </div>
//             </div>
//         )}
//       </div>
//   );
// }
//
// export default AgentEntryForm;





// import React, { useState, useRef, useEffect } from 'react';
// import { Camera, Upload, FileText, X, RefreshCw, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
//
// import Swal from 'sweetalert2';
// import { useNavigate, useLocation } from "react-router-dom";
// import Logo from "../LogoWithVariant.jsx";
//
// function AgentEntryForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//
//   const preFilledData = location.state || {};
//
//   const koolboksProducts = [
//     { size: '208L', name: 'Koolboks Solar Freezer (DC)', price: 684000 },
//     { size: '538L', name: 'Koolboks Solar Freezer (DC)', price: 997000 },
//     { size: '358L', name: 'Koolboks Upright Chiller (DC)', price: 1282000 },
//     { size: '195L', name: 'Koolboks Icemaker (DC)', price: 1136000 },
//     { size: '128L', name: 'Combo Fridge DC (Battery + 275W Solar Panel)', price: 652000 },
//     { size: '200L', name: 'AC Inverter Freezer', price: 682000 },
//     { size: '198L', name: 'AC Inverter Freezer', price: 706000 },
//     { size: '208L', name: 'AC Inverter Freezer', price: 756000 },
//     { size: '530L', name: 'AC Inverter Freezer', price: 1123000 },
//     { size: '600L', name: 'AC Inverter Freezer', price: 1106000 },
//     { size: '750L', name: 'AC Inverter Freezer', price: 1392000 }
//   ];
//
//   const koolEnergiesProducts = [
//     { size: '1 KVA', name: '1 KVA Premium Solar', price: 569000 },
//     { size: '1.5 KVA', name: '1.5 KVA Premium Solar', price: 652000 },
//     { size: '2 KVA', name: '2 KVA Premium Solar', price: 836000 },
//     { size: '3.5 KVA', name: '3.5 KVA Premium Solar', price: 2164781.25 },
//     { size: '5 KVA', name: '5 KVA Premium Solar', price: 4670875 },
//     { size: '7.5 KVA', name: '7.5 KVA Premium Solar', price: 6569593.75 },
//     { size: '10 KVA', name: '10 KVA Premium Solar', price: 9841625 },
//     { size: '200W', name: '200W Solar Generator (without panels)', price: 428656.25 },
//     { size: '200W', name: '200W Solar Generator (+ panels)', price: 519941.67 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (without panels)', price: 348000 },
//     { size: '1.5 KVA', name: '1.5 KVA Solar Generator (+ panels)', price: 501000 }
//   ];
//
//   const koolbuyBrands = [
//     "Samsung", "LG", "Whirlpool", "Bosch", "Panasonic", "Haier", "Hisense", "Midea",
//     "Sharp", "Electrolux", "Scanfrost", "Nexus", "Polystar", "Royal", "Bruhm",
//     "Binatone", "Maxi", "Ignis", "Haier Thermocool", "Kenstar", "Sub-Zero",
//     "KitchenAid", "GE Appliances", "Frigidaire", "Maytag", "True Manufacturing",
//     "Turbo Air", "Hoshizaki", "Beko", "Ariston", "Indesit", "Candy", "Grundig",
//     "TCL", "Skyworth", "Changhong", "Aucma", "Kelvinator", "Westinghouse", "Daewoo",
//     "Hitachi", "Fisher & Paykel", "Gorenje", "Liebherr", "Vestfrost", "Blomberg",
//     "Smeg", "Zanussi", "Amana", "Admiral", "Magic Chef", "RCA", "Danby", "Insignia",
//     "Avanti", "Galanz", "Summit", "EdgeStar", "Arctic King", "Conserv", "Costway",
//     "Koolatron", "Kegco", "Norpole", "Accucold", "Elcold", "Gram", "Fagor", "Defy",
//     "Kelon", "Chigo", "MediaStar", "Meling", "Snowsea", "Comfee", "Eurosonic",
//     "Powerline", "Eurostar", "Century", "Saisho", "Akai", "Bush", "Logik", "Matsui",
//     "Technostar", "Transtec", "Vision", "Orient", "Pelonis", "Premier", "Proline",
//     "Ramtons", "Rinnai", "Sinotec", "Swan", "Telefunken", "Toshiba", "Vestel",
//     "Voltas", "White-Westinghouse", "Winia", "York", "Haier Casarte", "Aiwa",
//     "Andrakk", "Alpha", "Atlantic", "BlueStar", "Conion", "Crown", "Dawlance",
//     "Geepas", "Goldline", "Homeking", "IceCool", "KIC", "Lec", "Montpellier",
//     "Neon", "Oscar", "Robin", "Silver Crest", "Super General", "Syinix", "Unionaire",
//     "Von", "Westpoint", "Zokop", "Others"
//   ];
//
//   const [businessType, setBusinessType] = useState('');
//   const [products, setProducts] = useState([
//     { productName: '', size: '', price: '', quantity: 1, othersSpec: '' }
//   ]);
//
//   const [formData, setFormData] = useState({
//     brand: '',
//     firstName: preFilledData.firstName || '',
//     middleName: preFilledData.middleName || '',
//     lastName: preFilledData.lastName || '',
//     dateOfBirth: '',
//     maritalStatus: '',
//     gender: '',
//     bvn: '',
//     nin: '',
//     mobileNumber: '',
//     passport: null,
//     plan: '',
//     installmentDuration: '',
//     omolopeDays: '',
//     bankStatementMethod: '',
//     spouseName: '',
//     spousePhone: '',
//     nextOfKinName: '',
//     nextOfKinPhone: '',
//     nextOfKinRelationship: ''
//   });
//
//   const [passportPreview, setPassportPreview] = useState(null);
//   const [showCameraModal, setShowCameraModal] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [facingMode, setFacingMode] = useState('user');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//
//   const isPreFilled = !!(preFilledData.firstName || preFilledData.lastName);
//   const hasMandateReference = !!(preFilledData.mandateReference);
//
//   const handleBusinessTypeChange = (type) => {
//     setBusinessType(type);
//     if (type === 'Koolboks') {
//       setFormData(prev => ({ ...prev, brand: 'Koolboks' }));
//     } else if (type === 'KoolEnergies') {
//       setFormData(prev => ({ ...prev, brand: 'KoolEnergies' }));
//     } else if (type === 'Koolbuy') {
//       setFormData(prev => ({ ...prev, brand: 'Koolbuy' }));
//     } else if (type === 'Scrap4New') {
//       setFormData(prev => ({ ...prev, brand: 'Scrap4New' }));
//     }
//     setProducts([{ productName: '', size: '', price: '', quantity: 1, othersSpec: '' }]);
//   };
//
//   const handleProductChange = (index, productName) => {
//     const newProducts = [...products];
//
//     if (businessType === 'Koolboks') {
//       const selectedProduct = koolboksProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1,
//           othersSpec: ''
//         };
//       }
//     } else if (businessType === 'KoolEnergies') {
//       const selectedProduct = koolEnergiesProducts.find(p => p.name === productName);
//       if (selectedProduct) {
//         newProducts[index] = {
//           productName: selectedProduct.name,
//           size: selectedProduct.size,
//           price: selectedProduct.price,
//           quantity: newProducts[index].quantity || 1,
//           othersSpec: ''
//         };
//       }
//     } else if (businessType === 'Koolbuy') {
//       // For Koolbuy, productName is the brand; size and price are manual
//       newProducts[index] = {
//         productName: productName,
//         size: productName === 'Others' ? newProducts[index].size : newProducts[index].size,
//         price: productName === 'Others' ? newProducts[index].price : newProducts[index].price,
//         quantity: newProducts[index].quantity || 1,
//         othersSpec: productName !== 'Others' ? '' : newProducts[index].othersSpec || ''
//       };
//     }
//
//     setProducts(newProducts);
//   };
//
//   const handleQuantityChange = (index, increment) => {
//     const newProducts = [...products];
//     const currentQuantity = newProducts[index].quantity || 1;
//     const newQuantity = currentQuantity + increment;
//     if (newQuantity >= 1) {
//       newProducts[index].quantity = newQuantity;
//       setProducts(newProducts);
//     }
//   };
//
//   const addProduct = () => {
//     setProducts([...products, { productName: '', size: '', price: '', quantity: 1, othersSpec: '' }]);
//   };
//
//   const removeProduct = (index) => {
//     if (products.length > 1) {
//       const newProducts = products.filter((_, i) => i !== index);
//       setProducts(newProducts);
//     }
//   };
//
//   const getTotalPrice = () => {
//     return products.reduce((total, product) => {
//       const price = parseFloat(product.price) || 0;
//       const quantity = parseInt(product.quantity) || 1;
//       return total + (price * quantity);
//     }, 0);
//   };
//
//   const getConcatenatedProductNames = () => {
//     return products
//         .filter(p => p.productName)
//         .map(p => {
//           const qty = p.quantity > 1 ? ` (x${p.quantity})` : '';
//           if (p.productName === 'Others' && p.othersSpec) {
//             return `Others: ${p.othersSpec}${qty}`;
//           }
//           return `${p.productName}${qty}`;
//         })
//         .join(' + ');
//   };
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
//
//   const startCamera = async (preferredFacingMode = 'user') => {
//     setCameraError('');
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: { ideal: preferredFacingMode },
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           aspectRatio: { ideal: 1.777777778 },
//           frameRate: { ideal: 30 }
//         },
//         audio: false
//       });
//       setStream(mediaStream);
//       setFacingMode(preferredFacingMode);
//       setShowCameraModal(true);
//       setTimeout(() => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//           videoRef.current.play().catch(err => {
//             console.error('Error playing video:', err);
//             setCameraError('Could not start video playback');
//           });
//         }
//       }, 100);
//     } catch (err) {
//       console.error('Camera error:', err);
//       setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
//       alert('Unable to access camera. Please check your browser permissions and ensure you have a physical camera connected.');
//     }
//   };
//
//   const flipCamera = () => {
//     const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
//     startCamera(newFacingMode);
//   };
//
//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//     if (!canvas || !video) { alert('Camera not ready. Please try again.'); return; }
//     if (video.readyState !== video.HAVE_ENOUGH_DATA) {
//       alert('Video is still loading. Please wait a moment and try again.'); return;
//     }
//     try {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       if (facingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
//       ctx.drawImage(video, 0, 0);
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const url = URL.createObjectURL(blob);
//           setPassportPreview(url);
//           setFormData(prev => ({ ...prev, passport: blob }));
//           stopCamera();
//         } else {
//           alert('Failed to capture photo. Please try again.');
//         }
//       }, 'image/jpeg', 0.95);
//     } catch (error) {
//       console.error('Capture error:', error);
//       alert('Error capturing photo. Please try again.');
//     }
//   };
//
//   const stopCamera = () => {
//     if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null); }
//     setShowCameraModal(false);
//   };
//
//   const retakePhoto = () => {
//     if (window.confirm('Are you sure you want to retake the passport photo? This will replace the current photo.')) {
//       setPassportPreview(null);
//       setFormData(prev => ({ ...prev, passport: null }));
//       startCamera();
//     }
//   };
//
//   const handleSubmit = async () => {
//     if (isSubmitting) return;
//
//     if (!businessType) {
//       Swal.fire({ icon: 'warning', title: 'Missing Business Type', text: 'Please select a business type.' });
//       return;
//     }
//
//     const requiredFields = [
//       'firstName', 'lastName', 'dateOfBirth', 'maritalStatus', 'gender',
//       'bvn', 'nin', 'mobileNumber', 'plan'
//     ];
//
//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Incomplete Form',
//           text: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
//         });
//         return;
//       }
//     }
//
//     if (businessType !== 'Koolbuy' && businessType !== 'Scrap4New') {
//       const hasEmptyProduct = products.some(p => !p.productName);
//       if (hasEmptyProduct) {
//         Swal.fire({ icon: 'warning', title: 'Product Missing', text: 'Please select all product names.' });
//         return;
//       }
//     }
//
//     if (businessType === 'Koolbuy') {
//       const hasEmptyProduct = products.some(p => !p.productName);
//       if (hasEmptyProduct) {
//         Swal.fire({ icon: 'warning', title: 'Product Missing', text: 'Please select a brand for all products.' });
//         return;
//       }
//       const hasEmptyPrice = products.some(p => !p.price);
//       if (hasEmptyPrice) {
//         Swal.fire({ icon: 'warning', title: 'Price Missing', text: 'Please enter a price for all products.' });
//         return;
//       }
//       const hasOthersWithoutSpec = products.some(p => p.productName === 'Others' && !p.othersSpec);
//       if (hasOthersWithoutSpec) {
//         Swal.fire({ icon: 'warning', title: 'Spec Missing', text: 'Please enter a product specification for "Others".' });
//         return;
//       }
//     }
//
//     if ((formData.plan === 'Easy 35' || formData.plan === 'Easy 25') && !formData.installmentDuration) {
//       Swal.fire({ icon: 'warning', title: 'Installment Required', text: 'Please select an installment duration.' });
//       return;
//     }
//
//     if (formData.plan === 'Omolope' && !formData.omolopeDays) {
//       Swal.fire({ icon: 'warning', title: 'Duration Required', text: 'Please enter the duration in days for Omolope plan.' });
//       return;
//     }
//
//     setIsSubmitting(true);
//
//     const formDataToSend = new FormData();
//     formDataToSend.append('businessType', businessType);
//     formDataToSend.append('productName', getConcatenatedProductNames());
//     formDataToSend.append('brand', formData.brand);
//     formDataToSend.append('size', products.map(p => p.size).join(', '));
//     formDataToSend.append('price', products.map(p => p.price).join(', '));
//     formDataToSend.append('totalPrice', getTotalPrice().toString());
//     formDataToSend.append('firstName', formData.firstName);
//     if (formData.middleName) formDataToSend.append('middleName', formData.middleName);
//     formDataToSend.append('lastName', formData.lastName);
//     formDataToSend.append('dateOfBirth', formData.dateOfBirth);
//     formDataToSend.append('maritalStatus', formData.maritalStatus);
//     formDataToSend.append('gender', formData.gender);
//     if (formData.spouseName) formDataToSend.append('spouseName', formData.spouseName);
//     if (formData.spousePhone) formDataToSend.append('spousePhone', formData.spousePhone);
//     if (formData.nextOfKinName) formDataToSend.append('nextOfKinName', formData.nextOfKinName);
//     if (formData.nextOfKinPhone) formDataToSend.append('nextOfKinPhone', formData.nextOfKinPhone);
//     if (formData.nextOfKinRelationship) formDataToSend.append('nextOfKinRelationship', formData.nextOfKinRelationship);
//     formDataToSend.append('bvn', formData.bvn);
//     formDataToSend.append('nin', formData.nin);
//     formDataToSend.append('mobileNumber', formData.mobileNumber);
//     formDataToSend.append('passport', formData.passport);
//     formDataToSend.append('plan', formData.plan);
//     if (formData.installmentDuration) formDataToSend.append('installmentDuration', formData.installmentDuration);
//     if (formData.omolopeDays) formDataToSend.append('omolopeDays', formData.omolopeDays);
//     if (formData.bankStatementMethod) formDataToSend.append('bankStatementMethod', formData.bankStatementMethod);
//
//     try {
//       const response = await fetch('https://web-production-9f730.up.railway.app/api/agent-entry', {
//         method: 'POST',
//         body: formDataToSend
//       });
//
//       const result = await response.json();
//
//       if (result.success) {
//         if (result.verified) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Verified',
//             text: 'Documents authenticated and verified successfully. Check your email for confirmation.'
//           }).then(() => {
//             const completeData = {
//               ...formData,
//               productName: getConcatenatedProductNames(),
//               brand: formData.brand,
//               size: products.map(p => p.size).join(', '),
//               price: products.map(p => p.price).join(', '),
//               totalPrice: getTotalPrice().toString(),
//               businessType: businessType,
//               mandateReference: preFilledData.mandateReference,
//               bankName: preFilledData.bankName,
//               accountNumber: preFilledData.accountNumber
//             };
//             sessionStorage.setItem("customerData", JSON.stringify(completeData));
//             window.agentEntryData = completeData;
//             navigate('/agent-followup', { state: completeData });
//           });
//         } else {
//           Swal.fire({ icon: 'error', title: 'Verification Failed', text: result.message });
//         }
//       } else {
//         Swal.fire({ icon: 'error', title: 'Error', text: result.message });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       Swal.fire({ icon: 'error', title: 'Submission Error', text: 'Error submitting form. Please ensure the backend server is running.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   const resetForm = () => {
//     setBusinessType('');
//     setProducts([{ productName: '', size: '', price: '', quantity: 1, othersSpec: '' }]);
//     setFormData({
//       brand: '', firstName: '', middleName: '', lastName: '', dateOfBirth: '',
//       maritalStatus: '', gender: '', bvn: '', nin: '', mobileNumber: '',
//       passport: null, plan: '', installmentDuration: '', omolopeDays: '',
//       bankStatementMethod: '', spouseName: '', spousePhone: '',
//       nextOfKinName: '', nextOfKinPhone: '', nextOfKinRelationship: ''
//     });
//     setPassportPreview(null);
//   };
//
//   const planOptions = ['OutrightFlex', 'Easy 35', 'Easy 25', 'Omolope'];
//   const installmentMonths = [1, 2, 5, 11, 17, 23];
//   const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
//   const genderOptions = ['Male', 'Female', 'Other'];
//
//   return (
//       <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//         <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">
//           <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
//             <Logo size="large" />
//           </div>
//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: '#f7623b' }}>
//             Agent Manual Entry
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">
//             Complete customer registration and product details
//           </p>
//
//           {isPreFilled && (
//               <div className="mb-6 space-y-3">
//                 <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
//                   <p className="text-green-400 text-sm text-center flex items-center justify-center">
//                     <CheckCircle size={16} className="mr-2" />
//                     Account verified - Customer details pre-filled
//                   </p>
//                 </div>
//                 {hasMandateReference && (
//                     <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                         <div className="flex-1">
//                           <p className="text-xs text-gray-400 mb-1">Mandate Reference (UUID)</p>
//                           <p className="text-sm text-white font-mono break-all">{preFilledData.mandateReference}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                     <span className="px-3 py-1 bg-[#f7623b] text-white text-xs font-semibold rounded-full whitespace-nowrap">
//                       Verified
//                     </span>
//                         </div>
//                       </div>
//                       {(preFilledData.bankName || preFilledData.accountNumber) && (
//                           <div className="mt-3 pt-3 border-t border-gray-700">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
//                               {preFilledData.bankName && (
//                                   <div>
//                                     <span className="text-gray-400">Bank: </span>
//                                     <span className="text-white">{preFilledData.bankName}</span>
//                                   </div>
//                               )}
//                               {preFilledData.accountNumber && (
//                                   <div>
//                                     <span className="text-gray-400">Account: </span>
//                                     <span className="text-white">{preFilledData.accountNumber}</span>
//                                   </div>
//                               )}
//                             </div>
//                           </div>
//                       )}
//                     </div>
//                 )}
//               </div>
//           )}
//
//           <div className="space-y-6 sm:space-y-8">
//
//             {/* Business Type Selection */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
//                 Select Business Type *
//               </h2>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {['Koolboks', 'KoolEnergies', 'Koolbuy', 'Scrap4New'].map(type => (
//                     <label
//                         key={type}
//                         className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition"
//                         style={{
//                           backgroundColor: businessType === type ? '#f7623b' : '#111827',
//                           borderColor: businessType === type ? '#f7623b' : '#374151'
//                         }}
//                     >
//                       <input
//                           type="radio"
//                           name="businessType"
//                           value={type}
//                           checked={businessType === type}
//                           onChange={(e) => handleBusinessTypeChange(e.target.value)}
//                           className="w-4 h-4 cursor-pointer"
//                       />
//                       <span className="text-white font-medium text-sm sm:text-base">{type}</span>
//                     </label>
//                 ))}
//               </div>
//
//               {/* Scrap4New CTA Button */}
//               {businessType === 'Scrap4New' && (
//                   <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
//                     <p className="text-gray-400 text-sm mb-3">
//                       Click below to open the Scrap4New submission form where you can enter scrap product details.
//                     </p>
//                     <button
//                         type="button"
//                         onClick={() => navigate('/scrap4new')}
//                         className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 cursor-pointer"
//                         style={{ backgroundColor: '#f7623b' }}
//                     >
//                       Submit Scrap Details →
//                     </button>
//                   </div>
//               )}
//             </div>
//
//             {/* Product Details Section — hidden for Scrap4New */}
//             {businessType && businessType !== 'Scrap4New' && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <div className="flex justify-between items-center mb-3 sm:mb-4">
//                     <h2 className="text-xl sm:text-2xl font-semibold text-white">Product Details</h2>
//                     <button
//                         type="button"
//                         onClick={addProduct}
//                         className="flex items-center px-3 py-2 rounded-lg text-white text-sm transition cursor-pointer hover:opacity-90"
//                         style={{ backgroundColor: '#f7623b' }}
//                     >
//                       <Plus size={16} className="mr-1" />
//                       Add Item
//                     </button>
//                   </div>
//
//                   {products.map((product, index) => (
//                       <div key={index} className="mb-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
//                         <div className="flex justify-between items-center mb-3">
//                           <h3 className="text-lg font-semibold text-white">Item {index + 1}</h3>
//                           {products.length > 1 && (
//                               <button
//                                   type="button"
//                                   onClick={() => removeProduct(index)}
//                                   className="p-2 rounded-lg text-red-400 hover:bg-red-900 transition cursor-pointer"
//                               >
//                                 <Trash2 size={18} />
//                               </button>
//                           )}
//                         </div>
//
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//
//                           {/* Brand (read-only for Koolboks/KoolEnergies, hidden for Koolbuy since brand IS the product) */}
//                           {businessType !== 'Koolbuy' && (
//                               <div>
//                                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Brand</label>
//                                 <input
//                                     type="text"
//                                     value={formData.brand}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
//                                 />
//                               </div>
//                           )}
//
//                           {/* Product Name */}
//                           <div className={businessType === 'Koolbuy' ? 'sm:col-span-3' : ''}>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                               {businessType === 'Koolbuy' ? 'Brand / Product Name *' : 'Product Name *'}
//                             </label>
//                             {businessType === 'Koolbuy' ? (
//                                 <select
//                                     value={product.productName}
//                                     onChange={(e) => handleProductChange(index, e.target.value)}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 >
//                                   <option value="">Select brand</option>
//                                   {koolbuyBrands.map((brand, i) => (
//                                       <option key={i} value={brand}>{brand}</option>
//                                   ))}
//                                 </select>
//                             ) : (
//                                 <select
//                                     value={product.productName}
//                                     onChange={(e) => handleProductChange(index, e.target.value)}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 >
//                                   <option value="">Select product</option>
//                                   {(businessType === 'Koolboks' ? koolboksProducts : koolEnergiesProducts).map((p, i) => (
//                                       <option key={i} value={p.name}>{p.name}</option>
//                                   ))}
//                                 </select>
//                             )}
//                           </div>
//
//                           {/* "Others" spec input — only shown for Koolbuy when Others is selected */}
//                           {businessType === 'Koolbuy' && product.productName === 'Others' && (
//                               <div className="sm:col-span-3">
//                                 <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                                   Product Specification *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={product.othersSpec || ''}
//                                     onChange={(e) => {
//                                       const newProducts = [...products];
//                                       newProducts[index].othersSpec = e.target.value;
//                                       setProducts(newProducts);
//                                     }}
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                     onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                     onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                     placeholder="e.g., Samsung 500L Side-by-Side Refrigerator, Model RS50N3413BC"
//                                 />
//                               </div>
//                           )}
//
//                           {/* Size — manual for Koolbuy, read-only for others */}
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Size</label>
//                             <input
//                                 type="text"
//                                 value={product.size}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].size = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className={`w-full px-4 py-3 border rounded-lg ${businessType === 'Koolbuy' ? 'bg-gray-900 border-gray-700 text-white focus:outline-none transition' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
//                                 onFocus={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#f7623b')}
//                                 onBlur={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#374151')}
//                                 placeholder={businessType === 'Koolbuy' ? 'e.g., 500L, 2-door' : ''}
//                             />
//                           </div>
//
//                           {/* Price — manual for Koolbuy, read-only for others */}
//                           <div className={businessType !== 'Koolbuy' ? 'sm:col-span-3' : ''}>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Price (₦)</label>
//                             <input
//                                 type="number"
//                                 value={product.price}
//                                 onChange={(e) => {
//                                   if (businessType === 'Koolbuy') {
//                                     const newProducts = [...products];
//                                     newProducts[index].price = e.target.value;
//                                     setProducts(newProducts);
//                                   }
//                                 }}
//                                 readOnly={businessType !== 'Koolbuy'}
//                                 className={`w-full px-4 py-3 border rounded-lg ${businessType === 'Koolbuy' ? 'bg-gray-900 border-gray-700 text-white focus:outline-none transition' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
//                                 onFocus={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#f7623b')}
//                                 onBlur={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#374151')}
//                                 placeholder={businessType === 'Koolbuy' ? 'Enter price' : ''}
//                             />
//                           </div>
//
//                           {/* Quantity */}
//                           <div className="sm:col-span-3">
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Quantity</label>
//                             <div className="flex items-center space-x-3">
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, -1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition cursor-pointer hover:opacity-90"
//                                   style={{ backgroundColor: '#f7623b' }}
//                                   disabled={product.quantity <= 1}
//                               >-</button>
//                               <input
//                                   type="number"
//                                   value={product.quantity || 1}
//                                   readOnly
//                                   className="w-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center"
//                               />
//                               <button
//                                   type="button"
//                                   onClick={() => handleQuantityChange(index, 1)}
//                                   className="px-4 py-3 rounded-lg font-bold text-white transition cursor-pointer hover:opacity-90"
//                                   style={{ backgroundColor: '#f7623b' }}
//                               >+</button>
//                               <span className="text-gray-400 ml-4">
//                           Subtotal: <span className="text-white font-semibold">
//                             ₦{((parseFloat(product.price) || 0) * (parseInt(product.quantity) || 1)).toLocaleString()}
//                           </span>
//                         </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                   ))}
//
//                   {/* Total Price */}
//                   <div className="mt-4 p-4 rounded-lg bg-gray-900 border-2" style={{ borderColor: '#f7623b' }}>
//                     <div className="flex justify-between items-center">
//                       <span className="text-lg font-semibold text-white">Total Price:</span>
//                       <span className="text-2xl font-bold" style={{ color: '#f7623b' }}>
//                     ₦{getTotalPrice().toLocaleString()}
//                   </span>
//                     </div>
//                     {products.filter(p => p.productName).length > 0 && (
//                         <div className="mt-2">
//                           <span className="text-sm text-gray-400">Products: </span>
//                           <span className="text-sm text-white">{getConcatenatedProductNames()}</span>
//                         </div>
//                     )}
//                   </div>
//                 </div>
//             )}
//
//             {/* Personal Information — hidden for Scrap4New */}
//             {businessType !== 'Scrap4New' && (
//                 <>
//                   {/* Personal Information Section */}
//                   <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                     <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Personal Information</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>First Name *</label>
//                         <input
//                             type="text"
//                             name="firstName"
//                             value={formData.firstName}
//                             onChange={handleInputChange}
//                             readOnly={isPreFilled}
//                             className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                             onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                             onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                             placeholder="First name"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Middle Name</label>
//                         <input
//                             type="text"
//                             name="middleName"
//                             value={formData.middleName}
//                             onChange={handleInputChange}
//                             readOnly={isPreFilled}
//                             className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                             onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                             onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                             placeholder="Middle name"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Last Name *</label>
//                         <input
//                             type="text"
//                             name="lastName"
//                             value={formData.lastName}
//                             onChange={handleInputChange}
//                             readOnly={isPreFilled}
//                             className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
//                             onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
//                             onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
//                             placeholder="Last name"
//                         />
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Date of Birth *</label>
//                         <input
//                             type="date"
//                             name="dateOfBirth"
//                             value={formData.dateOfBirth}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Marital Status *</label>
//                         <select
//                             name="maritalStatus"
//                             value={formData.maritalStatus}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                         >
//                           <option value="">Select status</option>
//                           {maritalStatusOptions.map(status => (
//                               <option key={status} value={status}>{status}</option>
//                           ))}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Gender *</label>
//                         <select
//                             name="gender"
//                             value={formData.gender}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                         >
//                           <option value="">Select gender</option>
//                           {genderOptions.map(gender => (
//                               <option key={gender} value={gender}>{gender}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//
//                   {/* Spouse Information */}
//                   {formData.maritalStatus === 'Married' && (
//                       <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Spouse Information</h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Spouse Name</label>
//                             <input
//                                 type="text"
//                                 name="spouseName"
//                                 value={formData.spouseName}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                 onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 placeholder="Enter spouse name"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Spouse Phone</label>
//                             <input
//                                 type="tel"
//                                 name="spousePhone"
//                                 value={formData.spousePhone}
//                                 onChange={handleInputChange}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                 onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 placeholder="Enter spouse phone number"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                   )}
//
//                   {/* Next of Kin */}
//                   <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                     <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Next of Kin Information</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Next of Kin Name</label>
//                         <input
//                             type="text"
//                             name="nextOfKinName"
//                             value={formData.nextOfKinName}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="Enter next of kin name"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Next of Kin Phone</label>
//                         <input
//                             type="tel"
//                             name="nextOfKinPhone"
//                             value={formData.nextOfKinPhone}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="Enter next of kin phone"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Relationship</label>
//                         <input
//                             type="text"
//                             name="nextOfKinRelationship"
//                             value={formData.nextOfKinRelationship}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="e.g., Brother, Sister, Friend"
//                         />
//                       </div>
//                     </div>
//                   </div>
//
//                   {/* Verification Details */}
//                   <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                     <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Verification Details</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>BVN *</label>
//                         <input
//                             type="text"
//                             name="bvn"
//                             value={formData.bvn}
//                             onChange={handleInputChange}
//                             maxLength="11"
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="Enter 11-digit BVN"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>NIN *</label>
//                         <input
//                             type="text"
//                             name="nin"
//                             value={formData.nin}
//                             onChange={handleInputChange}
//                             maxLength="11"
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="Enter 11-digit NIN"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Mobile Number *</label>
//                         <input
//                             type="tel"
//                             name="mobileNumber"
//                             value={formData.mobileNumber}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="Enter mobile number"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Passport Photo *</label>
//                         {!passportPreview ? (
//                             <button
//                                 type="button"
//                                 onClick={startCamera}
//                                 className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm sm:text-base hover:text-white cursor-pointer transition"
//                                 onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f7623b'}
//                                 onMouseLeave={(e) => e.currentTarget.style.borderColor = '#374151'}
//                             >
//                               <Camera className="mr-2" size={20} />
//                               Capture Live Photo
//                             </button>
//                         ) : (
//                             <div className="relative">
//                               <img
//                                   src={passportPreview}
//                                   alt="Passport preview"
//                                   className="w-full h-24 sm:h-32 object-cover rounded-lg border"
//                                   style={{ borderColor: '#f7623b' }}
//                               />
//                               <button
//                                   type="button"
//                                   onClick={retakePhoto}
//                                   className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full text-white cursor-pointer hover:opacity-90"
//                                   style={{ backgroundColor: '#f7623b' }}
//                               >
//                                 <Camera size={14} className="sm:w-4 sm:h-4" />
//                               </button>
//                             </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//
//                   {/* Payment Plan */}
//                   <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                     <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Select Plan *</h2>
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
//                       {planOptions.map(plan => (
//                           <button
//                               key={plan}
//                               type="button"
//                               onClick={() => setFormData(prev => ({ ...prev, plan }))}
//                               className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition cursor-pointer hover:opacity-90"
//                               style={{
//                                 backgroundColor: formData.plan === plan ? '#f7623b' : '#111827',
//                                 color: formData.plan === plan ? 'white' : '#9ca3af',
//                                 border: formData.plan === plan ? 'none' : '1px solid #374151'
//                               }}
//                           >
//                             {plan}
//                           </button>
//                       ))}
//                     </div>
//                   </div>
//
//                   {/* Installment Duration */}
//                   {(formData.plan === 'Easy 35' || formData.plan === 'Easy 25') && (
//                       <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Installment Duration *</h2>
//                         <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
//                           {installmentMonths.map(month => (
//                               <button
//                                   key={month}
//                                   type="button"
//                                   onClick={() => setFormData(prev => ({ ...prev, installmentDuration: month }))}
//                                   className="px-4 py-3 rounded-lg font-medium transition cursor-pointer hover:opacity-90"
//                                   style={{
//                                     backgroundColor: formData.installmentDuration === month ? '#f7623b' : '#111827',
//                                     color: formData.installmentDuration === month ? 'white' : '#9ca3af',
//                                     border: formData.installmentDuration === month ? 'none' : '1px solid #374151'
//                                   }}
//                               >
//                                 {month} {month === 1 ? 'Month' : 'Months'}
//                               </button>
//                           ))}
//                         </div>
//                       </div>
//                   )}
//
//                   {formData.plan === 'Omolope' && (
//                       <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Duration (Days) *</h2>
//                         <input
//                             type="number"
//                             name="omolopeDays"
//                             value={formData.omolopeDays}
//                             onChange={handleInputChange}
//                             min="1"
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
//                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                             onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             placeholder="Enter number of days"
//                         />
//                       </div>
//                   )}
//
//                   {/* Bank Statement */}
//                   <div className="pb-4 sm:pb-6">
//                     <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Request Bank Statement</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       <button
//                           type="button"
//                           onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'Mono' }))}
//                           className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition cursor-pointer hover:opacity-90"
//                           style={{
//                             backgroundColor: formData.bankStatementMethod === 'Mono' ? '#f7623b' : '#111827',
//                             color: formData.bankStatementMethod === 'Mono' ? 'white' : '#9ca3af',
//                             border: formData.bankStatementMethod === 'Mono' ? 'none' : '1px solid #374151'
//                           }}
//                       >
//                         <FileText className="mr-2" size={20} />
//                         Mono
//                       </button>
//                       <button
//                           type="button"
//                           onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'MBS' }))}
//                           className="flex items-center justify-center px-6 py-4 rounded-lg font-medium transition cursor-pointer hover:opacity-90"
//                           style={{
//                             backgroundColor: formData.bankStatementMethod === 'MBS' ? '#f7623b' : '#111827',
//                             color: formData.bankStatementMethod === 'MBS' ? 'white' : '#9ca3af',
//                             border: formData.bankStatementMethod === 'MBS' ? 'none' : '1px solid #374151'
//                           }}
//                       >
//                         <Upload className="mr-2" size={20} />
//                         MBS
//                       </button>
//                     </div>
//                   </div>
//
//                   {/* Submit Button */}
//                   <button
//                       onClick={handleSubmit}
//                       disabled={isSubmitting}
//                       className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition duration-200 shadow-lg text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{ backgroundColor: '#f7623b' }}
//                       onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
//                       onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.opacity = '1')}
//                   >
//                     {isSubmitting ? (
//                         <>
//                           <Loader2 className="animate-spin mr-2" size={20} />
//                           Submitting...
//                         </>
//                     ) : (
//                         'Submit Agent Entry'
//                     )}
//                   </button>
//                 </>
//             )}
//           </div>
//         </div>
//
//         {/* Camera Modal */}
//         {showCameraModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
//               <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
//                 <div className="flex justify-between items-center mb-3 sm:mb-4">
//                   <h3 className="text-lg sm:text-2xl font-bold text-white">Capture Passport Photo</h3>
//                   <button onClick={stopCamera} className="p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition cursor-pointer">
//                     <X className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//                   </button>
//                 </div>
//                 <div className="relative mb-3 sm:mb-4">
//                   <div className="relative overflow-hidden rounded-lg bg-gray-800">
//                     {cameraError && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10">
//                           {cameraError}
//                         </div>
//                     )}
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full rounded-lg"
//                         style={{
//                           transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
//                           minHeight: '300px',
//                           maxHeight: '500px',
//                           objectFit: 'cover'
//                         }}
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <div
//                           className="border-4 rounded-full bg-transparent"
//                           style={{
//                             width: '280px',
//                             height: '350px',
//                             borderColor: '#f7623b',
//                             boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
//                           }}
//                       />
//                     </div>
//                     <button
//                         onClick={flipCamera}
//                         className="absolute top-4 right-4 p-3 rounded-full text-white shadow-lg transition hover:opacity-80 cursor-pointer"
//                         style={{ backgroundColor: '#f7623b' }}
//                         title="Flip camera"
//                     >
//                       <RefreshCw size={20} />
//                     </button>
//                   </div>
//                   <p className="text-center text-gray-400 text-sm mt-2">
//                     Position your face within the oval • Use the flip button to switch cameras
//                   </p>
//                 </div>
//                 <button
//                     onClick={capturePhoto}
//                     className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition text-white cursor-pointer hover:opacity-90"
//                     style={{ backgroundColor: '#f7623b' }}
//                 >
//                   <Camera className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
//                   Capture Photo
//                 </button>
//                 <canvas ref={canvasRef} className="hidden" />
//               </div>
//             </div>
//         )}
//       </div>
//   );
// }
//
// export default AgentEntryForm;



















import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, FileText, X, RefreshCw, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';

import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../LogoWithVariant.jsx";

function AgentEntryForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const preFilledData = location.state || {};

  const koolboksProducts = [
    { size: '208L', name: 'Koolboks Solar Freezer (DC)', price: 684000 },
    { size: '538L', name: 'Koolboks Solar Freezer (DC)', price: 997000 },
    { size: '358L', name: 'Koolboks Upright Chiller (DC)', price: 1282000 },
    { size: '195L', name: 'Koolboks Icemaker (DC)', price: 1136000 },
    { size: '128L', name: 'Combo Fridge DC (Battery + 275W Solar Panel)', price: 652000 },
    { size: '200L', name: 'AC Inverter Freezer', price: 682000 },
    { size: '198L', name: 'AC Inverter Freezer', price: 706000 },
    { size: '208L', name: 'AC Inverter Freezer', price: 756000 },
    { size: '530L', name: 'AC Inverter Freezer', price: 1123000 },
    { size: '600L', name: 'AC Inverter Freezer', price: 1106000 },
    { size: '750L', name: 'AC Inverter Freezer', price: 1392000 }
  ];

  const koolEnergiesProducts = [
    { size: '1 KVA', name: '1 KVA Premium Solar', price: 569000 },
    { size: '1.5 KVA', name: '1.5 KVA Premium Solar', price: 652000 },
    { size: '2 KVA', name: '2 KVA Premium Solar', price: 836000 },
    { size: '3.5 KVA', name: '3.5 KVA Premium Solar', price: 2164781.25 },
    { size: '5 KVA', name: '5 KVA Premium Solar', price: 4670875 },
    { size: '7.5 KVA', name: '7.5 KVA Premium Solar', price: 6569593.75 },
    { size: '10 KVA', name: '10 KVA Premium Solar', price: 9841625 },
    { size: '200W', name: '200W Solar Generator (without panels)', price: 428656.25 },
    { size: '200W', name: '200W Solar Generator (+ panels)', price: 519941.67 },
    { size: '1.5 KVA', name: '1.5 KVA Solar Generator (without panels)', price: 348000 },
    { size: '1.5 KVA', name: '1.5 KVA Solar Generator (+ panels)', price: 501000 }
  ];

  const koolbuyBrands = [
    "Samsung", "LG", "Whirlpool", "Bosch", "Panasonic", "Haier", "Hisense", "Midea",
    "Sharp", "Electrolux", "Scanfrost", "Nexus", "Polystar", "Royal", "Bruhm",
    "Binatone", "Maxi", "Ignis", "Haier Thermocool", "Kenstar", "Sub-Zero",
    "KitchenAid", "GE Appliances", "Frigidaire", "Maytag", "True Manufacturing",
    "Turbo Air", "Hoshizaki", "Beko", "Ariston", "Indesit", "Candy", "Grundig",
    "TCL", "Skyworth", "Changhong", "Aucma", "Kelvinator", "Westinghouse", "Daewoo",
    "Hitachi", "Fisher & Paykel", "Gorenje", "Liebherr", "Vestfrost", "Blomberg",
    "Smeg", "Zanussi", "Amana", "Admiral", "Magic Chef", "RCA", "Danby", "Insignia",
    "Avanti", "Galanz", "Summit", "EdgeStar", "Arctic King", "Conserv", "Costway",
    "Koolatron", "Kegco", "Norpole", "Accucold", "Elcold", "Gram", "Fagor", "Defy",
    "Kelon", "Chigo", "MediaStar", "Meling", "Snowsea", "Comfee", "Eurosonic",
    "Powerline", "Eurostar", "Century", "Saisho", "Akai", "Bush", "Logik", "Matsui",
    "Technostar", "Transtec", "Vision", "Orient", "Pelonis", "Premier", "Proline",
    "Ramtons", "Rinnai", "Sinotec", "Swan", "Telefunken", "Toshiba", "Vestel",
    "Voltas", "White-Westinghouse", "Winia", "York", "Haier Casarte", "Aiwa",
    "Andrakk", "Alpha", "Atlantic", "BlueStar", "Conion", "Crown", "Dawlance",
    "Geepas", "Goldline", "Homeking", "IceCool", "KIC", "Lec", "Montpellier",
    "Neon", "Oscar", "Robin", "Silver Crest", "Super General", "Syinix", "Unionaire",
    "Von", "Westpoint", "Zokop", "Others"
  ];

  const [businessType, setBusinessType] = useState('');
  const [products, setProducts] = useState([
    { productName: '', size: '', price: '', quantity: 1, othersSpec: '' }
  ]);

  const [formData, setFormData] = useState({
    brand: '',
    firstName: preFilledData.firstName || '',
    middleName: preFilledData.middleName || '',
    lastName: preFilledData.lastName || '',
    dateOfBirth: '',
    maritalStatus: '',
    gender: '',
    bvn: '',
    nin: '',
    mobileNumber: '',
    passport: null,
    plan: '',
    installmentDuration: '',
    omolopeDays: '',
    bankStatementMethod: '',
    spouseName: '',
    spousePhone: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: ''
  });

  const [passportPreview, setPassportPreview] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const isPreFilled = !!(preFilledData.firstName || preFilledData.lastName);

  // ── Auto-populate when returning from Scrap4New PIN verification ──────────
  useEffect(() => {
    if (preFilledData.businessType === 'Scrap4New' && preFilledData.productName) {
      setBusinessType('Scrap4New');
      setFormData(prev => ({ ...prev, brand: 'Scrap4New' }));
      // Pre-fill the scrap product as a single product row
      setProducts([{
        productName: preFilledData.productName || '',
        size:        preFilledData.size        || '',
        price:       preFilledData.totalPrice  || preFilledData.price || '',
        quantity:    1,
        othersSpec:  '',
      }]);
    }
  }, []);
  const hasMandateReference = !!(preFilledData.mandateReference);

  const handleBusinessTypeChange = (type) => {
    setBusinessType(type);
    if (type === 'Koolboks') {
      setFormData(prev => ({ ...prev, brand: 'Koolboks' }));
    } else if (type === 'KoolEnergies') {
      setFormData(prev => ({ ...prev, brand: 'KoolEnergies' }));
    } else if (type === 'Koolbuy') {
      setFormData(prev => ({ ...prev, brand: 'Koolbuy' }));
    } else if (type === 'Scrap4New') {
      setFormData(prev => ({ ...prev, brand: 'Scrap4New' }));
    }
    setProducts([{ productName: '', size: '', price: '', quantity: 1, othersSpec: '' }]);
  };

  const handleProductChange = (index, productName) => {
    const newProducts = [...products];

    if (businessType === 'Koolboks') {
      const selectedProduct = koolboksProducts.find(p => p.name === productName);
      if (selectedProduct) {
        newProducts[index] = {
          productName: selectedProduct.name,
          size: selectedProduct.size,
          price: selectedProduct.price,
          quantity: newProducts[index].quantity || 1,
          othersSpec: ''
        };
      }
    } else if (businessType === 'KoolEnergies') {
      const selectedProduct = koolEnergiesProducts.find(p => p.name === productName);
      if (selectedProduct) {
        newProducts[index] = {
          productName: selectedProduct.name,
          size: selectedProduct.size,
          price: selectedProduct.price,
          quantity: newProducts[index].quantity || 1,
          othersSpec: ''
        };
      }
    } else if (businessType === 'Koolbuy') {
      // For Koolbuy, productName is the brand; size and price are manual
      newProducts[index] = {
        productName: productName,
        size: productName === 'Others' ? newProducts[index].size : newProducts[index].size,
        price: productName === 'Others' ? newProducts[index].price : newProducts[index].price,
        quantity: newProducts[index].quantity || 1,
        othersSpec: productName !== 'Others' ? '' : newProducts[index].othersSpec || ''
      };
    }

    setProducts(newProducts);
  };

  const handleQuantityChange = (index, increment) => {
    const newProducts = [...products];
    const currentQuantity = newProducts[index].quantity || 1;
    const newQuantity = currentQuantity + increment;
    if (newQuantity >= 1) {
      newProducts[index].quantity = newQuantity;
      setProducts(newProducts);
    }
  };

  const addProduct = () => {
    setProducts([...products, { productName: '', size: '', price: '', quantity: 1, othersSpec: '' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
    }
  };

  const getTotalPrice = () => {
    return products.reduce((total, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  const getConcatenatedProductNames = () => {
    return products
        .filter(p => p.productName)
        .map(p => {
          const qty = p.quantity > 1 ? ` (x${p.quantity})` : '';
          if (p.productName === 'Others' && p.othersSpec) {
            return `Others: ${p.othersSpec}${qty}`;
          }
          return `${p.productName}${qty}`;
        })
        .join(' + ');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startCamera = async (preferredFacingMode = 'user') => {
    setCameraError('');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: preferredFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 1.777777778 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      setStream(mediaStream);
      setFacingMode(preferredFacingMode);
      setShowCameraModal(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setCameraError('Could not start video playback');
          });
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
      alert('Unable to access camera. Please check your browser permissions and ensure you have a physical camera connected.');
    }
  };

  const flipCamera = () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newFacingMode);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) { alert('Camera not ready. Please try again.'); return; }
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      alert('Video is still loading. Please wait a moment and try again.'); return;
    }
    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (facingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPassportPreview(url);
          setFormData(prev => ({ ...prev, passport: blob }));
          stopCamera();
        } else {
          alert('Failed to capture photo. Please try again.');
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Capture error:', error);
      alert('Error capturing photo. Please try again.');
    }
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null); }
    setShowCameraModal(false);
  };

  const retakePhoto = () => {
    if (window.confirm('Are you sure you want to retake the passport photo? This will replace the current photo.')) {
      setPassportPreview(null);
      setFormData(prev => ({ ...prev, passport: null }));
      startCamera();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!businessType) {
      Swal.fire({ icon: 'warning', title: 'Missing Business Type', text: 'Please select a business type.' });
      return;
    }

    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'maritalStatus', 'gender',
      'bvn', 'nin', 'mobileNumber', 'plan'
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Form',
          text: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`
        });
        return;
      }
    }

    if (businessType !== 'Koolbuy' && businessType !== 'Scrap4New') {
      const hasEmptyProduct = products.some(p => !p.productName);
      if (hasEmptyProduct) {
        Swal.fire({ icon: 'warning', title: 'Product Missing', text: 'Please select all product names.' });
        return;
      }
    }

    if (businessType === 'Koolbuy') {
      const hasEmptyProduct = products.some(p => !p.productName);
      if (hasEmptyProduct) {
        Swal.fire({ icon: 'warning', title: 'Product Missing', text: 'Please select a brand for all products.' });
        return;
      }
      const hasEmptyPrice = products.some(p => !p.price);
      if (hasEmptyPrice) {
        Swal.fire({ icon: 'warning', title: 'Price Missing', text: 'Please enter a price for all products.' });
        return;
      }
      const hasOthersWithoutSpec = products.some(p => p.productName === 'Others' && !p.othersSpec);
      if (hasOthersWithoutSpec) {
        Swal.fire({ icon: 'warning', title: 'Spec Missing', text: 'Please enter a product specification for "Others".' });
        return;
      }
    }

    if ((formData.plan === 'Easy 35' || formData.plan === 'Easy 25') && !formData.installmentDuration) {
      Swal.fire({ icon: 'warning', title: 'Installment Required', text: 'Please select an installment duration.' });
      return;
    }

    if (formData.plan === 'Omolope' && !formData.omolopeDays) {
      Swal.fire({ icon: 'warning', title: 'Duration Required', text: 'Please enter the duration in days for Omolope plan.' });
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('businessType', businessType);
    formDataToSend.append('productName', getConcatenatedProductNames());
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('size', products.map(p => p.size).join(', '));
    formDataToSend.append('price', products.map(p => p.price).join(', '));
    formDataToSend.append('totalPrice', getTotalPrice().toString());
    formDataToSend.append('firstName', formData.firstName);
    if (formData.middleName) formDataToSend.append('middleName', formData.middleName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('maritalStatus', formData.maritalStatus);
    formDataToSend.append('gender', formData.gender);
    if (formData.spouseName) formDataToSend.append('spouseName', formData.spouseName);
    if (formData.spousePhone) formDataToSend.append('spousePhone', formData.spousePhone);
    if (formData.nextOfKinName) formDataToSend.append('nextOfKinName', formData.nextOfKinName);
    if (formData.nextOfKinPhone) formDataToSend.append('nextOfKinPhone', formData.nextOfKinPhone);
    if (formData.nextOfKinRelationship) formDataToSend.append('nextOfKinRelationship', formData.nextOfKinRelationship);
    formDataToSend.append('bvn', formData.bvn);
    formDataToSend.append('nin', formData.nin);
    formDataToSend.append('mobileNumber', formData.mobileNumber);
    formDataToSend.append('passport', formData.passport);
    formDataToSend.append('plan', formData.plan);
    if (formData.installmentDuration) formDataToSend.append('installmentDuration', formData.installmentDuration);
    if (formData.omolopeDays) formDataToSend.append('omolopeDays', formData.omolopeDays);
    if (formData.bankStatementMethod) formDataToSend.append('bankStatementMethod', formData.bankStatementMethod);

    try {
      const response = await fetch('https://web-production-9f730.up.railway.app/api/agent-entry', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        if (result.verified) {
          Swal.fire({
            icon: 'success',
            title: 'Verified',
            text: 'Documents authenticated and verified successfully. Check your email for confirmation.'
          }).then(() => {
            const completeData = {
              ...formData,
              productName: getConcatenatedProductNames(),
              brand: formData.brand,
              size: products.map(p => p.size).join(', '),
              price: products.map(p => p.price).join(', '),
              totalPrice: getTotalPrice().toString(),
              businessType: businessType,
              mandateReference: preFilledData.mandateReference,
              bankName: preFilledData.bankName,
              accountNumber: preFilledData.accountNumber
            };
            sessionStorage.setItem("customerData", JSON.stringify(completeData));
            window.agentEntryData = completeData;
            navigate('/agent-followup', { state: completeData });
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Verification Failed', text: result.message });
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: result.message });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({ icon: 'error', title: 'Submission Error', text: 'Error submitting form. Please ensure the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBusinessType('');
    setProducts([{ productName: '', size: '', price: '', quantity: 1, othersSpec: '' }]);
    setFormData({
      brand: '', firstName: '', middleName: '', lastName: '', dateOfBirth: '',
      maritalStatus: '', gender: '', bvn: '', nin: '', mobileNumber: '',
      passport: null, plan: '', installmentDuration: '', omolopeDays: '',
      bankStatementMethod: '', spouseName: '', spousePhone: '',
      nextOfKinName: '', nextOfKinPhone: '', nextOfKinRelationship: ''
    });
    setPassportPreview(null);
  };

  const planOptions = ['OutrightFlex', 'Easy 35', 'Easy 25', 'Omolope'];
  const installmentMonths = [1, 2, 5, 11, 17, 23];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const genderOptions = ['Male', 'Female', 'Other'];

  return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
        <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">
          <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
            <Logo size="large" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: '#f7623b' }}>
            Agent Manual Entry
          </h1>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">
            Complete customer registration and product details
          </p>

          {/* Scrap4New reduction badge — shown when returning from PIN verification */}
          {preFilledData.businessType === 'Scrap4New' && preFilledData.reductionPct && (
              <div className="mb-4 p-4 bg-gray-900 border-2 rounded-lg" style={{ borderColor: '#f7623b' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Scrap4New Trade-in Approved</p>
                    <p className="text-white text-sm font-semibold">
                      Ref: <span className="font-mono" style={{ color: '#f7623b' }}>{preFilledData.scrapReferenceId || '—'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Original Price</p>
                    <p className="text-gray-500 text-sm line-through">₦{Number(preFilledData.originalPrice || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Approved Price ({preFilledData.reductionPct}% off)</p>
                    <p className="text-xl font-bold" style={{ color: '#f7623b' }}>₦{Number(preFilledData.totalPrice || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
          )}

          {isPreFilled && (
              <div className="mb-6 space-y-3">
                <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <p className="text-green-400 text-sm text-center flex items-center justify-center">
                    <CheckCircle size={16} className="mr-2" />
                    Account verified - Customer details pre-filled
                  </p>
                </div>
                {hasMandateReference && (
                    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-1">Mandate Reference (UUID)</p>
                          <p className="text-sm text-white font-mono break-all">{preFilledData.mandateReference}</p>
                        </div>
                        <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#f7623b] text-white text-xs font-semibold rounded-full whitespace-nowrap">
                      Verified
                    </span>
                        </div>
                      </div>
                      {(preFilledData.bankName || preFilledData.accountNumber) && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {preFilledData.bankName && (
                                  <div>
                                    <span className="text-gray-400">Bank: </span>
                                    <span className="text-white">{preFilledData.bankName}</span>
                                  </div>
                              )}
                              {preFilledData.accountNumber && (
                                  <div>
                                    <span className="text-gray-400">Account: </span>
                                    <span className="text-white">{preFilledData.accountNumber}</span>
                                  </div>
                              )}
                            </div>
                          </div>
                      )}
                    </div>
                )}
              </div>
          )}

          <div className="space-y-6 sm:space-y-8">

            {/* Business Type Selection */}
            <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">
                Select Business Type *
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Koolboks', 'KoolEnergies', 'Koolbuy', 'Scrap4New'].map(type => (
                    <label
                        key={type}
                        className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition"
                        style={{
                          backgroundColor: businessType === type ? '#f7623b' : '#111827',
                          borderColor: businessType === type ? '#f7623b' : '#374151'
                        }}
                    >
                      <input
                          type="radio"
                          name="businessType"
                          value={type}
                          checked={businessType === type}
                          onChange={(e) => handleBusinessTypeChange(e.target.value)}
                          className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-white font-medium text-sm sm:text-base">{type}</span>
                    </label>
                ))}
              </div>

              {/* Scrap4New CTA Button */}
              {businessType === 'Scrap4New' && (
                  <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm mb-3">
                      Click below to open the Scrap4New submission form where you can enter scrap product details.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/scrap4new')}
                        className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 cursor-pointer"
                        style={{ backgroundColor: '#f7623b' }}
                    >
                      Submit Scrap Details →
                    </button>
                  </div>
              )}
            </div>

            {/* Product Details Section — hidden for Scrap4New */}
            {businessType && businessType !== 'Scrap4New' && (
                <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Product Details</h2>
                    <button
                        type="button"
                        onClick={addProduct}
                        className="flex items-center px-3 py-2 rounded-lg text-white text-sm transition cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: '#f7623b' }}
                    >
                      <Plus size={16} className="mr-1" />
                      Add Item
                    </button>
                  </div>

                  {products.map((product, index) => (
                      <div key={index} className="mb-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-white">Item {index + 1}</h3>
                          {products.length > 1 && (
                              <button
                                  type="button"
                                  onClick={() => removeProduct(index)}
                                  className="p-2 rounded-lg text-red-400 hover:bg-red-900 transition cursor-pointer"
                              >
                                <Trash2 size={18} />
                              </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                          {/* Brand (read-only for Koolboks/KoolEnergies, hidden for Koolbuy since brand IS the product) */}
                          {businessType !== 'Koolbuy' && (
                              <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Brand</label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400"
                                />
                              </div>
                          )}

                          {/* Product Name */}
                          <div className={businessType === 'Koolbuy' ? 'sm:col-span-3' : ''}>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                              {businessType === 'Koolbuy' ? 'Brand / Product Name *' : 'Product Name *'}
                            </label>
                            {businessType === 'Koolbuy' ? (
                                <select
                                    value={product.productName}
                                    onChange={(e) => handleProductChange(index, e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
                                    onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                                >
                                  <option value="">Select brand</option>
                                  {koolbuyBrands.map((brand, i) => (
                                      <option key={i} value={brand}>{brand}</option>
                                  ))}
                                </select>
                            ) : (
                                <select
                                    value={product.productName}
                                    onChange={(e) => handleProductChange(index, e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
                                    onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                                >
                                  <option value="">Select product</option>
                                  {(businessType === 'Koolboks' ? koolboksProducts : koolEnergiesProducts).map((p, i) => (
                                      <option key={i} value={p.name}>{p.name}</option>
                                  ))}
                                </select>
                            )}
                          </div>

                          {/* "Others" spec input — only shown for Koolbuy when Others is selected */}
                          {businessType === 'Koolbuy' && product.productName === 'Others' && (
                              <div className="sm:col-span-3">
                                <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                                  Product Specification *
                                </label>
                                <input
                                    type="text"
                                    value={product.othersSpec || ''}
                                    onChange={(e) => {
                                      const newProducts = [...products];
                                      newProducts[index].othersSpec = e.target.value;
                                      setProducts(newProducts);
                                    }}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                                    onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                                    placeholder="e.g., Samsung 500L Side-by-Side Refrigerator, Model RS50N3413BC"
                                />
                              </div>
                          )}

                          {/* Size — manual for Koolbuy, read-only for others */}
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Size</label>
                            <input
                                type="text"
                                value={product.size}
                                onChange={(e) => {
                                  if (businessType === 'Koolbuy') {
                                    const newProducts = [...products];
                                    newProducts[index].size = e.target.value;
                                    setProducts(newProducts);
                                  }
                                }}
                                readOnly={businessType !== 'Koolbuy'}
                                className={`w-full px-4 py-3 border rounded-lg ${businessType === 'Koolbuy' ? 'bg-gray-900 border-gray-700 text-white focus:outline-none transition' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                onFocus={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#f7623b')}
                                onBlur={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#374151')}
                                placeholder={businessType === 'Koolbuy' ? 'e.g., 500L, 2-door' : ''}
                            />
                          </div>

                          {/* Price — manual for Koolbuy, read-only for others */}
                          <div className={businessType !== 'Koolbuy' ? 'sm:col-span-3' : ''}>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Price (₦)</label>
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => {
                                  if (businessType === 'Koolbuy') {
                                    const newProducts = [...products];
                                    newProducts[index].price = e.target.value;
                                    setProducts(newProducts);
                                  }
                                }}
                                readOnly={businessType !== 'Koolbuy'}
                                className={`w-full px-4 py-3 border rounded-lg ${businessType === 'Koolbuy' ? 'bg-gray-900 border-gray-700 text-white focus:outline-none transition' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                onFocus={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#f7623b')}
                                onBlur={(e) => businessType === 'Koolbuy' && (e.target.style.borderColor = '#374151')}
                                placeholder={businessType === 'Koolbuy' ? 'Enter price' : ''}
                            />
                          </div>

                          {/* Quantity */}
                          <div className="sm:col-span-3">
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Quantity</label>
                            <div className="flex items-center space-x-3">
                              <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, -1)}
                                  className="px-4 py-3 rounded-lg font-bold text-white transition cursor-pointer hover:opacity-90"
                                  style={{ backgroundColor: '#f7623b' }}
                                  disabled={product.quantity <= 1}
                              >-</button>
                              <input
                                  type="number"
                                  value={product.quantity || 1}
                                  readOnly
                                  className="w-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center"
                              />
                              <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, 1)}
                                  className="px-4 py-3 rounded-lg font-bold text-white transition cursor-pointer hover:opacity-90"
                                  style={{ backgroundColor: '#f7623b' }}
                              >+</button>
                              <span className="text-gray-400 ml-4">
                          Subtotal: <span className="text-white font-semibold">
                            ₦{((parseFloat(product.price) || 0) * (parseInt(product.quantity) || 1)).toLocaleString()}
                          </span>
                        </span>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}

                  {/* Total Price */}
                  <div className="mt-4 p-4 rounded-lg bg-gray-900 border-2" style={{ borderColor: '#f7623b' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total Price:</span>
                      <span className="text-2xl font-bold" style={{ color: '#f7623b' }}>
                    ₦{getTotalPrice().toLocaleString()}
                  </span>
                    </div>
                    {products.filter(p => p.productName).length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-400">Products: </span>
                          <span className="text-sm text-white">{getConcatenatedProductNames()}</span>
                        </div>
                    )}
                  </div>
                </div>
            )}

            {/* Personal Information — hidden for Scrap4New */}
            {businessType !== 'Scrap4New' && (
                <>
                  {/* Personal Information Section */}
                  <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Personal Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            readOnly={isPreFilled}
                            className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
                            onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
                            onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
                            placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                            readOnly={isPreFilled}
                            className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
                            onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
                            onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
                            placeholder="Middle name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            readOnly={isPreFilled}
                            className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition ${isPreFilled ? 'cursor-not-allowed opacity-75' : ''}`}
                            onFocus={(e) => !isPreFilled && (e.target.style.borderColor = '#f7623b')}
                            onBlur={(e) => !isPreFilled && (e.target.style.borderColor = '#374151')}
                            placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Date of Birth *</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Marital Status *</label>
                        <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                        >
                          <option value="">Select status</option>
                          {maritalStatusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Gender *</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition cursor-pointer"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                        >
                          <option value="">Select gender</option>
                          {genderOptions.map(gender => (
                              <option key={gender} value={gender}>{gender}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Spouse Information */}
                  {formData.maritalStatus === 'Married' && (
                      <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Spouse Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Spouse Name</label>
                            <input
                                type="text"
                                name="spouseName"
                                value={formData.spouseName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                                onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                onBlur={(e) => e.target.style.borderColor = '#374151'}
                                placeholder="Enter spouse name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Spouse Phone</label>
                            <input
                                type="tel"
                                name="spousePhone"
                                value={formData.spousePhone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                                onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                onBlur={(e) => e.target.style.borderColor = '#374151'}
                                placeholder="Enter spouse phone number"
                            />
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Next of Kin */}
                  <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Next of Kin Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Next of Kin Name</label>
                        <input
                            type="text"
                            name="nextOfKinName"
                            value={formData.nextOfKinName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                            placeholder="Enter next of kin name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Next of Kin Phone</label>
                        <input
                            type="tel"
                            name="nextOfKinPhone"
                            value={formData.nextOfKinPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                            placeholder="Enter next of kin phone"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Relationship</label>
                        <input
                            type="text"
                            name="nextOfKinRelationship"
                            value={formData.nextOfKinRelationship}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                            placeholder="e.g., Brother, Sister, Friend"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Verification Details */}
                  <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Verification Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>BVN *</label>
                        <input
                            type="text"
                            name="bvn"
                            value={formData.bvn}
                            onChange={handleInputChange}
                            maxLength="11"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                            placeholder="Enter 11-digit BVN"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>NIN *</label>
                        <input
                            type="text"
                            name="nin"
                            value={formData.nin}
                            onChange={handleInputChange}
                            maxLength="11"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                            placeholder="Enter 11-digit NIN"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Mobile Number *</label>
                        <input
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                            placeholder="Enter mobile number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>Passport Photo *</label>
                        {!passportPreview ? (
                            <button
                                type="button"
                                onClick={startCamera}
                                className="flex items-center justify-center w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm sm:text-base hover:text-white cursor-pointer transition"
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f7623b'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#374151'}
                            >
                              <Camera className="mr-2" size={20} />
                              Capture Live Photo
                            </button>
                        ) : (
                            <div className="relative">
                              <img
                                  src={passportPreview}
                                  alt="Passport preview"
                                  className="w-full h-24 sm:h-32 object-cover rounded-lg border"
                                  style={{ borderColor: '#f7623b' }}
                              />
                              <button
                                  type="button"
                                  onClick={retakePhoto}
                                  className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full text-white cursor-pointer hover:opacity-90"
                                  style={{ backgroundColor: '#f7623b' }}
                              >
                                <Camera size={14} className="sm:w-4 sm:h-4" />
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Plan */}
                  <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Select Plan *</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      {planOptions.map(plan => (
                          <button
                              key={plan}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, plan }))}
                              className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition cursor-pointer hover:opacity-90"
                              style={{
                                backgroundColor: formData.plan === plan ? '#f7623b' : '#111827',
                                color: formData.plan === plan ? 'white' : '#9ca3af',
                                border: formData.plan === plan ? 'none' : '1px solid #374151'
                              }}
                          >
                            {plan}
                          </button>
                      ))}
                    </div>
                  </div>

                  {/* Installment Duration */}
                  {(formData.plan === 'Easy 35' || formData.plan === 'Easy 25') && (
                      <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Installment Duration *</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                          {installmentMonths.map(month => (
                              <button
                                  key={month}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, installmentDuration: month }))}
                                  className="px-4 py-3 rounded-lg font-medium transition cursor-pointer hover:opacity-90"
                                  style={{
                                    backgroundColor: formData.installmentDuration === month ? '#f7623b' : '#111827',
                                    color: formData.installmentDuration === month ? 'white' : '#9ca3af',
                                    border: formData.installmentDuration === month ? 'none' : '1px solid #374151'
                                  }}
                              >
                                {month} {month === 1 ? 'Month' : 'Months'}
                              </button>
                          ))}
                        </div>
                      </div>
                  )}

                  {formData.plan === 'Omolope' && (
                      <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Duration (Days) *</h2>
                        <input
                            type="number"
                            name="omolopeDays"
                            value={formData.omolopeDays}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition"
                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                            onBlur={(e) => e.target.style.borderColor = '#374151'}
                            placeholder="Enter number of days"
                        />
                      </div>
                  )}

                  {/* Bank Statement */}
                  <div className="pb-4 sm:pb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Request Bank Statement</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'Mono' }))}
                          className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition cursor-pointer hover:opacity-90"
                          style={{
                            backgroundColor: formData.bankStatementMethod === 'Mono' ? '#f7623b' : '#111827',
                            color: formData.bankStatementMethod === 'Mono' ? 'white' : '#9ca3af',
                            border: formData.bankStatementMethod === 'Mono' ? 'none' : '1px solid #374151'
                          }}
                      >
                        <FileText className="mr-2" size={20} />
                        Mono
                      </button>
                      <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, bankStatementMethod: 'MBS' }))}
                          className="flex items-center justify-center px-6 py-4 rounded-lg font-medium transition cursor-pointer hover:opacity-90"
                          style={{
                            backgroundColor: formData.bankStatementMethod === 'MBS' ? '#f7623b' : '#111827',
                            color: formData.bankStatementMethod === 'MBS' ? 'white' : '#9ca3af',
                            border: formData.bankStatementMethod === 'MBS' ? 'none' : '1px solid #374151'
                          }}
                      >
                        <Upload className="mr-2" size={20} />
                        MBS
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition duration-200 shadow-lg text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#f7623b' }}
                      onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.opacity = '1')}
                  >
                    {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          Submitting...
                        </>
                    ) : (
                        'Submit Agent Entry'
                    )}
                  </button>
                </>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {showCameraModal && (
            <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-2xl font-bold text-white">Capture Passport Photo</h3>
                  <button onClick={stopCamera} className="p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition cursor-pointer">
                    <X className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
                <div className="relative mb-3 sm:mb-4">
                  <div className="relative overflow-hidden rounded-lg bg-gray-800">
                    {cameraError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10">
                          {cameraError}
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-lg"
                        style={{
                          transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
                          minHeight: '300px',
                          maxHeight: '500px',
                          objectFit: 'cover'
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                          className="border-4 rounded-full bg-transparent"
                          style={{
                            width: '280px',
                            height: '350px',
                            borderColor: '#f7623b',
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                          }}
                      />
                    </div>
                    <button
                        onClick={flipCamera}
                        className="absolute top-4 right-4 p-3 rounded-full text-white shadow-lg transition hover:opacity-80 cursor-pointer"
                        style={{ backgroundColor: '#f7623b' }}
                        title="Flip camera"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                  <p className="text-center text-gray-400 text-sm mt-2">
                    Position your face within the oval • Use the flip button to switch cameras
                  </p>
                </div>
                <button
                    onClick={capturePhoto}
                    className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition text-white cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: '#f7623b' }}
                >
                  <Camera className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Capture Photo
                </button>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
        )}
      </div>
  );
}

export default AgentEntryForm;