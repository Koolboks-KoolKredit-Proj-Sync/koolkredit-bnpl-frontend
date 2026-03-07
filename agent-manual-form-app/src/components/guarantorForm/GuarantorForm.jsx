// import React, { useState, useEffect } from "react";
// import { Shield, User, Package, CreditCard, Phone, Mail, AlertCircle } from "lucide-react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
//
// export default function GuarantorFormPage() {
//     const { token } = useParams();
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [customerData, setCustomerData] = useState(null);
//     const [error, setError] = useState(null);
//     const [formData, setFormData] = useState({ bvn: "", phoneNumber: "", nin: "" });
//
//     useEffect(() => {
//         if (!token) {
//             setError("Invalid link - no token found");
//             setIsLoading(false);
//             return;
//         }
//
//         const fetchData = async () => {
//             try {
//                 setIsLoading(true);
//
//                 // ✅ STEP 1: Validate token and get basic info
//                 const tokenResponse = await axios.get(`https://web-production-9f730.up.railway.app/api/guarantor/form/${token}`);
//
//                 if (!tokenResponse.data.success) {
//                     setError(tokenResponse.data.message || "Invalid or expired link");
//                     setIsLoading(false);
//                     return;
//                 }
//
//                 // Extract BVN from token response
//                 const customerBvn = tokenResponse.data.customerBvn || tokenResponse.data.bvn;
//
//                 if (!customerBvn) {
//                     setError("Customer BVN not found");
//                     setIsLoading(false);
//                     return;
//                 }
//
//                 // ✅ STEP 2: Get detailed customer information using BVN
//                 const detailsResponse = await axios.get("https://web-production-9f730.up.railway.app/api/guarantor/context", {
//                     params: { bvn: customerBvn }
//                 });
//
//                 // ✅ STEP 3: Combine both responses
//                 const combinedData = {
//                     ...tokenResponse.data,      // Token validation data
//                     ...detailsResponse.data,    // Detailed customer data from BVN
//                 };
//
//                 setCustomerData(combinedData);
//                 setError(null);
//
//             } catch (err) {
//                 console.error("Error fetching guarantor data:", err);
//                 const errorMsg = err.response?.data?.message || "Failed to load guarantor data";
//                 setError(errorMsg);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: errorMsg,
//                     confirmButtonColor: "#f7623b"
//                 });
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//
//         fetchData();
//     }, [token]);
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//
//         // Only numeric input for bvn, nin, phoneNumber
//         if (["bvn", "nin", "phoneNumber"].includes(name) && !/^\d*$/.test(value)) return;
//
//         // Length restrictions
//         if ((name === "bvn" || name === "nin") && value.length > 11) return;
//         if (name === "phoneNumber" && value.length > 15) return;
//
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };
//
//     const validateForm = () => {
//         if (formData.bvn.length !== 11) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Validation Error",
//                 text: "BVN must be exactly 11 digits",
//                 confirmButtonColor: "#f7623b"
//             });
//             return false;
//         }
//         if (formData.nin.length !== 11) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Validation Error",
//                 text: "NIN must be exactly 11 digits",
//                 confirmButtonColor: "#f7623b"
//             });
//             return false;
//         }
//         if (formData.phoneNumber.length < 10) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Validation Error",
//                 text: "Please enter a valid phone number",
//                 confirmButtonColor: "#f7623b"
//             });
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
//             const response = await axios.post(
//                 `https://web-production-9f730.up.railway.app/api/guarantor/submit/${token}`,
//                 {
//                     guarantorBvn: formData.bvn,
//                     guarantorPhoneNumber: formData.phoneNumber,
//                     guarantorNin: formData.nin,
//                 }
//             );
//
//             if (response.data.success) {
//                 Swal.fire({
//                     icon: "success",
//                     title: "Submitted!",
//                     text: "You will receive an OTP after admin verification.",
//                     confirmButtonColor: "#f7623b"
//                 }).then(() => {
//                     // Navigate to OTP page or waiting page
//                     navigate(`/guarantor/otp/${token}`);
//                 });
//             } else {
//                 throw new Error(response.data.message || "Submission failed");
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Submission Failed",
//                 text: error.response?.data?.message || error.message || "Please try again",
//                 confirmButtonColor: "#f7623b"
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f7623b" }}>
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
//                     <p className="text-white text-lg">Loading form...</p>
//                 </div>
//             </div>
//         );
//     }
//
//     // Error state
//     if (error || !customerData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
//                 <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-8 text-center">
//                     <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//                     <h1 className="text-2xl font-bold mb-4 text-white">Link Invalid</h1>
//                     <p className="text-gray-400 mb-6">
//                         {error || "This link is invalid or has expired."}
//                     </p>
//                     <button
//                         onClick={() => navigate('/')}
//                         className="px-6 py-3 rounded-lg text-white font-medium transition hover:opacity-90"
//                         style={{ backgroundColor: "#f7623b" }}
//                     >
//                         Go to Home
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "#f7623b" }}>
//             <div className="max-w-4xl mx-auto">
//                 <div className="bg-black rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8">
//
//                     {/* Header */}
//                     <div className="text-center">
//                         <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
//                             <Shield className="w-8 h-8 text-white" />
//                         </div>
//                         <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
//                             Guarantor Form
//                         </h1>
//                         <p className="text-sm sm:text-base text-gray-400">
//                             You've been listed as a guarantor. Please review customer details and fill in your information below.
//                         </p>
//                     </div>
//
//                     {/* Product Details */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800">
//                         <div className="flex items-center gap-2 mb-4">
//                             <Package className="w-5 h-5 text-[#f7623b]" />
//                             <h2 className="text-lg font-semibold text-white">Product Details</h2>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Product Name</label>
//                                 <p className="text-white font-medium mt-1">{customerData.productName || "N/A"}</p>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Brand</label>
//                                 <p className="text-white font-medium mt-1">{customerData.brand || "N/A"}</p>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Size</label>
//                                 <p className="text-white font-medium mt-1">{customerData.size || "N/A"}</p>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Price</label>
//                                 <p className="text-white font-medium mt-1 text-[#f7623b]">
//                                     ₦{customerData.price ? Number(customerData.price).toLocaleString() : "N/A"}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Customer Info */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800">
//                         <div className="flex items-center gap-2 mb-4">
//                             <User className="w-5 h-5 text-[#f7623b]" />
//                             <h2 className="text-lg font-semibold text-white">Customer Information</h2>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Customer Name</label>
//                                 <p className="text-white font-medium mt-1">
//                                     {customerData.firstName || customerData.customerFirstName || ""} {customerData.lastName || customerData.customerLastName || ""}
//                                 </p>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Customer BVN</label>
//                                 <p className="text-white font-medium mt-1">{customerData.bvn || customerData.customerBvn || "N/A"}</p>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
//                                     <Phone className="w-3 h-3" /> Customer Phone
//                                 </label>
//                                 <p className="text-white font-medium mt-1">{customerData.mobileNumber || customerData.customerPhone || "N/A"}</p>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
//                                     <Mail className="w-3 h-3" /> Customer Email
//                                 </label>
//                                 <p className="text-white font-medium mt-1 break-all">{customerData.customerEmail || "N/A"}</p>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Classification Badge (if available) */}
//                     {customerData.classification && (
//                         <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-800">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-gray-400 text-sm">Credit Classification</span>
//                                 <span className={`px-4 py-2 rounded-full font-bold ${
//                                     customerData.classification === 'GREEN' ? 'bg-green-500 text-white' :
//                                         customerData.classification === 'YELLOW' ? 'bg-yellow-500 text-black' :
//                                             'bg-red-500 text-white'
//                                 }`}>
//                                     {customerData.classification}
//                                 </span>
//                             </div>
//                             {customerData.dti !== undefined && (
//                                 <div className="mt-2 text-gray-400 text-sm">
//                                     DTI Ratio: {customerData.dti.toFixed(2)}
//                                 </div>
//                             )}
//                         </div>
//                     )}
//
//                     {/* Payment Plan */}
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800">
//                         <div className="flex items-center gap-2 mb-4">
//                             <CreditCard className="w-5 h-5 text-[#f7623b]" />
//                             <h2 className="text-lg font-semibold text-white">Payment Plan</h2>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Plan Type</label>
//                                 <p className="text-white font-medium mt-1">{customerData.plan || customerData.customerPlan || "N/A"}</p>
//                             </div>
//                             <div>
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider">Duration</label>
//                                 <p className="text-white font-medium mt-1">
//                                     {customerData.installmentDuration || customerData.customerInstallmentDuration || customerData.installmentOption ? `${customerData.installmentDuration || customerData.customerInstallmentDuration || customerData.installmentOption} Months` : "N/A"}
//                                 </p>
//                             </div>
//                             <div className="sm:col-span-2">
//                                 <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
//                                     <Mail className="w-3 h-3" /> Your Email (Guarantor)
//                                 </label>
//                                 <p className="text-white font-medium mt-1 break-all">{customerData.guarantorEmail || "N/A"}</p>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Guarantor Form */}
//                     <div className="space-y-6">
//                         <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                             <h3 className="text-lg font-semibold text-white mb-4">Your Details (Guarantor)</h3>
//                             <div className="space-y-4">
//                                 <InputField
//                                     label="Your BVN"
//                                     name="bvn"
//                                     value={formData.bvn}
//                                     handleChange={handleChange}
//                                     maxLength={11}
//                                 />
//                                 <InputField
//                                     label="Your Phone Number"
//                                     name="phoneNumber"
//                                     value={formData.phoneNumber}
//                                     handleChange={handleChange}
//                                     maxLength={15}
//                                     note="OTP will be sent to this number after verification"
//                                 />
//                                 <InputField
//                                     label="Your NIN"
//                                     name="nin"
//                                     value={formData.nin}
//                                     handleChange={handleChange}
//                                     maxLength={11}
//                                 />
//                             </div>
//                         </div>
//
//                         <button
//                             onClick={handleSubmit}
//                             disabled={isSubmitting}
//                             className="w-full font-bold py-4 text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//                             style={{ backgroundColor: "#f7623b" }}
//                         >
//                             {isSubmitting ? "Submitting..." : "Submit Information"}
//                         </button>
//                     </div>
//
//                     {/* Info Notice */}
//                     <div className="bg-gray-900 border-l-4 border-[#f7623b] p-4 rounded">
//                         <p className="text-xs text-gray-400">
//                             <span className="font-semibold text-white">Important:</span> After
//                             submission, our admin will verify your information and send an OTP to
//                             your phone number. Please ensure all details are correct before submitting.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// // Reusable input component
// const InputField = ({ label, name, value, handleChange, maxLength, note }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-300 mb-2">
//             {label} <span className="text-red-500">*</span>
//         </label>
//         <input
//             type="text"
//             name={name}
//             value={value}
//             onChange={handleChange}
//             placeholder={`Enter your ${label.toLowerCase()}`}
//             maxLength={maxLength}
//             className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f7623b] transition"
//         />
//         {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
//         {!note && <p className="text-xs text-gray-500 mt-1">{value.length}/{maxLength} digits</p>}
//     </div>
// );












