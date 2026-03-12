import React, { useState, useRef } from 'react';
import {
    Camera, Upload, X, RefreshCw, Loader2, CheckCircle, Video,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../LogoWithVariant.jsx';

// ─── Data ─────────────────────────────────────────────────────────────────────

const koolboksProducts = [
    { size: '208L',  name: 'Koolboks Solar Freezer (DC)',                  price: 684000 },
    { size: '538L',  name: 'Koolboks Solar Freezer (DC)',                  price: 997000 },
    { size: '358L',  name: 'Koolboks Upright Chiller (DC)',                price: 1282000 },
    { size: '195L',  name: 'Koolboks Icemaker (DC)',                       price: 1136000 },
    { size: '128L',  name: 'Combo Fridge DC (Battery + 275W Solar Panel)', price: 652000 },
    { size: '200L',  name: 'AC Inverter Freezer',                          price: 682000 },
    { size: '198L',  name: 'AC Inverter Freezer',                          price: 706000 },
    { size: '208L',  name: 'AC Inverter Freezer',                          price: 756000 },
    { size: '530L',  name: 'AC Inverter Freezer',                          price: 1123000 },
    { size: '600L',  name: 'AC Inverter Freezer',                          price: 1106000 },
    { size: '750L',  name: 'AC Inverter Freezer',                          price: 1392000 },
];

const scrapBrands = [
    "Samsung","LG","Whirlpool","Bosch","Panasonic","Haier","Hisense","Midea",
    "Sharp","Electrolux","Scanfrost","Nexus","Polystar","Royal","Bruhm",
    "Binatone","Maxi","Ignis","Haier Thermocool","Kenstar","Sub-Zero",
    "KitchenAid","GE Appliances","Frigidaire","Maytag","True Manufacturing",
    "Turbo Air","Hoshizaki","Beko","Ariston","Indesit","Candy","Grundig",
    "TCL","Skyworth","Changhong","Aucma","Kelvinator","Westinghouse","Daewoo",
    "Hitachi","Fisher & Paykel","Gorenje","Liebherr","Vestfrost","Blomberg",
    "Smeg","Zanussi","Amana","Admiral","Magic Chef","RCA","Danby","Insignia",
    "Avanti","Galanz","Summit","EdgeStar","Arctic King","Conserv","Costway",
    "Koolatron","Kegco","Norpole","Accucold","Elcold","Gram","Fagor","Defy",
    "Kelon","Chigo","MediaStar","Meling","Snowsea","Comfee","Eurosonic",
    "Powerline","Eurostar","Century","Saisho","Akai","Bush","Logik","Matsui",
    "Technostar","Transtec","Vision","Orient","Pelonis","Premier","Proline",
    "Ramtons","Rinnai","Sinotec","Swan","Telefunken","Toshiba","Vestel",
    "Voltas","White-Westinghouse","Winia","York","Haier Casarte","Aiwa",
    "Andrakk","Alpha","Atlantic","BlueStar","Conion","Crown","Dawlance",
    "Geepas","Goldline","Homeking","IceCool","KIC","Lec","Montpellier",
    "Neon","Oscar","Robin","Silver Crest","Super General","Syinix","Unionaire",
    "Von","Westpoint","Zokop","Others",
];

const scrapIssues = [
    "Temperature too high or fluctuates",
    "Gas leakage",
    "Compressor issue",
    "Thermostat problem",
    "Compressor not working",
    "Compressor overheating",
    "Compressor runs continuously",
    "Excessive vibration or noise",
    "Tears or cracks in the rubber seal",
    "Loose or broken gasket",
    "Air leaks around the door",
    "Poor cooling",
    "High electricity consumption",
    "Door seal leak",
    "Defrost quickly",
    "Fans don't spin",
    "Scrap doesn't turn on",
];

const ACCENT = '#f7623b';
const inputClass = 'w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition';

// ─── Reusable Media Capture Field ─────────────────────────────────────────────

function MediaField({ label, accept, hint, value, onChange, required, allowCamera, allowVideo }) {
    const fileRef   = useRef(null);
    const videoRef  = useRef(null);
    const canvasRef = useRef(null);
    const mrRef     = useRef(null);
    const chunksRef = useRef([]);

    const [showCam,      setShowCam]      = useState(false);
    const [stream,       setStream]       = useState(null);
    const [facing,       setFacing]       = useState('environment');
    const [camErr,       setCamErr]       = useState('');
    const [recording,    setRecording]    = useState(false);
    const [recMode,      setRecMode]      = useState('photo');

    const preview = value
        ? (value instanceof Blob ? URL.createObjectURL(value) : value)
        : null;
    const previewIsVideo = value && (
        (value instanceof Blob && value.type.startsWith('video')) ||
        (typeof value === 'string' && /video/.test(value))
    );

    const openCam = async (mode = 'photo', f = 'environment') => {
        setCamErr('');
        if (stream) stream.getTracks().forEach(t => t.stop());
        try {
            const ms = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: f }, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: mode === 'video',
            });
            setStream(ms); setFacing(f); setRecMode(mode); setShowCam(true);
            setTimeout(() => {
                if (videoRef.current) { videoRef.current.srcObject = ms; videoRef.current.play().catch(() => {}); }
            }, 100);
        } catch { setCamErr('Could not access camera. Please check permissions.'); }
    };

    const closeCam = () => {
        if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
        setShowCam(false); setRecording(false);
    };

    const capturePhoto = () => {
        const c = canvasRef.current, v = videoRef.current;
        if (!c || !v || v.readyState < 2) return;
        c.width = v.videoWidth; c.height = v.videoHeight;
        const ctx = c.getContext('2d');
        if (facing === 'user') { ctx.translate(c.width, 0); ctx.scale(-1, 1); }
        ctx.drawImage(v, 0, 0);
        c.toBlob(blob => { if (blob) { onChange(blob); closeCam(); } }, 'image/jpeg', 0.92);
    };

    const startRec = () => {
        chunksRef.current = [];
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = () => { onChange(new Blob(chunksRef.current, { type: 'video/webm' })); closeCam(); };
        mr.start(); mrRef.current = mr; setRecording(true);
    };
    const stopRec = () => { if (mrRef.current) mrRef.current.stop(); setRecording(false); };

    return (
        <div>
            <label className="block text-sm font-medium mb-1" style={{ color: ACCENT }}>
                {label}{required && ' *'}
            </label>
            {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}

            {preview ? (
                <div className="relative rounded-lg overflow-hidden border-2" style={{ borderColor: ACCENT }}>
                    {previewIsVideo
                        ? <video src={preview} controls className="w-full max-h-44 object-cover" />
                        : <img src={preview} alt={label} className="w-full max-h-44 object-cover" />}
                    <button type="button" onClick={() => { onChange(null); if (fileRef.current) fileRef.current.value = ''; }}
                            className="absolute top-2 right-2 p-1.5 rounded-full text-white cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: ACCENT }}><X size={13} /></button>
                </div>
            ) : (
                <div className={`grid gap-2 ${allowVideo ? 'grid-cols-3' : allowCamera ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <button type="button" onClick={() => fileRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-[#f7623b] transition text-xs cursor-pointer bg-gray-900">
                        <Upload size={17} /><span>Upload</span>
                    </button>
                    {allowCamera && (
                        <button type="button" onClick={() => openCam('photo')}
                                className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-[#f7623b] transition text-xs cursor-pointer bg-gray-900">
                            <Camera size={17} /><span>Snap Photo</span>
                        </button>
                    )}
                    {allowVideo && (
                        <button type="button" onClick={() => openCam('video')}
                                className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-[#f7623b] transition text-xs cursor-pointer bg-gray-900">
                            <Video size={17} /><span>Record</span>
                        </button>
                    )}
                </div>
            )}

            <input ref={fileRef} type="file" accept={accept} onChange={e => { if (e.target.files[0]) onChange(e.target.files[0]); }} className="hidden" />
            <canvas ref={canvasRef} className="hidden" />

            {showCam && (
                <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[60] p-4">
                    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold text-base sm:text-lg">
                                {recMode === 'video' ? 'Record Video' : 'Capture Photo'} — {label}
                            </h3>
                            <button onClick={closeCam} className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
                                <X className="text-white" size={20} />
                            </button>
                        </div>

                        <div className="relative rounded-lg overflow-hidden bg-gray-800 mb-4">
                            {camErr && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10 text-sm">{camErr}</div>
                            )}
                            <video ref={videoRef} autoPlay playsInline muted={recMode === 'photo'}
                                   className="w-full rounded-lg"
                                   style={{ transform: facing === 'user' ? 'scaleX(-1)' : 'none', minHeight: 220, maxHeight: 380, objectFit: 'cover' }}
                            />
                            {recMode === 'photo' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="border-4 rounded-full"
                                         style={{ width: 170, height: 210, borderColor: ACCENT, boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} />
                                </div>
                            )}
                            {recording && (
                                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black bg-opacity-60 px-2 py-1 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-white text-xs font-semibold">REC</span>
                                </div>
                            )}
                            <button onClick={() => openCam(recMode, facing === 'user' ? 'environment' : 'user')}
                                    className="absolute top-3 right-3 p-2 rounded-full text-white hover:opacity-80 cursor-pointer"
                                    style={{ backgroundColor: ACCENT }}><RefreshCw size={15} /></button>
                        </div>

                        {recMode === 'photo' ? (
                            <button onClick={capturePhoto} className="w-full py-3 rounded-lg font-bold text-white hover:opacity-90 cursor-pointer transition" style={{ backgroundColor: ACCENT }}>
                                <Camera className="inline mr-2" size={17} /> Capture Photo
                            </button>
                        ) : !recording ? (
                            <button onClick={startRec} className="w-full py-3 rounded-lg font-bold text-white hover:opacity-90 cursor-pointer transition bg-red-600">
                                <Video className="inline mr-2" size={17} /> Start Recording
                            </button>
                        ) : (
                            <button onClick={stopRec} className="w-full py-3 rounded-lg font-bold text-white hover:opacity-90 cursor-pointer transition bg-gray-700">
                                ⏹ Stop &amp; Save
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

function Scrap4New() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const incoming  = location.state || {};

    const prefilledName = [incoming.firstName, incoming.middleName, incoming.lastName]
        .filter(Boolean).join(' ');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        customerName:        prefilledName || '',
        mobileNumber:        incoming.mobileNumber || '',
        houseAddress:        '',
        productOfInterest:   '',
        productSize:         '',
        productPrice:        '',
        scrapBrand:          '',
        scrapBrandOtherSpec: '',
        locationOfScrap:     '',
        receiptAvailable:    '',
        workingCondition:    '',
        selectedIssues:      [],
    });

    const [media, setMedia] = useState({
        receiptOrAffidavit: null,
        selfieWithScrap:    null,
        scrapBody:          null,
        scrapTop:           null,
        scrapCompressor:    null,
        scrapInside:        null,
        videoBody:          null,
        videoTop:           null,
        videoCompressor:    null,
        videoInside:        null,
    });

    const set    = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const setMed = (k, v) => setMedia(p => ({ ...p, [k]: v }));

    const selectedProduct = koolboksProducts.find(
        p => `${p.name}__${p.size}__${p.price}` === form.productOfInterest
    );

    const handleProductSelect = e => {
        const val = e.target.value;
        set('productOfInterest', val);
        const p = koolboksProducts.find(x => `${x.name}__${x.size}__${x.price}` === val);
        set('productSize',  p ? p.size  : '');
        set('productPrice', p ? p.price : '');
    };

    const toggleIssue = issue =>
        set('selectedIssues',
            form.selectedIssues.includes(issue)
                ? form.selectedIssues.filter(i => i !== issue)
                : [...form.selectedIssues, issue]
        );

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const checks = [
            [!form.customerName,       'customer name'],
            [!form.mobileNumber,       'mobile number'],
            [!form.houseAddress,       'house address'],
            [!form.productOfInterest,  'product of interest'],
            [!form.productSize,        'product size'],
            [!form.productPrice,       'product price'],
            [!form.scrapBrand,         'scrap brand'],
            [form.scrapBrand === 'Others' && !form.scrapBrandOtherSpec, 'scrap brand specification'],
            [!form.locationOfScrap,    'location of scrap'],
            [!form.receiptAvailable,   'receipt availability'],
            [!media.receiptOrAffidavit, form.receiptAvailable === 'Yes' ? 'receipt document' : 'sworn affidavit'],
            [!media.selfieWithScrap,   'selfie with scrap'],
            [!form.workingCondition,   'working condition'],
            [form.selectedIssues.length === 0, 'at least one issue'],
        ];

        for (const [fail, field] of checks) {
            if (fail) {
                Swal.fire({ icon: 'warning', title: 'Incomplete Form', text: `Please provide the ${field}.` });
                return;
            }
        }

        setIsSubmitting(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) =>
            fd.append(k, Array.isArray(v) ? v.join(', ') : v)
        );
        Object.entries(media).forEach(([k, v]) => { if (v) fd.append(k, v); });

        try {
            // TODO: replace URL with real endpoint
            // const res = await fetch('https://...', { method: 'POST', body: fd });
            // const result = await res.json();
            await new Promise(r => setTimeout(r, 1500)); // simulate

            Swal.fire({ icon: 'success', title: 'Submitted!', text: 'Your Scrap4New form has been submitted successfully.' })
                .then(() => navigate('/'));
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Submission failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Section wrapper shorthand
    const Section = ({ title, subtitle, children }) => (
        <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-white">{title}</h2>
            {subtitle && <p className="text-gray-400 text-sm mb-4">{subtitle}</p>}
            {!subtitle && <div className="mb-4" />}
            {children}
        </section>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: ACCENT }}>
            <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">

                {/* Logo */}
                <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
                    <Logo size="large" />
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: ACCENT }}>
                    Scrap4New
                </h1>
                <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">
                    Trade in your old appliance for a brand-new Koolboks product
                </p>

                <div className="space-y-0">

                    {/* 1. Customer Details */}
                    <Section title="Customer Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Customer Name *</label>
                                <input
                                    type="text" value={form.customerName}
                                    onChange={e => set('customerName', e.target.value)}
                                    readOnly={!!prefilledName}
                                    className={`${inputClass} ${prefilledName ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    onFocus={e => !prefilledName && (e.target.style.borderColor = ACCENT)}
                                    onBlur={e  => !prefilledName && (e.target.style.borderColor = '#374151')}
                                    placeholder="Full name"
                                />
                                {prefilledName && (
                                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                        <CheckCircle size={11} /> Pre-filled from entry form
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Mobile Number *</label>
                                <input
                                    type="tel" value={form.mobileNumber}
                                    onChange={e => set('mobileNumber', e.target.value)}
                                    className={inputClass}
                                    onFocus={e => e.target.style.borderColor = ACCENT}
                                    onBlur={e  => e.target.style.borderColor = '#374151'}
                                    placeholder="e.g. 08012345678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>House Address *</label>
                                <input
                                    type="text" value={form.houseAddress}
                                    onChange={e => set('houseAddress', e.target.value)}
                                    className={inputClass}
                                    onFocus={e => e.target.style.borderColor = ACCENT}
                                    onBlur={e  => e.target.style.borderColor = '#374151'}
                                    placeholder="Your house address"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* 2. Product of Interest */}
                    <Section title="Product of Interest">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Select Product *</label>
                                <select
                                    value={form.productOfInterest}
                                    onChange={handleProductSelect}
                                    className={`${inputClass} cursor-pointer`}
                                    onFocus={e => e.target.style.borderColor = ACCENT}
                                    onBlur={e  => e.target.style.borderColor = '#374151'}
                                >
                                    <option value="">— Choose a Koolboks product —</option>
                                    {koolboksProducts.map((p, i) => (
                                        <option key={i} value={`${p.name}__${p.size}__${p.price}`}>
                                            {p.name} ({p.size}) — ₦{p.price.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Size *</label>
                                <input
                                    type="text" value={form.productSize}
                                    onChange={e => set('productSize', e.target.value)}
                                    readOnly={!!selectedProduct}
                                    className={`${inputClass} ${selectedProduct ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    onFocus={e => !selectedProduct && (e.target.style.borderColor = ACCENT)}
                                    onBlur={e  => !selectedProduct && (e.target.style.borderColor = '#374151')}
                                    placeholder="e.g. 208L"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Price (₦) *</label>
                                <input
                                    type="number" value={form.productPrice}
                                    onChange={e => set('productPrice', e.target.value)}
                                    readOnly={!!selectedProduct}
                                    className={`${inputClass} ${selectedProduct ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    onFocus={e => !selectedProduct && (e.target.style.borderColor = ACCENT)}
                                    onBlur={e  => !selectedProduct && (e.target.style.borderColor = '#374151')}
                                    placeholder="Enter price"
                                />
                            </div>

                            {form.productPrice && (
                                <div className="sm:col-span-3 p-4 rounded-lg bg-gray-900 border-2 flex justify-between items-center" style={{ borderColor: ACCENT }}>
                                    <span className="text-white font-semibold text-sm sm:text-base">Selected Product Price:</span>
                                    <span className="text-xl sm:text-2xl font-bold" style={{ color: ACCENT }}>
                    ₦{Number(form.productPrice).toLocaleString()}
                  </span>
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* 3. Scrap Details */}
                    <Section title="Scrap Product Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Scrap Brand *</label>
                                <select
                                    value={form.scrapBrand}
                                    onChange={e => { set('scrapBrand', e.target.value); set('scrapBrandOtherSpec', ''); }}
                                    className={`${inputClass} cursor-pointer`}
                                    onFocus={e => e.target.style.borderColor = ACCENT}
                                    onBlur={e  => e.target.style.borderColor = '#374151'}
                                >
                                    <option value="">— Select brand —</option>
                                    {scrapBrands.map((b, i) => <option key={i} value={b}>{b}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Location of Scrap *</label>
                                <input
                                    type="text" value={form.locationOfScrap}
                                    onChange={e => set('locationOfScrap', e.target.value)}
                                    className={inputClass}
                                    onFocus={e => e.target.style.borderColor = ACCENT}
                                    onBlur={e  => e.target.style.borderColor = '#374151'}
                                    placeholder="Where is the scrap located?"
                                />
                            </div>

                            {form.scrapBrand === 'Others' && (
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Specify Brand *</label>
                                    <input
                                        type="text" value={form.scrapBrandOtherSpec}
                                        onChange={e => set('scrapBrandOtherSpec', e.target.value)}
                                        className={inputClass}
                                        onFocus={e => e.target.style.borderColor = ACCENT}
                                        onBlur={e  => e.target.style.borderColor = '#374151'}
                                        placeholder="Enter the brand name"
                                    />
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* 4. Proof of Ownership */}
                    <Section title="Proof of Ownership">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Is a receipt available? *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Yes', 'No'].map(opt => (
                                    <button key={opt} type="button"
                                            onClick={() => { set('receiptAvailable', opt); setMed('receiptOrAffidavit', null); }}
                                            className="py-3 rounded-lg font-semibold transition cursor-pointer hover:opacity-90 text-sm sm:text-base"
                                            style={{
                                                backgroundColor: form.receiptAvailable === opt ? ACCENT : '#111827',
                                                color:           form.receiptAvailable === opt ? 'white' : '#9ca3af',
                                                border:          form.receiptAvailable === opt ? 'none' : '1px solid #374151',
                                            }}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        {form.receiptAvailable === 'Yes' && (
                            <MediaField
                                label="Receipt" required
                                accept="image/*,application/pdf"
                                hint="Upload or snap a photo/PDF of your receipt."
                                value={media.receiptOrAffidavit}
                                onChange={v => setMed('receiptOrAffidavit', v)}
                                allowCamera
                            />
                        )}
                        {form.receiptAvailable === 'No' && (
                            <MediaField
                                label="Sworn Affidavit" required
                                accept="image/*,application/pdf"
                                hint="A sworn affidavit confirming the scrap belongs to you is required."
                                value={media.receiptOrAffidavit}
                                onChange={v => setMed('receiptOrAffidavit', v)}
                                allowCamera
                            />
                        )}
                    </Section>

                    {/* 5. Selfie */}
                    <Section title="Selfie with Scrap">
                        <MediaField
                            label="Selfie of you with the scrap" required
                            accept="image/*"
                            hint="Stand beside the scrap and take a clear selfie showing both you and the appliance."
                            value={media.selfieWithScrap}
                            onChange={v => setMed('selfieWithScrap', v)}
                            allowCamera
                        />
                    </Section>

                    {/* 6. Photos */}
                    <Section title="Real-Time Photos of Scrap" subtitle="Provide clear, real-time photos of each part of the appliance.">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { key: 'scrapBody',       label: 'Body' },
                                { key: 'scrapTop',        label: 'Top' },
                                { key: 'scrapCompressor', label: 'Compressor' },
                                { key: 'scrapInside',     label: 'Inside' },
                            ].map(({ key, label }) => (
                                <MediaField key={key} label={label} accept="image/*"
                                            value={media[key]} onChange={v => setMed(key, v)} allowCamera />
                            ))}
                        </div>
                    </Section>

                    {/* 7. Videos */}
                    <Section title="Real-Time Videos of Scrap" subtitle="Record or upload a short video for each part of the appliance.">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { key: 'videoBody',       label: 'Body Video' },
                                { key: 'videoTop',        label: 'Top Video' },
                                { key: 'videoCompressor', label: 'Compressor Video' },
                                { key: 'videoInside',     label: 'Inside Video' },
                            ].map(({ key, label }) => (
                                <MediaField key={key} label={label} accept="video/*"
                                            value={media[key]} onChange={v => setMed(key, v)} allowCamera allowVideo />
                            ))}
                        </div>
                    </Section>

                    {/* 8. Working Condition */}
                    <Section title="Working Condition">
            <textarea
                value={form.workingCondition}
                onChange={e => set('workingCondition', e.target.value)}
                rows={4} className={inputClass}
                onFocus={e => e.target.style.borderColor = ACCENT}
                onBlur={e  => e.target.style.borderColor = '#374151'}
                placeholder="Describe the current working condition of the scrap appliance in detail…"
            />
                    </Section>

                    {/* 9. Issues */}
                    <section className="pb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-white">Known Issues *</h2>
                        <p className="text-gray-400 text-sm mb-4">Select one or more issues with the scrap.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {scrapIssues.map(issue => {
                                const on = form.selectedIssues.includes(issue);
                                return (
                                    <button key={issue} type="button" onClick={() => toggleIssue(issue)}
                                            className="flex items-start gap-2 px-3 py-3 rounded-lg text-left text-sm font-medium transition cursor-pointer hover:opacity-90"
                                            style={{
                                                backgroundColor: on ? ACCENT : '#111827',
                                                color:           on ? 'white' : '#9ca3af',
                                                border:          on ? 'none'  : '1px solid #374151',
                                            }}>
                    <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center"
                          style={{ borderColor: on ? 'white' : '#6b7280', backgroundColor: on ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
                      {on && <CheckCircle size={9} className="text-white" />}
                    </span>
                                        {issue}
                                    </button>
                                );
                            })}
                        </div>

                        {form.selectedIssues.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <p className="text-xs text-gray-400 mb-1">Selected ({form.selectedIssues.length}):</p>
                                <p className="text-sm text-white leading-relaxed">{form.selectedIssues.join(' • ')}</p>
                            </div>
                        )}
                    </section>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="button" onClick={() => navigate(-1)}
                                className="sm:w-40 py-3 rounded-lg font-semibold text-gray-400 border border-gray-700 hover:border-[#f7623b] hover:text-white transition cursor-pointer bg-gray-900">
                            ← Back
                        </button>
                        <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 rounded-lg font-bold text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                                style={{ backgroundColor: ACCENT }}>
                            {isSubmitting
                                ? <><Loader2 className="animate-spin" size={20} /> Submitting…</>
                                : 'Submit Scrap4New Form'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Scrap4New;