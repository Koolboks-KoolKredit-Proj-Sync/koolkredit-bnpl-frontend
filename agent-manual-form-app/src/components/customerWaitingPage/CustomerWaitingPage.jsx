// import React, { useState, useEffect } from "react";
// import { CheckCircle, Clock, Mail, Shield } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";
//
// // Component for the waiting page while guarantor processes the application
// export default function CustomerWaitingPage() {
//   const navigate = useNavigate();
//   const { state: locationState } = useLocation();
//
//   const [customer, setCustomer] = useState(null);
//   const [status, setStatus] = useState("LOADING");
//   const [statusMessage, setStatusMessage] = useState("Checking guarantor status...");
//   const [guarantorEmail, setGuarantorEmail] = useState("");
//
//   // Load customer from location.state or sessionStorage
//   useEffect(() => {
//     // Attempt to load from locationState first, then sessionStorage
//     const storedCustomer = locationState || JSON.parse(sessionStorage.getItem("customer") || "null");
//
//     if (!storedCustomer) {
//       // No customer info found, redirect to home/application start
//       navigate("/");
//       return;
//     }
//     setCustomer(storedCustomer);
//
//     // Cleanup sessionStorage after loading to avoid stale data on subsequent visits/reloads
//     // sessionStorage.removeItem("customer"); // Uncomment if you want to clear session after initial load
//   }, [locationState, navigate]);
//
//   // Poll guarantor status only when customer is loaded
//   useEffect(() => {
//     if (!customer?.bvn) return; // Wait until customer and their bvn is available
//
//     const checkGuarantorStatus = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/guarantor/status/${customer.bvn}`);
//         // Check for non-200 status codes
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//
//         if (data.success) {
//           setStatus(data.status);
//           setStatusMessage(data.message);
//           if (data.guarantorEmail) setGuarantorEmail(data.guarantorEmail);
//
//           if (data.status === "VERIFIED") {
//             // Stop polling immediately upon verification
//             clearInterval(interval);
//
//             Swal.fire({
//               icon: "success",
//               title: "Guarantor Verified!",
//               text: "Your guarantor has been successfully verified. Redirecting to final approval...",
//               confirmButtonColor: "#f7623b",
//             }).then(() => {
//               // Store customer data one last time before navigating if needed,
//               // though the new component will likely fetch based on the ref.
//               // sessionStorage.setItem("customer", JSON.stringify(customer));
//
//               // ⭐️ CORRECTED NAVIGATION: Route to BnplApproved and pass the bvn as 'ref' search parameter
//               navigate("/bnpl-approved?ref=" + customer.bvn);
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Error checking status:", error);
//         // Optionally set status to an ERROR state here
//         // setStatus("ERROR");
//         // setStatusMessage("Failed to connect to status service. Retrying...");
//       }
//     };
//
//     // Initial check
//     checkGuarantorStatus();
//
//     // Poll every 5 seconds
//     const interval = setInterval(checkGuarantorStatus, 5000);
//
//     // Cleanup function to clear the interval when the component unmounts or dependencies change
//     return () => clearInterval(interval);
//   }, [customer, navigate]);
//
//   const getStatusIcon = () => {
//     switch (status) {
//       case "VERIFIED":
//         return <CheckCircle className="w-16 h-16 text-green-500" />;
//       case "WAITING_GUARANTOR":
//       case "PENDING_ADMIN":
//       case "OTP_SENT":
//         return <Clock className="w-16 h-16 text-[#f7623b]" />;
//       default:
//         // Including LOADING, ERROR, and other initial states
//         return <Shield className="w-16 h-16 text-gray-400" />;
//     }
//   };
//
//   const getStatusColor = () => {
//     switch (status) {
//       case "VERIFIED":
//         return "text-green-500";
//       case "WAITING_GUARANTOR":
//       case "PENDING_ADMIN":
//       case "OTP_SENT":
//         return "text-[#f7623b]";
//       default:
//         return "text-gray-400";
//     }
//   };
//
//   if (!customer) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white bg-black">
//         Loading customer data...
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
//       <div className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-8">
//         {/* Status Icon */}
//         <div className="flex justify-center mb-6">{getStatusIcon()}</div>
//
//         {/* Title */}
//         <h1 className="text-3xl font-bold text-center mb-4" style={{ color: "#f7623b" }}>
//           {status === "VERIFIED" ? "Guarantor Verified!" : "Waiting for Guarantor"}
//         </h1>
//
//         {/* Status Message */}
//         <p className={`text-center text-lg mb-8 ${getStatusColor()}`}>{statusMessage}</p>
//
//         {/* Progress Steps */}
//         <div className="space-y-4 mb-8">
//           <Step
//             icon={<Mail className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />}
//             title="Email Sent to Guarantor"
//             message={guarantorEmail ? `Sent to ${guarantorEmail}` : "Verification link sent"}
//             active={["WAITING_GUARANTOR", "PENDING_ADMIN", "OTP_SENT", "VERIFIED"].includes(status)}
//           />
//           <Step
//             icon={<Shield className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />}
//             title="Guarantor Form Submitted"
//             // Note: Updated message for clarity
//             message={["PENDING_ADMIN", "OTP_SENT", "VERIFIED"].includes(status) ? "Awaiting admin confirmation" : "Waiting for guarantor to fill form"}
//             active={["PENDING_ADMIN", "OTP_SENT", "VERIFIED"].includes(status)}
//           />
//           <Step
//             icon={<CheckCircle className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />}
//             title="OTP Sent to Guarantor"
//             message={["OTP_SENT", "VERIFIED"].includes(status) ? "Waiting for guarantor to verify OTP" : "Pending admin confirmation"}
//             active={["OTP_SENT", "VERIFIED"].includes(status)}
//           />
//           <Step
//             icon={<CheckCircle className={`w-6 h-6 mr-3 mt-1 ${status === "VERIFIED" ? "text-green-500" : "text-gray-600"}`} />}
//             title="Guarantor Verified"
//             message={status === "VERIFIED" ? "Verification complete! Redirecting..." : "Waiting for OTP verification"}
//             active={status === "VERIFIED"}
//             borderColor={status === "VERIFIED" ? "border-green-500" : "border-gray-800"}
//           />
//         </div>
//
//         {/* Loading Indicator */}
//         {status !== "VERIFIED" && (
//           <div className="flex justify-center items-center space-x-2 text-gray-400">
//             <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
//             <p className="text-sm">Checking status every 5 seconds...</p>
//           </div>
//         )}
//
//         {/* Customer Info */}
//         <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
//           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Application</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-xs text-gray-500">Name</p>
//               <p className="text-white">{customer.firstName} {customer.lastName}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Plan</p>
//               <p className="text-white">{customer.plan}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // Reusable step component
// function Step({ icon, title, message, active, borderColor }) {
//   // Use a default for borderColor if none is provided
//   const finalBorderColor = borderColor || "border-[#f7623b]";
//
//   return (
//     <div className={`flex items-start p-4 rounded-lg ${active ? `bg-gray-900 border-l-4 ${finalBorderColor}` : "bg-gray-800"}`}>
//       {icon}
//       <div className="flex-1">
//         <h3 className="text-white font-semibold">{title}</h3>
//         <p className="text-sm text-gray-400">{message}</p>
//       </div>
//       {/* Show checkmark only if the step is active, using the green color */}
//       {active && <CheckCircle className="w-6 h-6 text-green-500" />}
//     </div>
//   );
// }













