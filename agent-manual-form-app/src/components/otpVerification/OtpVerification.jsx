import React, { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

export default function CustomerOtpVerification() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

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

  // In CustomerOtpVerification.jsx - Update the handleSubmit function

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Swal.fire({
        title: "Error",
        text: "Please enter all 6 digits",
        icon: "error",
        confirmButtonColor: "#f7623b",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://web-production-9f730.up.railway.app/api/agent-followup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bvn: state?.bvn,
          otp: otpCode,
        }),
      });

      if (response.ok) {
        // ✅ Get guarantor email from the state (it was passed from AgentFollowUpForm)
        const guarantorEmailFromState = state?.guarantorEmail;

        if (guarantorEmailFromState) {
          // Show confirmation before sending
          Swal.fire({
            title: "OTP Verified!",
            html: `
            <p class="mb-4">Sending verification link to guarantor:</p>
            <p class="font-semibold text-[#f7623b]">${guarantorEmailFromState}</p>
          `,
            icon: "success",
            confirmButtonColor: "#f7623b",
            confirmButtonText: "Send Link to Guarantor",
            showCancelButton: false,
            allowOutsideClick: false,
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                // Request guarantor link
                const guarantorResponse = await fetch("https://web-production-9f730.up.railway.app/api/guarantor/request", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  // body: JSON.stringify({
                  //   customerBvn: state?.bvn,
                  //   customerFirstName: state?.firstName,
                  //   customerLastName: state?.lastName,
                  //   customerEmail: state?.customerEmail,
                  //   customerPhone: state?.mobileNumber,
                  //   customerPlan: state?.plan,
                  //   installmentDuration: state?.installmentDuration || state?.omolopeDays,
                  //   guarantorEmail: guarantorEmailFromState,


                    // ✅ ADD ALL PRODUCT AND CUSTOMER DETAILS
                    // productName: state?.productName,
                    // brand: state?.brand,
                    // size: state?.size,
                    // price: state?.price,


                    // // ✅ PRODUCT DETAILS - Use correct field names
                    // productName: state?.productName,
                    // productBrand: state?.brand,      // ✅ Changed from brand
                    // productSize: state?.size,        // ✅ Changed from size
                    // storePrice: state?.totalPrice,   // ✅ Changed from price to totalPrice as BigDecimal



                    // ✅ NEW CODE
                    body: JSON.stringify({
                      customerBvn: state?.bvn,
                      customerFirstName: state?.firstName,
                      customerLastName: state?.lastName,
                      customerEmail: state?.customerEmail,
                      customerPhone: state?.mobileNumber,
                      customerPlan: state?.plan,
                      customerInstallmentDuration: state?.installmentDuration || state?.omolopeDays,
                      guarantorEmail: guarantorEmailFromState,

                      // ✅ Product details
                      productName: state?.productName,
                      brand: state?.brand,      // ✅ Changed from 'brand'
                      size: state?.size,        // ✅ Changed from 'size'
                      price: state?.totalPrice,
                      // productBrand: state?.brand,      // ✅ Changed from 'brand'
                      // productSize: state?.size,        // ✅ Changed from 'size'
                      // storePrice: state?.totalPrice,   // ✅ Use totalPrice, not price
                  }),
                });

                const guarantorData = await guarantorResponse.json();

                if (guarantorData.success) {
                  // ✅ STORE COMPLETE DATA IN WINDOW OBJECT
                  window.customerDataForWaiting = state;

                  Swal.fire({
                    icon: "success",
                    title: "Link Sent!",
                    html: `
                    <p>A verification link has been sent to:</p>
                    <p class="font-semibold text-[#f7623b] my-2">${guarantorEmailFromState}</p>
                    <p class="text-sm text-gray-600">Please wait while your guarantor completes their verification...</p>
                  `,
                    confirmButtonColor: "#f7623b",
                    timer: 3000,
                  }).then(() => {
                    // ✅ NAVIGATE TO WAITING PAGE WITH ALL DATA
                    navigate("/customer-waiting", { state });
                  });
                } else {
                  throw new Error(guarantorData.message || "Failed to send guarantor link");
                }
              } catch (error) {
                Swal.fire({
                  title: "Error",
                  text: error.message || "Failed to send guarantor link. Please try again.",
                  icon: "error",
                  confirmButtonColor: "#f7623b",
                });
              }
            }
          });
        } else {
          // ❌ NO GUARANTOR EMAIL - This shouldn't happen, but handle it
          Swal.fire({
            title: "Error",
            text: "Guarantor email is missing. Please go back and complete the form.",
            icon: "error",
            confirmButtonColor: "#f7623b",
          }).then(() => {
            navigate(-1);
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid OTP code");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Invalid OTP. Please try again.",
        icon: "error",
        confirmButtonColor: "#f7623b",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //
  //   const otpCode = otp.join("");
  //   if (otpCode.length !== 6) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Please enter all 6 digits",
  //       icon: "error",
  //       confirmButtonColor: "#f7623b",
  //     });
  //     return;
  //   }
  //
  //   setIsLoading(true);
  //
  //   try {
  //     const response = await fetch("http://localhost:8080/api/agent-followup/verify-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         bvn: state?.bvn,
  //         otp: otpCode,
  //       }),
  //     });
  //
  //     if (response.ok) {
  //       // Show success and ask for guarantor email
  //       const { value: guarantorEmail } = await Swal.fire({
  //         title: "OTP Verified!",
  //         html: `
  //           <p class="mb-4">Please enter your guarantor's email address.</p>
  //           <p class="text-sm text-gray-600">A link will be sent to them to complete the guarantor form.</p>
  //         `,
  //         input: "email",
  //         inputPlaceholder: "guarantor@example.com",
  //         showCancelButton: false,
  //         confirmButtonColor: "#f7623b",
  //         confirmButtonText: "Send Link to Guarantor",
  //         allowOutsideClick: false,
  //         inputValidator: (value) => {
  //           if (!value) {
  //             return "Please enter guarantor's email";
  //           }
  //           if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
  //             return "Please enter a valid email address";
  //           }
  //         },
  //       });
  //
  //       if (guarantorEmail) {
  //         // Request guarantor
  //         const guarantorResponse = await fetch("http://localhost:8080/api/guarantor/request", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             customerBvn: state?.bvn,
  //             customerFirstName: state?.firstName,
  //             customerLastName: state?.lastName,
  //             customerEmail: state?.email || state?.customerEmail,
  //             customerPlan: state?.plan,
  //             installmentDuration: state?.installmentDuration || state?.omolopeDays,
  //             guarantorEmail: guarantorEmail,
  //           }),
  //         });
  //
  //         const guarantorData = await guarantorResponse.json();
  //
  //         if (guarantorData.success) {
  //
  //           // 1. Get the current data from storage
  //           const currentData = JSON.parse(sessionStorage.getItem("customerData") || "{}");
  //
  //           // 2. Add the guarantor email to it
  //           const finalData = {
  //             ...currentData,
  //             guarantorEmail: guarantorEmail
  //           };
  //
  //           // 3. Save it back to storage
  //           sessionStorage.setItem("customerData", JSON.stringify(finalData));
  //
  //
  //
  //           Swal.fire({
  //             icon: "success",
  //             title: "Link Sent!",
  //             html: `
  //               <p>A verification link has been sent to:</p>
  //               <p class="font-semibold text-[#f7623b] my-2">${guarantorData.guarantorEmail || guarantorEmail}</p>
  //               <p class="text-sm text-gray-600">You will be redirected to a waiting page...</p>
  //             `,
  //             confirmButtonColor: "#f7623b",
  //             timer: 3000,
  //           }).then(() => {
  //             // 4. Pass the final data in state as a backup
  //             navigate("/customer-waiting", { state: finalData });
  //             //navigate("/customer-waiting", { state });
  //           });
  //         } else {
  //           throw new Error(guarantorData.message || "Failed to send guarantor link");
  //         }
  //       }
  //     } else {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(errorData.message || "Invalid OTP code");
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Error",
  //       text: error.message || "Invalid OTP. Please try again.",
  //       icon: "error",
  //       confirmButtonColor: "#f7623b",
  //     });
  //     setOtp(["", "", "", "", "", ""]);
  //     inputRefs.current[0]?.focus();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleResendOtp = () => {
    Swal.fire({
      title: "Resend OTP",
      text: "A new code will be sent to your mobile number",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#f7623b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Resend",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Code Sent!",
          text: "A new verification code has been sent",
          icon: "success",
          confirmButtonColor: "#f7623b",
        });
      }
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#f7623b" }}
    >
      <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#f7623b] mb-6 font-medium hover:opacity-80 transition"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
            Verify OTP
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Enter the 6-digit code sent to your mobile number
          </p>
          {state?.mobileNumber && (
            <p className="text-sm text-gray-500 mt-2">{state.mobileNumber}</p>
          )}
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

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-[#f7623b] transition underline"
              onClick={handleResendOtp}
            >
              Didn't receive the code? Resend
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.some((digit) => !digit)}
            className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "#f7623b" }}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}





















// import React, { useState, useRef } from "react";
// import { ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function OtpVerification() {
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
//           navigate("/guarantor/form/:token", {
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
//             Verify OTP
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400">
//             Enter the 6-digit code sent to your mobile number
//           </p>
//           {state?.mobileNumber && (
//             <p className="text-sm text-gray-500 mt-2">{state.mobileNumber}</p>
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
