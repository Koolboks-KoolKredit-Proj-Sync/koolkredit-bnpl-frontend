// import React, { useState, useEffect } from 'react';
// import { User, Mail, Phone, DollarSign, Calendar } from 'lucide-react';
//
// export default function AgentProofReadOnly() {
//     const [isLoading, setIsLoading] = useState(true);
//     const [agentData, setAgentData] = useState(null);
//     const [isConfirming, setIsConfirming] = useState(false);
//
//
//     const getPayId = () => {
//         const parts = window.location.pathname.split('/').filter(Boolean);
//         return parts[parts.length - 1];
//     };
//
//     useEffect(() => {
//         const fetchAgentData = async () => {
//             try {
//                 const paymentId = getPayId();
//                 const response = await fetch(`http://127.0.0.1:8000/v1/api/agent-proof-data/${paymentId}/`);
//                 if (!response.ok) throw new Error('Failed to fetch agent data');
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
//
//     const handleConfirm = async () => {
//         try {
//             setIsConfirming(true);
//             const paymentId = getPayId();
//
//             const response = await fetch(
//                 `http://127.0.0.1:8000/v1/api/agent-confirm/${paymentId}/`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//
//             if (!response.ok) {
//                 throw new Error('Confirmation failed');
//             }
//
//             alert('Payment confirmed successfully');
//         } catch (error) {
//             console.error(error);
//             alert('Failed to confirm payment');
//         } finally {
//             setIsConfirming(false);
//         }
//     };
//
//
//     return (
//         <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//                 <div className="text-center mb-8">
//                     <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
//                         Payment Information
//                     </h1>
//                     <p className="text-sm sm:text-base text-gray-400">
//                         Review payment and agent details
//                     </p>
//                 </div>
//
//                 <div className="space-y-6">
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Agent Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <User className="w-4 h-4 mr-2" /> Agent Name
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
//                                     <User className="w-4 h-4 mr-2" /> Agent ID
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
//                                     <Mail className="w-4 h-4 mr-2" /> Email
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
//                                     <Phone className="w-4 h-4 mr-2" /> Phone Number
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
//                                     <DollarSign className="w-4 h-4 mr-2" /> Initial Installment
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
//                                     <Calendar className="w-4 h-4 mr-2" /> Payment Date
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
//                 </div>
//                 <div className="pt-8 text-center">
//                     <button
//                         onClick={handleConfirm}
//                         disabled={isConfirming}
//                         className={`px-8 py-3 rounded-lg font-bold transition
//             ${isConfirming
//                             ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
//                             : 'bg-[#f7623b] text-black hover:bg-orange-600'}
//         `}
//                     >
//                         {isConfirming ? 'Confirming...' : 'Confirm'}
//                     </button>
//                 </div>
//
//             </div>
//         </div>
//     );
// }










import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, DollarSign, Calendar } from 'lucide-react';

