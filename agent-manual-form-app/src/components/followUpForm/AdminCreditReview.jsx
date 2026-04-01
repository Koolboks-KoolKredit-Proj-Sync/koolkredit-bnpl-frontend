import React, { useState, useEffect, useMemo } from 'react';
import {
    Loader2, CheckCircle, XCircle, AlertTriangle, Shield,
    User, Phone, CreditCard, TrendingUp, FileText,
    ChevronDown, ChevronUp, Clock, RefreshCw, Zap
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';

// ── Constants ──────────────────────────────────────────────────────────────────
const ACCENT      = '#f7623b';
const BACKEND_URL = 'https://web-production-88f7c.up.railway.app';

// Decision Engine risk colour mapping
function deColor(riskLevel, decision) {
    if (!riskLevel && !decision) return '#6b7280';
    const r = (riskLevel || '').toUpperCase();
    const d = (decision  || '').toUpperCase();
    if (r === 'LOW'  || d === 'APPROVE') return '#16a34a';
    if (r === 'MEDIUM')                   return '#d97706';
    if (r === 'HIGH' || r === 'VERY_HIGH' || d === 'REJECT') return '#dc2626';
    return '#6b7280';
}

// Internal classification colour
function classColour(cls) {
    if (!cls) return '#6b7280';
    const c = cls.toUpperCase();
    if (c === 'GREEN' || c === 'LOW')  return '#16a34a';
    if (c === 'AMBER' || c === 'MEDIUM') return '#d97706';
    return '#dc2626';
}

// ── Small re-usable components ─────────────────────────────────────────────────
function Badge({ label, colour }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 999,
            background: `${colour}22`, border: `1px solid ${colour}`,
            color: colour, fontSize: 12, fontWeight: 700, letterSpacing: 1,
            whiteSpace: 'nowrap'
        }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: colour, display: 'inline-block', flexShrink: 0 }} />
            {label}
        </span>
    );
}

function Stat({ label, value, accent }) {
    return (
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 10, padding: '14px 16px' }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: accent || '#fff', margin: 0 }}>{value ?? '—'}</p>
        </div>
    );
}

