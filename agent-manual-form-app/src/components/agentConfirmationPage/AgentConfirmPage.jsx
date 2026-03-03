// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, Upload, User, Mail, Phone, DollarSign, Calendar, MapPin, Store, CheckCircle } from 'lucide-react';
//
// export default function AgentProofForm() {
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [agentData, setAgentData] = useState(null);
//     const [showCamera, setShowCamera] = useState(false);
//     const [capturedImage, setCapturedImage] = useState(null);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const streamRef = useRef(null);
//
//     const [formData, setFormData] = useState({
//         store_name: '',
//         store_location: '',
//         confirmation_date: new Date().toISOString().split('T')[0],
//         receipt_image: null
//     });
//
//     const getPaymentId = () => {
//         const parts = window.location.pathname.split('/').filter(Boolean);
//         return parts[parts.length - 1];
//     };
//
//
//
//
//     // const getPaymentId = () => {
//     //     const pathParts = window.location.pathname.split('/');
//     //     return pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
//     // };
//
//     useEffect(() => {
//         const fetchAgentData = async () => {
//             try {
//                 const paymentId = getPaymentId();
//                 const response = await fetch(`http://127.0.0.1:8000/v1/api/agent-proof-data/${paymentId}/`);
//
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch agent data');
//                 }
//
//                 const data = await response.json();
//                 setAgentData(data);
//                 setIsLoading(false);
//             } catch (error) {
//                 console.error('Error fetching agent data:', error);
//                 alert('Failed to load agent data. Please try again.');
//                 setIsLoading(false);
//             }
//         };
//
//         fetchAgentData();
//     }, []);
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
//
//
//     const startCamera = async () => {
//         try {
//             setShowCamera(true); // 👈 render <video> first
//
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: true // FIX 3 below
//             });
//
//             streamRef.current = stream;
//
//             // wait for DOM render
//             setTimeout(() => {
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.play(); // Safari fix
//                 }
//             }, 100);
//
//         } catch (error) {
//             console.error('Error accessing camera:', error);
//             alert('Unable to access camera. Please check permissions.');
//         }
//     };
//
//
//
//
//
//     // const startCamera = async () => {
//     //     try {
//     //         const stream = await navigator.mediaDevices.getUserMedia({
//     //             video: { facingMode: 'environment' }
//     //         });
//     //         streamRef.current = stream;
//     //         if (videoRef.current) {
//     //             videoRef.current.srcObject = stream;
//     //         }
//     //         setShowCamera(true);
//     //     } catch (error) {
//     //         console.error('Error accessing camera:', error);
//     //         alert('Unable to access camera. Please check permissions.');
//     //     }
//     // };
//
//     const stopCamera = () => {
//         if (streamRef.current) {
//             streamRef.current.getTracks().forEach(track => track.stop());
//         }
//         setShowCamera(false);
//     };
//
//     const capturePhoto = () => {
//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//
//         if (video && canvas) {
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//             const ctx = canvas.getContext('2d');
//             ctx.drawImage(video, 0, 0);
//
//             canvas.toBlob((blob) => {
//                 setCapturedImage(URL.createObjectURL(blob));
//                 setFormData(prev => ({
//                     ...prev,
//                     receipt_image: blob
//                 }));
//                 stopCamera();
//             }, 'image/jpeg', 0.9);
//         }
//     };
//
//     const retakePhoto = () => {
//         setCapturedImage(null);
//         setFormData(prev => ({
//             ...prev,
//             receipt_image: null
//         }));
//         startCamera();
//     };
//
//     const validateForm = () => {
//         if (!formData.store_name.trim()) {
//             alert('Please enter store name');
//             return false;
//         }
//         if (!formData.store_location.trim()) {
//             alert('Please enter store location');
//             return false;
//         }
//         if (!formData.confirmation_date) {
//             alert('Please select confirmation date');
//             return false;
//         }
//         if (!formData.receipt_image) {
//             alert('Please capture receipt image');
//             return false;
//         }
//         return true;
//     };
//
//     // Updated handleSubmit function for React component
// // Add this to your AgentProofForm component
//
//     const handleSubmit = async () => {
//         if (!validateForm()) return;
//
//         setIsSubmitting(true);
//
//         try {
//             const paymentId = getPaymentId();
//             const submitData = new FormData();
//
//             // Store information
//             submitData.append('store_name', formData.store_name);
//             submitData.append('store_location', formData.store_location);
//             submitData.append('confirmation_date', formData.confirmation_date);
//             submitData.append('receipt_image', formData.receipt_image, 'receipt.jpg');
//
//             // Agent information from agentData state
//             submitData.append('agent_name', agentData.agent_name);
//             submitData.append('agent_email', agentData.agent_email);
//             submitData.append('agent_id', agentData.agent_id);
//             submitData.append('agent_mobile', agentData.agent_mobile);
//
//             const response = await fetch(`http://127.0.0.1:8000/v1/api/submit-proof/${paymentId}/`, {
//                 method: 'POST',
//                 body: submitData
//             });
//
//             const data = await response.json();
//
//             if (response.ok) {
//                 alert('Proof submitted successfully! Email sent to After Sales Team.');
//                 window.location.href = '/agent-dashboard';
//             } else {
//                 throw new Error(data.message || 'Failed to submit proof');
//             }
//         } catch (error) {
//             console.error('Submission error:', error);
//             alert(error.message || 'Failed to submit proof. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//
//
//
//
//     // const handleSubmit = async () => {
//     //     if (!validateForm()) return;
//     //
//     //     setIsSubmitting(true);
//     //
//     //     try {
//     //         const paymentId = getPaymentId();
//     //         const submitData = new FormData();
//     //         submitData.append('store_name', formData.store_name);
//     //         submitData.append('store_location', formData.store_location);
//     //         submitData.append('confirmation_date', formData.confirmation_date);
//     //         submitData.append('receipt_image', formData.receipt_image, 'receipt.jpg');
//     //
//     //         const response = await fetch(`http://127.0.0.1:8000/v1/api/submit-proof/${paymentId}/`, {
//     //             method: 'POST',
//     //             body: submitData
//     //         });
//     //
//     //         const data = await response.json();
//     //
//     //         if (response.ok) {
//     //             alert('Proof submitted successfully!');
//     //             window.location.href = '/agent-dashboard';
//     //         } else {
//     //             throw new Error(data.message || 'Failed to submit proof');
//     //         }
//     //     } catch (error) {
//     //         console.error('Submission error:', error);
//     //         alert(error.message || 'Failed to submit proof. Please try again.');
//     //     } finally {
//     //         setIsSubmitting(false);
//     //     }
//     // };
//
//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7623b' }}>
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
//             </div>
//         );
//     }
//
//     if (!agentData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
//                 <div className="bg-black rounded-lg p-8 text-white text-center">
//                     <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
//                     <p>Unable to load payment information.</p>
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
//                         <Camera className="w-8 h-8 text-white" />
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
//                         Submit Payment Proof
//                     </h1>
//                     <p className="text-sm sm:text-base text-gray-400">
//                         Confirm payment and upload receipt
//                     </p>
//                 </div>
//
//                 <div className="space-y-6">
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
//                                     value={agentData.agent_name}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <User className="w-4 h-4 mr-2" />
//                                     Agent ID
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={agentData.agent_id}
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
//                                     value={agentData.agent_email}
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
//                                     value={agentData.agent_mobile}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Payment Details</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     Customer Loan Reference
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={agentData.loan_ref}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <DollarSign className="w-4 h-4 mr-2" />
//                                     Initial Installment
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={`₦${agentData.amount.toLocaleString()}`}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//
//                             <div className="md:col-span-2">
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <Calendar className="w-4 h-4 mr-2" />
//                                     Payment Date
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={agentData.payment_date}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Store Information</h2>
//
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <Store className="w-4 h-4 mr-2" />
//                                     Store Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="store_name"
//                                     value={formData.store_name}
//                                     onChange={handleChange}
//                                     placeholder="Enter store/merchant name"
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <MapPin className="w-4 h-4 mr-2" />
//                                     Store Location *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="store_location"
//                                     value={formData.store_location}
//                                     onChange={handleChange}
//                                     placeholder="Enter store address/location"
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
//                                     <Calendar className="w-4 h-4 mr-2" />
//                                     Payment Confirmation Date *
//                                 </label>
//                                 <input
//                                     type="date"
//                                     name="confirmation_date"
//                                     value={formData.confirmation_date}
//                                     onChange={handleChange}
//                                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Receipt Image *</h2>
//
//                         {!showCamera && !capturedImage && (
//                             <button
//                                 type="button"
//                                 onClick={startCamera}
//                                 className="w-full py-4 bg-[#f7623b] text-white font-bold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
//                             >
//                                 <Camera className="w-5 h-5" />
//                                 Open Camera
//                             </button>
//                         )}
//
//                         {showCamera && (
//                             <div className="space-y-4">
//                                 <video
//                                     ref={videoRef}
//                                     autoPlay
//                                     playsInline
//                                     muted
//                                     className="w-full rounded-lg"
//                                 />
//                                 <div className="flex gap-3">
//                                     <button
//                                         type="button"
//                                         onClick={capturePhoto}
//                                         className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
//                                     >
//                                         Capture Photo
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={stopCamera}
//                                         className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//
//                         {capturedImage && (
//                             <div className="space-y-4">
//                                 <img
//                                     src={capturedImage}
//                                     alt="Captured receipt"
//                                     className="w-full rounded-lg border-2 border-[#f7623b]"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={retakePhoto}
//                                     className="w-full py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition"
//                                 >
//                                     Retake Photo
//                                 </button>
//                             </div>
//                         )}
//
//                         <canvas ref={canvasRef} style={{ display: 'none' }} />
//                     </div>
//
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
//                                 Submit Proof
//                             </>
//                         )}
//                     </button>
//
//                     <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
//                         <p className="text-xs text-gray-400">
//                             <span className="font-semibold text-white">📸 Note:</span> Please ensure the receipt image is clear and readable before submitting.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, User, Mail, Phone, DollarSign, Calendar, MapPin, Store, CheckCircle } from 'lucide-react';

