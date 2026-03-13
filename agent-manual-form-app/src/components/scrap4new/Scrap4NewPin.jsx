import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../LogoWithVariant.jsx';

const ACCENT = '#f7623b';
const PIN_LENGTH = 6;

// TODO: Replace with real PIN verification endpoint when backend is ready
const PIN_VERIFY_API = 'https://web-production-80fc1.up.railway.app/api/scrap-form/verify-pin';

function Scrap4NewPin() {
    const navigate = useNavigate();
    const location = useLocation();

    // Context passed from Scrap4New after successful submission
    const context = location.state || JSON.parse(sessionStorage.getItem('scrap4newContext') || '{}');

    const [pin,         setPin]         = useState(Array(PIN_LENGTH).fill(''));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSuccess,   setIsSuccess]   = useState(false);
    const [error,       setError]       = useState('');
    const [resending,   setResending]   = useState(false);
    const [countdown,   setCountdown]   = useState(60); // seconds before resend allowed
    const [canResend,   setCanResend]   = useState(false);

    const inputRefs = useRef([]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown <= 0) { setCanResend(true); return; }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    // Auto-focus first box on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handlePinChange = (index, value) => {
        // Allow only single digit
        const digit = value.replace(/\D/g, '').slice(-1);
        setError('');

        const next = [...pin];
        next[index] = digit;
        setPin(next);

        // Move focus forward
        if (digit && index < PIN_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (digit && index === PIN_LENGTH - 1) {
            const completed = [...next];
            if (completed.every(d => d !== '')) {
                submitPin(completed.join(''));
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (pin[index]) {
                // Clear current box
                const next = [...pin]; next[index] = ''; setPin(next);
            } else if (index > 0) {
                // Move back and clear previous
                inputRefs.current[index - 1]?.focus();
                const next = [...pin]; next[index - 1] = ''; setPin(next);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = e => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
        if (!pasted) return;
        const next = Array(PIN_LENGTH).fill('');
        pasted.split('').forEach((d, i) => { if (i < PIN_LENGTH) next[i] = d; });
        setPin(next);
        const lastFilled = Math.min(pasted.length, PIN_LENGTH - 1);
        inputRefs.current[lastFilled]?.focus();
        if (pasted.length === PIN_LENGTH) submitPin(pasted);
    };

    const submitPin = async (pinValue) => {
        if (isVerifying || isSuccess) return;
        setIsVerifying(true);
        setError('');

        try {
            const payload = {
                pin:           pinValue,
                submission_id: context.submissionId || null,
                mobile_number: context.mobileNumber || '',
            };

            const response = await fetch(PIN_VERIFY_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok && (result.success !== false)) {
                setIsSuccess(true);

                // Build the AgentEntryForm update payload from scrap context
                const agentUpdateData = {
                    // Pass through original agent entry fields
                    ...context,
                    // Override / add scrap product data
                    productName:  context.productName  || '',
                    size:         context.productSize  || '',
                    totalPrice:   String(context.grandTotal || ''),
                    businessType: 'Scrap4New',
                    // Clear any scrap-specific routing keys to avoid confusion
                    submissionId: undefined,
                };

                // Store in sessionStorage as backup
                sessionStorage.setItem('customerData', JSON.stringify(agentUpdateData));
                sessionStorage.removeItem('scrap4newContext');

                // Short success pause, then route back to AgentEntryForm
                setTimeout(() => {
                    navigate('/agent-entry', { state: agentUpdateData });
                }, 1800);

            } else {
                setError(result.message || 'Incorrect PIN. Please try again.');
                // Shake and clear the PIN
                setPin(Array(PIN_LENGTH).fill(''));
                setTimeout(() => inputRefs.current[0]?.focus(), 100);
            }
        } catch (err) {
            console.error('PIN verify error:', err);
            setError('Could not verify PIN. Please check your connection and try again.');
            setPin(Array(PIN_LENGTH).fill(''));
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleManualSubmit = () => {
        const pinValue = pin.join('');
        if (pinValue.length < PIN_LENGTH) {
            setError('Please enter all 6 digits of your PIN.');
            return;
        }
        submitPin(pinValue);
    };

    const handleResend = async () => {
        if (!canResend || resending) return;
        setResending(true);
        setError('');

        try {
            // TODO: wire to real resend endpoint
            await fetch('https://web-production-80fc1.up.railway.app/api/scrap-form/resend-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submission_id: context.submissionId,
                    mobile_number: context.mobileNumber,
                }),
            });
            setCountdown(60);
            setCanResend(false);
            setPin(Array(PIN_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
            Swal.fire({ icon: 'info', title: 'PIN Resent', text: 'A new PIN has been sent to your phone number.', timer: 2500, showConfirmButton: false });
        } catch {
            setError('Could not resend PIN. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const maskedPhone = context.mobileNumber
        ? context.mobileNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1***$3')
        : 'your registered number';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6"
             style={{ backgroundColor: ACCENT }}>
            <div className="w-full max-w-md bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-10">

                <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
                    <Logo size="large" />
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: isSuccess ? '#16a34a20' : `${ACCENT}20`, border: `2px solid ${isSuccess ? '#16a34a' : ACCENT}` }}>
                        {isSuccess
                            ? <CheckCircle size={32} className="text-green-500" />
                            : <ShieldCheck size={32} style={{ color: ACCENT }} />}
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: ACCENT }}>
                    {isSuccess ? 'Verified!' : 'Enter Your PIN'}
                </h1>

                {isSuccess ? (
                    <div className="text-center">
                        <p className="text-green-400 text-sm sm:text-base mb-2">Your submission has been verified successfully.</p>
                        <p className="text-gray-400 text-sm">Updating your entry form…</p>
                        <div className="flex justify-center mt-6">
                            <Loader2 className="animate-spin" size={32} style={{ color: ACCENT }} />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Info text */}
                        <div className="mb-6 text-center space-y-1">
                            <p className="text-gray-300 text-sm sm:text-base">
                                Your Scrap4New submission is under review by our AI.
                            </p>
                            <p className="text-gray-400 text-sm">
                                A 6-digit PIN will be sent to <span className="text-white font-medium">{maskedPhone}</span> once the review is complete.
                            </p>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full border mx-auto w-fit"
                             style={{ borderColor: `${ACCENT}60`, backgroundColor: `${ACCENT}15` }}>
                            <Clock size={14} style={{ color: ACCENT }} />
                            <span className="text-xs font-medium" style={{ color: ACCENT }}>Awaiting AI review &amp; PIN delivery</span>
                        </div>

                        {/* PIN boxes */}
                        <div className="flex justify-center gap-2 sm:gap-3 mb-2" onPaste={handlePaste}>
                            {pin.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => (inputRefs.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handlePinChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    disabled={isVerifying || isSuccess}
                                    className="w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 bg-gray-900 text-white focus:outline-none transition disabled:opacity-50"
                                    style={{
                                        borderColor: digit ? ACCENT : error ? '#ef4444' : '#374151',
                                        boxShadow:   digit ? `0 0 0 2px ${ACCENT}40` : 'none',
                                        width: '2.75rem',
                                        height: '3.5rem',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="button"
                            onClick={handleManualSubmit}
                            disabled={isVerifying || pin.join('').length < PIN_LENGTH}
                            className="mt-5 w-full flex items-center justify-center gap-2 py-3 sm:py-4 rounded-lg font-bold text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                            style={{ backgroundColor: ACCENT }}>
                            {isVerifying
                                ? <><Loader2 className="animate-spin" size={20} /> Verifying…</>
                                : 'Verify PIN'}
                        </button>

                        {/* Resend */}
                        <div className="mt-4 text-center">
                            {canResend ? (
                                <button type="button" onClick={handleResend} disabled={resending}
                                        className="text-sm font-medium transition hover:opacity-80 cursor-pointer disabled:opacity-40"
                                        style={{ color: ACCENT }}>
                                    {resending ? 'Resending…' : 'Resend PIN'}
                                </button>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Resend PIN in{' '}
                                    <span className="font-semibold" style={{ color: ACCENT }}>{countdown}s</span>
                                </p>
                            )}
                        </div>

                        {/* Back link */}
                        <div className="mt-4 text-center">
                            <button type="button" onClick={() => navigate(-1)}
                                    className="text-xs text-gray-600 hover:text-gray-400 transition cursor-pointer">
                                ← Go back to form
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Scrap4NewPin;