import React, { useState, useEffect, useRef } from "react";
import { Shield, User, Package, CreditCard, Phone, Mail, AlertCircle, Camera, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// ─── Animated SVG Caricatures ───────────────────────────────────────────────

const Stage1SVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <ellipse cx="100" cy="90" rx="45" ry="52" fill="#f7c59f" stroke="#f7623b" strokeWidth="2.5"/>
        {/* Hair */}
        <ellipse cx="100" cy="45" rx="45" ry="18" fill="#3b2a1a"/>
        {/* Left Eye - blinking */}
        <g>
            <ellipse cx="82" cy="82" rx="9" ry="9" fill="white"/>
            <circle cx="82" cy="84" r="5" fill="#3b2a1a"/>
            <circle cx="84" cy="82" r="2" fill="white"/>
            <animateTransform attributeName="transform" type="scale" values="1 1;1 0.1;1 1" dur="2s" repeatCount="indefinite" additive="sum" origin="82 82"/>
        </g>
        {/* Right Eye - blinking */}
        <g>
            <ellipse cx="118" cy="82" rx="9" ry="9" fill="white"/>
            <circle cx="118" cy="84" r="5" fill="#3b2a1a"/>
            <circle cx="120" cy="82" r="2" fill="white"/>
            <animateTransform attributeName="transform" type="scale" values="1 1;1 0.1;1 1" dur="2s" repeatCount="indefinite" additive="sum" origin="118 82"/>
        </g>
        {/* Nose */}
        <ellipse cx="100" cy="100" rx="5" ry="7" fill="#e8a87c"/>
        {/* Smile */}
        <path d="M 85 115 Q 100 128 115 115" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Rotation arrows */}
        <path d="M 50 90 Q 40 60 70 45" fill="none" stroke="#f7623b" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrow)"/>
        <path d="M 150 90 Q 160 60 130 45" fill="none" stroke="#f7623b" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrow2)"/>
        <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#f7623b"/>
            </marker>
            <marker id="arrow2" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
                <path d="M8,0 L8,6 L0,3 z" fill="#f7623b"/>
            </marker>
        </defs>
        {/* Blink x2 label */}
        <text x="100" y="175" textAnchor="middle" fill="#f7623b" fontSize="13" fontWeight="bold">Blink x2 + Rotate Head</text>
        {/* Animated rotation indicator */}
        <animateTransform attributeName="transform" type="rotate" values="0 100 90;-8 100 90;8 100 90;0 100 90" dur="3s" repeatCount="indefinite"/>
    </svg>
);

