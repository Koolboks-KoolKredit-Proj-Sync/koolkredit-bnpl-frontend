// import React, { useState } from "react";
// import { Camera, Upload, ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";
//
// export default function AgentFollowUpForm() {
//   const navigate = useNavigate();
//   const { state: entryData } = useLocation();
//
//   // Form state
//   const [usage, setUsage] = useState("Personal");
//   const [utilityBill, setUtilityBill] = useState(null);
//   const [utilityBillFile, setUtilityBillFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//
//   // Personal fields
//   const [homeAddress, setHomeAddress] = useState("");
//   const [workAddress, setWorkAddress] = useState("");
//   const [monthlyIncome, setMonthlyIncome] = useState("");
//
//   // Commercial fields
//   const [storeAddress, setStoreAddress] = useState("");
//   const [monthlySales, setMonthlySales] = useState("");
//
//   // BVN Mobile Number (editable)
//   const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");
//
//   //EMAIL Addresses
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [guarantorEmail, setGuarantorEmail] = useState("");
//
//   const handleUtilityUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUtilityBill(URL.createObjectURL(file));
//       setUtilityBillFile(file);
//     }
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     if (!entryData?.bvn) {
//       return Swal.fire("Error", "BVN is required", "error");
//     }
//
//     if (!utilityBillFile) {
//       return Swal.fire("Error", "Please upload a utility bill", "error");
//     }
//
//     if (usage === "Personal" && !monthlyIncome) {
//       return Swal.fire("Error", "Monthly Income is required", "error");
//     }
//
//     if (usage === "Commercial" && !monthlySales) {
//       return Swal.fire("Error", "Monthly Sales is required", "error");
//     }
//
//     setIsLoading(true);
//
//     try {
//       const formData = new FormData();
//
//       formData.append("bvn", entryData.bvn);
//       formData.append("nin", entryData.nin || "");
//       formData.append("mobileNumber", mobileNumber);
//       formData.append("usageType", usage.toLowerCase());
//       formData.append("plan", entryData.plan || "");
//       formData.append("installmentOption", entryData.installmentDuration || "");
//       formData.append("homeAddress", homeAddress);
//       formData.append("customerEmail", customerEmail);
//       formData.append("guarantorEmail", guarantorEmail);
//       formData.append("utilityBill", utilityBillFile);
//
//       if (usage === "Personal") {
//         formData.append("workAddress", workAddress);
//         formData.append("monthlyIncome", monthlyIncome);
//         formData.append("storeAddress", "");
//         formData.append("monthlySales", 0);
//       } else {
//         formData.append("storeAddress", storeAddress);
//         formData.append("monthlySales", monthlySales);
//         formData.append("workAddress", "");
//         formData.append("monthlyIncome", 0);
//       }
//
//       const response = await fetch(
//           "http://localhost:8080/api/agent-followup",
//           { method: "POST", body: formData }
//       );
//
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Submission failed");
//       }
//
//       const data = await response.json();
//
//       const finalCustomerData = {
//         ...entryData,
//         mobileNumber,
//         customerEmail,
//         guarantorEmail,
//         homeAddress,
//         usageType: usage.toLowerCase(),
//         workAddress: usage === "Personal" ? workAddress : "",
//         storeAddress: usage === "Commercial" ? storeAddress : "",
//         monthlyIncome: usage === "Personal" ? monthlyIncome : "",
//         monthlySales: usage === "Commercial" ? monthlySales : "",
//       };
//
//       // Store globally for next forms
//       window.agentEntryData = entryData;
//       window.agentFollowUpData = finalCustomerData;
//       window.guarantorFormData = finalCustomerData;
//
//       Swal.fire("Success!", data?.message || "Submitted successfully", "success")
//           .then(() => {
//             if (data?.otpSent) {
//               navigate("/customer-otp", { state: finalCustomerData });
//             } else {
//               navigate(-1);
//             }
//           });
//
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//       <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>
//
//         <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
//           Agent Follow-Up Form
//         </h1>
//         <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
//           Complete follow-up details for the agent entry
//         </p>
//
//         <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//           {/* Verification Details Section */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
//               Verification Details
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
//                 <input
//                   type="text"
//                   value={entryData?.bvn || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
//                 <input
//                   type="text"
//                   value={entryData?.nin || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number</label>
//                 <input
//                   type="text"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Your Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="youremail@something.com"
//                   value={customerEmail}
//                   onChange={(e) => setCustomerEmail(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               {entryData?.passportPreview && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
//                   <img
//                     src={entryData.passportPreview}
//                     alt="Passport"
//                     className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//
//           {/* Plan & Installment */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
//                 <input
//                   type="text"
//                   value={entryData?.plan || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
//                 <input
//                   type="text"
//                   value={entryData?.installmentDuration || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//             </div>
//           </div>
//
//           {/* Product Usage */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
//             <select
//               value={usage}
//               onChange={(e) => setUsage(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//             >
//               <option value="Personal">Personal</option>
//               <option value="Commercial">Commercial</option>
//             </select>
//           </div>
//
//           {/* Conditional Fields */}
//           {usage === "Personal" && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Home Address"
//                     value={homeAddress}
//                     onChange={(e) => setHomeAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Work Address"
//                     value={workAddress}
//                     onChange={(e) => setWorkAddress(e.target.value)}
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Monthly Gross Income"
//                     value={monthlyIncome}
//                     onChange={(e) => setMonthlyIncome(e.target.value)}
//                     required
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="guarantor@example.com"
//                     value={guarantorEmail}
//                     onChange={(e) => setGuarantorEmail(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//
//           {usage === "Commercial" && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Home Address"
//                     value={homeAddress}
//                     onChange={(e) => setHomeAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Store Address"
//                     value={storeAddress}
//                     onChange={(e) => setStoreAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Monthly Sales"
//                     value={monthlySales}
//                     onChange={(e) => setMonthlySales(e.target.value)}
//                     required
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="guarantor@example.com"
//                     value={guarantorEmail}
//                     onChange={(e) => setGuarantorEmail(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//
//           {/* Utility Bill Upload */}
//           <div className="pb-4 sm:pb-6">
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
//             <div className="flex items-center gap-3">
//               <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                 <Upload size={18} /> Upload
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleUtilityUpload}
//                   className="hidden"
//                 />
//               </label>
//               <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                 <Camera size={18} /> Snap
//                 <input
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   onChange={handleUtilityUpload}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//             {utilityBill && (
//               <img
//                 src={utilityBill}
//                 alt="Utility Bill"
//                 className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
//               />
//             )}
//           </div>
//
//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//             style={{ backgroundColor: '#f7623b' }}
//           >
//             {isLoading ? "Submitting..." : "Submit Follow-Up"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }





