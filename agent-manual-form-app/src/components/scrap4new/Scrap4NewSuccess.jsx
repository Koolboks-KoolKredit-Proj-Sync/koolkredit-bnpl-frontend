import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Mail, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../LogoWithVariant.jsx';

const ACCENT = '#f7623b';

function Scrap4NewSuccess() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const context   = location.state || JSON.parse(sessionStorage.getItem('scrap4newContext') || '{}');

    const [step, setStep] = useState(0);

    // Animate through steps to show progress
    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 800),
            setTimeout(() => setStep(2), 1800),
            setTimeout(() => setStep(3), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const steps = [
        { icon: CheckCircle,    label: 'Submission received',         done: step >= 1 },
        { icon: Shield,         label: 'AI evaluation in progress',   done: step >= 2 },
        { icon: Mail,           label: 'Admin review & offer pending', done: step >= 3 },
    ];

    const maskedPhone = context.mobileNumber
        ? context.mobileNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1***$3')
        : 'your registered number';

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
            style={{ backgroundColor: ACCENT }}
        >
            <div className="w-full max-w-lg bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-10">

                <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
                    <Logo size="large" />
                </div>

                {/* Success icon */}
                <div className="flex justify-center mb-6">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${ACCENT}20`, border: `3px solid ${ACCENT}` }}
                    >
                        <CheckCircle size={40} style={{ color: ACCENT }} />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: ACCENT }}>
                    Submission Successful!
                </h1>
                <p className="text-gray-400 text-sm text-center mb-2">
                    Reference: <span className="text-white font-mono font-semibold">{context.referenceId || '—'}</span>
                </p>
                <p className="text-gray-400 text-sm text-center mb-8">
                    Your Scrap4New submission is now under technical evaluation.
                </p>

                {/* Progress steps */}
                <div className="space-y-3 mb-8">
                    {steps.map(({ icon: Icon, label, done }, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
                            style={{
                                backgroundColor: done ? `${ACCENT}15` : '#111827',
                                border: `1px solid ${done ? ACCENT : '#374151'}`,
                                opacity: done ? 1 : 0.5,
                            }}
                        >
                            <Icon
                                size={20}
                                style={{ color: done ? ACCENT : '#6b7280', flexShrink: 0 }}
                            />
                            <span
                                className="text-sm font-medium"
                                style={{ color: done ? '#f9fafb' : '#9ca3af' }}
                            >
                {label}
              </span>
                            {done && (
                                <span
                                    className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: ACCENT, color: 'white' }}
                                >
                  ✓
                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* What to expect */}
                <div
                    className="rounded-lg p-4 mb-6"
                    style={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Mail size={16} style={{ color: ACCENT }} />
                        <h3 className="text-sm font-semibold text-white">Check Your Email</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        An acknowledgement has been sent to your registered email address.
                        Once our AI evaluation and admin review are complete, you will receive a
                        <strong className="text-white"> trade-in offer email</strong> with an
                        Accept or Reject button.
                    </p>
                </div>

                {/* Warning */}
                <div
                    className="rounded-lg p-4 mb-8"
                    style={{ backgroundColor: '#7f1d1d20', border: '1px solid #7f1d1d60' }}
                >
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-xs leading-relaxed">
                            <strong>Important:</strong> Any falsehood detected in your submitted
                            images or videos will result in an <strong>increased percentage reduction</strong>{' '}
                            on the product price. Ensure all media is genuine.
                        </p>
                    </div>
                </div>

                {/* What happens with PIN */}
                <div
                    className="rounded-lg p-4 mb-8"
                    style={{ backgroundColor: '#111827', border: `1px solid #374151` }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={16} style={{ color: ACCENT }} />
                        <h3 className="text-sm font-semibold text-white">After You Accept the Offer</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        A 6-digit verification PIN will be sent to{' '}
                        <span className="text-white font-medium">{maskedPhone}</span> and your
                        email. You will use this PIN to complete the trade-in process.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/scrap4new-pin', { state: context })}
                        className="flex-1 py-3 rounded-lg font-bold text-white hover:opacity-90 transition cursor-pointer"
                        style={{ backgroundColor: ACCENT }}
                    >
                        I Already Have a PIN →
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="sm:w-40 py-3 rounded-lg font-semibold text-gray-400 border border-gray-700 hover:border-[#f7623b] hover:text-white transition cursor-pointer bg-gray-900"
                    >
                        Go Home
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Scrap4NewSuccess;