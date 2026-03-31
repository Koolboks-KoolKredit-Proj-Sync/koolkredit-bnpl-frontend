import React, { useState, useEffect } from 'react';
import {
    Loader2, CheckCircle, XCircle, AlertTriangle, Shield,
    User, Phone, MapPin, CreditCard, TrendingUp, FileText,
    ChevronDown, ChevronUp, Clock, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const ACCENT      = '#f7623b';
const BACKEND_URL = 'https://web-production-88f7c.up.railway.app';

// ── helpers ────────────────────────────────────────────────────────────────────

function classColour(cls) {
    if (!cls) return '#6b7280';
    const c = cls.toUpperCase();
    if (c === 'GREEN') return '#16a34a';
    if (c === 'AMBER') return '#d97706';
    return '#dc2626';
}

function RiskBadge({ level }) {
    const colour = classColour(level);
    const label  = level || 'UNKNOWN';
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 999,
            background: `${colour}22`, border: `1px solid ${colour}`,
            color: colour, fontSize: 12, fontWeight: 700, letterSpacing: 1
        }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: colour, display: 'inline-block' }} />
            {label}
        </span>
    );
}

function Stat({ label, value, sub, accent }) {
    return (
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 10, padding: '14px 16px' }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: accent || '#fff', margin: 0 }}>{value ?? '—'}</p>
            {sub && <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{sub}</p>}
        </div>
    );
}

function Section({ title, children, icon: Icon, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {Icon && <Icon size={15} style={{ color: ACCENT }} />}
                    <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</span>
                </div>
                {open ? <ChevronUp size={15} style={{ color: '#6b7280' }} /> : <ChevronDown size={15} style={{ color: '#6b7280' }} />}
            </button>
            {open && <div style={{ padding: '0 18px 18px' }}>{children}</div>}
        </div>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: highlight || '#e5e7eb' }}>{value ?? '—'}</span>
        </div>
    );
}

// ── parse helpers ──────────────────────────────────────────────────────────────

function extractScoring(rawReport) {
    if (!Array.isArray(rawReport)) return null;
    for (const block of rawReport) {
        if (block.Scoring && Array.isArray(block.Scoring) && block.Scoring.length > 0) return block.Scoring[0];
    }
    return null;
}

function extractCreditSummary(rawReport) {
    if (!Array.isArray(rawReport)) return null;
    for (const block of rawReport) {
        if (block.CreditAccountSummary && Array.isArray(block.CreditAccountSummary) && block.CreditAccountSummary.length > 0)
            return block.CreditAccountSummary[0];
    }
    return null;
}

function extractCreditRating(rawReport) {
    if (!Array.isArray(rawReport)) return null;
    for (const block of rawReport) {
        if (block.CreditAccountRating && Array.isArray(block.CreditAccountRating) && block.CreditAccountRating.length > 0)
            return block.CreditAccountRating[0];
    }
    return null;
}

function extractEnquiryInput(rawReport) {
    if (!Array.isArray(rawReport)) return null;
    for (const block of rawReport) {
        if (block.EnquiryInput && Array.isArray(block.EnquiryInput) && block.EnquiryInput.length > 0)
            return block.EnquiryInput[0];
    }
    return null;
}

function extractPaymentHeader(rawReport) {
    if (!Array.isArray(rawReport)) return null;
    for (const block of rawReport) {
        if (block.AccountMonthlyPaymentHeader && Array.isArray(block.AccountMonthlyPaymentHeader) && block.AccountMonthlyPaymentHeader.length > 0)
            return block.AccountMonthlyPaymentHeader[0];
    }
    return null;
}

// ── main component ─────────────────────────────────────────────────────────────