export default function AgentProofForm() {
    // CONFIGURATION: Both backend endpoints
    const DJANGO_API_URL = 'https://koolkredit-payment-integration-production.up.railway.app';
    //const SPRING_API_URL = 'http://127.0.0.1:8080';
    const SPRING_API_URL = 'https://web-production-9f730.up.railway.app';

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agentData, setAgentData] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [formData, setFormData] = useState({
        store_name: '',
        store_location: '',
        confirmation_date: new Date().toISOString().split('T')[0],
        receipt_image: null
    });

    const getPaymentId = () => {
        const parts = window.location.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1];
    };

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const paymentId = getPaymentId();
                // Fetch from Django backend
                const response = await fetch(`${DJANGO_API_URL}/v1/api/agent-proof-data/${paymentId}/`);

                if (!response.ok) {
                    throw new Error('Failed to fetch agent data');
                }

                const data = await response.json();
                setAgentData(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching agent data:', error);
                alert('Failed to load agent data. Please try again.');
                setIsLoading(false);
            }
        };

        fetchAgentData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const startCamera = async () => {
        try {
            setShowCamera(true);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });

            streamRef.current = stream;

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            }, 100);

        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            canvas.toBlob((blob) => {
                setCapturedImage(URL.createObjectURL(blob));
                setFormData(prev => ({
                    ...prev,
                    receipt_image: blob
                }));
                stopCamera();
            }, 'image/jpeg', 0.9);
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setFormData(prev => ({
            ...prev,
            receipt_image: null
        }));
        startCamera();
    };

    const validateForm = () => {
        if (!formData.store_name.trim()) {
            alert('Please enter store name');
            return false;
        }
        if (!formData.store_location.trim()) {
            alert('Please enter store location');
            return false;
        }
        if (!formData.confirmation_date) {
            alert('Please select confirmation date');
            return false;
        }
        if (!formData.receipt_image) {
            alert('Please capture receipt image');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const paymentId = getPaymentId();
            const applicationReference = agentData.loan_ref; // Use loan_ref for Spring Boot

            // Prepare FormData for Django
            const djangoFormData = new FormData();
            djangoFormData.append('store_name', formData.store_name);
            djangoFormData.append('store_location', formData.store_location);
            djangoFormData.append('confirmation_date', formData.confirmation_date);
            djangoFormData.append('receipt_image', formData.receipt_image, 'receipt.jpg');
            djangoFormData.append('agent_name', agentData.agent_name);
            djangoFormData.append('agent_email', agentData.agent_email);
            djangoFormData.append('agent_id', agentData.agent_id);
            djangoFormData.append('agent_mobile', agentData.agent_mobile);

            // Prepare FormData for Spring Boot
            const springFormData = new FormData();
            springFormData.append('store_name', formData.store_name);
            springFormData.append('store_location', formData.store_location);
            springFormData.append('confirmation_date', formData.confirmation_date);
            springFormData.append('receipt_image', formData.receipt_image, 'receipt.jpg');
            springFormData.append('agent_name', agentData.agent_name);
            springFormData.append('agent_email', agentData.agent_email);
            springFormData.append('agent_id', agentData.agent_id);
            springFormData.append('agent_mobile', agentData.agent_mobile);

            console.log('Submitting to both backends...');
            console.log('Django endpoint:', `${DJANGO_API_URL}/v1/api/submit-proof/${paymentId}/`);
            console.log('Spring Boot endpoint:', `${SPRING_API_URL}/v1/api/submit-proof/${applicationReference}`);

            // Submit to BOTH backends simultaneously
            const [djangoResponse, springResponse] = await Promise.all([
                fetch(`${DJANGO_API_URL}/v1/api/submit-proof/${paymentId}/`, {
                    method: 'POST',
                    body: djangoFormData
                }),
                fetch(`${SPRING_API_URL}/v1/api/submit-proof/${applicationReference}`, {
                    method: 'POST',
                    body: springFormData
                })
            ]);

            // Parse both responses
            const djangoData = await djangoResponse.json();
            const springData = await springResponse.json();

            console.log('Django response:', djangoData);
            console.log('Spring Boot response:', springData);

            // Check if both succeeded
            if (djangoResponse.ok && springResponse.ok) {
                alert('Proof submitted successfully to both systems! Email sent to After Sales Team.');
                window.location.href = '/https://koolkredit-payment-integration-production.up.railway.app/admin/login/?next=/admin/';
            } else if (!djangoResponse.ok && springResponse.ok) {
                throw new Error(`Django submission failed: ${djangoData.message || 'Unknown error'}`);
            } else if (djangoResponse.ok && !springResponse.ok) {
                throw new Error(`Spring Boot submission failed: ${springData.message || 'Unknown error'}`);
            } else {
                throw new Error('Both submissions failed. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(error.message || 'Failed to submit proof. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7623b' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    if (!agentData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7623b' }}>
                <div className="bg-black rounded-lg p-8 text-white text-center">
                    <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
                    <p>Unable to load payment information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
            <div className="max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                        Submit Payment Proof
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Confirm payment and upload receipt
                    </p>
                </div>

                <div className="space-y-6">
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
                                    value={agentData.agent_name}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <User className="w-4 h-4 mr-2" />
                                    Agent ID
                                </label>
                                <input
                                    type="text"
                                    value={agentData.agent_id}
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
                                    value={agentData.agent_email}
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
                                    value={agentData.agent_mobile}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Payment Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    Customer Loan Reference
                                </label>
                                <input
                                    type="text"
                                    value={agentData.loan_ref}
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
                                    value={`₦${agentData.amount.toLocaleString()}`}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Payment Date
                                </label>
                                <input
                                    type="text"
                                    value={agentData.payment_date}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Store Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Store className="w-4 h-4 mr-2" />
                                    Store Name *
                                </label>
                                <input
                                    type="text"
                                    name="store_name"
                                    value={formData.store_name}
                                    onChange={handleChange}
                                    placeholder="Enter store/merchant name"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Store Location *
                                </label>
                                <input
                                    type="text"
                                    name="store_location"
                                    value={formData.store_location}
                                    onChange={handleChange}
                                    placeholder="Enter store address/location"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-[#f7623b]">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Payment Confirmation Date *
                                </label>
                                <input
                                    type="date"
                                    name="confirmation_date"
                                    value={formData.confirmation_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Receipt Image *</h2>

                        {!showCamera && !capturedImage && (
                            <button
                                type="button"
                                onClick={startCamera}
                                className="w-full py-4 bg-[#f7623b] text-white font-bold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                            >
                                <Camera className="w-5 h-5" />
                                Open Camera
                            </button>
                        )}

                        {showCamera && (
                            <div className="space-y-4">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full rounded-lg"
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                                    >
                                        Capture Photo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={stopCamera}
                                        className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {capturedImage && (
                            <div className="space-y-4">
                                <img
                                    src={capturedImage}
                                    alt="Captured receipt"
                                    className="w-full rounded-lg border-2 border-[#f7623b]"
                                />
                                <button
                                    type="button"
                                    onClick={retakePhoto}
                                    className="w-full py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition"
                                >
                                    Retake Photo
                                </button>
                            </div>
                        )}

                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

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
                                Submit Proof
                            </>
                        )}
                    </button>

                    <div className="bg-gray-900 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">📸 Note:</span> Please ensure the receipt image is clear and readable before submitting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}