const Stage2SVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Face turned sideways - profile view */}
        <ellipse cx="105" cy="90" rx="35" ry="50" fill="#f7c59f" stroke="#f7623b" strokeWidth="2.5"/>
        {/* Hair */}
        <ellipse cx="100" cy="47" rx="40" ry="17" fill="#3b2a1a"/>
        {/* Ear */}
        <ellipse cx="70" cy="92" rx="10" ry="13" fill="#f7c59f" stroke="#f7623b" strokeWidth="1.5"/>
        <ellipse cx="72" cy="92" rx="6" ry="9" fill="#e8a87c"/>
        {/* Eye (side profile - only one visible) */}
        <ellipse cx="98" cy="82" rx="7" ry="7" fill="white" stroke="#ccc" strokeWidth="1"/>
        <circle cx="100" cy="84" r="4" fill="#3b2a1a"/>
        <circle cx="101" cy="82" r="1.5" fill="white"/>
        {/* Nose (side profile) */}
        <path d="M 112 98 Q 118 105 112 112" fill="#e8a87c" stroke="#c8956c" strokeWidth="1"/>
        {/* Lips */}
        <path d="M 108 118 Q 116 122 108 126" fill="#e07070" stroke="none"/>
        {/* Arrow pointing sideways */}
        <path d="M 30 90 L 55 90" fill="none" stroke="#f7623b" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowRight)"/>
        <defs>
            <marker id="arrowRight" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#f7623b"/>
            </marker>
        </defs>
        <text x="100" y="172" textAnchor="middle" fill="#f7623b" fontSize="13" fontWeight="bold">Turn Face Sideways</text>
        {/* Animated nudge */}
        <animateTransform attributeName="transform" type="translate" values="0 0;8 0;0 0" dur="2s" repeatCount="indefinite"/>
    </svg>
);

