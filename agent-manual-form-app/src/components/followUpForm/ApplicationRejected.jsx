import React from 'react';
import { XCircle, Phone, Mail } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';

const ACCENT = '#f7623b';

/**
 * Route: /application-rejected/:token
 * The backend embeds the rejection reason and customer name in a signed link
 * query param, e.g. ?name=John&reason=Poor+credit+score
 * OR the page fetches it from the backend using the token.
 */
export default function ApplicationRejected() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();

    const name   = searchParams.get('name')   || 'Valued Customer';
    const reason = searchParams.get('reason') || 'Your application did not meet our current credit criteria.';

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: ACCENT, padding: 16
        }}>
            <div style={{ background: '#000', borderRadius: 24, padding: '48px 32px', maxWidth: 480, width: '100%', textAlign: 'center' }}>

                <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: '#dc262618', border: '2px solid #dc2626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <XCircle size={36} style={{ color: '#dc2626' }} />
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
                    Application Unsuccessful
                </h1>
                <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 28 }}>
                    Dear {name}, we regret to inform you that your application could not be approved at this time.
                </p>

                {/* Reason box */}
                <div style={{
                    background: '#dc262610', border: '1px solid #dc262640',
                    borderRadius: 12, padding: '18px 20px', marginBottom: 28, textAlign: 'left'
                }}>
                    <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                        Reason for Decline
                    </p>
                    <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.6 }}>{reason}</p>
                </div>

                {/* What to do next */}
                <div style={{ background: '#111', border: '1px solid #1f2937', borderRadius: 12, padding: '18px 20px', marginBottom: 28, textAlign: 'left' }}>
                    <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>What You Can Do</p>
                    {[
                        'Improve your credit score by repaying existing loans on time',
                        'Reduce outstanding debts before reapplying',
                        'Contact our support team to discuss your options',
                        'You may reapply after 90 days',
                    ].map((tip, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                            <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                            <span style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>{tip}</span>
                        </div>
                    ))}
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="tel:+2340000000000" style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                        background: ACCENT, borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none'
                    }}>
                        <Phone size={14} /> Call Support
                    </a>
                    <a href="mailto:support@koolboks.com" style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
                        background: '#111', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb', fontWeight: 600, fontSize: 13, textDecoration: 'none'
                    }}>
                        <Mail size={14} /> Email Us
                    </a>
                </div>

                <p style={{ fontSize: 11, color: '#4b5563', marginTop: 28 }}>
                    Reference: {token || 'N/A'} · Koolboks Credit System
                </p>
            </div>
        </div>
    );
}