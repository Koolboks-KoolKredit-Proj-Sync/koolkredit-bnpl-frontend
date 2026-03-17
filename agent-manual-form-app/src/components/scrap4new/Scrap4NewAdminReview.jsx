import React, { useState, useEffect } from 'react';
import {
    Loader2, CheckCircle, AlertTriangle, Camera, Video,
    User, Phone, MapPin, BarChart3, Shield
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import Logo from '../LogoWithVariant.jsx';

const ACCENT      = '#f7623b';
const BACKEND_URL = 'https://web-production-80fc1.up.railway.app';

function ScoreBar({ value, max = 1 }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: ACCENT }}
                />
            </div>
            <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
        </div>
    );
}

function MediaThumb({ url, type = 'image', label }) {
    if (!url) return (
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
            <span className="text-gray-600 text-xs">No file</span>
        </div>
    );

    const fullUrl = url.startsWith('http') ? url
        : type === 'video'
            ? `https://res.cloudinary.com/dqf7vhuxq/video/upload/${url}`
            : `https://res.cloudinary.com/dqf7vhuxq/image/upload/${url}`;

    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            {type === 'video' ? (
                <video
                    src={fullUrl}
                    controls
                    className="w-full rounded-lg border border-gray-700"
                    style={{ maxHeight: 160 }}
                />
            ) : (
                <a href={fullUrl} target="_blank" rel="noreferrer">
                    <img
                        src={fullUrl}
                        alt={label}
                        className="w-full rounded-lg border border-gray-700 object-cover"
                        style={{ maxHeight: 160 }}
                    />
                </a>
            )}
        </div>
    );
}