// import React, { useState, useEffect } from "react";
// import { CheckCircle, Clock, Mail, Shield } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function CustomerWaitingPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const [status, setStatus] = useState("LOADING");
//   const [statusMessage, setStatusMessage] = useState("Checking guarantor status...");
//   const [guarantorEmail, setGuarantorEmail] = useState("");


  

//   useEffect(() => {
//     if (!state?.bvn) {
//       navigate("/");
//       return;
//     }
//     const checkGuarantorStatus = async () => {
//         try {
//           const response = await fetch(
//             `http://localhost:8080/api/guarantor/status/${state.bvn}`
//           );
//           const data = await response.json();
    
//           if (data.success) {
//             setStatus(data.status);
//             setStatusMessage(data.message);
            
//             if (data.guarantorEmail) {
//               setGuarantorEmail(data.guarantorEmail);
//             }
    
//             // If verified, navigate to next page
//             if (data.status === "VERIFIED") {
//               Swal.fire({
//                 icon: "success",
//                 title: "Guarantor Verified!",
//                 text: "Your guarantor has been successfully verified.",
//                 confirmButtonColor: "#f7623b",
//               }).then(() => {
//                 //navigate("/success", { state });
                
//               });
//             }
//           }
//         } catch (error) {
//           console.error("Error checking status:", error);
//         }
//       };

//     // Initial check
//     checkGuarantorStatus();

//     // Poll every 5 seconds
//     const interval = setInterval(checkGuarantorStatus, 5000);

