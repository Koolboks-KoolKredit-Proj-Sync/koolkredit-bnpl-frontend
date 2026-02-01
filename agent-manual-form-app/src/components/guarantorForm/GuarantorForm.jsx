import React, { useState, useEffect } from "react";
import { Shield, User, Package, CreditCard, Phone, Mail, AlertCircle } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function GuarantorFormPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ bvn: "", phoneNumber: "", nin: "" });

    useEffect(() => {
        if (!token) {
            setError("Invalid link - no token found");
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);

                // ✅ STEP 1: Validate token and get basic info
                const tokenResponse = await axios.get(`http://localhost:8080/api/guarantor/form/${token}`);

                if (!tokenResponse.data.success) {
                    setError(tokenResponse.data.message || "Invalid or expired link");
                    setIsLoading(false);
                    return;
                }

                // Extract BVN from token response
                const customerBvn = tokenResponse.data.customerBvn || tokenResponse.data.bvn;

                if (!customerBvn) {
                    setError("Customer BVN not found");
                    setIsLoading(false);
                    return;
                }

                // ✅ STEP 2: Get detailed customer information using BVN
                const detailsResponse = await axios.get("http://localhost:8080/api/guarantor/context", {
                    params: { bvn: customerBvn }
                });

                // ✅ STEP 3: Combine both responses
                const combinedData = {
                    ...tokenResponse.data,      // Token validation data
                    ...detailsResponse.data,    // Detailed customer data from BVN
                };

                setCustomerData(combinedData);
                setError(null);

            } catch (err) {
                console.error("Error fetching guarantor data:", err);
                const errorMsg = err.response?.data?.message || "Failed to load guarantor data";
                setError(errorMsg);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMsg,
                    confirmButtonColor: "#f7623b"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Only numeric input for bvn, nin, phoneNumber
        if (["bvn", "nin", "phoneNumber"].includes(name) && !/^\d*$/.test(value)) return;

        // Length restrictions
        if ((name === "bvn" || name === "nin") && value.length > 11) return;
        if (name === "phoneNumber" && value.length > 15) return;

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (formData.bvn.length !== 11) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "BVN must be exactly 11 digits",
                confirmButtonColor: "#f7623b"
            });
            return false;
        }
        if (formData.nin.length !== 11) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "NIN must be exactly 11 digits",
                confirmButtonColor: "#f7623b"
            });
            return false;
        }
        if (formData.phoneNumber.length < 10) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Please enter a valid phone number",
                confirmButtonColor: "#f7623b"
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/guarantor/submit/${token}`,
                {
                    guarantorBvn: formData.bvn,
                    guarantorPhoneNumber: formData.phoneNumber,
                    guarantorNin: formData.nin,
                }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Submitted!",
                    text: "You will receive an OTP after admin verification.",
                    confirmButtonColor: "#f7623b"
                }).then(() => {
                    // Navigate to OTP page or waiting page
                    navigate(`/guarantor/otp/${token}`);
                });
            } else {
                throw new Error(response.data.message || "Submission failed");
            }
        } catch (error) {
            console.error("Submission error:", error);
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

    // Loading state
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

    // Error state
    if (error || !customerData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
                <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4 text-white">Link Invalid</h1>
                    <p className="text-gray-400 mb-6">
                        {error || "This link is invalid or has expired."}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-lg text-white font-medium transition hover:opacity-90"
                        style={{ backgroundColor: "#f7623b" }}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "#f7623b" }}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-black rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8">

                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f7623b] rounded-full mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                            Guarantor Form
                        </h1>
                        <p className="text-sm sm:text-base text-gray-400">
                            You've been listed as a guarantor. Please review customer details and fill in your information below.
                        </p>
                    </div>

                    {/* Product Details */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-[#f7623b]" />
                            <h2 className="text-lg font-semibold text-white">Product Details</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Product Name</label>
                                <p className="text-white font-medium mt-1">{customerData.productName || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Brand</label>
                                <p className="text-white font-medium mt-1">{customerData.brand || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Size</label>
                                <p className="text-white font-medium mt-1">{customerData.size || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Price</label>
                                <p className="text-white font-medium mt-1 text-[#f7623b]">
                                    ₦{customerData.price ? Number(customerData.price).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-[#f7623b]" />
                            <h2 className="text-lg font-semibold text-white">Customer Information</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Customer Name</label>
                                <p className="text-white font-medium mt-1">
                                    {customerData.firstName || customerData.customerFirstName || ""} {customerData.lastName || customerData.customerLastName || ""}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Customer BVN</label>
                                <p className="text-white font-medium mt-1">{customerData.bvn || customerData.customerBvn || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Customer Phone
                                </label>
                                <p className="text-white font-medium mt-1">{customerData.mobileNumber || customerData.customerPhone || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Customer Email
                                </label>
                                <p className="text-white font-medium mt-1 break-all">{customerData.customerEmail || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Classification Badge (if available) */}
                    {customerData.classification && (
                        <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-800">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Credit Classification</span>
                                <span className={`px-4 py-2 rounded-full font-bold ${
                                    customerData.classification === 'GREEN' ? 'bg-green-500 text-white' :
                                        customerData.classification === 'YELLOW' ? 'bg-yellow-500 text-black' :
                                            'bg-red-500 text-white'
                                }`}>
                                    {customerData.classification}
                                </span>
                            </div>
                            {customerData.dti !== undefined && (
                                <div className="mt-2 text-gray-400 text-sm">
                                    DTI Ratio: {customerData.dti.toFixed(2)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Payment Plan */}
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-[#f7623b]" />
                            <h2 className="text-lg font-semibold text-white">Payment Plan</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Plan Type</label>
                                <p className="text-white font-medium mt-1">{customerData.plan || customerData.customerPlan || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Duration</label>
                                <p className="text-white font-medium mt-1">
                                    {customerData.installmentDuration || customerData.customerInstallmentDuration || customerData.installmentOption ? `${customerData.installmentDuration || customerData.customerInstallmentDuration || customerData.installmentOption} Months` : "N/A"}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Your Email (Guarantor)
                                </label>
                                <p className="text-white font-medium mt-1 break-all">{customerData.guarantorEmail || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Guarantor Form */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                            <h3 className="text-lg font-semibold text-white mb-4">Your Details (Guarantor)</h3>
                            <div className="space-y-4">
                                <InputField
                                    label="Your BVN"
                                    name="bvn"
                                    value={formData.bvn}
                                    handleChange={handleChange}
                                    maxLength={11}
                                />
                                <InputField
                                    label="Your Phone Number"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    handleChange={handleChange}
                                    maxLength={15}
                                    note="OTP will be sent to this number after verification"
                                />
                                <InputField
                                    label="Your NIN"
                                    name="nin"
                                    value={formData.nin}
                                    handleChange={handleChange}
                                    maxLength={11}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full font-bold py-4 text-base rounded-lg text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                            style={{ backgroundColor: "#f7623b" }}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Information"}
                        </button>
                    </div>

                    {/* Info Notice */}
                    <div className="bg-gray-900 border-l-4 border-[#f7623b] p-4 rounded">
                        <p className="text-xs text-gray-400">
                            <span className="font-semibold text-white">Important:</span> After
                            submission, our admin will verify your information and send an OTP to
                            your phone number. Please ensure all details are correct before submitting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable input component
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
        {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
        {!note && <p className="text-xs text-gray-500 mt-1">{value.length}/{maxLength} digits</p>}
    </div>
);