const Stage3SVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <ellipse cx="100" cy="72" rx="38" ry="44" fill="#f7c59f" stroke="#f7623b" strokeWidth="2.5"/>
        {/* Hair */}
        <ellipse cx="100" cy="35" rx="38" ry="15" fill="#3b2a1a"/>
        {/* Eyes */}
        <ellipse cx="85" cy="65" rx="7" ry="7" fill="white"/>
        <circle cx="85" cy="67" r="4" fill="#3b2a1a"/>
        <circle cx="87" cy="65" r="1.5" fill="white"/>
        <ellipse cx="115" cy="65" rx="7" ry="7" fill="white"/>
        <circle cx="115" cy="67" r="4" fill="#3b2a1a"/>
        <circle cx="117" cy="65" r="1.5" fill="white"/>
        {/* Nose */}
        <ellipse cx="100" cy="80" rx="4" ry="5" fill="#e8a87c"/>
        {/* Smile */}
        <path d="M 88 92 Q 100 102 112 92" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
        {/* Arms/Hands holding ID */}
        <path d="M 60 130 Q 55 145 65 152" fill="none" stroke="#f7c59f" strokeWidth="8" strokeLinecap="round"/>
        <path d="M 140 130 Q 145 145 135 152" fill="none" stroke="#f7c59f" strokeWidth="8" strokeLinecap="round"/>
        {/* ID Card */}
        <rect x="55" y="148" width="90" height="42" rx="5" fill="#1a1a2e" stroke="#f7623b" strokeWidth="2"/>
        <rect x="60" y="153" width="20" height="20" rx="3" fill="#f7623b" opacity="0.7"/>
        <line x1="85" y1="158" x2="138" y2="158" stroke="#666" strokeWidth="2"/>
        <line x1="85" y1="164" x2="130" y2="164" stroke="#666" strokeWidth="2"/>
        <line x1="85" y1="170" x2="120" y2="170" stroke="#666" strokeWidth="2"/>
        {/* ID label */}
        <text x="100" y="197" textAnchor="middle" fill="#f7623b" fontSize="11" fontWeight="bold">Hold ID & Take Selfie</text>
    </svg>
);

// ─── Liveness Camera Component ───────────────────────────────────────────────