// import React, { useState } from "react";
// import { Camera, Upload, ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";
//
// export default function AgentFollowUpForm() {
//   const navigate = useNavigate();
//   const { state: entryData } = useLocation();
//
//   // Form state
//   const [usage, setUsage] = useState("Personal");
//   const [utilityBill, setUtilityBill] = useState(null);
//   const [utilityBillFile, setUtilityBillFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//
//   // Personal fields
//   const [homeAddress, setHomeAddress] = useState("");
//   const [workAddress, setWorkAddress] = useState("");
//   const [monthlyIncome, setMonthlyIncome] = useState("");
//
//   // Commercial fields
//   const [storeAddress, setStoreAddress] = useState("");
//   const [monthlySales, setMonthlySales] = useState("");
//
//   // BVN Mobile Number (editable)
//   const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");
//
//   //EMAIL Addresses
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [guarantorEmail, setGuarantorEmail] = useState("");
//
//   const BACKEND_API_URL = 'http://localhost:8080'; // Update with your backend URL
//
//   const handleUtilityUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUtilityBill(URL.createObjectURL(file));
//       setUtilityBillFile(file);
//     }
//   };
//
//   // Function to update DebitMandate with customer details
//   const updateDebitMandateCustomerDetails = async () => {
//     // Only update if we have a mandate ID from the previous step
//     if (!entryData?.mandateId) {
//       console.log("No mandate ID found, skipping DebitMandate update");
//       return;
//     }
//
//     try {
//       const payload = {
//         bvn: entryData.bvn,
//         customerAddress: homeAddress,
//         customerEmail: customerEmail,
//         customerPhone: mobileNumber
//       };
//
//       console.log('Updating DebitMandate with:', payload);
//
//       const response = await fetch(
//           `${BACKEND_API_URL}/api/debit-mandate/customer-details/${entryData.mandateId}`,
//           {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload)
//           }
//       );
//
//       const data = await response.json();
//
//       if (!response.ok || !data.success) {
//         console.error('Failed to update DebitMandate:', data.message);
//         // Don't throw error - just log it, as this is a secondary operation
//       } else {
//         console.log('DebitMandate updated successfully:', data);
//       }
//     } catch (error) {
//       console.error('Error updating DebitMandate:', error);
//       // Don't throw error - just log it, as this is a secondary operation
//     }
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     if (!entryData?.bvn) {
//       return Swal.fire("Error", "BVN is required", "error");
//     }
//
//     if (!utilityBillFile) {
//       return Swal.fire("Error", "Please upload a utility bill", "error");
//     }
//
//     if (usage === "Personal" && !monthlyIncome) {
//       return Swal.fire("Error", "Monthly Income is required", "error");
//     }
//
//     if (usage === "Commercial" && !monthlySales) {
//       return Swal.fire("Error", "Monthly Sales is required", "error");
//     }
//
//     setIsLoading(true);
//
//     try {
//       const formData = new FormData();
//
//       formData.append("bvn", entryData.bvn);
//       formData.append("nin", entryData.nin || "");
//       formData.append("mobileNumber", mobileNumber);
//       formData.append("usageType", usage.toLowerCase());
//       formData.append("plan", entryData.plan || "");
//       formData.append("installmentOption", entryData.installmentDuration || "");
//       formData.append("homeAddress", homeAddress);
//       formData.append("customerEmail", customerEmail);
//       formData.append("guarantorEmail", guarantorEmail);
//       formData.append("utilityBill", utilityBillFile);
//
//       if (usage === "Personal") {
//         formData.append("workAddress", workAddress);
//         formData.append("monthlyIncome", monthlyIncome);
//         formData.append("storeAddress", "");
//         formData.append("monthlySales", 0);
//       } else {
//         formData.append("storeAddress", storeAddress);
//         formData.append("monthlySales", monthlySales);
//         formData.append("workAddress", "");
//         formData.append("monthlyIncome", 0);
//       }
//
//       // Submit the agent follow-up form
//       const response = await fetch(
//           "http://localhost:8080/api/agent-followup",
//           { method: "POST", body: formData }
//       );
//
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Submission failed");
//       }
//
//       const data = await response.json();
//
//       // Update DebitMandate with customer details (non-blocking)
//       await updateDebitMandateCustomerDetails();
//
//       const finalCustomerData = {
//         ...entryData,
//         mobileNumber,
//         customerEmail,
//         guarantorEmail,
//         homeAddress,
//         usageType: usage.toLowerCase(),
//         workAddress: usage === "Personal" ? workAddress : "",
//         storeAddress: usage === "Commercial" ? storeAddress : "",
//         monthlyIncome: usage === "Personal" ? monthlyIncome : "",
//         monthlySales: usage === "Commercial" ? monthlySales : "",
//       };
//
//       // Store globally for next forms
//       window.agentEntryData = entryData;
//       window.agentFollowUpData = finalCustomerData;
//       window.guarantorFormData = finalCustomerData;
//
//       Swal.fire("Success!", data?.message || "Submitted successfully", "success")
//           .then(() => {
//             if (data?.otpSent) {
//               navigate("/customer-otp", { state: finalCustomerData });
//             } else {
//               navigate(-1);
//             }
//           });
//
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   return (
//       <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//         <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//           <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
//           >
//             <ArrowLeft className="mr-2" /> Back
//           </button>
//
//           <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
//             Agent Follow-Up Form
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
//             Complete follow-up details for the agent entry
//           </p>
//
//           <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//             {/* Verification Details Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
//                 Verification Details
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
//                   <input
//                       type="text"
//                       value={entryData?.bvn || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
//                   <input
//                       type="text"
//                       value={entryData?.nin || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number *</label>
//                   <input
//                       type="text"
//                       value={mobileNumber}
//                       onChange={(e) => setMobileNumber(e.target.value)}
//                       required
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Your Email *</label>
//                   <input
//                       type="email"
//                       name="email"
//                       placeholder="youremail@something.com"
//                       value={customerEmail}
//                       onChange={(e) => setCustomerEmail(e.target.value)}
//                       required
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 {entryData?.passportPreview && (
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
//                       <img
//                           src={entryData.passportPreview}
//                           alt="Passport"
//                           className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
//                       />
//                     </div>
//                 )}
//               </div>
//             </div>
//
//             {/* Plan & Installment */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
//                   <input
//                       type="text"
//                       value={entryData?.plan || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
//                   <input
//                       type="text"
//                       value={entryData?.installmentDuration || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//
//             {/* Product Usage */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
//               <select
//                   value={usage}
//                   onChange={(e) => setUsage(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//               >
//                 <option value="Personal">Personal</option>
//                 <option value="Commercial">Commercial</option>
//               </select>
//             </div>
//
//             {/* Conditional Fields */}
//             {usage === "Personal" && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Home Address"
//                           value={homeAddress}
//                           onChange={(e) => setHomeAddress(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Work Address"
//                           value={workAddress}
//                           onChange={(e) => setWorkAddress(e.target.value)}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
//                       <input
//                           type="number"
//                           placeholder="Enter Monthly Gross Income"
//                           value={monthlyIncome}
//                           onChange={(e) => setMonthlyIncome(e.target.value)}
//                           required
//                           min="0"
//                           step="0.01"
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                       <input
//                           type="email"
//                           name="email"
//                           placeholder="guarantor@example.com"
//                           value={guarantorEmail}
//                           onChange={(e) => setGuarantorEmail(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {usage === "Commercial" && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Home Address"
//                           value={homeAddress}
//                           onChange={(e) => setHomeAddress(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Store Address"
//                           value={storeAddress}
//                           onChange={(e) => setStoreAddress(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
//                       <input
//                           type="number"
//                           placeholder="Enter Monthly Sales"
//                           value={monthlySales}
//                           onChange={(e) => setMonthlySales(e.target.value)}
//                           required
//                           min="0"
//                           step="0.01"
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                       <input
//                           type="email"
//                           name="email"
//                           placeholder="guarantor@example.com"
//                           value={guarantorEmail}
//                           onChange={(e) => setGuarantorEmail(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {/* Utility Bill Upload */}
//             <div className="pb-4 sm:pb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
//               <div className="flex items-center gap-3">
//                 <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                   <Upload size={18} /> Upload
//                   <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleUtilityUpload}
//                       className="hidden"
//                   />
//                 </label>
//                 <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                   <Camera size={18} /> Snap
//                   <input
//                       type="file"
//                       accept="image/*"
//                       capture="environment"
//                       onChange={handleUtilityUpload}
//                       className="hidden"
//                   />
//                 </label>
//               </div>
//               {utilityBill && (
//                   <img
//                       src={utilityBill}
//                       alt="Utility Bill"
//                       className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
//                   />
//               )}
//             </div>
//
//             {/* Submit */}
//             <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//                 style={{ backgroundColor: '#f7623b' }}
//             >
//               {isLoading ? "Submitting..." : "Submit Follow-Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//   );
// }














// import React, { useState } from "react";
// import { Camera, Upload, ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";
//
// export default function AgentFollowUpForm() {
//   const navigate = useNavigate();
//   const { state: entryData } = useLocation();
//
//   // Form state
//   const [usage, setUsage] = useState("Personal");
//   const [utilityBill, setUtilityBill] = useState(null);
//   const [utilityBillFile, setUtilityBillFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//
//   // Personal fields
//   const [homeAddress, setHomeAddress] = useState("");
//   const [workAddress, setWorkAddress] = useState("");
//   const [monthlyIncome, setMonthlyIncome] = useState("");
//
//   // Commercial fields
//   const [storeAddress, setStoreAddress] = useState("");
//   const [monthlySales, setMonthlySales] = useState("");
//
//   // BVN Mobile Number (editable)
//   const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");
//
//   //EMAIL Addresses
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [guarantorEmail, setGuarantorEmail] = useState("");
//
//   const BACKEND_API_URL = 'http://localhost:8080'; // Update with your backend URL
//
//   const handleUtilityUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUtilityBill(URL.createObjectURL(file));
//       setUtilityBillFile(file);
//     }
//   };
//
//   // Function to update DebitMandate with customer details
//   const updateDebitMandateCustomerDetails = async () => {
//     // Only update if we have a mandate reference from the previous step
//     if (!entryData?.mandateReference) {
//       console.log("No mandate reference found, skipping DebitMandate update");
//       return;
//     }
//
//     try {
//       const payload = {
//         bvn: entryData.bvn,
//         customerAddress: homeAddress,
//         customerEmail: customerEmail,
//         customerPhone: mobileNumber
//       };
//
//       console.log('Updating DebitMandate with:', payload);
//
//       const response = await fetch(
//           `${BACKEND_API_URL}/api/debit-mandate/customer-details/reference/${entryData.mandateReference}`,
//           {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload)
//           }
//       );
//
//       const data = await response.json();
//
//       if (!response.ok || !data.success) {
//         console.error('Failed to update DebitMandate:', data.message);
//         // Don't throw error - just log it, as this is a secondary operation
//       } else {
//         console.log('DebitMandate updated successfully:', data);
//       }
//     } catch (error) {
//       console.error('Error updating DebitMandate:', error);
//       // Don't throw error - just log it, as this is a secondary operation
//     }
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     if (!entryData?.bvn) {
//       return Swal.fire("Error", "BVN is required", "error");
//     }
//
//     if (!utilityBillFile) {
//       return Swal.fire("Error", "Please upload a utility bill", "error");
//     }
//
//     if (usage === "Personal" && !monthlyIncome) {
//       return Swal.fire("Error", "Monthly Income is required", "error");
//     }
//
//     if (usage === "Commercial" && !monthlySales) {
//       return Swal.fire("Error", "Monthly Sales is required", "error");
//     }
//
//     setIsLoading(true);
//
//     try {
//       const formData = new FormData();
//
//       formData.append("bvn", entryData.bvn);
//       formData.append("nin", entryData.nin || "");
//       formData.append("mobileNumber", mobileNumber);
//       formData.append("usageType", usage.toLowerCase());
//       formData.append("plan", entryData.plan || "");
//       formData.append("installmentOption", entryData.installmentDuration || "");
//       formData.append("homeAddress", homeAddress);
//       formData.append("customerEmail", customerEmail);
//       formData.append("guarantorEmail", guarantorEmail);
//       formData.append("utilityBill", utilityBillFile);
//
//       if (usage === "Personal") {
//         formData.append("workAddress", workAddress);
//         formData.append("monthlyIncome", monthlyIncome);
//         formData.append("storeAddress", "");
//         formData.append("monthlySales", 0);
//       } else {
//         formData.append("storeAddress", storeAddress);
//         formData.append("monthlySales", monthlySales);
//         formData.append("workAddress", "");
//         formData.append("monthlyIncome", 0);
//       }
//
//       // Submit the agent follow-up form
//       const response = await fetch(
//           "http://localhost:8080/api/agent-followup",
//           { method: "POST", body: formData }
//       );
//
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Submission failed");
//       }
//
//       const data = await response.json();
//
//       // Update DebitMandate with customer details (non-blocking)
//       await updateDebitMandateCustomerDetails();
//
//       const finalCustomerData = {
//         ...entryData,
//         mobileNumber,
//         customerEmail,
//         guarantorEmail,
//         homeAddress,
//         usageType: usage.toLowerCase(),
//         workAddress: usage === "Personal" ? workAddress : "",
//         storeAddress: usage === "Commercial" ? storeAddress : "",
//         monthlyIncome: usage === "Personal" ? monthlyIncome : "",
//         monthlySales: usage === "Commercial" ? monthlySales : "",
//       };
//
//       // Store globally for next forms
//       window.agentEntryData = entryData;
//       window.agentFollowUpData = finalCustomerData;
//       window.guarantorFormData = finalCustomerData;
//
//       Swal.fire("Success!", data?.message || "Submitted successfully", "success")
//           .then(() => {
//             if (data?.otpSent) {
//               navigate("/customer-otp", { state: finalCustomerData });
//             } else {
//               navigate(-1);
//             }
//           });
//
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   return (
//       <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//         <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//           <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
//           >
//             <ArrowLeft className="mr-2" /> Back
//           </button>
//
//           <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
//             Agent Follow-Up Form
//           </h1>
//           <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
//             Complete follow-up details for the agent entry
//           </p>
//
//           <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//             {/* Verification Details Section */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
//                 Verification Details
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
//                   <input
//                       type="text"
//                       value={entryData?.bvn || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
//                   <input
//                       type="text"
//                       value={entryData?.nin || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number *</label>
//                   <input
//                       type="text"
//                       value={mobileNumber}
//                       onChange={(e) => setMobileNumber(e.target.value)}
//                       required
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Your Email *</label>
//                   <input
//                       type="email"
//                       name="email"
//                       placeholder="youremail@something.com"
//                       value={customerEmail}
//                       onChange={(e) => setCustomerEmail(e.target.value)}
//                       required
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 {entryData?.passportPreview && (
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
//                       <img
//                           src={entryData.passportPreview}
//                           alt="Passport"
//                           className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
//                       />
//                     </div>
//                 )}
//               </div>
//             </div>
//
//             {/* Plan & Installment */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
//                   <input
//                       type="text"
//                       value={entryData?.plan || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
//                   <input
//                       type="text"
//                       value={entryData?.installmentDuration || ""}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//
//             {/* Product Usage */}
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
//               <select
//                   value={usage}
//                   onChange={(e) => setUsage(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//               >
//                 <option value="Personal">Personal</option>
//                 <option value="Commercial">Commercial</option>
//               </select>
//             </div>
//
//             {/* Conditional Fields */}
//             {usage === "Personal" && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Home Address"
//                           value={homeAddress}
//                           onChange={(e) => setHomeAddress(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Work Address"
//                           value={workAddress}
//                           onChange={(e) => setWorkAddress(e.target.value)}
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
//                       <input
//                           type="number"
//                           placeholder="Enter Monthly Gross Income"
//                           value={monthlyIncome}
//                           onChange={(e) => setMonthlyIncome(e.target.value)}
//                           required
//                           min="0"
//                           step="0.01"
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                       <input
//                           type="email"
//                           name="email"
//                           placeholder="guarantor@example.com"
//                           value={guarantorEmail}
//                           onChange={(e) => setGuarantorEmail(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {usage === "Commercial" && (
//                 <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                   <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Home Address"
//                           value={homeAddress}
//                           onChange={(e) => setHomeAddress(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
//                       <input
//                           type="text"
//                           placeholder="Enter Store Address"
//                           value={storeAddress}
//                           onChange={(e) => setStoreAddress(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
//                       <input
//                           type="number"
//                           placeholder="Enter Monthly Sales"
//                           value={monthlySales}
//                           onChange={(e) => setMonthlySales(e.target.value)}
//                           required
//                           min="0"
//                           step="0.01"
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                       <input
//                           type="email"
//                           name="email"
//                           placeholder="guarantor@example.com"
//                           value={guarantorEmail}
//                           onChange={(e) => setGuarantorEmail(e.target.value)}
//                           required
//                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                       />
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {/* Utility Bill Upload */}
//             <div className="pb-4 sm:pb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
//               <div className="flex items-center gap-3">
//                 <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                   <Upload size={18} /> Upload
//                   <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleUtilityUpload}
//                       className="hidden"
//                   />
//                 </label>
//                 <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                   <Camera size={18} /> Snap
//                   <input
//                       type="file"
//                       accept="image/*"
//                       capture="environment"
//                       onChange={handleUtilityUpload}
//                       className="hidden"
//                   />
//                 </label>
//               </div>
//               {utilityBill && (
//                   <img
//                       src={utilityBill}
//                       alt="Utility Bill"
//                       className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
//                   />
//               )}
//             </div>
//
//             {/* Submit */}
//             <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//                 style={{ backgroundColor: '#f7623b' }}
//             >
//               {isLoading ? "Submitting..." : "Submit Follow-Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//   );
// }





















// import React, { useState } from "react";
// import { Camera, Upload, ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";
//
// export default function AgentFollowUpForm() {
//     const navigate = useNavigate();
//     const { state: entryData } = useLocation();
//
//     // Form state
//     const [usage, setUsage] = useState("Personal");
//     const [utilityBill, setUtilityBill] = useState(null);
//     const [utilityBillFile, setUtilityBillFile] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//
//     // Personal fields
//     const [homeAddress, setHomeAddress] = useState("");
//     const [workAddress, setWorkAddress] = useState("");
//     const [monthlyIncome, setMonthlyIncome] = useState("");
//
//     // Commercial fields
//     const [storeAddress, setStoreAddress] = useState("");
//     const [monthlySales, setMonthlySales] = useState("");
//
//     // BVN Mobile Number (editable)
//     const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");
//
//     //EMAIL Addresses
//     const [customerEmail, setCustomerEmail] = useState("");
//     const [guarantorEmail, setGuarantorEmail] = useState("");
//
//     const BACKEND_API_URL = 'http://localhost:8080'; // Update with your backend URL
//
//     const handleUtilityUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setUtilityBill(URL.createObjectURL(file));
//             setUtilityBillFile(file);
//         }
//     };
//
//     // Function to update DebitMandate with customer details and create Mono customer
//     const updateDebitMandateCustomerDetails = async () => {
//         // Only update if we have a mandate reference from the previous step
//         if (!entryData?.mandateReference) {
//             console.log("No mandate reference found, skipping DebitMandate update");
//             return;
//         }
//
//         try {
//             const payload = {
//                 bvn: entryData.bvn,
//                 customerAddress: homeAddress,
//                 customerEmail: customerEmail,
//                 customerPhone: mobileNumber,
//                 firstName: entryData.firstName || "",  // From entryData
//                 lastName: entryData.lastName || ""     // From entryData
//             };
//
//             console.log('Updating DebitMandate with Mono customer creation:', payload);
//
//             const response = await fetch(
//                 `${BACKEND_API_URL}/api/debit-mandate/customer-details/reference/${entryData.mandateReference}`,
//                 {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(payload)
//                 }
//             );
//
//             const data = await response.json();
//
//             if (!response.ok || !data.success) {
//                 console.error('Failed to update DebitMandate:', data.message);
//                 // Don't throw error - just log it, as this is a secondary operation
//             } else {
//                 console.log('DebitMandate updated successfully:', data);
//
//                 // Log Mono customer ID if created
//                 if (data.data?.monoCustomerId) {
//                     console.log('Mono customer ID created:', data.data.monoCustomerId);
//                 }
//
//                 // Show warning if Mono creation failed
//                 if (data.warning) {
//                     console.warn('Mono warning:', data.warning);
//                 }
//             }
//         } catch (error) {
//             console.error('Error updating DebitMandate:', error);
//             // Don't throw error - just log it, as this is a secondary operation
//         }
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         if (!entryData?.bvn) {
//             return Swal.fire("Error", "BVN is required", "error");
//         }
//
//         if (!utilityBillFile) {
//             return Swal.fire("Error", "Please upload a utility bill", "error");
//         }
//
//         if (usage === "Personal" && !monthlyIncome) {
//             return Swal.fire("Error", "Monthly Income is required", "error");
//         }
//
//         if (usage === "Commercial" && !monthlySales) {
//             return Swal.fire("Error", "Monthly Sales is required", "error");
//         }
//
//         // Validate that firstName and lastName exist in entryData
//         if (!entryData?.firstName || !entryData?.lastName) {
//             return Swal.fire("Error", "Customer name information is missing. Please go back and complete the previous form.", "error");
//         }
//
//         setIsLoading(true);
//
//         try {
//             const formData = new FormData();
//
//             formData.append("bvn", entryData.bvn);
//             formData.append("nin", entryData.nin || "");
//             formData.append("mobileNumber", mobileNumber);
//             formData.append("usageType", usage.toLowerCase());
//             formData.append("plan", entryData.plan || "");
//             formData.append("installmentOption", entryData.installmentDuration || "");
//             formData.append("homeAddress", homeAddress);
//             formData.append("customerEmail", customerEmail);
//             formData.append("guarantorEmail", guarantorEmail);
//             formData.append("utilityBill", utilityBillFile);
//
//             if (usage === "Personal") {
//                 formData.append("workAddress", workAddress);
//                 formData.append("monthlyIncome", monthlyIncome);
//                 formData.append("storeAddress", "");
//                 formData.append("monthlySales", 0);
//             } else {
//                 formData.append("storeAddress", storeAddress);
//                 formData.append("monthlySales", monthlySales);
//                 formData.append("workAddress", "");
//                 formData.append("monthlyIncome", 0);
//             }
//
//             // Submit the agent follow-up form
//             const response = await fetch(
//                 "http://localhost:8080/api/agent-followup",
//                 { method: "POST", body: formData }
//             );
//
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(errorText || "Submission failed");
//             }
//
//             const data = await response.json();
//
//             // Update DebitMandate with customer details and create Mono customer (non-blocking)
//             await updateDebitMandateCustomerDetails();
//
//             const finalCustomerData = {
//                 ...entryData,
//                 mobileNumber,
//                 customerEmail,
//                 guarantorEmail,
//                 homeAddress,
//                 usageType: usage.toLowerCase(),
//                 workAddress: usage === "Personal" ? workAddress : "",
//                 storeAddress: usage === "Commercial" ? storeAddress : "",
//                 monthlyIncome: usage === "Personal" ? monthlyIncome : "",
//                 monthlySales: usage === "Commercial" ? monthlySales : "",
//             };
//
//             // Store globally for next forms
//             window.agentEntryData = entryData;
//             window.agentFollowUpData = finalCustomerData;
//             window.guarantorFormData = finalCustomerData;
//
//             Swal.fire("Success!", data?.message || "Submitted successfully", "success")
//                 .then(() => {
//                     if (data?.otpSent) {
//                         navigate("/customer-otp", { state: finalCustomerData });
//                     } else {
//                         navigate(-1);
//                     }
//                 });
//
//         } catch (error) {
//             Swal.fire("Error", error.message, "error");
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
//                 >
//                     <ArrowLeft className="mr-2" /> Back
//                 </button>
//
//                 <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
//                     Agent Follow-Up Form
//                 </h1>
//                 <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
//                     Complete follow-up details for the agent entry
//                 </p>
//
//                 <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//                     {/* Verification Details Section */}
//                     <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
//                             Verification Details
//                         </h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.bvn || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.nin || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number *</label>
//                                 <input
//                                     type="text"
//                                     value={mobileNumber}
//                                     onChange={(e) => setMobileNumber(e.target.value)}
//                                     required
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Your Email *</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     placeholder="youremail@something.com"
//                                     value={customerEmail}
//                                     onChange={(e) => setCustomerEmail(e.target.value)}
//                                     required
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             {entryData?.passportPreview && (
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
//                                     <img
//                                         src={entryData.passportPreview}
//                                         alt="Passport"
//                                         className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Plan & Installment */}
//                     <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.plan || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.installmentDuration || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Product Usage */}
//                     <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
//                         <select
//                             value={usage}
//                             onChange={(e) => setUsage(e.target.value)}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                         >
//                             <option value="Personal">Personal</option>
//                             <option value="Commercial">Commercial</option>
//                         </select>
//                     </div>
//
//                     {/* Conditional Fields */}
//                     {usage === "Personal" && (
//                         <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Home Address"
//                                         value={homeAddress}
//                                         onChange={(e) => setHomeAddress(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Work Address"
//                                         value={workAddress}
//                                         onChange={(e) => setWorkAddress(e.target.value)}
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
//                                     <input
//                                         type="number"
//                                         placeholder="Enter Monthly Gross Income"
//                                         value={monthlyIncome}
//                                         onChange={(e) => setMonthlyIncome(e.target.value)}
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         placeholder="guarantor@example.com"
//                                         value={guarantorEmail}
//                                         onChange={(e) => setGuarantorEmail(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {usage === "Commercial" && (
//                         <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Home Address"
//                                         value={homeAddress}
//                                         onChange={(e) => setHomeAddress(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Store Address"
//                                         value={storeAddress}
//                                         onChange={(e) => setStoreAddress(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
//                                     <input
//                                         type="number"
//                                         placeholder="Enter Monthly Sales"
//                                         value={monthlySales}
//                                         onChange={(e) => setMonthlySales(e.target.value)}
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         placeholder="guarantor@example.com"
//                                         value={guarantorEmail}
//                                         onChange={(e) => setGuarantorEmail(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Utility Bill Upload */}
//                     <div className="pb-4 sm:pb-6">
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
//                         <div className="flex items-center gap-3">
//                             <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                                 <Upload size={18} /> Upload
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleUtilityUpload}
//                                     className="hidden"
//                                 />
//                             </label>
//                             <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                                 <Camera size={18} /> Snap
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     capture="environment"
//                                     onChange={handleUtilityUpload}
//                                     className="hidden"
//                                 />
//                             </label>
//                         </div>
//                         {utilityBill && (
//                             <img
//                                 src={utilityBill}
//                                 alt="Utility Bill"
//                                 className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
//                             />
//                         )}
//                     </div>
//
//                     {/* Submit */}
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//                         style={{ backgroundColor: '#f7623b' }}
//                     >
//                         {isLoading ? "Submitting..." : "Submit Follow-Up"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }
//



// import React, { useState } from "react";
// import { Camera, Upload, ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";
//
// export default function AgentFollowUpForm() {
//     const navigate = useNavigate();
//     const { state: entryData } = useLocation();
//
//     // Form state
//     const [usage, setUsage] = useState("Personal");
//     const [utilityBill, setUtilityBill] = useState(null);
//     const [utilityBillFile, setUtilityBillFile] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//
//     // Personal fields
//     const [homeAddress, setHomeAddress] = useState("");
//     const [workAddress, setWorkAddress] = useState("");
//     const [monthlyIncome, setMonthlyIncome] = useState("");
//
//     // Commercial fields
//     const [storeAddress, setStoreAddress] = useState("");
//     const [monthlySales, setMonthlySales] = useState("");
//
//     // BVN Mobile Number (editable)
//     const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");
//
//     //EMAIL Addresses
//     const [customerEmail, setCustomerEmail] = useState("");
//     const [guarantorEmail, setGuarantorEmail] = useState("");
//
//     const BACKEND_API_URL = 'http://localhost:8080';
//
//     const handleUtilityUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setUtilityBill(URL.createObjectURL(file));
//             setUtilityBillFile(file);
//         }
//     };
//
//     // Function to update DebitMandate with customer details and create Mono customer
//     const updateDebitMandateCustomerDetails = async () => {
//         // Only update if we have a mandate reference from the previous step
//         if (!entryData?.mandateReference) {
//             console.log("No mandate reference found, skipping DebitMandate update");
//             return;
//         }
//
//         try {
//             const payload = {
//                 bvn: entryData.bvn,
//                 customerAddress: homeAddress,
//                 customerEmail: customerEmail,
//                 customerPhone: mobileNumber,
//                 firstName: entryData.firstName || "",
//                 lastName: entryData.lastName || ""
//             };
//
//             console.log('Updating DebitMandate with Mono customer creation:', payload);
//
//             const response = await fetch(
//                 `${BACKEND_API_URL}/api/debit-mandate/customer-details/reference/${entryData.mandateReference}`,
//                 {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(payload)
//                 }
//             );
//
//             const data = await response.json();
//
//             if (!response.ok || !data.success) {
//                 console.error('Failed to update DebitMandate:', data.message);
//             } else {
//                 console.log('DebitMandate updated successfully:', data);
//
//                 if (data.data?.monoCustomerId) {
//                     console.log('Mono customer ID created:', data.data.monoCustomerId);
//                 }
//
//                 if (data.warning) {
//                     console.warn('Mono warning:', data.warning);
//                 }
//             }
//         } catch (error) {
//             console.error('Error updating DebitMandate:', error);
//         }
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         if (!entryData?.bvn) {
//             return Swal.fire("Error", "BVN is required", "error");
//         }
//
//         if (!utilityBillFile) {
//             return Swal.fire("Error", "Please upload a utility bill", "error");
//         }
//
//         if (usage === "Personal" && !monthlyIncome) {
//             return Swal.fire("Error", "Monthly Income is required", "error");
//         }
//
//         if (usage === "Commercial" && !monthlySales) {
//             return Swal.fire("Error", "Monthly Sales is required", "error");
//         }
//
//         // Validate that firstName and lastName exist in entryData
//         if (!entryData?.firstName || !entryData?.lastName) {
//             return Swal.fire("Error", "Customer name information is missing. Please go back and complete the previous form.", "error");
//         }
//
//         setIsLoading(true);
//
//         try {
//             const formData = new FormData();
//
//             formData.append("bvn", entryData.bvn);
//             formData.append("nin", entryData.nin || "");
//             formData.append("mobileNumber", mobileNumber);
//             formData.append("usageType", usage.toLowerCase());
//             formData.append("plan", entryData.plan || "");
//             formData.append("installmentOption", entryData.installmentDuration || "");
//             formData.append("homeAddress", homeAddress);
//             formData.append("customerEmail", customerEmail);
//             formData.append("guarantorEmail", guarantorEmail);
//             formData.append("utilityBill", utilityBillFile);
//
//             if (usage === "Personal") {
//                 formData.append("workAddress", workAddress);
//                 formData.append("monthlyIncome", monthlyIncome);
//                 formData.append("storeAddress", "");
//                 formData.append("monthlySales", 0);
//             } else {
//                 formData.append("storeAddress", storeAddress);
//                 formData.append("monthlySales", monthlySales);
//                 formData.append("workAddress", "");
//                 formData.append("monthlyIncome", 0);
//             }
//
//             // Submit the agent follow-up form
//             const response = await fetch(
//                 "http://localhost:8080/api/agent-followup",
//                 { method: "POST", body: formData }
//             );
//
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(errorText || "Submission failed");
//             }
//
//             const data = await response.json();
//
//             // Update DebitMandate with customer details and create Mono customer (non-blocking)
//             await updateDebitMandateCustomerDetails();
//
//             const finalCustomerData = {
//                 ...entryData,
//                 mobileNumber,
//                 customerEmail,
//                 guarantorEmail,
//                 homeAddress,
//                 usageType: usage.toLowerCase(),
//                 workAddress: usage === "Personal" ? workAddress : "",
//                 storeAddress: usage === "Commercial" ? storeAddress : "",
//                 monthlyIncome: usage === "Personal" ? monthlyIncome : "",
//                 monthlySales: usage === "Commercial" ? monthlySales : "",
//             };
//
//             // Store globally for next forms
//             window.agentEntryData = entryData;
//             window.agentFollowUpData = finalCustomerData;
//             window.guarantorFormData = finalCustomerData;
//
//             Swal.fire("Success!", data?.message || "Submitted successfully", "success")
//                 .then(() => {
//                     if (data?.otpSent) {
//                         navigate("/customer-otp", { state: finalCustomerData });
//                     } else {
//                         navigate(-1);
//                     }
//                 });
//
//         } catch (error) {
//             Swal.fire("Error", error.message, "error");
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
//                 >
//                     <ArrowLeft className="mr-2" /> Back
//                 </button>
//
//                 <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
//                     Agent Follow-Up Form
//                 </h1>
//                 <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
//                     Complete follow-up details for the agent entry
//                 </p>
//
//                 <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//                     {/* Verification Details Section */}
//                     <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
//                             Verification Details
//                         </h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.bvn || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.nin || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number *</label>
//                                 <input
//                                     type="text"
//                                     value={mobileNumber}
//                                     onChange={(e) => setMobileNumber(e.target.value)}
//                                     required
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Your Email *</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     placeholder="youremail@something.com"
//                                     value={customerEmail}
//                                     onChange={(e) => setCustomerEmail(e.target.value)}
//                                     required
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             {entryData?.passportPreview && (
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
//                                     <img
//                                         src={entryData.passportPreview}
//                                         alt="Passport"
//                                         className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Plan & Installment */}
//                     <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.plan || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
//                                 <input
//                                     type="text"
//                                     value={entryData?.installmentDuration || ""}
//                                     readOnly
//                                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Product Usage */}
//                     <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
//                         <select
//                             value={usage}
//                             onChange={(e) => setUsage(e.target.value)}
//                             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                         >
//                             <option value="Personal">Personal</option>
//                             <option value="Commercial">Commercial</option>
//                         </select>
//                     </div>
//
//                     {/* Conditional Fields */}
//                     {usage === "Personal" && (
//                         <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Home Address"
//                                         value={homeAddress}
//                                         onChange={(e) => setHomeAddress(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Work Address"
//                                         value={workAddress}
//                                         onChange={(e) => setWorkAddress(e.target.value)}
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
//                                     <input
//                                         type="number"
//                                         placeholder="Enter Monthly Gross Income"
//                                         value={monthlyIncome}
//                                         onChange={(e) => setMonthlyIncome(e.target.value)}
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         placeholder="guarantor@example.com"
//                                         value={guarantorEmail}
//                                         onChange={(e) => setGuarantorEmail(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {usage === "Commercial" && (
//                         <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//                             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Home Address"
//                                         value={homeAddress}
//                                         onChange={(e) => setHomeAddress(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter Store Address"
//                                         value={storeAddress}
//                                         onChange={(e) => setStoreAddress(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
//                                     <input
//                                         type="number"
//                                         placeholder="Enter Monthly Sales"
//                                         value={monthlySales}
//                                         onChange={(e) => setMonthlySales(e.target.value)}
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         placeholder="guarantor@example.com"
//                                         value={guarantorEmail}
//                                         onChange={(e) => setGuarantorEmail(e.target.value)}
//                                         required
//                                         className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Utility Bill Upload */}
//                     <div className="pb-4 sm:pb-6">
//                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
//                         <div className="flex items-center gap-3">
//                             <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                                 <Upload size={18} /> Upload
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleUtilityUpload}
//                                     className="hidden"
//                                 />
//                             </label>
//                             <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                                 <Camera size={18} /> Snap
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     capture="environment"
//                                     onChange={handleUtilityUpload}
//                                     className="hidden"
//                                 />
//                             </label>
//                         </div>
//                         {utilityBill && (
//                             <img
//                                 src={utilityBill}
//                                 alt="Utility Bill"
//                                 className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
//                             />
//                         )}
//                     </div>
//
//                     {/* Submit */}
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//                         style={{ backgroundColor: '#f7623b' }}
//                     >
//                         {isLoading ? "Submitting..." : "Submit Follow-Up"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }
//











// import React, { useState } from "react";
// import { Camera, Upload, ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function AgentFollowUpForm() {
//   const navigate = useNavigate();
//   const { state: entryData } = useLocation();

//   // Form state
//   const [usage, setUsage] = useState("Personal");
//   const [utilityBill, setUtilityBill] = useState(null);
//   const [utilityBillFile, setUtilityBillFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Personal fields
//   const [homeAddress, setHomeAddress] = useState("");
//   const [workAddress, setWorkAddress] = useState("");
//   const [monthlyIncome, setMonthlyIncome] = useState("");

//   // Commercial fields
//   const [storeAddress, setStoreAddress] = useState("");
//   const [monthlySales, setMonthlySales] = useState("");

//   // BVN Mobile Number (editable)
//   const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");

//   const handleUtilityUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUtilityBill(URL.createObjectURL(file));
//       setUtilityBillFile(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!entryData?.bvn) {
//       Swal.fire({
//         title: "Error",
//         text: "BVN is required",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     if (!utilityBillFile) {
//       Swal.fire({
//         title: "Error",
//         text: "Please upload a utility bill",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     if (usage === "Personal" && !monthlyIncome) {
//       Swal.fire({
//         title: "Error",
//         text: "Monthly Gross Income is required for Personal usage",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     if (usage === "Commercial" && !monthlySales) {
//       Swal.fire({
//         title: "Error",
//         text: "Monthly Sales is required for Commercial usage",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Convert file to Base64 for JSON submission
//       const fileToBase64 = (file) => {
//         return new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.readAsDataURL(file);
//           reader.onload = () => resolve(reader.result);
//           reader.onerror = (error) => reject(error);
//         });
//       };

//       const utilityBillBase64 = await fileToBase64(utilityBillFile);

//       // Create JSON payload
//       const payload = {
//         bvn: entryData.bvn,
//         nin: entryData.nin || "",
//         mobileNumber: mobileNumber,
//         usageType: usage.toLowerCase(), // "personal" or "commercial"
//         plan: entryData.plan || "",
//         installmentOption: entryData.installment || "",
//         homeAddress: homeAddress,
//         workAddress: usage === "Personal" ? workAddress : "",
//         storeAddress: usage === "Commercial" ? storeAddress : "",
//         monthlyIncome: usage === "Personal" ? (parseFloat(monthlyIncome) || 0) : null,
//         monthlySales: usage === "Commercial" ? (parseFloat(monthlySales) || 0) : null,
//         utilityBill: utilityBillBase64, // Send as base64 string
//         utilityBillFileName: utilityBillFile.name,
//         utilityBillType: utilityBillFile.type
//       };

//       // Make POST request with JSON
//       const response = await fetch("/api/agent-followup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         // Try to parse JSON, but handle empty responses
//         let data = null;
//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.includes("application/json")) {
//           try {
//             data = await response.json();
//           } catch (e) {
//             // Empty or invalid JSON response - that's okay for success
//             console.log("Response was not JSON, but request succeeded");
//             console.log(e);
//           }
//         }

//         Swal.fire({
//           title: "Success!",
//           text: data?.message || "Follow-up submitted successfully",
//           icon: "success",
//           confirmButtonColor: "#f7623b",
//         }).then(() => {
//           // Check if OTP was sent
//           if (data?.otpSent) {
//             // Navigate to OTP verification page
//             navigate("/otp-verification", {
//               state: {
//                 bvn: entryData.bvn,
//                 mobileNumber: mobileNumber,
//                 ...entryData
//               }
//             });
//           } else {
//             // If no OTP sent (not eligible), go back
//             navigate(-1);
//           }
//         });
//       } else {
//         // Handle error response
//         let errorMessage = "Failed to submit follow-up";
//         const contentType = response.headers.get("content-type");
        
//         if (contentType && contentType.includes("application/json")) {
//           try {
//             const errorData = await response.json();
//             errorMessage = errorData.message || errorMessage;
//           } catch (e) {
//             // Couldn't parse error JSON
//             errorMessage = `Error ${response.status}: ${response.statusText}`;
//             console.log(e);
//           }
//         } else {
//           // Response is not JSON (might be plain text)
//           const textError = await response.text();
//           errorMessage = textError || `Error ${response.status}: ${response.statusText}`;
//         }
        
//         throw new Error(errorMessage);
//       }
//     } catch (error) {
//       console.error("Error submitting follow-up:", error);
//       Swal.fire({
//         title: "Error",
//         text: error.message || "Failed to submit follow-up. Please try again.",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//       <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>

//         <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
//           Agent Follow-Up Form
//         </h1>
//         <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
//           Complete follow-up details for the agent entry
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//           {/* Verification Details Section */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
//               Verification Details
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
//                 <input
//                   type="text"
//                   value={entryData?.bvn || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
//                 <input
//                   type="text"
//                   value={entryData?.nin || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number</label>
//                 <input
//                   type="text"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               {entryData?.passportPreview && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
//                   <img
//                     src={entryData.passportPreview}
//                     alt="Passport"
//                     className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Plan & Installment */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
//                 <input
//                   type="text"
//                   value={entryData?.plan || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
//                 <input
//                   type="text"
//                   value={entryData?.installment || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Product Usage */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
//             <select
//               value={usage}
//               onChange={(e) => setUsage(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//             >
//               <option value="Personal">Personal</option>
//               <option value="Commercial">Commercial</option>
//             </select>
//           </div>

//           {/* Conditional Fields */}
//           {usage === "Personal" && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Home Address"
//                     value={homeAddress}
//                     onChange={(e) => setHomeAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Work Address"
//                     value={workAddress}
//                     onChange={(e) => setWorkAddress(e.target.value)}
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Monthly Gross Income"
//                     value={monthlyIncome}
//                     onChange={(e) => setMonthlyIncome(e.target.value)}
//                     required
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {usage === "Commercial" && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Home Address"
//                     value={homeAddress}
//                     onChange={(e) => setHomeAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Store Address"
//                     value={storeAddress}
//                     onChange={(e) => setStoreAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Monthly Sales"
//                     value={monthlySales}
//                     onChange={(e) => setMonthlySales(e.target.value)}
//                     required
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Utility Bill Upload */}
//           <div className="pb-4 sm:pb-6">
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
//             <div className="flex items-center gap-3">
//               <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                 <Upload size={18} /> Upload
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleUtilityUpload}
//                   className="hidden"
//                 />
//               </label>
//               <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                 <Camera size={18} /> Snap
//                 <input
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   onChange={handleUtilityUpload}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//             {utilityBill && (
//               <img
//                 src={utilityBill}
//                 alt="Utility Bill"
//                 className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
//               />
//             )}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//             style={{ backgroundColor: '#f7623b' }}
//           >
//             {isLoading ? "Submitting..." : "Submit Follow-Up"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

















// import React, { useState } from "react";
// import { Camera, Upload, ArrowLeft } from "lucide-react";
// import Swal from "sweetalert2";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function AgentFollowUpForm() {
//   const navigate = useNavigate();
//   const { state: entryData } = useLocation();

//   // Form state
//   const [usage, setUsage] = useState("Personal");
//   const [utilityBill, setUtilityBill] = useState(null);
//   const [utilityBillFile, setUtilityBillFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Personal fields
//   const [homeAddress, setHomeAddress] = useState("");
//   const [workAddress, setWorkAddress] = useState("");
//   const [monthlyIncome, setMonthlyIncome] = useState("");

//   // Commercial fields
//   const [storeAddress, setStoreAddress] = useState("");
//   const [monthlySales, setMonthlySales] = useState("");

//   // BVN Mobile Number (editable)
//   const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");

//   const handleUtilityUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUtilityBill(URL.createObjectURL(file));
//       setUtilityBillFile(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!entryData?.bvn) {
//       Swal.fire({
//         title: "Error",
//         text: "BVN is required",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     if (!utilityBillFile) {
//       Swal.fire({
//         title: "Error",
//         text: "Please upload a utility bill",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     if (usage === "Personal" && !monthlyIncome) {
//       Swal.fire({
//         title: "Error",
//         text: "Monthly Gross Income is required for Personal usage",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     if (usage === "Commercial" && !monthlySales) {
//       Swal.fire({
//         title: "Error",
//         text: "Monthly Sales is required for Commercial usage",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Create FormData for multipart/form-data request
//       const formData = new FormData();

//       // Add all fields to FormData
//       formData.append("bvn", entryData.bvn);
//       formData.append("nin", entryData.nin || "");
//       formData.append("mobileNumber", mobileNumber);
//       formData.append("usageType", usage.toLowerCase()); // "personal" or "commercial"
//       formData.append("plan", entryData.plan || "");
//       formData.append("installmentOption", entryData.installment || "");
      
//       // Add addresses
//       formData.append("homeAddress", homeAddress);
      
//       if (usage === "Personal") {
//         formData.append("workAddress", workAddress);
//         formData.append("monthlyIncome", parseFloat(monthlyIncome) || 0);
//       } else {
//         formData.append("storeAddress", storeAddress);
//         formData.append("monthlySales", parseFloat(monthlySales) || 0);
//       }

//       // Add utility bill file
//       formData.append("utilityBill", utilityBillFile);

//       // Make POST request
//       const response = await fetch("http://localhost:8080/api/agent-followup", {
//         method: "POST",
//         body: formData,
//         // Don't set Content-Type header - browser will set it automatically with boundary
//       });

//       if (response.ok) {
//         // Try to parse JSON, but handle empty responses
//         let data = null;
//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.includes("application/json")) {
//           try {
//             data = await response.json();
//           } catch (e) {
//             // Empty or invalid JSON response - that's okay for success
//             console.log(`${e} Response was not JSON, but request succeeded`);
//           }
//         }

//         Swal.fire({
//           title: "Success!",
//           text: data?.message || "Follow-up submitted successfully",
//           icon: "success",
//           confirmButtonColor: "#f7623b",
//         }).then(() => {
//           navigate(-1); // Go back to previous page
//         });
//       } else {
//         // Handle error response
//         let errorMessage = "Failed to submit follow-up";
//         const contentType = response.headers.get("content-type");
        
//         if (contentType && contentType.includes("application/json")) {
//           try {
//             const errorData = await response.json();
//             errorMessage = errorData.message || errorMessage;
//           } catch (e) {
//             // Couldn't parse error JSON
//             errorMessage = `Error ${response.status}: ${response.statusText}`;
//             console.log(e)
//           }
//         } else {
//           // Response is not JSON (might be plain text)
//           const textError = await response.text();
//           errorMessage = textError || `Error ${response.status}: ${response.statusText}`;
//         }
        
//         throw new Error(errorMessage);
//       }
//     } catch (error) {
//       console.error("Error submitting follow-up:", error);
//       Swal.fire({
//         title: "Error",
//         text: error.message || "Failed to submit follow-up. Please try again.",
//         icon: "error",
//         confirmButtonColor: "#f7623b",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//       <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>

//         <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
//           Agent Follow-Up Form
//         </h1>
//         <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
//           Complete follow-up details for the agent entry
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//           {/* Verification Details Section */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
//               Verification Details
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
//                 <input
//                   type="text"
//                   value={entryData?.bvn || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
//                 <input
//                   type="text"
//                   value={entryData?.nin || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number</label>
//                 <input
//                   type="text"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               {entryData?.passportPreview && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
//                   <img
//                     src={entryData.passportPreview}
//                     alt="Passport"
//                     className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Plan & Installment */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
//                 <input
//                   type="text"
//                   value={entryData?.plan || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
//                 <input
//                   type="text"
//                   value={entryData?.installment || ""}
//                   readOnly
//                   className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Product Usage */}
//           <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
//             <select
//               value={usage}
//               onChange={(e) => setUsage(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//             >
//               <option value="Personal">Personal</option>
//               <option value="Commercial">Commercial</option>
//             </select>
//           </div>

//           {/* Conditional Fields */}
//           {usage === "Personal" && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Home Address"
//                     value={homeAddress}
//                     onChange={(e) => setHomeAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Work Address"
//                     value={workAddress}
//                     onChange={(e) => setWorkAddress(e.target.value)}
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Monthly Gross Income"
//                     value={monthlyIncome}
//                     onChange={(e) => setMonthlyIncome(e.target.value)}
//                     required
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {usage === "Commercial" && (
//             <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
//               <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Home Address"
//                     value={homeAddress}
//                     onChange={(e) => setHomeAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
//                   <input
//                     type="text"
//                     placeholder="Enter Store Address"
//                     value={storeAddress}
//                     onChange={(e) => setStoreAddress(e.target.value)}
//                     required
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Monthly Sales"
//                     value={monthlySales}
//                     onChange={(e) => setMonthlySales(e.target.value)}
//                     required
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Utility Bill Upload */}
//           <div className="pb-4 sm:pb-6">
//             <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
//             <div className="flex items-center gap-3">
//               <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                 <Upload size={18} /> Upload
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleUtilityUpload}
//                   className="hidden"
//                 />
//               </label>
//               <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
//                 <Camera size={18} /> Snap
//                 <input
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   onChange={handleUtilityUpload}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//             {utilityBill && (
//               <img
//                 src={utilityBill}
//                 alt="Utility Bill"
//                 className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
//               />
//             )}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//             style={{ backgroundColor: '#f7623b' }}
//           >
//             {isLoading ? "Submitting..." : "Submit Follow-Up"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }















import React, { useState } from "react";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

export default function AgentFollowUpForm() {
    const navigate = useNavigate();
    const { state: entryData } = useLocation();

    // Form state
    const [usage, setUsage] = useState("Personal");
    const [utilityBill, setUtilityBill] = useState(null);
    const [utilityBillFile, setUtilityBillFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Personal fields
    const [homeAddress, setHomeAddress] = useState("");
    const [workAddress, setWorkAddress] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");

    // Commercial fields
    const [storeAddress, setStoreAddress] = useState("");
    const [monthlySales, setMonthlySales] = useState("");

    // BVN Mobile Number (editable)
    const [mobileNumber, setMobileNumber] = useState(entryData?.mobileNumber || "");

    //EMAIL Addresses
    const [customerEmail, setCustomerEmail] = useState("");
    const [guarantorEmail, setGuarantorEmail] = useState("");

    const BACKEND_API_URL = 'https://koolkredit-bnpl-backend-gqbj.onrender.com';

    const handleUtilityUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUtilityBill(URL.createObjectURL(file));
            setUtilityBillFile(file);
        }
    };

    // Function to update DebitMandate with customer details and create Mono customer
    const updateDebitMandateCustomerDetails = async () => {
        // Only update if we have a mandate reference from the previous step
        if (!entryData?.mandateReference) {
            console.log("No mandate reference found, skipping DebitMandate update");
            return;
        }

        try {
            const payload = {
                bvn: entryData.bvn,
                customerAddress: homeAddress,
                customerEmail: customerEmail,
                customerPhone: mobileNumber,
                firstName: entryData.firstName || "",
                lastName: entryData.lastName || ""
            };

            console.log('Updating DebitMandate with Mono customer creation:', payload);

            const response = await fetch(
                `${BACKEND_API_URL}/api/debit-mandate/customer-details/reference/${entryData.mandateReference}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error('Failed to update DebitMandate:', data.message);
            } else {
                console.log('DebitMandate updated successfully:', data);

                if (data.data?.monoCustomerId) {
                    console.log('Mono customer ID created:', data.data.monoCustomerId);
                }

                if (data.warning) {
                    console.warn('Mono warning:', data.warning);
                }
            }
        } catch (error) {
            console.error('Error updating DebitMandate:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!entryData?.bvn) {
            return Swal.fire("Error", "BVN is required", "error");
        }

        if (!utilityBillFile) {
            return Swal.fire("Error", "Please upload a utility bill", "error");
        }

        if (usage === "Personal" && !monthlyIncome) {
            return Swal.fire("Error", "Monthly Income is required", "error");
        }

        if (usage === "Commercial" && !monthlySales) {
            return Swal.fire("Error", "Monthly Sales is required", "error");
        }

        // Validate that firstName and lastName exist in entryData
        if (!entryData?.firstName || !entryData?.lastName) {
            return Swal.fire("Error", "Customer name information is missing. Please go back and complete the previous form.", "error");
        }

        setIsLoading(true);

        try {
            const formData = new FormData();

            formData.append("bvn", entryData.bvn);
            formData.append("nin", entryData.nin || "");
            formData.append("mobileNumber", mobileNumber);
            formData.append("usageType", usage.toLowerCase());
            formData.append("plan", entryData.plan || "");
            formData.append("installmentOption", entryData.installmentDuration || "");
            formData.append("homeAddress", homeAddress);
            formData.append("customerEmail", customerEmail);
            formData.append("guarantorEmail", guarantorEmail);
            formData.append("utilityBill", utilityBillFile);

            if (usage === "Personal") {
                formData.append("workAddress", workAddress);
                formData.append("monthlyIncome", monthlyIncome);
                formData.append("storeAddress", "");
                formData.append("monthlySales", 0);
            } else {
                formData.append("storeAddress", storeAddress);
                formData.append("monthlySales", monthlySales);
                formData.append("workAddress", "");
                formData.append("monthlyIncome", 0);
            }

            // Submit the agent follow-up form
            const response = await fetch(
                "http://localhost:8080/api/agent-followup",
                { method: "POST", body: formData }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Submission failed");
            }

            const data = await response.json();

            // Update DebitMandate with customer details and create Mono customer (non-blocking)
            await updateDebitMandateCustomerDetails();

            const finalCustomerData = {
                ...entryData,
                mobileNumber,
                customerEmail,
                guarantorEmail,
                homeAddress,
                usageType: usage.toLowerCase(),
                workAddress: usage === "Personal" ? workAddress : "",
                storeAddress: usage === "Commercial" ? storeAddress : "",
                monthlyIncome: usage === "Personal" ? monthlyIncome : "",
                monthlySales: usage === "Commercial" ? monthlySales : "",
            };

            // Store globally for next forms
            window.agentEntryData = entryData;
            window.agentFollowUpData = finalCustomerData;
            window.guarantorFormData = finalCustomerData;

            Swal.fire("Success!", data?.message || "Submitted successfully", "success")
                .then(() => {
                    if (data?.otpSent) {
                        navigate("/customer-otp", { state: finalCustomerData });
                    } else {
                        navigate(-1);
                    }
                });

        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
            <div className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#f7623b] mb-4 font-medium hover:opacity-80 transition"
                >
                    <ArrowLeft className="mr-2" /> Back
                </button>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[#f7623b]">
                    Agent Follow-Up Form
                </h1>
                <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
                    Complete follow-up details for the agent entry
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* Verification Details Section */}
                    <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
                            Verification Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN *</label>
                                <input
                                    type="text"
                                    value={entryData?.bvn || ""}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#f7623b]">NIN</label>
                                <input
                                    type="text"
                                    value={entryData?.nin || ""}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#f7623b]">BVN Mobile Number *</label>
                                <input
                                    type="text"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#f7623b]">Your Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="youremail@something.com"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>
                            {entryData?.passportPreview && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Passport Photo</label>
                                    <img
                                        src={entryData.passportPreview}
                                        alt="Passport"
                                        className="h-32 w-32 object-cover rounded-lg border border-[#f7623b]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Plan & Installment */}
                    <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Plan Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#f7623b]">Plan</label>
                                <input
                                    type="text"
                                    value={entryData?.plan || ""}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#f7623b]">Installment Option</label>
                                <input
                                    type="text"
                                    value={entryData?.installmentDuration || ""}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Usage */}
                    <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Product Usage *</h2>
                        <select
                            value={usage}
                            onChange={(e) => setUsage(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                        >
                            <option value="Personal">Personal</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                    </div>

                    {/* Conditional Fields */}
                    {usage === "Personal" && (
                        <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Personal Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Home Address"
                                        value={homeAddress}
                                        onChange={(e) => setHomeAddress(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Work Address</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Work Address"
                                        value={workAddress}
                                        onChange={(e) => setWorkAddress(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Gross Income *</label>
                                    <input
                                        type="number"
                                        placeholder="Enter Monthly Gross Income"
                                        value={monthlyIncome}
                                        onChange={(e) => setMonthlyIncome(e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="guarantor@example.com"
                                        value={guarantorEmail}
                                        onChange={(e) => setGuarantorEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {usage === "Commercial" && (
                        <div className="border-b pb-4 sm:pb-6" style={{ borderColor: '#f7623b' }}>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Commercial Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Home Address *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Home Address"
                                        value={homeAddress}
                                        onChange={(e) => setHomeAddress(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Store Address *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Store Address"
                                        value={storeAddress}
                                        onChange={(e) => setStoreAddress(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Monthly Sales *</label>
                                    <input
                                        type="number"
                                        placeholder="Enter Monthly Sales"
                                        value={monthlySales}
                                        onChange={(e) => setMonthlySales(e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#f7623b]">Guarantor Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="guarantor@example.com"
                                        value={guarantorEmail}
                                        onChange={(e) => setGuarantorEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#f7623b] transition"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Utility Bill Upload */}
                    <div className="pb-4 sm:pb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Utility Bill *</h2>
                        <div className="flex items-center gap-3">
                            <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
                                <Upload size={18} /> Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUtilityUpload}
                                    className="hidden"
                                />
                            </label>
                            <label className="p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer flex items-center gap-2 text-white hover:border-[#f7623b] transition">
                                <Camera size={18} /> Snap
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleUtilityUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {utilityBill && (
                            <img
                                src={utilityBill}
                                alt="Utility Bill"
                                className="h-40 mt-3 rounded-lg border border-[#f7623b] object-cover"
                            />
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ backgroundColor: '#f7623b' }}
                    >
                        {isLoading ? "Submitting..." : "Submit Follow-Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}