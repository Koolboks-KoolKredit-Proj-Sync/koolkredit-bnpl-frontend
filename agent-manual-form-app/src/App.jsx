import React from 'react';
import AgentEntryForm from './components/entryForm/AgentEntryForm';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AgentFollowUpForm from "./components/followUpForm/AgentFollowUpForm";
import CustomerOtpVerification from './components/otpVerification/OtpVerification';
import GuarantorFormPage from './components/guarantorForm/GuarantorForm';
import GuarantorOtpPage from './components/guarantorForm/GuarantorOtp';
import CustomerWaitingPage from './components/customerWaitingPage/CustomerWaitingPage';
import BnplApproved from './components/successPage/Success';
import BNPLPaymentForm from "./components/payments/InitialPayment.jsx";
import AgentProofForm from "./components/agentConfirmationPage/AgentConfirmPage.jsx";
import AgentProofReadOnly from "./components/agentConfirmationPage/ConfirmForKoolboksChoice.jsx";
import AfterSales from "./components/afterSalesPage/AfterSales.jsx";
import InventoryConfirmation from "./components/inventory/InventoryConfirmation.jsx";
import DeliveryScheduling from "./components/delivery/DeliveryScheduling.jsx";
import InstallationConfirmation from "./components/delivery/InstallationConfirmation.jsx";
import RepaymentPaymentForm from "./components/payments/RepaymentPaymentForm.jsx";
import HomePage from "./components/HomePage.jsx";
import Logo from "./components/LogoWithVariant.jsx";
import MandateVerificationForm from "./components/delivery/MandateVerificationForm.jsx";
import Scrap4New from "./components/scrap4new/Scrap4New.jsx";
import Scrap4NewPin from "./components/scrap4new/Scrap4NewPin.jsx";
import Scrap4NewSuccess from "./components/scrap4new/Scrap4NewSuccess.jsx";
import Scrap4NewAdminReview from "./components/scrap4new/Scrap4NewAdminReview.jsx";

function App(){
    return (
        <BrowserRouter>
            <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
                <Logo size="large" />
            </div>

            <Routes>
                {/* Home page - Account verification */}
                <Route path="/" element={<HomePage />} />

                {/* Agent entry form - Pre-filled with customer data */}
                <Route path="/agent-entry" element={<AgentEntryForm />} />

                <Route path="/agent-followup" element={<AgentFollowUpForm />} />

                {/* Customer routes */}
                <Route path="/customer-otp" element={<CustomerOtpVerification />} />
                <Route path="/customer-waiting" element={<CustomerWaitingPage />} />
                <Route path="/bnpl-approved" element={<BnplApproved />} />

                {/* Guarantor routes (opened on guarantor's device) */}
                <Route path="/guarantor/form/:token" element={<GuarantorFormPage />} />
                <Route path="/guarantor/otp/:token" element={<GuarantorOtpPage />} />

                {/* Initial PAYMENT route */}
                <Route path="/pay/pay" element={<BNPLPaymentForm />} />

                {/* Agent proof submission route */}
                <Route path="/agent-proof/:paymentId" element={<AgentProofForm />} />

                {/* Read-only route */}
                <Route path="/agent-proof-readonly/:paymentId" element={<AgentProofReadOnly />} />

                {/* After Sales Paygo Configuration route */}
                <Route path="/after-sales" element={<AfterSales />} />

                {/* Inventory Stock Confirmation route */}
                <Route path="/inventory-confirmation" element={<InventoryConfirmation />} />

                {/* Delivery Scheduling route */}
                <Route path="/delivery-scheduling" element={<DeliveryScheduling />} />

                {/* Installation Confirmation route */}
                <Route path="/installation-confirmation" element={<InstallationConfirmation />} />

                <Route path="/repayment-payment" element={<RepaymentPaymentForm />} />

                <Route path="/mandate-form" element={<MandateVerificationForm />} />

                {/* Scrap4New route */}
                <Route path="/scrap4new" element={<Scrap4New />} />
                <Route path="/scrap4new-pin" element={<Scrap4NewPin />} />
                <Route path="/scrap4new-success" element={<Scrap4NewSuccess />} />
                {/*//<Route path="/scrap4new-pin" element={<Scrap4NewPin />} />*/}
                <Route path="/admin-review/:token" element={<Scrap4NewAdminReview />} />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

// Simple 404 component
function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7623b' }}>
            <div className="bg-black rounded-lg p-8 text-white text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl mb-4">Page Not Found</p>
                <a href="/" className="text-[#f7623b] underline">Go Home</a>
            </div>
        </div>
    );
}

export default App;