//     return () => clearInterval(interval);
//   }, [navigate,state]);

  

//   const getStatusIcon = () => {
//     switch (status) {
//       case "VERIFIED":
//         return <CheckCircle className="w-16 h-16 text-green-500" />;
//       case "WAITING_GUARANTOR":
//       case "PENDING_ADMIN":
//       case "OTP_SENT":
//         return <Clock className="w-16 h-16 text-[#f7623b]" />;
//       default:
//         return <Shield className="w-16 h-16 text-gray-400" />;
//     }
//   };

//   const getStatusColor = () => {
//     switch (status) {
//       case "VERIFIED":
//         return "text-green-500";
//       case "WAITING_GUARANTOR":
//       case "PENDING_ADMIN":
//       case "OTP_SENT":
//         return "text-[#f7623b]";
//       default:
//         return "text-gray-400";
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4"
//       style={{ backgroundColor: "#f7623b" }}
//     >
//       <div className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-8">
//         {/* Status Icon */}
//         <div className="flex justify-center mb-6">
//           {getStatusIcon()}
//         </div>

//         {/* Title */}
//         <h1 className="text-3xl font-bold text-center mb-4" style={{ color: "#f7623b" }}>
//           {status === "VERIFIED" ? "Guarantor Verified!" : "Waiting for Guarantor"}
//         </h1>

//         {/* Status Message */}
//         <p className={`text-center text-lg mb-8 ${getStatusColor()}`}>
//           {statusMessage}
//         </p>

//         {/* Progress Steps */}
//         <div className="space-y-4 mb-8">
//           <div className={`flex items-start p-4 rounded-lg ${
//             status === "WAITING_GUARANTOR" || status === "PENDING_ADMIN" || status === "OTP_SENT" || status === "VERIFIED"
//               ? "bg-gray-900 border-l-4 border-[#f7623b]"
//               : "bg-gray-800"
//           }`}>
//             <Mail className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />
//             <div className="flex-1">
//               <h3 className="text-white font-semibold">Email Sent to Guarantor</h3>
//               <p className="text-sm text-gray-400">
//                 {guarantorEmail ? `Sent to ${guarantorEmail}` : "Verification link sent"}
//               </p>
//             </div>
//             <CheckCircle className="w-6 h-6 text-green-500" />
//           </div>

//           <div className={`flex items-start p-4 rounded-lg ${
//             status === "PENDING_ADMIN" || status === "OTP_SENT" || status === "VERIFIED"
//               ? "bg-gray-900 border-l-4 border-[#f7623b]"
//               : "bg-gray-800"
//           }`}>
//             <Shield className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />
//             <div className="flex-1">
//               <h3 className="text-white font-semibold">Guarantor Form Submitted</h3>
//               <p className="text-sm text-gray-400">
//                 {status === "PENDING_ADMIN" || status === "OTP_SENT" || status === "VERIFIED"
//                   ? "Awaiting admin confirmation"
//                   : "Waiting for guarantor to fill form"}
//               </p>
//             </div>
//             {(status === "PENDING_ADMIN" || status === "OTP_SENT" || status === "VERIFIED") && (
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             )}
//           </div>

//           <div className={`flex items-start p-4 rounded-lg ${
//             status === "OTP_SENT" || status === "VERIFIED"
//               ? "bg-gray-900 border-l-4 border-[#f7623b]"
//               : "bg-gray-800"
//           }`}>
//             <CheckCircle className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />
//             <div className="flex-1">
//               <h3 className="text-white font-semibold">OTP Sent to Guarantor</h3>
//               <p className="text-sm text-gray-400">
//                 {status === "OTP_SENT" || status === "VERIFIED"
//                   ? "Waiting for guarantor to verify OTP"
//                   : "Pending admin confirmation"}
//               </p>
//             </div>
//             {status === "VERIFIED" && (
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             )}
//           </div>

//           <div className={`flex items-start p-4 rounded-lg ${
//             status === "VERIFIED"
//               ? "bg-gray-900 border-l-4 border-green-500"
//               : "bg-gray-800"
//           }`}>
//             <CheckCircle className={`w-6 h-6 mr-3 mt-1 ${
//               status === "VERIFIED" ? "text-green-500" : "text-gray-600"
//             }`} />
//             <div className="flex-1">
//               <h3 className="text-white font-semibold">Guarantor Verified</h3>
//               <p className="text-sm text-gray-400">
//                 {status === "VERIFIED"
//                   ? "Verification complete!"
//                   : "Waiting for OTP verification"}
//               </p>
//             </div>
//             {status === "VERIFIED" && (
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             )}
//           </div>
//         </div>