const LivenessCamera = ({ stage, onStageComplete }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const faceApiRef = useRef(null);
    const detectionIntervalRef = useRef(null);

    const [cameraReady, setCameraReady] = useState(false);
    const [faceApiLoaded, setFaceApiLoaded] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Starting camera...");
    const [progress, setProgress] = useState({ blinkCount: 0, rotated: false, sideways: false });
    const [progressPct, setProgressPct] = useState(0);
    const [capturedImage, setCapturedImage] = useState(null);

    const prevEarRef = useRef(null);
    const blinkStateRef = useRef("open");
    const blinkCountRef = useRef(0);
    const rotatedRef = useRef(false);

    // Load face-api.js
    useEffect(() => {
        const loadFaceApi = async () => {
            if (window.faceapi) {
                setFaceApiLoaded(true);
                return;
            }
            setLoadingMessage("Loading face detection...");
            try {
                await new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });

                setLoadingMessage("Loading AI models...");
                const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
                await Promise.all([
                    window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    window.faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
                ]);

                faceApiRef.current = window.faceapi;
                setFaceApiLoaded(true);
                setLoadingMessage("Starting camera...");
            } catch (err) {
                console.error("Failed to load face-api:", err);
                // Fallback to timer-based if face-api fails
                setFaceApiLoaded("fallback");
            }
        };
        loadFaceApi();
    }, []);

    // Start camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                }
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setCameraReady(true);
                    setLoadingMessage("");
                }
            } catch (err) {
                console.error("Camera error:", err);
                setLoadingMessage("Camera access denied. Please allow camera.");
            }
        };
        startCamera();

        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        };
    }, [stage]);

    // Run detection for stages 1 and 2
    useEffect(() => {
        if (!cameraReady || stage === 3) return;

        if (faceApiLoaded === "fallback") {
            // Timer-based fallback
            let count = 0;
            const total = stage === 1 ? 5 : 4;
            detectionIntervalRef.current = setInterval(() => {
                count++;
                setProgressPct(Math.min((count / total) * 100, 100));
                if (count >= total) {
                    clearInterval(detectionIntervalRef.current);
                    setTimeout(() => onStageComplete(), 500);
                }
            }, 800);
            return;
        }

        if (!faceApiLoaded || !faceApiRef.current) return;

        const faceapi = faceApiRef.current;
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 });

        detectionIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || !cameraReady) return;
            try {
                const result = await faceapi
                    .detectSingleFace(videoRef.current, options)
                    .withFaceLandmarks(true);

                if (!result) return;

                const landmarks = result.landmarks;
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();

                // Eye aspect ratio
                const eyeAR = (eye) => {
                    const h1 = Math.abs(eye[1].y - eye[5].y);
                    const h2 = Math.abs(eye[2].y - eye[4].y);
                    const w = Math.abs(eye[0].x - eye[3].x);
                    return (h1 + h2) / (2 * w);
                };

                const leftEAR = eyeAR(leftEye);
                const rightEAR = eyeAR(rightEye);
                const avgEAR = (leftEAR + rightEAR) / 2;

                // Head rotation via eye-nose geometry
                const nose = landmarks.getNose();
                const noseTip = nose[3];
                const eyeCenter = { x: (leftEye[0].x + rightEye[3].x) / 2, y: (leftEye[0].y + rightEye[3].y) / 2 };
                const eyeWidth = Math.abs(rightEye[3].x - leftEye[0].x);
                const noseOffset = (noseTip.x - eyeCenter.x) / eyeWidth;

                if (stage === 1) {
                    // Blink detection
                    if (avgEAR < 0.2 && blinkStateRef.current === "open") {
                        blinkStateRef.current = "closed";
                    } else if (avgEAR > 0.25 && blinkStateRef.current === "closed") {
                        blinkStateRef.current = "open";
                        blinkCountRef.current += 1;
                        setProgress(p => ({ ...p, blinkCount: blinkCountRef.current }));
                    }

                    // Head rotation detection
                    if (Math.abs(noseOffset) > 0.25 && !rotatedRef.current) {
                        rotatedRef.current = true;
                        setProgress(p => ({ ...p, rotated: true }));
                    }

                    const pct = Math.min(
                        ((blinkCountRef.current >= 2 ? 50 : blinkCountRef.current * 25) +
                            (rotatedRef.current ? 50 : 0)),
                        100
                    );
                    setProgressPct(pct);

                    if (blinkCountRef.current >= 2 && rotatedRef.current) {
                        clearInterval(detectionIntervalRef.current);
                        setTimeout(() => onStageComplete(), 800);
                    }
                }

                if (stage === 2) {
                    // Side profile: nose offset > 0.35 means turned sideways
                    if (Math.abs(noseOffset) > 0.35) {
                        setProgress(p => ({ ...p, sideways: true }));
                        setProgressPct(prev => Math.min(prev + 8, 100));
                    }

                    if (progressPct >= 100) {
                        clearInterval(detectionIntervalRef.current);
                        setTimeout(() => onStageComplete(), 800);
                    }
                }
            } catch (err) {
                // Silent fail on individual frames
            }
        }, 200);

        return () => clearInterval(detectionIntervalRef.current);
    }, [cameraReady, faceApiLoaded, stage]);

    // Stage 3: capture photo manually
    const captureStage3 = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            setCapturedImage(url);
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            onStageComplete(blob);
        }, "image/jpeg", 0.92);
    };

    const retake = () => {
        setCapturedImage(null);
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        };
        startCamera();
    };

    return (
        <div className="space-y-4">
            {/* Video / Preview */}
            <div className="relative rounded-xl overflow-hidden bg-gray-900 border-2 border-[#f7623b]" style={{ minHeight: 260 }}>
                {capturedImage ? (
                    <img src={capturedImage} alt="Selfie" className="w-full rounded-xl" style={{ transform: "scaleX(-1)" }} />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-xl"
                        style={{ transform: "scaleX(-1)", minHeight: 240, objectFit: "cover" }}
                    />
                )}

                {/* Loading overlay */}
                {loadingMessage && (
                    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center gap-3 rounded-xl">
                        <Loader2 className="w-10 h-10 text-[#f7623b] animate-spin" />
                        <p className="text-white text-sm text-center px-4">{loadingMessage}</p>
                    </div>
                )}

                {/* Stage badge */}
                {!loadingMessage && (
                    <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-[#f7623b] text-xs font-bold px-3 py-1 rounded-full">
                        Stage {stage} of 3
                    </div>
                )}
            </div>

            {/* Progress bar for stages 1 & 2 */}
            {stage !== 3 && !loadingMessage && (
                <div className="space-y-2">
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%`, backgroundColor: "#f7623b" }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        {stage === 1 && (
                            <>
                                <span className={progress.blinkCount >= 2 ? "text-green-400" : ""}>
                                    {progress.blinkCount >= 2 ? "✅" : "👁️"} Blinks: {progress.blinkCount}/2
                                </span>
                                <span className={progress.rotated ? "text-green-400" : ""}>
                                    {progress.rotated ? "✅" : "🔄"} Head rotation
                                </span>
                            </>
                        )}
                        {stage === 2 && (
                            <span className={progress.sideways ? "text-green-400" : ""}>
                                {progress.sideways ? "✅ Profile detected - hold still..." : "↔️ Turn your face sideways slowly"}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Stage 3 buttons */}
            {stage === 3 && cameraReady && !capturedImage && (
                <button
                    type="button"
                    onClick={captureStage3}
                    className="w-full py-4 bg-[#f7623b] text-white font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 text-base"
                >
                    <Camera className="w-5 h-5" />
                    Take Selfie with ID
                </button>
            )}

            {capturedImage && (
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={retake}
                        className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition"
                    >
                        Retake
                    </button>
                    <div className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Looks Good!
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

// ─── Selfie Section with 3 stages ────────────────────────────────────────────

const SelfieLiveness = ({ onComplete }) => {
    const [currentStage, setCurrentStage] = useState(1);
    const [completedStages, setCompletedStages] = useState([]);

    const stages = [
        {
            title: "Liveness Check — Blink & Rotate",
            description: "Blink your eyes twice and slowly turn your head left and right.",
            svg: <Stage1SVG />,
            color: "from-orange-900 to-black",
        },
        {
            title: "Liveness Check — Side Profile",
            description: "Turn your face fully to one side and hold for a moment.",
            svg: <Stage2SVG />,
            color: "from-purple-900 to-black",
        },
        {
            title: "ID Selfie",
            description: "Hold your valid Driver's Licence, Voter's Card, NIN slip, or Passport clearly in front of you and take a selfie.",
            svg: <Stage3SVG />,
            color: "from-blue-900 to-black",
        },
    ];

    const handleStageComplete = (blob) => {
        setCompletedStages(prev => [...prev, currentStage]);
        if (currentStage < 3) {
            setTimeout(() => setCurrentStage(prev => prev + 1), 400);
        } else {
            // Stage 3 complete — pass blob up
            onComplete(blob);
        }
    };

    const stageInfo = stages[currentStage - 1];

    return (
        <div className="space-y-5">
            {/* Stage stepper */}
            <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            completedStages.includes(s)
                                ? "bg-green-500 text-white"
                                : currentStage === s
                                    ? "bg-[#f7623b] text-white ring-4 ring-orange-300 ring-opacity-40"
                                    : "bg-gray-700 text-gray-400"
                        }`}>
                            {completedStages.includes(s) ? <CheckCircle className="w-5 h-5" /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`h-1 w-10 rounded-full transition-all duration-500 ${
                                completedStages.includes(s) ? "bg-green-500" : "bg-gray-700"
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Stage card */}
            <div className={`bg-gradient-to-br ${stageInfo.color} rounded-2xl p-5 border border-gray-700`}>
                <h3 className="text-[#f7623b] font-bold text-base mb-1">{stageInfo.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{stageInfo.description}</p>

                {/* SVG illustration */}
                <div className="w-36 h-36 mx-auto mb-4 bg-black bg-opacity-40 rounded-2xl p-2">
                    {stageInfo.svg}
                </div>

                {/* Camera component */}
                <LivenessCamera
                    key={currentStage}
                    stage={currentStage}
                    onStageComplete={handleStageComplete}
                />
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GuarantorFormPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ bvn: "", phoneNumber: "", nin: "" });
    const [selfieBlob, setSelfieBlob] = useState(null);
    const [selfieComplete, setSelfieComplete] = useState(false);

    useEffect(() => {
        if (!token) { setError("Invalid link - no token found"); setIsLoading(false); return; }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const tokenResponse = await axios.get(`https://web-production-9f730.up.railway.app/api/guarantor/form/${token}`);
                if (!tokenResponse.data.success) {
                    setError(tokenResponse.data.message || "Invalid or expired link");
                    setIsLoading(false);
                    return;
                }
                const customerBvn = tokenResponse.data.customerBvn || tokenResponse.data.bvn;
                if (!customerBvn) { setError("Customer BVN not found"); setIsLoading(false); return; }

                const detailsResponse = await axios.get("https://web-production-9f730.up.railway.app/api/guarantor/context", {
                    params: { bvn: customerBvn }
                });
                setCustomerData({ ...tokenResponse.data, ...detailsResponse.data });
                setError(null);
            } catch (err) {
                const msg = err.response?.data?.message || "Failed to load guarantor data";
                setError(msg);
                Swal.fire({ icon: "error", title: "Error", text: msg, confirmButtonColor: "#f7623b" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["bvn", "nin", "phoneNumber"].includes(name) && !/^\d*$/.test(value)) return;
        if ((name === "bvn" || name === "nin") && value.length > 11) return;
        if (name === "phoneNumber" && value.length > 15) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelfieComplete = (blob) => {
        setSelfieBlob(blob);
        setSelfieComplete(true);
        Swal.fire({
            icon: "success",
            title: "Liveness Verified!",
            text: "Your selfie with ID has been captured successfully.",
            confirmButtonColor: "#f7623b",
            timer: 2500,
            timerProgressBar: true,
        });
    };

    const validateForm = () => {
        if (formData.bvn.length !== 11) {
            Swal.fire({ icon: "warning", title: "Validation Error", text: "BVN must be exactly 11 digits", confirmButtonColor: "#f7623b" });
            return false;
        }
        if (formData.nin.length !== 11) {
            Swal.fire({ icon: "warning", title: "Validation Error", text: "NIN must be exactly 11 digits", confirmButtonColor: "#f7623b" });
            return false;
        }
        if (formData.phoneNumber.length < 10) {
            Swal.fire({ icon: "warning", title: "Validation Error", text: "Please enter a valid phone number", confirmButtonColor: "#f7623b" });
            return false;
        }
        if (!selfieBlob) {
            Swal.fire({ icon: "warning", title: "Selfie Required", text: "Please complete the liveness verification and take your ID selfie.", confirmButtonColor: "#f7623b" });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            const payload = new FormData();
            payload.append("guarantorBvn", formData.bvn);
            payload.append("guarantorPhoneNumber", formData.phoneNumber);
            payload.append("guarantorNin", formData.nin);
            payload.append("selfieImage", selfieBlob, "guarantor_selfie.jpg");

            const response = await axios.post(
                `https://web-production-9f730.up.railway.app/api/guarantor/submit/${token}`,
                payload,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Submitted!",
                    text: "You will receive an OTP after admin verification.",
                    confirmButtonColor: "#f7623b"
                }).then(() => navigate(`/guarantor/otp/${token}`));
            } else {
                throw new Error(response.data.message || "Submission failed");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: error.response?.data?.message || error.message || "Please try again",
                confirmButtonColor: "#f7623b"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f7623b" }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading form...</p>
                </div>
            </div>
        );
    }

    if (error || !customerData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
                <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4 text-white">Link Invalid</h1>
                    <p className="text-gray-400 mb-6">{error || "This link is invalid or has expired."}</p>
                    <button onClick={() => navigate("/")}
                            className="px-6 py-3 rounded-lg text-white font-medium transition hover:opacity-90"
                            style={{ backgroundColor: "#f7623b" }}>
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "#f7623b" }}>
            <div className="max-w-2xl mx-auto">
                <div className="bg-black rounded-2xl shadow-2xl p-5 sm:p-8 space-y-6">

                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">Guarantor Form</h1>
                        <p className="text-sm sm:text-base text-gray-400">
                            You've been listed as a guarantor. Review the details below and complete verification.
                        </p>
                    </div>

                    {/* Product Details */}
                    <InfoCard title="Product Details" icon={<Package className="w-5 h-5 text-[#f7623b]" />}>
                        <InfoGrid items={[
                            { label: "Product Name", value: customerData.productName },
                            { label: "Brand", value: customerData.brand },
                            { label: "Size", value: customerData.size },
                            { label: "Price", value: customerData.price ? `₦${Number(customerData.price).toLocaleString()}` : null, highlight: true },
                        ]} />
                    </InfoCard>

                    {/* Customer Info */}
                    <InfoCard title="Customer Information" icon={<User className="w-5 h-5 text-[#f7623b]" />}>
                        <InfoGrid items={[
                            { label: "Customer Name", value: `${customerData.firstName || customerData.customerFirstName || ""} ${customerData.lastName || customerData.customerLastName || ""}`.trim() },
                            { label: "Customer BVN", value: customerData.bvn || customerData.customerBvn },
                            { label: "Customer Phone", value: customerData.mobileNumber || customerData.customerPhone },
                            { label: "Customer Email", value: customerData.customerEmail },
                        ]} />
                    </InfoCard>

                    {/* Classification */}
                    {customerData.classification && (
                        <InfoCard title="Credit Classification" icon={<Shield className="w-5 h-5 text-[#f7623b]" />}>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Classification</span>
                                <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                                    customerData.classification === "GREEN" ? "bg-green-500 text-white" :
                                        customerData.classification === "YELLOW" ? "bg-yellow-500 text-black" :
                                            "bg-red-500 text-white"
                                }`}>
                                    {customerData.classification}
                                </span>
                            </div>
                            {customerData.dti !== undefined && (
                                <p className="text-gray-400 text-sm mt-2">DTI Ratio: {customerData.dti.toFixed(2)}</p>
                            )}
                        </InfoCard>
                    )}

                    {/* Payment Plan */}
                    <InfoCard title="Payment Plan" icon={<CreditCard className="w-5 h-5 text-[#f7623b]" />}>
                        <InfoGrid items={[
                            { label: "Plan Type", value: customerData.plan || customerData.customerPlan },
                            { label: "Duration", value: customerData.installmentDuration ? `${customerData.installmentDuration} Months` : null },
                            { label: "Your Email (Guarantor)", value: customerData.guarantorEmail, full: true },
                        ]} />
                    </InfoCard>

                    {/* Guarantor Details */}
                    <InfoCard title="Your Details (Guarantor)" icon={<User className="w-5 h-5 text-[#f7623b]" />} highlight>
                        <div className="space-y-4">
                            <InputField label="Your BVN" name="bvn" value={formData.bvn} handleChange={handleChange} maxLength={11} />
                            <InputField label="Your Phone Number" name="phoneNumber" value={formData.phoneNumber} handleChange={handleChange} maxLength={15}
                                        note="OTP will be sent to this number after verification" />
                            <InputField label="Your NIN" name="nin" value={formData.nin} handleChange={handleChange} maxLength={11} />
                        </div>
                    </InfoCard>

                    {/* Liveness & Selfie */}
                    <InfoCard
                        title={selfieComplete ? "✅ Liveness Verified" : "🔐 Liveness Verification & ID Selfie"}
                        icon={<Camera className="w-5 h-5 text-[#f7623b]" />}
                        highlight
                    >
                        {selfieComplete ? (
                            <div className="text-center py-4 space-y-2">
                                <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
                                <p className="text-green-400 font-semibold">Liveness check passed and selfie captured!</p>
                                <button
                                    type="button"
                                    onClick={() => { setSelfieComplete(false); setSelfieBlob(null); }}
                                    className="text-sm text-gray-400 underline mt-1"
                                >
                                    Redo verification
                                </button>
                            </div>
                        ) : (
                            <SelfieLiveness onComplete={handleSelfieComplete} />
                        )}
                    </InfoCard>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selfieComplete}
                        className="w-full font-bold py-4 text-base rounded-xl text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: "#f7623b" }}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin w-5 h-5" /> Submitting...</>
                        ) : (
                            <><CheckCircle className="w-5 h-5" /> Submit Information</>
                        )}
                    </button>

                    {/* Notice */}
                    <div className="bg-gray-900 border-l-4 border-[#f7623b] p-4 rounded-lg">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">Important:</span> After submission, our admin will verify your information and send an OTP to your phone number. Please ensure all details are correct before submitting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Reusable UI Components ───────────────────────────────────────────────────

const InfoCard = ({ title, icon, children, highlight }) => (
    <div className={`bg-gray-900 rounded-xl p-5 border-2 ${highlight ? "border-[#f7623b]" : "border-gray-800"}`}>
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-base font-semibold text-white">{title}</h2>
        </div>
        {children}
    </div>
);

const InfoGrid = ({ items }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ label, value, highlight, full }) => (
            <div key={label} className={full ? "sm:col-span-2" : ""}>
                <label className="text-xs text-gray-500 uppercase tracking-wider">{label}</label>
                <p className={`font-medium mt-1 break-all ${highlight ? "text-[#f7623b]" : "text-white"}`}>
                    {value || "N/A"}
                </p>
            </div>
        ))}
    </div>
);

const InputField = ({ label, name, value, handleChange, maxLength, note }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            {label} <span className="text-red-500">*</span>
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={`Enter your ${label.toLowerCase()}`}
            maxLength={maxLength}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f7623b] transition"
        />
        {note
            ? <p className="text-xs text-gray-500 mt-1">{note}</p>
            : <p className="text-xs text-gray-500 mt-1">{value.length}/{maxLength} digits</p>
        }
    </div>
);