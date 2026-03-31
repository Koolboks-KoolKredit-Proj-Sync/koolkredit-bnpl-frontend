import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ACCENT = '#f7623b';

export default function ApplicationPending() {
    const { state: data } = useLocation();

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: ACCENT, padding: 16
        }}>
            <div style={{ background: '#000', borderRadius: 24, padding: '48px 32px', maxWidth: 480, width: '100%', textAlign: 'center' }}>

                {/* Animated clock icon */}
                <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: '#f7623b18', border: `2px solid ${ACCENT}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', animation: 'pulse 2s ease-in-out infinite'
                }}>
                    <Clock size={36} style={{ color: ACCENT }} />
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
                    Application Under Review
                </h1>

                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7, margin: '0 0 28px' }}>
                    Thank you, {data?.firstName ? <strong style={{ color: '#e5e7eb' }}>{data.firstName}</strong> : 'valued customer'}.
                    Your application has been received and is being reviewed by our credit team.
                </p>

                <div style={{
                    background: '#111', border: '1px solid #1f2937', borderRadius: 12,
                    padding: '18px 20px', marginBottom: 28, textAlign: 'left'
                }}>
                    {[
                        { label: 'Application Status', value: 'Under Review', colour: '#f59e0b' },
                        { label: 'Next Step',           value: 'OTP via SMS once approved' },
                        { label: 'Contact',             value: data?.mobileNumber || '—' },
                        { label: 'Email',               value: data?.customerEmail || '—' },
                    ].map(({ label, value, colour }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1a1a1a' }}>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: colour || '#e5e7eb' }}>{value}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                        'Application submitted successfully',
                        'Credit bureau check completed',
                        'Awaiting admin approval',
                        'OTP will be sent upon approval',
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: i < 2 ? '#16a34a' : i === 2 ? ACCENT : '#374151',
                                border: i === 2 ? `2px solid ${ACCENT}` : 'none'
                            }}>
                                {i < 2
                                    ? <CheckCircle size={13} style={{ color: '#fff' }} />
                                    : <span style={{ width: 6, height: 6, borderRadius: '50%', background: i === 2 ? '#fff' : '#6b7280' }} />
                                }
                            </div>
                            <span style={{ fontSize: 13, color: i < 3 ? '#e5e7eb' : '#6b7280', textAlign: 'left' }}>{step}</span>
                        </div>
                    ))}
                </div>

                <p style={{ fontSize: 11, color: '#4b5563', marginTop: 32 }}>
                    Please keep your phone nearby. You will receive an SMS shortly.
                </p>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.05)} }`}</style>
        </div>
    );
}