//         {/* Loading Indicator */}
//         {status !== "VERIFIED" && (
//           <div className="flex justify-center items-center space-x-2 text-gray-400">
//             <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
//             <p className="text-sm">Checking status every 5 seconds...</p>
//           </div>
//         )}

//         {/* Customer Info */}
//         <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
//           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
//             Your Application
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-xs text-gray-500">Name</p>
//               <p className="text-white">{state?.firstName} {state?.lastName}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Plan</p>
//               <p className="text-white">{state?.plan}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, Mail, Shield } from "lucide-react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

export default function CustomerWaitingPage() {
    const navigate = useNavigate();
    const { state: locationState } = useLocation();

    const [customer, setCustomer] = useState(null);
    const [status, setStatus] = useState("LOADING");
    const [statusMessage, setStatusMessage] = useState("Checking guarantor status...");
    const [guarantorEmail, setGuarantorEmail] = useState("");

    const intervalRef = useRef(null);

    // Load customer from location.state or sessionStorage
    useEffect(() => {
        const storedCustomer =
            locationState || JSON.parse(sessionStorage.getItem("customer") || "null");

        if (!storedCustomer) {
            navigate("/");
            return;
        }

        setCustomer(storedCustomer);
    }, [locationState, navigate]);

    // Poll guarantor status once customer is loaded
    // useEffect(() => {
    //     if (!customer?.bvn) return;
    //
    //     const checkGuarantorStatus = async () => {
    //         try {
    //             const response = await fetch(
    //                 `http://localhost:8080/api/guarantor/status/${customer.bvn}`
    //             );
    //
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //
    //             const data = await response.json();
    //
    //             if (data.success) {
    //                 const normalizedStatus = data.status?.trim().toUpperCase();
    //                 setStatus(normalizedStatus);
    //                 setStatusMessage(data.message);
    //
    //                 if (data.guarantorEmail) {
    //                     setGuarantorEmail(data.guarantorEmail);
    //                 }
    //
    //                 if (normalizedStatus === "VERIFIED") {
    //                     // Stop polling immediately
    //                     if (intervalRef.current) {
    //                         clearInterval(intervalRef.current);
    //                         intervalRef.current = null;
    //                     }
    //
    //                     Swal.fire({
    //                         icon: "success",
    //                         title: "Guarantor Verified!",
    //                         text: "Your guarantor has been successfully verified. Redirecting to final approval...",
    //                         confirmButtonColor: "#f7623b",
    //                     }).then(() => {
    //                         navigate("/bnpl-approved?ref=" + customer.bvn);
    //                     });
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Error checking guarantor status:", error);
    //         }
    //     };
    //
    //     // Run immediately on mount
    //     checkGuarantorStatus();
    //
    //     // Then poll every 5 seconds
    //     intervalRef.current = setInterval(checkGuarantorStatus, 5000);
    //
    //     // Cleanup on unmount or customer change
    //     return () => {
    //         if (intervalRef.current) {
    //             clearInterval(intervalRef.current);
    //             intervalRef.current = null;
    //         }
    //     };
    // }, [customer, navigate]);
    //


    useEffect(() => {
        if (!customer?.bvn) return;

        const checkGuarantorStatus = async () => {
            try {
                const response = await fetch(
                    `https://koolkredit-bnpl-backend-gqbj.onrender.com/api/guarantor/status/${customer.bvn}`
                );
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();

                if (data.success) {
                    const normalizedStatus = data.status?.trim().toUpperCase();
                    setStatus(normalizedStatus);
                    setStatusMessage(data.message);
                    if (data.guarantorEmail) setGuarantorEmail(data.guarantorEmail);

                    if (normalizedStatus === "VERIFIED") {
                        clearInterval(interval); // ✅ local reference like the working version

                        setTimeout(() => {   // ✅ let React render the ticked Step 4 first
                            Swal.fire({
                                icon: "success",
                                title: "Guarantor Verified!",
                                text: "Your guarantor has been successfully verified. Redirecting to final approval...",
                                confirmButtonColor: "#f7623b",
                            }).then(() => {
                                navigate("/bnpl-approved?ref=" + customer.bvn);
                            });
                        }, 300);
                    }
                }
            } catch (error) {
                console.error("Error checking guarantor status:", error);
            }
        };

        checkGuarantorStatus();
        const interval = setInterval(checkGuarantorStatus, 5000); // ✅ local variable

        return () => clearInterval(interval);
    }, [customer, navigate]);




    const getStatusIcon = () => {
        switch (status) {
            case "VERIFIED":
                return <CheckCircle className="w-16 h-16 text-green-500" />;
            case "WAITING_GUARANTOR":
            case "PENDING_ADMIN":
            case "OTP_SENT":
                return <Clock className="w-16 h-16 text-[#f7623b]" />;
            default:
                return <Shield className="w-16 h-16 text-gray-400" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case "VERIFIED":
                return "text-green-500";
            case "WAITING_GUARANTOR":
            case "PENDING_ADMIN":
            case "OTP_SENT":
                return "text-[#f7623b]";
            default:
                return "text-gray-400";
        }
    };

    if (!customer) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Loading customer data...
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "#f7623b" }}
        >
            <div className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-8">
                {/* Status Icon */}
                <div className="flex justify-center mb-6">{getStatusIcon()}</div>

                {/* Title */}
                <h1
                    className="text-3xl font-bold text-center mb-4"
                    style={{ color: "#f7623b" }}
                >
                    {status === "VERIFIED" ? "Guarantor Verified!" : "Waiting for Guarantor"}
                </h1>

                {/* Status Message */}
                <p className={`text-center text-lg mb-8 ${getStatusColor()}`}>
                    {statusMessage}
                </p>

                {/* Progress Steps */}
                <div className="space-y-4 mb-8">
                    {/* Step 1: Email Sent */}
                    <Step
                        icon={<Mail className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />}
                        title="Email Sent to Guarantor"
                        message={
                            guarantorEmail ? `Sent to ${guarantorEmail}` : "Verification link sent"
                        }
                        active={["WAITING_GUARANTOR", "PENDING_ADMIN", "OTP_SENT", "VERIFIED"].includes(status)}
                        borderColor="border-[#f7623b]"
                    />

                    {/* Step 2: Guarantor Form Submitted */}
                    <Step
                        icon={<Shield className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />}
                        title="Guarantor Form Submitted"
                        message={
                            ["PENDING_ADMIN", "OTP_SENT", "VERIFIED"].includes(status)
                                ? "Awaiting admin confirmation"
                                : "Waiting for guarantor to fill form"
                        }
                        active={["PENDING_ADMIN", "OTP_SENT", "VERIFIED"].includes(status)}
                        borderColor="border-[#f7623b]"
                    />

                    {/* Step 3: OTP Sent */}
                    <Step
                        icon={<CheckCircle className="w-6 h-6 mr-3 mt-1 text-[#f7623b]" />}
                        title="OTP Sent to Guarantor"
                        message={
                            ["OTP_SENT", "VERIFIED"].includes(status)
                                ? "Waiting for guarantor to verify OTP"
                                : "Pending admin confirmation"
                        }
                        active={["OTP_SENT", "VERIFIED"].includes(status)}
                        borderColor="border-[#f7623b]"
                    />

                    {/* Step 4: Guarantor Verified */}
                    <Step
                        icon={
                            <CheckCircle
                                className={`w-6 h-6 mr-3 mt-1 ${
                                    status === "VERIFIED" ? "text-green-500" : "text-[#f7623b]"
                                }`}
                            />
                        }
                        title="Guarantor Verified"
                        message={
                            status === "VERIFIED"
                                ? "Verification complete! Redirecting..."
                                : "Waiting for OTP verification"
                        }
                        active={status === "VERIFIED"}
                        borderColor="border-green-500"
                    />
                </div>

                {/* Loading Indicator */}
                {status !== "VERIFIED" && (
                    <div className="flex justify-center items-center space-x-2 text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                        <p className="text-sm">Checking status every 5 seconds...</p>
                    </div>
                )}

                {/* Customer Info */}
                <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Your Application
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-white">
                                {customer.firstName} {customer.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Plan</p>
                            <p className="text-white">{customer.plan}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable step component
function Step({ icon, title, message, active, borderColor = "border-[#f7623b]" }) {
    return (
        <div
            className={`flex items-start p-4 rounded-lg transition-all duration-300 ${
                active
                    ? `bg-gray-900 border-l-4 ${borderColor}`
                    : "bg-gray-800"
            }`}
        >
            {icon}
            <div className="flex-1">
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-sm text-gray-400">{message}</p>
            </div>
            {active && <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />}
        </div>
    );
}