function Section({ title, children, icon: Icon, defaultOpen = true, accentColour }) {
    const [open, setOpen] = useState(defaultOpen);
    const col = accentColour || ACCENT;
    return (
        <div style={{ background: '#0a0a0a', border: `1px solid ${col}33`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {Icon && <Icon size={15} style={{ color: col }} />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: col, textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</span>
                </div>
                {open ? <ChevronUp size={15} style={{ color: '#6b7280' }} /> : <ChevronDown size={15} style={{ color: '#6b7280' }} />}
            </button>
            {open && <div style={{ padding: '0 18px 18px' }}>{children}</div>}
        </div>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #1a1a1a', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#6b7280', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: highlight || '#e5e7eb', textAlign: 'right', wordBreak: 'break-word' }}>{value ?? '—'}</span>
        </div>
    );
}

// ── Raw report parsers ─────────────────────────────────────────────────────────
function findBlock(rawReport, key) {
    if (!Array.isArray(rawReport)) return null;
    for (const block of rawReport) {
        if (block[key] && Array.isArray(block[key]) && block[key].length > 0)
            return block[key][0];
    }
    return null;
}

function findArray(rawReport, key) {
    if (!Array.isArray(rawReport)) return [];
    for (const block of rawReport) {
        if (block[key] && Array.isArray(block[key])) return block[key];
    }
    return [];
}

// ── Chart data builders ────────────────────────────────────────────────────────
const MONTH_KEYS = ['M24','M23','M22','M21','M20','M19','M18','M17','M16','M15','M14','M13','M12','M11','M10','M09','M08','M07','M06','M05','M04','M03','M02','M01'];

function buildPaymentHistoryData(paymentHistories, paymentHeader) {
    if (!paymentHistories.length || !paymentHeader) return [];
    return MONTH_KEYS.map((mk, i) => {
        const label = paymentHeader[`MH${mk.replace('M','')}`] || mk;
        let totalScore = 0, count = 0, badCount = 0;
        paymentHistories.forEach(acc => {
            const val = acc[mk];
            if (val && val !== '#') {
                const num = parseInt(val, 10);
                if (!isNaN(num)) { totalScore += num; count++; }
                if (num > 600) badCount++;
            }
        });
        return { month: label, avgScore: count > 0 ? Math.round(totalScore / count) : null, badAccounts: badCount };
    }).filter(d => d.avgScore !== null).reverse();
}

function buildDebtTrendData(agreements) {
    if (!agreements.length) return [];
    const byYear = {};
    agreements.forEach(ag => {
        const yr = ag.DateAccountOpened?.split('/')[2] || 'Unknown';
        if (!byYear[yr]) byYear[yr] = { year: yr, outstanding: 0, arrears: 0 };
        const bal = parseFloat((ag.CurrentBalanceAmt || '0').replace(/,/g,'')) || 0;
        const arr = parseFloat((ag.AmountOverdue   || '0').replace(/,/g,'')) || 0;
        byYear[yr].outstanding += bal;
        byYear[yr].arrears     += arr;
    });
    return Object.values(byYear).sort((a,b) => a.year.localeCompare(b.year));
}

function buildArrearsTrend(paymentHistories, paymentHeader) {
    if (!paymentHistories.length || !paymentHeader) return [];
    return MONTH_KEYS.map(mk => {
        const label = paymentHeader[`MH${mk.replace('M','')}`] || mk;
        let arrearAccounts = 0, performingAccounts = 0;
        paymentHistories.forEach(acc => {
            const val = acc[mk];
            if (val && val !== '#') {
                const num = parseInt(val, 10);
                if (!isNaN(num) && num > 600) arrearAccounts++;
                else if (val !== '#') performingAccounts++;
            }
        });
        return { month: label, arrears: arrearAccounts, performing: performingAccounts };
    }).filter(d => d.arrears > 0 || d.performing > 0).reverse();
}

function buildScoreBreakdown(scoring) {
    if (!scoring) return [];
    const parse = (str) => {
        if (!str) return 0;
        const parts = str.split('/');
        return parts.length === 2 ? Math.round((parseInt(parts[0]) / parseInt(parts[1])) * 100) : 0;
    };
    return [
        { name: 'Repayment History', score: parse(scoring.RepaymentHistoryScore), full: scoring.RepaymentHistoryScore },
        { name: 'Amount Owed',       score: parse(scoring.TotalAmountOwedScore),   full: scoring.TotalAmountOwedScore },
        { name: 'Credit Types',      score: parse(scoring.TypesOfCreditScore),     full: scoring.TypesOfCreditScore },
        { name: 'Credit Length',     score: parse(scoring.LengthOfCreditHistoryScore), full: scoring.LengthOfCreditHistoryScore },
        { name: 'No. of Accounts',   score: parse(scoring.NoOfAcctScore),          full: scoring.NoOfAcctScore },
    ];
}

// ── Custom chart tooltip ───────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
            <p style={{ color: '#9ca3af', fontSize: 11, marginBottom: 6 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, fontSize: 12, fontWeight: 600, margin: '2px 0' }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
                </p>
            ))}
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminCreditReview() {
    const { token } = useParams();

    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState('');
    const [reviewData, setReviewData] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted,  setSubmitted]  = useState(false);
    const [decision,   setDecision]   = useState('');

    // ── Admin override state (real-time) ──────────────────────────────────────
    const [overrideClassification, setOverrideClassification] = useState('');
    const [overridePlan,           setOverridePlan]           = useState('');
    const [overrideInstalment,     setOverrideInstalment]     = useState('');
    const [rejectionReason,        setRejectionReason]        = useState('');
    const [adminNotes,             setAdminNotes]             = useState('');

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
        const confirmResult = await Swal.fire({
            icon: finalDecision === 'APPROVE' ? 'question' : 'warning',
            title: finalDecision === 'APPROVE' ? 'Approve Application?' : 'Reject Application?',
            html: finalDecision === 'APPROVE'
                ? `Approve <strong>${customerName}</strong> with classification <strong style="color:${classColour(overrideClassification)}">${overrideClassification}</strong>?<br/><small style="color:#6b7280">OTP sent immediately.</small>`
                : `Reject <strong>${customerName}</strong>?<br/><small style="color:#6b7280">Customer will be notified.</small>`,
            showCancelButton: true,
            confirmButtonText: finalDecision === 'APPROVE' ? 'Yes, Approve & Send OTP' : 'Yes, Reject',
            confirmButtonColor: finalDecision === 'APPROVE' ? '#16a34a' : '#dc2626',
        });
        if (!confirmResult.isConfirmed) return;

        setDecision(finalDecision);
        setSubmitting(true);
        try {
            const payload = {
                decision: finalDecision,
                overrideClassification: overrideClassification || undefined,
                overridePlan:           overridePlan           || undefined,
                overrideInstalment:     overrideInstalment     || undefined,
                rejectionReason:        finalDecision === 'REJECT' ? rejectionReason : undefined,
                adminNotes:             adminNotes || undefined,
            };
            const r = await fetch(`${BACKEND_URL}/api/agent-followup/admin-review/${token}/submit`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
            });
            const data = await r.json();
            if (!r.ok || !data.success) throw new Error(data.message || 'Submission failed');
            setSubmitted(true);
            Swal.fire({
                icon: finalDecision === 'APPROVE' ? 'success' : 'info',
                title: finalDecision === 'APPROVE' ? 'Approved!' : 'Application Rejected',
                text: finalDecision === 'APPROVE' ? `OTP sent to ${customerName}.` : `${customerName} has been notified.`,
            });
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: e.message });
            setDecision('');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Derived data ──────────────────────────────────────────────────────────
    const { followUp, creditReport } = reviewData || {};
    const rawReport = creditReport?.raw_report || [];

    const scoring          = useMemo(() => findBlock(rawReport, 'Scoring'), [rawReport]);
    const summary          = useMemo(() => findBlock(rawReport, 'CreditAccountSummary'), [rawReport]);
    const rating           = useMemo(() => findBlock(rawReport, 'CreditAccountRating'), [rawReport]);
    const enquiryInput     = useMemo(() => findBlock(rawReport, 'EnquiryInput'), [rawReport]);
    const paymentHeader    = useMemo(() => findBlock(rawReport, 'AccountMonthlyPaymentHeader'), [rawReport]);
    const agreements       = useMemo(() => findArray(rawReport, 'CreditAgreementSummary'), [rawReport]);
    const paymentHistories = useMemo(() => findArray(rawReport, 'AccountMonthlyPaymentHistory'), [rawReport]);
    const personalDetails  = useMemo(() => findBlock(rawReport, 'PersonalDetailsSummary'), [rawReport]);

    // Decision Engine fields
    const de = creditReport || {};
    const deRiskLevel = de.risk_level || '';
    const deDecision  = de.decision   || '';
    const deColour    = deColor(deRiskLevel, deDecision);

    // Chart data
    const paymentHistoryChartData = useMemo(() => buildPaymentHistoryData(paymentHistories, paymentHeader), [paymentHistories, paymentHeader]);
    const debtTrendData           = useMemo(() => buildDebtTrendData(agreements), [agreements]);
    const arrearsTrendData        = useMemo(() => buildArrearsTrend(paymentHistories, paymentHeader), [paymentHistories, paymentHeader]);
    const scoreBreakdownData      = useMemo(() => buildScoreBreakdown(scoring), [scoring]);

    // Real-time computed values
    const effectivePlan       = overridePlan      || followUp?.plan            || '—';
    const effectiveInstalment = overrideInstalment || followUp?.installmentOption || '—';
    const effectiveClass      = overrideClassification || followUp?.creditStatus   || '—';

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT }}>
            <div style={{ background: '#000', borderRadius: 20, padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <Loader2 size={36} style={{ color: ACCENT, animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading credit review data…</p>
            </div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT, padding: 16 }}>
            <div style={{ background: '#000', borderRadius: 20, padding: 48, maxWidth: 420, width: '100%', textAlign: 'center' }}>
                <AlertTriangle size={40} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
                <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Access Error</h2>
                <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>{error}</p>
                <a href={`${BACKEND_URL}/admin/`} style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: ACCENT, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
                    Go to Admin Login
                </a>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: ACCENT, padding: '24px 16px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div style={{ background: '#000', borderRadius: 16, padding: '20px 24px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: ACCENT, margin: 0 }}>Credit Application Review</h1>
                        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                            BVN: <span style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{de.bvn || followUp?.bvn || '—'}</span>
                            {' · '}
                            <span style={{ color: '#6b7280' }}>{enquiryInput?.EnquiryDate || (de.created_at || '').split('T')[0] || ''}</span>
                        </p>
                    </div>
                    {submitted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: decision === 'APPROVE' ? '#16a34a22' : '#dc262622', border: `1px solid ${decision === 'APPROVE' ? '#16a34a' : '#dc2626'}`, borderRadius: 8 }}>
                            {decision === 'APPROVE' ? <CheckCircle size={16} style={{ color: '#16a34a' }} /> : <XCircle size={16} style={{ color: '#dc2626' }} />}
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

                {/* ── Top KPI Strip — Decision Engine quick metrics ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 20 }}>
                    <Stat label="Bureau Score (Raw)"  value={de.bureau_score_raw        ?? '—'} accent={ACCENT} />
                    <Stat label="Normalised Score"    value={de.bureau_score_normalized  ?? '—'} accent={ACCENT} />
                    <Stat label="FirstCentral Score"  value={de.first_central_score      ?? '—'} accent={ACCENT} />
                    <Stat label="Risk Level"          value={<Badge label={deRiskLevel || '—'} colour={deColour} />} />
                    <Stat label="DE Decision"         value={<Badge label={deDecision  || '—'} colour={deColour} />} />
                    <Stat label="Prob. of Default"    value={de.probability_of_default != null ? `${(de.probability_of_default * 100).toFixed(1)}%` : '—'} accent={de.probability_of_default > 0.7 ? '#dc2626' : de.probability_of_default > 0.4 ? '#d97706' : '#16a34a'} />
                    <Stat label="Total Accounts"      value={de.total_accounts          ?? summary?.TotalAccounts ?? '—'} />
                    <Stat label="Accounts in Arrears" value={de.accounts_in_arrears      ?? '—'} accent={de.accounts_in_arrears > 0 ? '#dc2626' : '#16a34a'} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,360px)', gap: 20, alignItems: 'start' }}>

                    {/* ══════════════ LEFT COLUMN ══════════════ */}
                    <div>

                        {/* ── DECISION ENGINE Section ───────────────────────────── */}
                        <Section title="Decision Engine" icon={Zap} accentColour={deColour}>
                            {/* Hero banner */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: `${deColour}11`, border: `1px solid ${deColour}44`, borderRadius: 10, padding: '16px 20px', marginBottom: 16, gap: 12 }}>
                                <div>
                                    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Decision Engine Verdict</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Badge label={deDecision  || 'N/A'} colour={deColour} />
                                        <Badge label={deRiskLevel || 'N/A'} colour={deColour} />
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Recommended Amount</p>
                                    <p style={{ fontSize: 24, fontWeight: 800, color: deColour, margin: 0 }}>
                                        ₦{parseFloat(de.recommended_amount || 0).toLocaleString()}
                                    </p>
                                    <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                                        {de.recommended_duration_months ? `Over ${de.recommended_duration_months} months` : 'Duration N/A'}
                                        {de.recommended_interest_rate != null ? ` @ ${de.recommended_interest_rate}%` : ''}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                                <Stat label="Outstanding Debt"     value={`₦${parseFloat(de.total_outstanding_debt  || 0).toLocaleString()}`} accent={parseFloat(de.total_outstanding_debt) > 0 ? '#d97706' : '#16a34a'} />
                                <Stat label="Monthly Instalment"   value={`₦${parseFloat(de.total_monthly_instalment || 0).toLocaleString()}`} />
                                <Stat label="Risk Points"          value={de.risk_points ?? '—'} accent={deColour} />
                                <Stat label="Accounts Good Standing" value={de.accounts_in_good_standing ?? '—'} accent="#16a34a" />
                            </div>

                            <InfoRow label="Applicant"   value={de.applicant_name}   />
                            <InfoRow label="Gender"      value={de.applicant_gender} />
                            <InfoRow label="Date of Birth" value={de.applicant_dob}  />
                            <InfoRow label="Enquiry ID"  value={de.id} />
                            <InfoRow label="Status"      value={de.status} />
                            <InfoRow label="Created"     value={de.created_at ? new Date(de.created_at).toLocaleString() : '—'} />

                            {/* System Flags from Decision Engine */}
                            {Array.isArray(de.reasons) && de.reasons.length > 0 && (
                                <div style={{ marginTop: 14 }}>
                                    <p style={{ fontSize: 11, color: deColour, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Decision Engine Flags</p>
                                    {de.reasons.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: deColour, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, color: '#e5e7eb' }}>{r}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* ── CHARTS ─────────────────────────────────────────────── */}

                        {/* Chart 1 — Score Breakdown Bar Chart */}
                        {scoreBreakdownData.length > 0 && (
                            <Section title="Score Breakdown" icon={TrendingUp}>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={scoreBreakdownData} margin={{ top: 8, right: 10, left: -10, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                                        <Tooltip content={<DarkTooltip />} formatter={(v) => [`${v}%`, 'Score %']} />
                                        <Bar dataKey="score" radius={[4,4,0,0]}>
                                            {scoreBreakdownData.map((entry, i) => (
                                                <Cell key={i} fill={entry.score >= 60 ? '#16a34a' : entry.score >= 40 ? '#d97706' : '#dc2626'} />
                                            ))}
                                        </Bar>
                                        <ReferenceLine y={60} stroke="#16a34a" strokeDasharray="4 2" label={{ value: 'Good', fill: '#16a34a', fontSize: 10, position: 'right' }} />
                                        <ReferenceLine y={40} stroke="#d97706" strokeDasharray="4 2" label={{ value: 'Fair', fill: '#d97706', fontSize: 10, position: 'right' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <p style={{ fontSize: 10, color: '#4b5563', marginTop: 4, textAlign: 'center' }}>Percentage of maximum possible score per category</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 6, marginTop: 10 }}>
                                    {scoreBreakdownData.map(d => (
                                        <div key={d.name} style={{ background: '#111', border: '1px solid #222', borderRadius: 6, padding: '6px 10px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 11, color: '#6b7280' }}>{d.name}</span>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: d.score >= 60 ? '#16a34a' : d.score >= 40 ? '#d97706' : '#dc2626' }}>{d.full}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Chart 2 — Monthly Payment History (24 months) */}
                        {paymentHistoryChartData.length > 0 && (
                            <Section title="Monthly Payment History (24 Months)" icon={CreditCard}>
                                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                                    Average arrears score across all accounts by month. Higher scores indicate worse performance.
                                </p>
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart data={paymentHistoryChartData} margin={{ top: 8, right: 10, left: -10, bottom: 50 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                                        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                                        <Tooltip content={<DarkTooltip />} />
                                        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 10 }} />
                                        <ReferenceLine y={600} stroke="#d97706" strokeDasharray="4 2" label={{ value: 'Watch', fill: '#d97706', fontSize: 10 }} />
                                        <Line type="monotone" dataKey="avgScore"     stroke={deColour}   strokeWidth={2} dot={{ r: 3, fill: deColour }} name="Avg Arrears Score" />
                                        <Line type="monotone" dataKey="badAccounts" stroke="#dc2626"   strokeWidth={2} dot={{ r: 3, fill: '#dc2626' }} name="Accounts in Arrears" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Section>
                        )}

                        {/* Chart 3 — Outstanding Debt Over Time */}
                        {debtTrendData.length > 0 && (
                            <Section title="Outstanding Debt Over Time" icon={TrendingUp} defaultOpen={false}>
                                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                                    Total outstanding balance and arrears by year loans were opened.
                                </p>
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart data={debtTrendData} margin={{ top: 8, right: 10, left: 10, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                                        <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                                        <Tooltip content={<DarkTooltip />} formatter={v => `₦${v.toLocaleString()}`} />
                                        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 8 }} />
                                        <Line type="monotone" dataKey="outstanding" stroke={deColour}   strokeWidth={2} dot={{ r: 4 }} name="Outstanding Debt (₦)" />
                                        <Line type="monotone" dataKey="arrears"     stroke="#dc2626"   strokeWidth={2} dot={{ r: 4 }} name="Arrears (₦)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Section>
                        )}

                        {/* Chart 4 — Arrears Trend */}
                        {arrearsTrendData.length > 0 && (
                            <Section title="Arrears Trend (24 Months)" icon={AlertTriangle} defaultOpen={false}>
                                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                                    Count of accounts in arrears vs. performing each month.
                                </p>
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={arrearsTrendData} margin={{ top: 8, right: 10, left: -10, bottom: 50 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                                        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip content={<DarkTooltip />} />
                                        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 10 }} />
                                        <Bar dataKey="arrears"    fill="#dc2626" radius={[3,3,0,0]} name="Accounts in Arrears" />
                                        <Bar dataKey="performing" fill="#16a34a" radius={[3,3,0,0]} name="Performing Accounts" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Section>
                        )}

                        {/* ── Credit Account Summary ────────────────────────────── */}
                        {summary && (
                            <Section title="Account Summary" icon={CreditCard}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                                    <Stat label="Total Accounts"     value={summary.TotalAccounts} />
                                    <Stat label="In Arrears"         value={summary.TotalAccountarrear} accent={Number(summary.TotalAccountarrear) > 0 ? '#dc2626' : '#16a34a'} />
                                    <Stat label="Outstanding Debt"   value={`₦${parseFloat((summary.TotalOutstandingdebt||'0').replace(/,/g,'') || 0).toLocaleString()}`} accent="#d97706" />
                                    <Stat label="Monthly Instalment" value={`₦${parseFloat((summary.TotalMonthlyInstalment||'0').replace(/,/g,'') || 0).toLocaleString()}`} />
                                </div>
                                <InfoRow label="Judgements"          value={summary.TotalNumberofJudgement}  highlight={Number(summary.TotalNumberofJudgement) > 0 ? '#dc2626' : '#16a34a'} />
                                <InfoRow label="Dishonoured Cheques" value={summary.TotalNumberofDishonoured} highlight={Number(summary.TotalNumberofDishonoured) > 0 ? '#dc2626' : '#16a34a'} />
                                <InfoRow label="Amount in Arrears"   value={`₦${parseFloat((summary.Amountarrear||'0').replace(/,/g,'') || 0).toLocaleString()}`} />
                                <InfoRow label="Last Judgement"      value={summary.LastJudgementDate} />
                            </Section>
                        )}

                        {/* ── Credit Agreements List ────────────────────────────── */}
                        {agreements.length > 0 && (
                            <Section title={`Credit Agreements (${agreements.length})`} icon={FileText} defaultOpen={false}>
                                {agreements.map((ag, i) => {
                                    const perf  = ag.PerformanceStatus || '';
                                    const isGood = perf.toLowerCase() === 'performing';
                                    const col   = isGood ? '#16a34a' : '#dc2626';
                                    return (
                                        <div key={i} style={{ background: '#111', border: `1px solid ${col}33`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb', margin: 0 }}>{ag.SubscriberName}</p>
                                                    <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Acc: {ag.AccountNo} · Opened: {ag.DateAccountOpened}</p>
                                                </div>
                                                <Badge label={perf || 'Unknown'} colour={col} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                                                <div><p style={{ fontSize: 10, color: '#6b7280' }}>Opening Balance</p><p style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>₦{ag.OpeningBalanceAmt}</p></div>
                                                <div><p style={{ fontSize: 10, color: '#6b7280' }}>Current Balance</p><p style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>₦{ag.CurrentBalanceAmt || '0.00'}</p></div>
                                                <div><p style={{ fontSize: 10, color: '#6b7280' }}>Amount Overdue</p><p style={{ fontSize: 12, fontWeight: 600, color: parseFloat((ag.AmountOverdue||'0').replace(/,/g,'')) > 0 ? '#dc2626' : '#16a34a' }}>₦{ag.AmountOverdue || '0.00'}</p></div>
                                            </div>
                                            <p style={{ fontSize: 11, color: '#4b5563', marginTop: 6 }}>Status: {ag.AccountStatus} · {ag.RepaymentFrequency}</p>
                                        </div>
                                    );
                                })}
                            </Section>
                        )}

                        {/* ── Customer Details ──────────────────────────────────── */}
                        <Section title="Customer Details" icon={User}>
                            <InfoRow label="Full Name"    value={`${followUp?.firstName || ''} ${followUp?.lastName || ''}`.trim() || personalDetails?.Surname} />
                            <InfoRow label="BVN"          value={followUp?.bvn} />
                            <InfoRow label="Mobile"       value={followUp?.mobileNumber} />
                            <InfoRow label="Email"        value={followUp?.customerEmail} />
                            <InfoRow label="Home Address" value={followUp?.homeAddress} />
                            <InfoRow label="Usage Type"   value={followUp?.usageType} />
                            {followUp?.usageType === 'personal' && <>
                                <InfoRow label="Work Address"   value={followUp?.workAddress} />
                                <InfoRow label="Monthly Income" value={followUp?.monthlyIncome ? `₦${parseFloat(followUp.monthlyIncome).toLocaleString()}` : '—'} />
                            </>}
                            {followUp?.usageType === 'commercial' && <>
                                <InfoRow label="Store Address"  value={followUp?.storeAddress} />
                                <InfoRow label="Monthly Sales"  value={followUp?.monthlySales ? `₦${parseFloat(followUp.monthlySales).toLocaleString()}` : '—'} />
                            </>}
                            <InfoRow label="Guarantor Email" value={followUp?.guarantorEmail} />
                            <InfoRow label="Internal DTI"    value={followUp?.dti != null ? `${parseFloat(followUp.dti).toFixed(2)}%` : '—'} />
                        </Section>

                        {/* ── Enquiry Info ──────────────────────────────────────── */}
                        {enquiryInput && (
                            <Section title="Enquiry Details" icon={RefreshCw} defaultOpen={false}>
                                <InfoRow label="Enquiry Date" value={enquiryInput.EnquiryDate} />
                                <InfoRow label="Enquiry Type" value={enquiryInput.EnquiryType} />
                                <InfoRow label="Subscriber"   value={enquiryInput.SubscriberName} />
                                <InfoRow label="Match Rate"   value={`${enquiryInput.MatchRate}%`} />
                            </Section>
                        )}

                    </div>

                    {/* ══════════════ RIGHT COLUMN — Admin Decision Panel ══════════════ */}
                    <div style={{ position: 'sticky', top: 24 }}>

                        {/* ── System Recommendation — based on Decision Engine ── */}
                        <div style={{
                            background: '#000', border: `2px solid ${deColour}`,
                            borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                                <Zap size={14} style={{ color: deColour }} />
                                <p style={{ fontSize: 11, color: deColour, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Decision Engine Recommendation</p>
                            </div>
                            <Badge label={deDecision  || 'N/A'} colour={deColour} />
                            <div style={{ marginTop: 8 }}>
                                <Badge label={deRiskLevel || 'N/A'} colour={deColour} />
                            </div>
                            {de.probability_of_default != null && (
                                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
                                    {(de.probability_of_default * 100).toFixed(1)}% probability of default
                                </p>
                            )}
                            {parseFloat(de.recommended_amount || 0) > 0 && (
                                <div style={{ marginTop: 10, padding: '8px 12px', background: `${deColour}11`, borderRadius: 8 }}>
                                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Recommended Amount</p>
                                    <p style={{ fontSize: 18, fontWeight: 800, color: deColour, margin: 0 }}>₦{parseFloat(de.recommended_amount).toLocaleString()}</p>
                                </div>
                            )}
                        </div>

                        {/* ── Live Override Preview ─────────────────────────────── */}
                        <div style={{ background: '#0a0a0a', border: '1px solid #1f2937', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                            <p style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, fontWeight: 600 }}>Live Override Preview</p>
                            <InfoRow label="Classification" value={<Badge label={effectiveClass} colour={classColour(effectiveClass)} />} />
                            <InfoRow label="Plan"           value={<span style={{ color: overridePlan ? ACCENT : '#e5e7eb', fontWeight: overridePlan ? 700 : 400 }}>{effectivePlan}</span>} />
                            <InfoRow label="Instalment"     value={<span style={{ color: overrideInstalment ? ACCENT : '#e5e7eb', fontWeight: overrideInstalment ? 700 : 400 }}>{effectiveInstalment}</span>} />
                        </div>

                        {/* ── Admin Overrides ───────────────────────────────────── */}
                        <div style={{ background: '#000', border: '1px solid #1f2937', borderRadius: 14, padding: 20, marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <Shield size={15} style={{ color: ACCENT }} />
                                <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.8 }}>Admin Overrides</span>
                            </div>

                            {/* Classification */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: ACCENT, marginBottom: 6, fontWeight: 600 }}>Override Classification</label>
                                <select
                                    value={overrideClassification}
                                    onChange={e => setOverrideClassification(e.target.value)}
                                    disabled={submitted}
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: `1px solid ${classColour(overrideClassification)}`, borderRadius: 8, color: classColour(overrideClassification), fontSize: 14, fontWeight: 700, outline: 'none' }}
                                >
                                    <option value="GREEN" style={{ color: '#16a34a' }}>GREEN — Approve</option>
                                    <option value="AMBER" style={{ color: '#d97706' }}>AMBER — Conditional</option>
                                    <option value="RED"   style={{ color: '#dc2626' }}>RED — Decline</option>
                                </select>
                            </div>

                            {/* Plan */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: ACCENT, marginBottom: 6, fontWeight: 600 }}>Override Plan</label>
                                <input
                                    type="text"
                                    value={overridePlan}
                                    onChange={e => setOverridePlan(e.target.value)}
                                    disabled={submitted}
                                    placeholder={followUp?.plan || 'e.g. Easy 35'}
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Instalment */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: ACCENT, marginBottom: 6, fontWeight: 600 }}>Override Instalment Duration</label>
                                <input
                                    type="text"
                                    value={overrideInstalment}
                                    onChange={e => setOverrideInstalment(e.target.value)}
                                    disabled={submitted}
                                    placeholder={followUp?.installmentOption || 'e.g. 12 months'}
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Rejection Reason */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 11, color: '#ef4444', marginBottom: 6, fontWeight: 600 }}>
                                    Rejection Reason <span style={{ color: '#6b7280' }}>(required if rejecting)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                    disabled={submitted}
                                    placeholder="Reason shown to customer…"
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Admin Notes */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 6, fontWeight: 600 }}>Internal Notes (optional)</label>
                                <textarea
                                    rows={2}
                                    value={adminNotes}
                                    onChange={e => setAdminNotes(e.target.value)}
                                    disabled={submitted}
                                    placeholder="Internal notes only…"
                                    style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #1f2937', borderRadius: 8, color: '#9ca3af', fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Approve / Reject */}
                            {!submitted ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <button
                                        onClick={() => handleDecision('REJECT')}
                                        disabled={submitting}
                                        style={{ padding: '14px 0', borderRadius: 10, border: '1px solid #dc2626', background: '#dc262618', color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                    >
                                        {submitting && decision === 'REJECT' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={16} />}
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleDecision('APPROVE')}
                                        disabled={submitting}
                                        style={{ padding: '14px 0', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                    >
                                        {submitting && decision === 'APPROVE' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
                                        Approve
                                    </button>
                                </div>
                            ) : (
                                <div style={{ padding: '14px 0', borderRadius: 10, background: decision === 'APPROVE' ? '#16a34a' : '#374151', color: '#fff', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>
                                    {decision === 'APPROVE' ? '✓ Approved — OTP Sent' : '✗ Application Rejected'}
                                </div>
                            )}
                        </div>

                        {/* ── Plan Details (read-only, live) ────────────────────── */}
                        <Section title="Plan & Instalment" icon={FileText}>
                            <InfoRow label="Plan"                  value={effectivePlan}       highlight={overridePlan ? ACCENT : undefined} />
                            <InfoRow label="Instalment"            value={effectiveInstalment}  highlight={overrideInstalment ? ACCENT : undefined} />
                            <InfoRow label="Classification"        value={<Badge label={effectiveClass} colour={classColour(effectiveClass)} />} />
                            <InfoRow label="DE Decision"           value={<Badge label={deDecision  || '—'} colour={deColour} />} />
                            <InfoRow label="DE Risk Level"         value={<Badge label={deRiskLevel || '—'} colour={deColour} />} />
                        </Section>

                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
                @media (max-width: 860px) {
                    .review-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}