export default function AdminCreditReview() {
    const { token } = useParams();

    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState('');
    const [reviewData,  setReviewData]  = useState(null);   // { followUp, creditReport }
    const [submitting,  setSubmitting]  = useState(false);
    const [submitted,   setSubmitted]   = useState(false);
    const [decision,    setDecision]    = useState('');     // 'APPROVE' | 'REJECT'

    // Admin override fields
    const [overrideClassification, setOverrideClassification] = useState('');
    const [overridePlan,            setOverridePlan]           = useState('');
    const [overrideInstalment,      setOverrideInstalment]     = useState('');
    const [rejectionReason,         setRejectionReason]        = useState('');
    const [adminNotes,              setAdminNotes]             = useState('');

    useEffect(() => {
        if (!token) { setError('Invalid review link.'); setLoading(false); return; }

        fetch(`${BACKEND_URL}/api/agent-followup/admin-review/${token}/data`)
            .then(r => {
                if (r.status === 403) throw new Error('Unauthorised — please log in to the admin panel first.');
                if (!r.ok) throw new Error(`Server error ${r.status}`);
                return r.json();
            })
            .then(data => {
                setReviewData(data);
                // Pre-fill overrides from existing follow-up data
                setOverrideClassification(data.followUp?.creditStatus || '');
                setOverridePlan(data.followUp?.plan || '');
                setOverrideInstalment(data.followUp?.installmentOption || '');
                setLoading(false);
            })
            .catch(e => { setError(e.message); setLoading(false); });
    }, [token]);

    const handleDecision = async (finalDecision) => {
        if (finalDecision === 'REJECT' && !rejectionReason.trim()) {
            return Swal.fire({ icon: 'warning', title: 'Reason required', text: 'Please provide a reason for rejection.' });
        }

        const customerName = `${reviewData?.followUp?.firstName || ''} ${reviewData?.followUp?.lastName || ''}`.trim() || 'Customer';
        const classLabel   = overrideClassification || reviewData?.followUp?.creditStatus || 'N/A';

        const confirmResult = await Swal.fire({
            icon: finalDecision === 'APPROVE' ? 'question' : 'warning',
            title: finalDecision === 'APPROVE' ? 'Approve Application?' : 'Reject Application?',
            html: finalDecision === 'APPROVE'
                ? `Approve <strong>${customerName}</strong> with classification <strong style="color:${classColour(classLabel)}">${classLabel}</strong>?<br/><small style="color:#6b7280">An OTP will be sent to the customer immediately.</small>`
                : `Reject <strong>${customerName}</strong>?<br/><small style="color:#6b7280">The customer will be notified with the reason provided.</small>`,
            showCancelButton: true,
            confirmButtonText: finalDecision === 'APPROVE' ? 'Yes, Approve & Send OTP' : 'Yes, Reject',
            confirmButtonColor: finalDecision === 'APPROVE' ? '#16a34a' : '#dc2626',
            cancelButtonText: 'Go back',
        });

        if (!confirmResult.isConfirmed) return;

        setDecision(finalDecision);
        setSubmitting(true);

        try {
            const payload = {
                decision: finalDecision,
                overrideClassification: overrideClassification || undefined,
                overridePlan:           overridePlan || undefined,
                overrideInstalment:     overrideInstalment || undefined,
                rejectionReason:        finalDecision === 'REJECT' ? rejectionReason : undefined,
                adminNotes:             adminNotes || undefined,
            };

            const r = await fetch(`${BACKEND_URL}/api/agent-followup/admin-review/${token}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await r.json();
            if (!r.ok || !data.success) throw new Error(data.message || 'Submission failed');

            setSubmitted(true);

            Swal.fire({
                icon: finalDecision === 'APPROVE' ? 'success' : 'info',
                title: finalDecision === 'APPROVE' ? 'Approved!' : 'Application Rejected',
                text: finalDecision === 'APPROVE'
                    ? `OTP has been sent to ${customerName}.`
                    : `${customerName} has been notified.`,
            });

        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: e.message });
            setDecision('');
        } finally {
            setSubmitting(false);
        }
    };

    // ── loading state ──────────────────────────────────────────────────────────
    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT }}>
            <div style={{ background: '#000', borderRadius: 20, padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <Loader2 size={36} style={{ color: ACCENT, animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading credit review data…</p>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    // ── error state ────────────────────────────────────────────────────────────
    if (error) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT, padding: 16 }}>
            <div style={{ background: '#000', borderRadius: 20, padding: 48, maxWidth: 420, width: '100%', textAlign: 'center' }}>
                <AlertTriangle size={40} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
                <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Access Error</h2>
                <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>{error}</p>
                <a href={`${BACKEND_URL}/admin/`}
                   style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: ACCENT, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
                    Go to Admin Login
                </a>
            </div>
        </div>
    );

    const { followUp, creditReport } = reviewData || {};
    const rawReport    = creditReport?.raw_report   || [];
    const scoring      = extractScoring(rawReport);
    const summary      = extractCreditSummary(rawReport);
    const rating       = extractCreditRating(rawReport);
    const enquiryInput = extractEnquiryInput(rawReport);
    const payHeader    = extractPaymentHeader(rawReport);

    const systemClass  = followUp?.creditStatus || creditReport?.risk_level || 'N/A';
    const probDefault  = creditReport?.probability_of_default;
    const decision_str = creditReport?.decision;
    const reasons      = creditReport?.reasons || [];
    const normScore    = creditReport?.bureau_score_normalized;

    return (
        <div style={{ minHeight: '100vh', background: ACCENT, padding: '24px 16px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* ── Header ── */}
                <div style={{ background: '#000', borderRadius: 16, padding: '20px 24px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: ACCENT, margin: 0 }}>Credit Application Review</h1>
                        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                            BVN: <span style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{creditReport?.bvn || followUp?.bvn || '—'}</span>
                            {' · '}
                            <span style={{ color: '#6b7280' }}>
                                {enquiryInput?.EnquiryDate || creditReport?.created_at?.split('T')[0] || ''}
                            </span>
                        </p>
                    </div>
                    {submitted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: decision === 'APPROVE' ? '#16a34a22' : '#dc262622', border: `1px solid ${decision === 'APPROVE' ? '#16a34a' : '#dc2626'}`, borderRadius: 8 }}>
                            {decision === 'APPROVE'
                                ? <CheckCircle size={16} style={{ color: '#16a34a' }} />
                                : <XCircle size={16} style={{ color: '#dc2626' }} />}
                            <span style={{ color: decision === 'APPROVE' ? '#16a34a' : '#dc2626', fontSize: 13, fontWeight: 600 }}>
                                {decision === 'APPROVE' ? 'Approved — OTP Sent' : 'Rejected — Customer Notified'}
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f59e0b22', border: '1px solid #f59e0b', borderRadius: 8 }}>
                            <Clock size={13} style={{ color: '#f59e0b' }} />
                            <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 600 }}>Awaiting Admin Review</span>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,340px)', gap: 20, alignItems: 'start' }}>

                    {/* ── Left Column ── */}
                    <div>

                        {/* Credit Score Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 16 }}>
                            <Stat label="Bureau Score" value={normScore ?? creditReport?.first_central_score ?? '—'} accent={ACCENT} />
                            <Stat label="Risk Level" value={<RiskBadge level={creditReport?.risk_level} />} />
                            <Stat label="System Decision" value={decision_str || '—'} accent={decision_str === 'REJECT' ? '#dc2626' : '#16a34a'} />
                            <Stat label="Default Probability" value={probDefault != null ? `${(probDefault * 100).toFixed(1)}%` : '—'} accent={probDefault > 0.7 ? '#dc2626' : probDefault > 0.4 ? '#d97706' : '#16a34a'} />
                        </div>

                        {/* System Reasons */}
                        {reasons.length > 0 && (
                            <Section title="System Flags" icon={AlertTriangle}>
                                {reasons.map((r, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, color: '#e5e7eb' }}>{r}</span>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {/* Scoring */}
                        {scoring && (
                            <Section title="Credit Scoring" icon={TrendingUp}>
                                <InfoRow label="Consumer ID"         value={scoring.ConsumerID} />
                                <InfoRow label="Total Score"         value={scoring.TotalConsumerScore} highlight={ACCENT} />
                                <InfoRow label="Description"         value={scoring.Description} highlight={classColour(scoring.Description?.includes('HIGH') ? 'RED' : 'GREEN')} />
                                <InfoRow label="Score Date"          value={scoring.ScoreDate} />
                                <InfoRow label="Repayment History"   value={scoring.RepaymentHistoryScore || 'N/A'} />
                                <InfoRow label="Credit Length"       value={scoring.LengthOfCreditHistoryScore || 'N/A'} />
                                <InfoRow label="No. of Accounts"     value={scoring.NoOfAcctScore || 'N/A'} />
                            </Section>
                        )}

                        {/* Account Summary */}
                        {summary && (
                            <Section title="Account Summary" icon={CreditCard}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                                    <Stat label="Total Accounts"     value={summary.TotalAccounts} />
                                    <Stat label="In Arrears"         value={summary.TotalAccountarrear} accent={Number(summary.TotalAccountarrear) > 0 ? '#dc2626' : '#16a34a'} />
                                    <Stat label="Outstanding Debt"   value={`₦${parseFloat(summary.TotalOutstandingdebt || 0).toLocaleString()}`} accent={Number(summary.TotalOutstandingdebt) > 0 ? '#d97706' : '#e5e7eb'} />
                                    <Stat label="Monthly Instalment" value={`₦${parseFloat(summary.TotalMonthlyInstalment || 0).toLocaleString()}`} />
                                </div>
                                <InfoRow label="Judgements"          value={summary.TotalNumberofJudgement} highlight={Number(summary.TotalNumberofJudgement) > 0 ? '#dc2626' : '#16a34a'} />
                                <InfoRow label="Dishonoured Cheques" value={summary.TotalNumberofDishonoured} highlight={Number(summary.TotalNumberofDishonoured) > 0 ? '#dc2626' : '#16a34a'} />
                                <InfoRow label="Amount in Arrears"   value={`₦${parseFloat(summary.Amountarrear || 0).toLocaleString()}`} />
                                <InfoRow label="Last Judgement"      value={summary.LastJudgementDate} />
                            </Section>
                        )}

                        {/* Credit Account Rating */}
                        {rating && (
                            <Section title="Account Type Breakdown" icon={BarChartIcon} defaultOpen={false}>
                                {[
                                    ['Home Loans',     rating.NoOfHomeLoanAccountsGood,     rating.NoOfHomeLoanAccountsBad],
                                    ['Auto Loans',     rating.NoOfAutoLoanccountsGood,       rating.NoOfAutoLoanAccountsBad],
                                    ['Personal Loans', rating.NoOfPersonalLoanAccountsGood,  rating.NoOfPersonalLoanAccountsBad],
                                    ['Credit Cards',   rating.NoOfCreditCardAccountsGood,    rating.NoOfCreditCardAccountsBad],
                                    ['Retail',         rating.NoOfRetailAccountsGood,        rating.NoOfRetailAccountsBad],
                                    ['Telecom',        rating.NoOfTelecomAccountsGood,       rating.NoOfTelecomAccountsBad],
                                    ['Other',          rating.NoOfOtherAccountsGood,         rating.NoOfOtherAccountsBad],
                                ].map(([type, good, bad]) => (
                                    <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{type}</span>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <span style={{ fontSize: 12, color: '#16a34a' }}>{good} good</span>
                                            <span style={{ fontSize: 12, color: Number(bad) > 0 ? '#dc2626' : '#6b7280' }}>{bad} bad</span>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {/* Customer Details from follow-up */}
                        <Section title="Customer Details" icon={User}>
                            <InfoRow label="Full Name"    value={`${followUp?.firstName || ''} ${followUp?.lastName || ''}`.trim()} />
                            <InfoRow label="BVN"          value={followUp?.bvn} />
                            <InfoRow label="Mobile"       value={followUp?.mobileNumber} />
                            <InfoRow label="Email"        value={followUp?.customerEmail} />
                            <InfoRow label="Home Address" value={followUp?.homeAddress} />
                            <InfoRow label="Usage Type"   value={followUp?.usageType} />
                            {followUp?.usageType === 'personal' && <>
                                <InfoRow label="Work Address"    value={followUp?.workAddress} />
                                <InfoRow label="Monthly Income"  value={followUp?.monthlyIncome ? `₦${parseFloat(followUp.monthlyIncome).toLocaleString()}` : '—'} />
                            </>}
                            {followUp?.usageType === 'commercial' && <>
                                <InfoRow label="Store Address"   value={followUp?.storeAddress} />
                                <InfoRow label="Monthly Sales"   value={followUp?.monthlySales ? `₦${parseFloat(followUp.monthlySales).toLocaleString()}` : '—'} />
                            </>}
                            <InfoRow label="Guarantor Email" value={followUp?.guarantorEmail} />
                            <InfoRow label="DTI"              value={followUp?.dti != null ? `${parseFloat(followUp.dti).toFixed(2)}%` : '—'} />
                        </Section>

                        {/* Plan Details */}
                        <Section title="Plan & Instalment" icon={FileText}>
                            <InfoRow label="Plan"              value={followUp?.plan} />
                            <InfoRow label="Instalment Option" value={followUp?.installmentOption} />
                            <InfoRow label="System Classification" value={<RiskBadge level={systemClass} />} />
                        </Section>

                        {/* Enquiry Info */}
                        {enquiryInput && (
                            <Section title="Enquiry Details" icon={RefreshCw} defaultOpen={false}>
                                <InfoRow label="Enquiry Date"    value={enquiryInput.EnquiryDate} />
                                <InfoRow label="Enquiry Type"    value={enquiryInput.EnquiryType} />
                                <InfoRow label="Subscriber"      value={enquiryInput.SubscriberName} />
                                <InfoRow label="Match Rate"      value={enquiryInput.MatchRate} />
                            </Section>
                        )}

                    </div>

                    {/* ── Right Column — Admin Decision Panel ── */}
                    <div style={{ position: 'sticky', top: 24 }}>

                        {/* System recommendation banner */}
                        <div style={{
                            background: '#000', border: `2px solid ${classColour(systemClass)}`,
                            borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center'
                        }}>
                            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>System Recommendation</p>
                            <RiskBadge level={systemClass} />
                            {probDefault != null && (
                                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                                    {(probDefault * 100).toFixed(1)}% probability of default
                                </p>
                            )}
                        </div>

                        {/* Override Panel */}
                        <div style={{ background: '#000', border: '1px solid #1f2937', borderRadius: 14, padding: 20, marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <Shield size={15} style={{ color: ACCENT }} />
                                <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.8 }}>Admin Overrides</span>
                            </div>

                            {/* Classification override */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: ACCENT, marginBottom: 6, fontWeight: 600 }}>
                                    Override Classification
                                </label>
                                <select
                                    value={overrideClassification}
                                    onChange={e => setOverrideClassification(e.target.value)}
                                    disabled={submitted}
                                    style={{
                                        width: '100%', padding: '10px 12px', background: '#111', border: `1px solid ${classColour(overrideClassification)}`,
                                        borderRadius: 8, color: classColour(overrideClassification), fontSize: 14, fontWeight: 700, outline: 'none'
                                    }}
                                >
                                    <option value="GREEN" style={{ color: '#16a34a' }}>GREEN — Approve</option>
                                    <option value="AMBER" style={{ color: '#d97706' }}>AMBER — Conditional</option>
                                    <option value="RED"   style={{ color: '#dc2626' }}>RED — Decline</option>
                                </select>
                            </div>

                            {/* Plan override */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: ACCENT, marginBottom: 6, fontWeight: 600 }}>
                                    Override Plan
                                </label>
                                <input
                                    type="text"
                                    value={overridePlan}
                                    onChange={e => setOverridePlan(e.target.value)}
                                    disabled={submitted}
                                    placeholder={followUp?.plan || 'e.g. Basic Plan'}
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Instalment override */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: ACCENT, marginBottom: 6, fontWeight: 600 }}>
                                    Override Instalment Duration
                                </label>
                                <input
                                    type="text"
                                    value={overrideInstalment}
                                    onChange={e => setOverrideInstalment(e.target.value)}
                                    disabled={submitted}
                                    placeholder={followUp?.installmentOption || 'e.g. 12 months'}
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Rejection reason */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: '#ef4444', marginBottom: 6, fontWeight: 600 }}>
                                    Rejection Reason <span style={{ color: '#6b7280' }}>(required if rejecting)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                    disabled={submitted}
                                    placeholder="State the reason for rejection — this will be shown to the customer."
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Admin notes */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 6, fontWeight: 600 }}>
                                    Internal Notes (optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={adminNotes}
                                    onChange={e => setAdminNotes(e.target.value)}
                                    disabled={submitted}
                                    placeholder="Notes for internal records only…"
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #1f2937', borderRadius: 8, color: '#9ca3af', fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Approve / Reject buttons */}
                            {!submitted ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <button
                                        onClick={() => handleDecision('REJECT')}
                                        disabled={submitting}
                                        style={{
                                            padding: '14px 0', borderRadius: 10, border: '1px solid #dc2626',
                                            background: '#dc262618', color: '#ef4444', fontWeight: 700, fontSize: 14,
                                            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                        }}
                                    >
                                        {submitting && decision === 'REJECT'
                                            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                            : <XCircle size={16} />}
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleDecision('APPROVE')}
                                        disabled={submitting}
                                        style={{
                                            padding: '14px 0', borderRadius: 10, border: 'none',
                                            background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 14,
                                            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                                        }}
                                    >
                                        {submitting && decision === 'APPROVE'
                                            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                            : <CheckCircle size={16} />}
                                        Approve
                                    </button>
                                </div>
                            ) : (
                                <div style={{ padding: '14px 0', borderRadius: 10, background: decision === 'APPROVE' ? '#16a34a' : '#374151', color: '#fff', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>
                                    {decision === 'APPROVE' ? '✓ Approved — OTP Sent' : '✗ Application Rejected'}
                                </div>
                            )}
                        </div>

                        {/* Payment header months reference */}
                        {payHeader && (
                            <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 10, padding: 14 }}>
                                <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>24-Month Payment Period</p>
                                <p style={{ fontSize: 12, color: '#374151' }}>
                                    {payHeader.MH24} → {payHeader.MH01}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// Fallback icon for Section
function BarChartIcon({ size, style }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}>
            <rect x="18" y="3" width="4" height="18" /><rect x="10" y="8" width="4" height="13" /><rect x="2" y="13" width="4" height="8" />
        </svg>
    );
}