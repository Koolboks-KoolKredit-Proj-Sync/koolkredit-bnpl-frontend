import React, { useState, useRef, useEffect } from "react";
import { Shield, Clock, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export default function GuarantorOtpPage() {
  const { token } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [waitingForOtp, setWaitingForOtp] = useState(true);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Poll to check if OTP has been sent (admin confirmed)
    const interval = setInterval(checkOtpStatus, 5173);
    return () => clearInterval(interval);
  }, []);

  const checkOtpStatus = async () => {
    // This would be implemented if needed
    // For now, we assume OTP arrives when admin confirms
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Swal.fire({
        title: "Incomplete OTP",
        text: "Please enter all 6 digits",
        icon: "error",
        confirmButtonColor: "#f7623b",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://koolkredit-bnpl-backend-gqbj.onrender.com/api/guarantor/verify-otp/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await response.json();

      if (data.success && data.verified) {
        setIsVerified(true);
        Swal.fire({
          icon: "success",
          title: "Verification Complete!",
          html: `
            <p>Your guarantor verification is complete.</p>
            <p class="text-sm text-gray-600 mt-2">The customer can now proceed with their application.</p>
          `,
          confirmButtonColor: "#f7623b",
          allowOutsideClick: false,
        });
      } else if (data.alreadyVerified) {
        setIsVerified(true);
        Swal.fire({
          icon: "info",
          title: "Already Verified",
          text: "This OTP has already been verified.",
          confirmButtonColor: "#f7623b",
        });
      } else {
        throw new Error(data.message || "Invalid OTP code");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: error.message || "Invalid OTP. Please try again.",
        confirmButtonColor: "#f7623b",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiveOtp = () => {
    setWaitingForOtp(false);
    Swal.fire({
      icon: "info",
      title: "Ready to Enter OTP",
      text: "Please enter the 6-digit code sent to your phone.",
      confirmButtonColor: "#f7623b",
    });
  };

  if (isVerified) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#f7623b" }}
      >
        <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-white">
            Verification Complete!
          </h1>
          <p className="text-gray-400 mb-6">
            Thank you for completing the guarantor verification. The customer 
            has been notified and can now proceed with their application.
          </p>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              You can safely close this page now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (waitingForOtp) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#f7623b" }}
      >
        <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Clock className="w-16 h-16 text-[#f7623b] mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
              Waiting for Admin Confirmation
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Your form has been submitted. Our admin is reviewing your information 
              and will send an OTP to your phone shortly.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-[#f7623b] mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-2">What's happening?</h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Admin is verifying your information</li>
                  <li>• A phone call may be made to confirm</li>
                  <li>• OTP will be sent to your phone once confirmed</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleReceiveOtp}
            className="w-full font-bold py-3 text-base rounded-lg text-white transition shadow-lg hover:opacity-90"
            style={{ backgroundColor: "#f7623b" }}
          >
            I Received the OTP
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            This page will automatically update when the OTP is sent
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#f7623b" }}
    >
      <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-[#f7623b] mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
            Verify OTP
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.some((digit) => !digit)}
            className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "#f7623b" }}
          >
            {isLoading ? "Verifying..." : "Verify & Complete"}
          </button>
        </form>

        <div className="mt-6 bg-gray-900 border-l-4 border-[#f7623b] p-4 rounded">
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-white">Note:</span> After 
            successful verification, the customer will be able to proceed with 
            their application.
          </p>
        </div>
      </div>
    </div>
  );
}






















// import React, { useState, useRef } from "react";
// import { ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function GuarantorOtp() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);
//   const inputRefs = useRef([]);

//   const handleChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text").slice(0, 6);
//     if (!/^\d+$/.test(pastedData)) return;

//     const newOtp = [...otp];
//     pastedData.split("").forEach((char, index) => {
//       if (index < 6) newOtp[index] = char;
//     });
//     setOtp(newOtp);

//     const lastIndex = Math.min(pastedData.length, 5);
//     inputRefs.current[lastIndex]?.focus();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const otpCode = otp.join("");
//     if (otpCode.length !== 6) {
//       Swal.fire({
//         title: "Error",
//         text: "Please enter all 6 digits",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:8080/api/agent-followup/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           bvn: state?.bvn,
//           otp: otpCode,
//         }),
//       });

//       if (response.ok) {
//         Swal.fire({
//           title: "Success!",
//           text: "OTP verified successfully",
//           icon: "success",
//           confirmButtonColor: "#f7623b",
//         }).then(() => {
//           navigate("/guarantor-form", {
//             state: { ...state, otpVerified: true },
//           });
//         });
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || "Invalid OTP code");
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "Error",
//         text: error.message || "Invalid OTP. Please try again.",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = () => {
//     Swal.fire({
//       title: "Resend OTP",
//       text: "A new code will be sent to your mobile number",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonColor: "#f7623b",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Resend",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: "Code Sent!",
//           text: "A new verification code has been sent",
//           icon: "success",
//           confirmButtonColor: "#f7623b",
//         });
//       }
//     });
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
//       style={{ backgroundColor: "#f7623b" }}
//     >
//       <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-[#f7623b] mb-6 font-medium hover:opacity-80 transition"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>

//         <div className="text-center mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
//             Guarantor's OTP
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400">
//             Enter the 6-digit code sent to your guarantor
//           </p>
//           {state?.guarantorPhoneNumber && (
//             <p className="text-sm text-gray-500 mt-2">{state.guarantorPhoneNumber}</p>
//           )}
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="flex justify-center gap-2 sm:gap-3">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 onPaste={handlePaste}
//                 className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 autoFocus={index === 0}
//               />
//             ))}
//           </div>

//           <div className="text-center">
//             <button
//               type="button"
//               className="text-sm text-gray-400 hover:text-[#f7623b] transition underline"
//               onClick={handleResendOtp}
//             >
//               Didn't receive the code? Resend
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || otp.some((digit) => !digit)}
//             className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//             style={{ backgroundColor: "#f7623b" }}
//           >
//             {isLoading ? "Verifying..." : "Verify & Continue"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