function Scrap4NewAdminReview() {
    const { token } = useParams();

    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState('');
    const [evaluation,  setEvaluation]  = useState(null);
    const [scrapForm,   setScrapForm]   = useState(null);
    const [reduction,   setReduction]   = useState('');
    const [adminNotes,  setAdminNotes]  = useState('');
    const [submitting,  setSubmitting]  = useState(false);
    const [submitted,   setSubmitted]   = useState(false);

    useEffect(() => {
        if (!token) { setError('Invalid review link.'); setLoading(false); return; }
        fetch(`${BACKEND_URL}/api/scrap-evaluation/admin-review/${token}/data/`, {
            credentials: 'include',
        })
            .then(r => {
                if (r.status === 403) throw new Error('Please log in to the admin panel first.');
                if (!r.ok) throw new Error(`Server error ${r.status}`);
                return r.json();
            })
            .then(data => {
                setEvaluation(data.evaluation);
                setScrapForm(data.scrap_form);
                setReduction(data.evaluation.ml_reduction_pct);
                setLoading(false);
            })
            .catch(e => { setError(e.message); setLoading(false); });
    }, [token]);

    const handleSubmit = async () => {
        const pct = parseFloat(reduction);
        if (isNaN(pct) || pct < 0 || pct > 7) {
            Swal.fire({ icon: 'warning', title: 'Invalid', text: 'Reduction must be between 0% and 7%.' });
            return;
        }

        const confirm = await Swal.fire({
            icon:              'question',
            title:             'Confirm Offer',
            html:              `Send a <strong>${pct.toFixed(1)}%</strong> reduction offer to <strong>${evaluation.customer_name}</strong>?<br/><br/>New price: <strong>₦${(parseFloat(evaluation.grand_total) * (1 - pct / 100)).toLocaleString()}</strong>`,
            showCancelButton:  true,
            confirmButtonText: 'Yes, send offer',
            confirmButtonColor: ACCENT,
        });

        if (!confirm.isConfirmed) return;

        setSubmitting(true);
        try {
            const r = await fetch(`${BACKEND_URL}/api/scrap-evaluation/admin-review/${token}/submit/`, {
                method:      'POST',
                credentials: 'include',
                headers:     { 'Content-Type': 'application/json' },
                body:        JSON.stringify({ reduction_pct: pct, admin_notes: adminNotes }),
            });
            const data = await r.json();
            if (r.ok && data.success) {
                setSubmitted(true);
                Swal.fire({
                    icon:  'success',
                    title: 'Offer Sent!',
                    text:  `A ${pct.toFixed(1)}% reduction offer has been emailed to ${evaluation.customer_name}.`,
                });
            } else {
                throw new Error(data.error || 'Submission failed');
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: e.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: ACCENT }}>
            <div className="bg-black rounded-2xl p-10 flex flex-col items-center gap-4">
                <Loader2 size={40} className="animate-spin" style={{ color: ACCENT }} />
                <p className="text-gray-400 text-sm">Loading evaluation data…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: ACCENT }}>
            <div className="bg-black rounded-2xl p-10 max-w-md w-full text-center">
                <AlertTriangle size={40} className="mx-auto mb-4 text-red-400" />
                <h2 className="text-white font-bold text-xl mb-2">Access Error</h2>
                <p className="text-gray-400 text-sm mb-6">{error}</p>
                <a
                    href="https://web-production-80fc1.up.railway.app/admin/"
                    className="inline-block px-6 py-3 rounded-lg font-bold text-white hover:opacity-90"
                    style={{ backgroundColor: ACCENT }}
                >
                    Go to Admin Login
                </a>
            </div>
        </div>
    );

    const grandTotal    = parseFloat(evaluation.grand_total);
    const mlReduction   = parseFloat(evaluation.ml_reduction_pct);
    const currentPct    = parseFloat(reduction) || 0;
    const newPrice      = grandTotal * (1 - currentPct / 100);

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: ACCENT }}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="bg-black rounded-xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: ACCENT }}>
                            Scrap4New Admin Review
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Reference: <span className="text-white font-mono">{evaluation.reference_id}</span>
                            {' · '}
                            <span
                                className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: evaluation.status === 'awaiting_admin' ? '#f59e0b' : ACCENT }}
                            >
                {evaluation.status.replace(/_/g, ' ')}
              </span>
                        </p>
                    </div>
                    {submitted && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/50 rounded-lg">
                            <CheckCircle size={16} className="text-green-400" />
                            <span className="text-green-400 text-sm font-semibold">Offer Sent</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left col — customer + scrap details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Customer Details */}
                        <div className="bg-black rounded-xl p-5" style={{ border: `1px solid #1f2937` }}>
                            <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: ACCENT }}>
                                Customer Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {[
                                    { icon: User,   label: 'Name',     value: evaluation.customer_name },
                                    { icon: Phone,  label: 'Mobile',   value: evaluation.mobile_number },
                                    { icon: MapPin, label: 'Address',  value: scrapForm?.house_address },
                                    { icon: MapPin, label: 'Scrap Location', value: scrapForm?.location_of_scrap },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-start gap-2">
                                        <Icon size={14} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
                                        <div>
                                            <p className="text-gray-500 text-xs">{label}</p>
                                            <p className="text-white">{value || '—'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Scrap Brand</p>
                                    <p className="text-white">{scrapForm?.scrap_brand}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Receipt Available</p>
                                    <p className="text-white">{scrapForm?.receipt_available}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-gray-500 text-xs mb-1">Working Condition</p>
                                    <p className="text-white bg-gray-900 p-2 rounded-lg text-xs leading-relaxed">
                                        {scrapForm?.working_condition}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-gray-500 text-xs mb-1">Selected Issues</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {scrapForm?.selected_issues?.split(',').map((issue, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-full text-xs text-white"
                                                style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                            >
                        {issue.trim()}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="bg-black rounded-xl p-5" style={{ border: '1px solid #1f2937' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Camera size={16} style={{ color: ACCENT }} />
                                <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>Photos</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <MediaThumb url={scrapForm?.receipt_or_affidavit} label="Receipt/Affidavit" />
                                <MediaThumb url={scrapForm?.selfie_with_scrap}    label="Selfie with Scrap" />
                                <MediaThumb url={scrapForm?.scrap_body}           label="Body" />
                                <MediaThumb url={scrapForm?.scrap_top}            label="Top" />
                                <MediaThumb url={scrapForm?.scrap_compressor}     label="Compressor" />
                                <MediaThumb url={scrapForm?.scrap_inside}         label="Inside" />
                            </div>
                        </div>

                        {/* Videos */}
                        <div className="bg-black rounded-xl p-5" style={{ border: '1px solid #1f2937' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Video size={16} style={{ color: ACCENT }} />
                                <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>Videos</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <MediaThumb url={scrapForm?.video_body}       type="video" label="Body Video" />
                                <MediaThumb url={scrapForm?.video_top}        type="video" label="Top Video" />
                                <MediaThumb url={scrapForm?.video_compressor} type="video" label="Compressor Video" />
                                <MediaThumb url={scrapForm?.video_inside}     type="video" label="Inside Video" />
                            </div>
                        </div>

                    </div>

                    {/* Right col — ML results + review form */}
                    <div className="space-y-6">

                        {/* Grand total */}
                        <div
                            className="bg-black rounded-xl p-5 text-center"
                            style={{ border: `2px solid ${ACCENT}` }}
                        >
                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Product Grand Total</p>
                            <p className="text-3xl font-bold" style={{ color: ACCENT }}>
                                ₦{grandTotal.toLocaleString()}
                            </p>
                        </div>

                        {/* ML Scores */}
                        <div className="bg-black rounded-xl p-5" style={{ border: '1px solid #1f2937' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 size={16} style={{ color: ACCENT }} />
                                <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
                                    ML Evaluation
                                </h2>
                            </div>

                            {evaluation.ml_ai_flag && (
                                <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-500/40">
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertTriangle size={14} className="text-red-400" />
                                        <span className="text-red-400 text-xs font-semibold">AI/Fake Media Detected</span>
                                    </div>
                                    <p className="text-red-300 text-xs">{evaluation.ml_ai_flag_reason}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-400 text-xs">Condition Score</span>
                                    </div>
                                    <ScoreBar value={parseFloat(evaluation.ml_condition_score)} />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-400 text-xs">Image Quality</span>
                                    </div>
                                    <ScoreBar value={parseFloat(evaluation.ml_image_score)} />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-400 text-xs">Video Quality</span>
                                    </div>
                                    <ScoreBar value={parseFloat(evaluation.ml_video_score)} />
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                                <p className="text-gray-400 text-xs mb-1">ML Suggested Reduction</p>
                                <p className="text-3xl font-bold" style={{ color: ACCENT }}>
                                    {mlReduction.toFixed(1)}%
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Max allowed: 7%
                                </p>
                            </div>

                            <details className="mt-3">
                                <summary className="text-gray-600 text-xs cursor-pointer hover:text-gray-400">
                                    View ML Reasoning
                                </summary>
                                <pre className="mt-2 text-gray-600 text-xs whitespace-pre-wrap bg-gray-950 p-2 rounded-lg overflow-auto max-h-40">
                  {evaluation.ml_reasoning}
                </pre>
                            </details>
                        </div>

                        {/* Admin Review Form */}
                        <div className="bg-black rounded-xl p-5" style={{ border: `1px solid #374151` }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield size={16} style={{ color: ACCENT }} />
                                <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
                                    Your Review
                                </h2>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-medium mb-2" style={{ color: ACCENT }}>
                                    Final Reduction % (0–7) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="7"
                                    step="0.1"
                                    value={reduction}
                                    onChange={e => setReduction(e.target.value)}
                                    disabled={submitted}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-xl font-bold text-center focus:outline-none disabled:opacity-50"
                                    onFocus={e => e.target.style.borderColor = ACCENT}
                                    onBlur={e  => e.target.style.borderColor = '#374151'}
                                />
                            </div>

                            {/* Live price preview */}
                            <div
                                className="p-3 rounded-lg mb-4 text-center"
                                style={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                            >
                                <p className="text-gray-500 text-xs mb-1">Customer pays</p>
                                <p className="text-xl font-bold text-white">
                                    ₦{isNaN(newPrice) ? '—' : newPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs mt-1" style={{ color: ACCENT }}>
                                    {isNaN(currentPct) ? '' : `${currentPct.toFixed(1)}% off ₦${grandTotal.toLocaleString()}`}
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-medium mb-2" style={{ color: ACCENT }}>
                                    Admin Notes (optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={adminNotes}
                                    onChange={e => setAdminNotes(e.target.value)}
                                    disabled={submitted}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none resize-none disabled:opacity-50"
                                    onFocus={e => e.target.style.borderColor = ACCENT}
                                    onBlur={e  => e.target.style.borderColor = '#374151'}
                                    placeholder="Optional notes visible in admin dashboard…"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || submitted}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: submitted ? '#16a34a' : ACCENT }}
                            >
                                {submitting ? (
                                    <><Loader2 className="animate-spin" size={18} /> Sending Offer…</>
                                ) : submitted ? (
                                    <><CheckCircle size={18} /> Offer Sent</>
                                ) : (
                                    'Send Offer to Customer →'
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Scrap4NewAdminReview;