export default function AgentProofReadOnly() {
    // CONFIGURATION: Both backend endpoints
    const DJANGO_API_URL = 'http://127.0.0.1:8000';
    const SPRING_API_URL = 'http://127.0.0.1:8080';

    const [isLoading, setIsLoading] = useState(true);
    const [agentData, setAgentData] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const getPayId = () => {
        const parts = window.location.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1];
    };

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const paymentId = getPayId();
                const response = await fetch(`${DJANGO_API_URL}/v1/api/agent-proof-data/${paymentId}/`);
                if (!response.ok) throw new Error('Failed to fetch agent data');

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

    const handleConfirm = async () => {
        try {
            setIsConfirming(true);
            const paymentId = getPayId();
            const customerLoanRef = agentData.loan_ref; // Use loan_ref for Spring Boot

            console.log('Submitting confirmation to both backends...');
            console.log('Django endpoint:', `${DJANGO_API_URL}/v1/api/agent-confirm/${paymentId}/`);
            console.log('Spring Boot endpoint:', `${SPRING_API_URL}/v1/api/koolboks-confirm/${customerLoanRef}`);

            // Submit to BOTH backends simultaneously
            const [djangoResponse, springResponse] = await Promise.all([
                fetch(`${DJANGO_API_URL}/v1/api/agent-confirm/${paymentId}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(`${SPRING_API_URL}/v1/api/koolboks-confirm/${customerLoanRef}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ]);

            console.log('Django response status:', djangoResponse.status);
            console.log('Spring Boot response status:', springResponse.status);

            // Parse responses
            const djangoData = djangoResponse.ok ? await djangoResponse.json().catch(() => ({})) : null;
            const springData = springResponse.ok ? await springResponse.json().catch(() => ({})) : null;

            console.log('Django response:', djangoData);
            console.log('Spring Boot response:', springData);

            // Check if both succeeded
            if (djangoResponse.ok && springResponse.ok) {
                alert('Payment confirmed successfully in both systems! Loan activation email sent.');
                // Optional: redirect to success page
                // window.location.href = '/agent-dashboard';
            } else if (!djangoResponse.ok && springResponse.ok) {
                const errorMsg = djangoData?.error || djangoData?.message || 'Unknown error';
                throw new Error(`Django confirmation failed: ${errorMsg}`);
            } else if (djangoResponse.ok && !springResponse.ok) {
                const errorMsg = springData?.error || springData?.message || 'Unknown error';
                throw new Error(`Spring Boot confirmation failed: ${errorMsg}`);
            } else {
                throw new Error('Both confirmations failed. Please try again.');
            }
        } catch (error) {
            console.error('Confirmation error:', error);
            alert(error.message || 'Failed to confirm payment');
        } finally {
            setIsConfirming(false);
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
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
                        Payment Information
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Review payment and agent details
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
                        <h2 className="text-xl font-bold text-[#f7623b] mb-4">Agent Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
                                    <User className="w-4 h-4 mr-2" /> Agent Name
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
                                    <User className="w-4 h-4 mr-2" /> Agent ID
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
                                    <Mail className="w-4 h-4 mr-2" /> Email
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
                                    <Phone className="w-4 h-4 mr-2" /> Phone Number
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
                                    <DollarSign className="w-4 h-4 mr-2" /> Initial Installment
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
                                    <Calendar className="w-4 h-4 mr-2" /> Payment Date
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
                </div>

                <div className="pt-8 text-center">
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className={`px-8 py-3 rounded-lg font-bold transition
                            ${isConfirming
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-[#f7623b] text-black hover:bg-orange-600'}
                        `}
                    >
                        {isConfirming ? 'Confirming...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}















// import React, { useState, useEffect } from 'react';
// import { User, Mail, Phone, DollarSign, Calendar } from 'lucide-react';
//
// export default function AgentProofReadOnly() {
//     const [isLoading, setIsLoading] = useState(true);
//     const [agentData, setAgentData] = useState(null);
//     const [isConfirming, setIsConfirming] = useState(false);
//
//
//     const getPayId = () => {
//         const parts = window.location.pathname.split('/').filter(Boolean);
//         return parts[parts.length - 1];
//     };
//
//     useEffect(() => {
//         const fetchAgentData = async () => {
//             try {
//                 const paymentId = getPayId();
//                 const response = await fetch(`http://127.0.0.1:8000/v1/api/agent-proof-data/${paymentId}/`);
//                 if (!response.ok) throw new Error('Failed to fetch agent data');
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
//
//     const handleConfirm = async () => {
//         try {
//             setIsConfirming(true);
//             const paymentId = getPayId();
//
//             const response = await fetch(
//                 `http://127.0.0.1:8000/v1/api/agent-proof-readonly/${paymentId}/`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//
//             if (!response.ok) {
//                 throw new Error('Confirmation failed');
//             }
//
//             alert('Payment confirmed successfully');
//         } catch (error) {
//             console.error(error);
//             alert('Failed to confirm payment');
//         } finally {
//             setIsConfirming(false);
//         }
//     };
//
//
//     return (
//         <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl p-6 sm:p-8">
//                 <div className="text-center mb-8">
//                     <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7623b]">
//                         Payment Information
//                     </h1>
//                     <p className="text-sm sm:text-base text-gray-400">
//                         Review payment and agent details
//                     </p>
//                 </div>
//
//                 <div className="space-y-6">
//                     <div className="bg-gray-900 rounded-lg p-6 border-2 border-[#f7623b]">
//                         <h2 className="text-xl font-bold text-[#f7623b] mb-4">Agent Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="flex items-center text-sm font-medium mb-2 text-gray-400">
//                                     <User className="w-4 h-4 mr-2" /> Agent Name
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
//                                     <User className="w-4 h-4 mr-2" /> Agent ID
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
//                                     <Mail className="w-4 h-4 mr-2" /> Email
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
//                                     <Phone className="w-4 h-4 mr-2" /> Phone Number
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
//                                     <DollarSign className="w-4 h-4 mr-2" /> Initial Installment
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
//                                     <Calendar className="w-4 h-4 mr-2" /> Payment Date
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
//                 </div>
//                 <div className="pt-8 text-center">
//                     <button
//                         onClick={handleConfirm}
//                         disabled={isConfirming}
//                         className={`px-8 py-3 rounded-lg font-bold transition
//             ${isConfirming
//                             ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
//                             : 'bg-[#f7623b] text-black hover:bg-orange-600'}
//         `}
//                     >
//                         {isConfirming ? 'Confirming...' : 'Confirm'}
//                     </button>
//                 </div>
//
//             </div>
//         </div>
//     );
// }