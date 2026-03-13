import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RefreshCw, Loader2, CheckCircle, Video, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../LogoWithVariant.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const SCRAP_API = 'https://web-production-80fc1.up.railway.app/api/scrap-forms/';
const ACCENT    = '#f7623b';

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

const allBrands = [
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

const inputCls = 'w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition';
const focusOn  = e => (e.target.style.borderColor = ACCENT);
const focusOff = e => (e.target.style.borderColor = '#374151');
const koolboksKey = p => `KB__${p.name}__${p.size}__${p.price}`;

// ─── MediaField ───────────────────────────────────────────────────────────────

function MediaField({ label, accept, hint, value, onChange, allowPhoto = true, allowVideo = false, required }) {
    const fileRef   = useRef(null);
    const videoRef  = useRef(null);
    const canvasRef = useRef(null);
    const mrRef     = useRef(null);
    const chunksRef = useRef([]);

    const [showCam,   setShowCam]   = useState(false);
    const [stream,    setStream]    = useState(null);
    const [facing,    setFacing]    = useState('environment');
    const [camErr,    setCamErr]    = useState('');
    const [recording, setRecording] = useState(false);
    const [recMode,   setRecMode]   = useState('photo');

    const preview      = value ? (value instanceof Blob ? URL.createObjectURL(value) : value) : null;
    const isVideoFile  = value && ((value instanceof Blob && value.type?.startsWith('video')) || (typeof value === 'string' && /video/i.test(value)));
    const btnCount     = [true, allowPhoto, allowVideo].filter(Boolean).length;
    const gridCols     = btnCount === 1 ? 'grid-cols-1' : btnCount === 2 ? 'grid-cols-2' : 'grid-cols-3';

    const openCam = async (mode = 'photo', f = 'environment') => {
        setCamErr('');
        if (stream) stream.getTracks().forEach(t => t.stop());
        try {
            const ms = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: f }, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: mode === 'video',
            });
            setStream(ms); setFacing(f); setRecMode(mode); setShowCam(true);
            setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = ms; videoRef.current.play().catch(() => {}); } }, 100);
        } catch { setCamErr('Could not access camera. Please check permissions.'); setShowCam(true); }
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
        if (!stream) return;
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
                    {isVideoFile
                        ? <video src={preview} controls className="w-full max-h-44 object-cover bg-gray-900" />
                        : <img src={preview} alt={label} className="w-full max-h-44 object-cover" />}
                    <button type="button"
                            onClick={() => { onChange(null); if (fileRef.current) fileRef.current.value = ''; }}
                            className="absolute top-2 right-2 p-1.5 rounded-full text-white cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: ACCENT }}><X size={13} /></button>
                </div>
            ) : (
                <div className={`grid gap-2 ${gridCols}`}>
                    <button type="button" onClick={() => fileRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-[#f7623b] transition text-xs cursor-pointer bg-gray-900">
                        <Upload size={17} /><span>Upload</span>
                    </button>
                    {allowPhoto && (
                        <button type="button" onClick={() => openCam('photo')}
                                className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-[#f7623b] transition text-xs cursor-pointer bg-gray-900">
                            <Camera size={17} /><span>Snap Photo</span>
                        </button>
                    )}
                    {allowVideo && (
                        <button type="button" onClick={() => openCam('video')}
                                className="flex flex-col items-center justify-center gap-1 py-4 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-[#f7623b] transition text-xs cursor-pointer bg-gray-900">
                            <Video size={17} /><span>Record Video</span>
                        </button>
                    )}
                </div>
            )}

            <input ref={fileRef} type="file" accept={accept}
                   onChange={e => { if (e.target.files[0]) onChange(e.target.files[0]); }} className="hidden" />
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
                            {camErr && <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center z-10 text-sm rounded-lg">{camErr}</div>}
                            <video ref={videoRef} autoPlay playsInline muted={recMode === 'photo'} className="w-full rounded-lg"
                                   style={{ transform: facing === 'user' ? 'scaleX(-1)' : 'none', minHeight: 220, maxHeight: 380, objectFit: 'cover' }} />
                            {recMode === 'photo' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="border-4 rounded-full"
                                         style={{ width: 170, height: 210, borderColor: ACCENT, boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} />
                                </div>
                            )}
                            {recording && (
                                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black bg-opacity-60 px-2 py-1 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-white text-xs font-semibold">REC</span>
                                </div>
                            )}
                            <button onClick={() => openCam(recMode, facing === 'user' ? 'environment' : 'user')}
                                    className="absolute top-3 right-3 p-2 rounded-full text-white hover:opacity-80 cursor-pointer" style={{ backgroundColor: ACCENT }}>
                                <RefreshCw size={15} /></button>
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

// ─── ProductRow ───────────────────────────────────────────────────────────────

function ProductRow({ index, item, onChange, onRemove, showRemove }) {
    const isKoolboks = item.selection.startsWith('KB__');
    const locked     = isKoolboks;
    const subtotal   = (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);

    const handleSelect = e => {
        const val = e.target.value;
        if (!val) { onChange({ ...item, selection: '', name: '', size: '', price: '', quantity: 1 }); return; }
        if (val.startsWith('KB__')) {
            const parts = val.split('__');
            onChange({ ...item, selection: val, name: parts[1], size: parts[2], price: parts[3], quantity: item.quantity });
        } else {
            const brand = val.replace('BRAND__', '');
            onChange({ ...item, selection: val, name: brand, size: '', price: '', quantity: item.quantity });
        }
    };

    return (
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 mb-3">
            <div className="flex justify-between items-center mb-3">
                <span className="text-white font-semibold text-sm">Item {index + 1}</span>
                {showRemove && (
                    <button type="button" onClick={onRemove} className="p-1.5 rounded-lg text-red-400 hover:bg-red-900 transition cursor-pointer">
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1.5" style={{ color: ACCENT }}>Product / Brand *</label>
                    <select value={item.selection} onChange={handleSelect}
                            className={`${inputCls} cursor-pointer text-sm`} onFocus={focusOn} onBlur={focusOff}>
                        <option value="">— Select a product or brand —</option>
                        <optgroup label="── Koolboks Products ──">
                            {koolboksProducts.map((p, i) => (
                                <option key={i} value={koolboksKey(p)}>
                                    {p.name} ({p.size}) — ₦{p.price.toLocaleString()}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="── Other Brands ──">
                            {allBrands.map((b, i) => (
                                <option key={i} value={`BRAND__${b}`}>{b}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: ACCENT }}>Size *</label>
                    <input type="text" value={item.size}
                           onChange={e => !locked && onChange({ ...item, size: e.target.value })}
                           readOnly={locked}
                           className={`${inputCls} text-sm ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                           onFocus={e => !locked && focusOn(e)} onBlur={e => !locked && focusOff(e)}
                           placeholder="e.g. 208L" />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: ACCENT }}>Price (₦) *</label>
                    <input type="number" value={item.price}
                           onChange={e => !locked && onChange({ ...item, price: e.target.value })}
                           readOnly={locked}
                           className={`${inputCls} text-sm ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                           onFocus={e => !locked && focusOn(e)} onBlur={e => !locked && focusOff(e)}
                           placeholder="Enter price" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1.5" style={{ color: ACCENT }}>Quantity</label>
                    <div className="flex items-center gap-3">
                        <button type="button"
                                onClick={() => onChange({ ...item, quantity: Math.max(1, (item.quantity || 1) - 1) })}
                                disabled={(item.quantity || 1) <= 1}
                                className="w-10 h-10 rounded-lg font-bold text-white flex items-center justify-center hover:opacity-90 cursor-pointer disabled:opacity-40 transition"
                                style={{ backgroundColor: ACCENT }}>−</button>
                        <span className="w-10 text-center text-white font-semibold">{item.quantity || 1}</span>
                        <button type="button"
                                onClick={() => onChange({ ...item, quantity: (item.quantity || 1) + 1 })}
                                className="w-10 h-10 rounded-lg font-bold text-white flex items-center justify-center hover:opacity-90 cursor-pointer transition"
                                style={{ backgroundColor: ACCENT }}>+</button>
                        {item.price && (
                            <span className="ml-2 text-gray-400 text-sm">
                Subtotal: <span className="text-white font-semibold">₦{subtotal.toLocaleString()}</span>
              </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Scrap4New Form ──────────────────────────────────────────────────────

function Scrap4New() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const incoming  = location.state || {};

    // Build readonly full name: prefer AgentEntryForm state fields, fallback to HomePage customerName
    const agentName = [incoming.firstName, incoming.middleName, incoming.lastName].filter(Boolean).join(' ');
    const readonlyName = agentName || incoming.customerName || '';

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        customerName:        readonlyName,
        mobileNumber:        incoming.mobileNumber || '',
        houseAddress:        '',
        scrapBrand:          '',
        scrapBrandOtherSpec: '',
        locationOfScrap:     '',
        receiptAvailable:    '',
        workingCondition:    '',
        selectedIssues:      [],
    });

    const emptyProduct = () => ({ selection: '', name: '', size: '', price: '', quantity: 1 });
    const [products, setProducts] = useState([emptyProduct()]);

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

    const updateProduct = (i, updated) => { const n = [...products]; n[i] = updated; setProducts(n); };
    const addProduct    = () => setProducts(p => [...p, emptyProduct()]);
    const removeProduct = i  => setProducts(p => p.filter((_, idx) => idx !== i));

    const grandTotal = products.reduce(
        (sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 1), 0
    );

    const toggleIssue = issue =>
        set('selectedIssues', form.selectedIssues.includes(issue)
            ? form.selectedIssues.filter(i => i !== issue)
            : [...form.selectedIssues, issue]
        );

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = () => {
        if (!form.customerName)   { Swal.fire({ icon: 'warning', title: 'Required', text: 'Customer name is required.' }); return false; }
        if (!form.mobileNumber)   { Swal.fire({ icon: 'warning', title: 'Required', text: 'Mobile number is required.' }); return false; }
        if (!form.houseAddress)   { Swal.fire({ icon: 'warning', title: 'Required', text: 'House address is required.' }); return false; }

        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            if (!p.selection) { Swal.fire({ icon: 'warning', title: 'Required', text: `Please select a product / brand for Item ${i + 1}.` }); return false; }
            if (!p.size)      { Swal.fire({ icon: 'warning', title: 'Required', text: `Please enter a size for Item ${i + 1}.` }); return false; }
            if (!p.price)     { Swal.fire({ icon: 'warning', title: 'Required', text: `Please enter a price for Item ${i + 1}.` }); return false; }
        }

        if (!form.scrapBrand)  { Swal.fire({ icon: 'warning', title: 'Required', text: 'Please select the scrap brand.' }); return false; }
        if (form.scrapBrand === 'Others' && !form.scrapBrandOtherSpec) {
            Swal.fire({ icon: 'warning', title: 'Required', text: 'Please specify the scrap brand.' }); return false;
        }
        if (!form.locationOfScrap)   { Swal.fire({ icon: 'warning', title: 'Required', text: 'Location of scrap is required.' }); return false; }
        if (!form.receiptAvailable)  { Swal.fire({ icon: 'warning', title: 'Required', text: 'Please indicate if a receipt is available.' }); return false; }
        if (!media.receiptOrAffidavit) {
            Swal.fire({ icon: 'warning', title: 'Required', text: form.receiptAvailable === 'Yes' ? 'Please provide the receipt.' : 'Please provide the sworn affidavit.' });
            return false;
        }
        if (!media.selfieWithScrap) { Swal.fire({ icon: 'warning', title: 'Required', text: 'Please provide a selfie with the scrap.' }); return false; }

        for (const [key, label] of [['scrapBody','body photo'],['scrapTop','top photo'],['scrapCompressor','compressor photo'],['scrapInside','inside photo']]) {
            if (!media[key]) { Swal.fire({ icon: 'warning', title: 'Required', text: `Please provide the scrap ${label}.` }); return false; }
        }
        for (const [key, label] of [['videoBody','body video'],['videoTop','top video'],['videoCompressor','compressor video'],['videoInside','inside video']]) {
            if (!media[key]) { Swal.fire({ icon: 'warning', title: 'Required', text: `Please provide the ${label}.` }); return false; }
        }
        if (!form.workingCondition)        { Swal.fire({ icon: 'warning', title: 'Required', text: 'Please describe the working condition.' }); return false; }
        if (form.selectedIssues.length === 0) { Swal.fire({ icon: 'warning', title: 'Required', text: 'Please select at least one issue.' }); return false; }

        return true;
    };

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validate()) return;

        setIsSubmitting(true);

        // Build FormData matching Django backend field names (snake_case)
        const fd = new FormData();
        fd.append('customer_name',        form.customerName);
        fd.append('mobile_number',        form.mobileNumber);
        fd.append('house_address',        form.houseAddress);
        fd.append('scrap_brand',          form.scrapBrand === 'Others' ? form.scrapBrandOtherSpec : form.scrapBrand);
        fd.append('scrap_brand_other_spec', form.scrapBrandOtherSpec || '');
        fd.append('location_of_scrap',    form.locationOfScrap);
        fd.append('receipt_available',    form.receiptAvailable);
        fd.append('working_condition',    form.workingCondition);
        fd.append('selected_issues',      form.selectedIssues.join(', '));
        fd.append('grand_total',          grandTotal.toFixed(2));


        // Keep product info for navigation context only (not model fields)
        const productNames = products.map(p => `${p.name}${p.quantity > 1 ? ` ×${p.quantity}` : ''}`).join(' + ');
        const productSizes = products.map(p => p.size).join(', ');


        // Media files (snake_case keys)
        const mediaMap = {
            receipt_or_affidavit: media.receiptOrAffidavit,
            selfie_with_scrap:    media.selfieWithScrap,
            scrap_body:           media.scrapBody,
            scrap_top:            media.scrapTop,
            scrap_compressor:     media.scrapCompressor,
            scrap_inside:         media.scrapInside,
            video_body:           media.videoBody,
            video_top:            media.videoTop,
            video_compressor:     media.videoCompressor,
            video_inside:         media.videoInside,
        };
        Object.entries(mediaMap).forEach(([k, v]) => { if (v) fd.append(k, v); });

        try {
            const response = await fetch(SCRAP_API, { method: 'POST', body: fd });

            // Read raw text first — never call .json() on HTML error pages (404/500)
            const rawText = await response.text();
            const contentType = response.headers.get('content-type') || '';

            if (!response.ok) {
                throw new Error('Server returned ' + response.status + ' ' + response.statusText + '. Please ensure the backend endpoint is deployed correctly.');
            }
            if (!contentType.includes('application/json')) {
                throw new Error('Unexpected server response format. Please contact support.');
            }

            const result = JSON.parse(rawText);

            if (result.success !== false) {
                const scrapContext = {
                    submissionId:  result.id || result.submission_id || null,
                    productName:   productNames,
                    productSize:   productSizes,
                    grandTotal:    grandTotal,
                    mobileNumber:  form.mobileNumber,
                    customerName:  form.customerName,
                    ...incoming,
                };

                sessionStorage.setItem('scrap4newContext', JSON.stringify(scrapContext));
                navigate('/scrap4new-pin', { state: scrapContext });
            } else {
                Swal.fire({ icon: 'error', title: 'Submission Failed', text: result.message || 'Please try again.' });
            }
        } catch (err) {
            console.error('Scrap4New submit error:', err);
            Swal.fire({ icon: 'error', title: 'Submission Error', text: err.message || 'Could not reach the server. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: ACCENT }}>
            <div className="w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-10">

                <div className="hidden sm:block fixed sm:top-3 sm:left-3 z-50 pointer-events-none">
                    <Logo size="large" />
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center" style={{ color: ACCENT }}>
                    Scrap4New
                </h1>
                <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">
                    Trade in your old appliance for a brand-new Koolboks product
                </p>

                <div className="space-y-0">

                    {/* ── 1. Customer Details ──────────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Customer Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Customer Full Name *</label>
                                <input type="text" value={form.customerName}
                                       onChange={e => !readonlyName && set('customerName', e.target.value)}
                                       readOnly={!!readonlyName}
                                       className={`${inputCls} ${readonlyName ? 'opacity-75 cursor-not-allowed' : ''}`}
                                       onFocus={e => !readonlyName && focusOn(e)}
                                       onBlur={e  => !readonlyName && focusOff(e)}
                                       placeholder="Full name" />
                                {readonlyName && (
                                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                        <CheckCircle size={11} />
                                        {agentName ? 'Pre-filled from entry form' : 'Pre-filled from account verification'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Mobile Number *</label>
                                <input type="tel" value={form.mobileNumber}
                                       onChange={e => set('mobileNumber', e.target.value)}
                                       className={inputCls} onFocus={focusOn} onBlur={focusOff}
                                       placeholder="e.g. 08012345678" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>House Address *</label>
                                <input type="text" value={form.houseAddress}
                                       onChange={e => set('houseAddress', e.target.value)}
                                       className={inputCls} onFocus={focusOn} onBlur={focusOff}
                                       placeholder="Your house address" />
                            </div>
                        </div>
                    </section>

                    {/* ── 2. Products of Interest ──────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white">Product(s) of Interest</h2>
                            <button type="button" onClick={addProduct}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm hover:opacity-90 transition cursor-pointer"
                                    style={{ backgroundColor: ACCENT }}>
                                <Plus size={15} /> Add Item
                            </button>
                        </div>
                        {products.map((item, i) => (
                            <ProductRow key={i} index={i} item={item}
                                        onChange={updated => updateProduct(i, updated)}
                                        onRemove={() => removeProduct(i)}
                                        showRemove={products.length > 1} />
                        ))}
                        <div className="mt-2 p-4 rounded-lg bg-gray-900 border-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                             style={{ borderColor: ACCENT }}>
                            <div>
                                <p className="text-white font-semibold text-sm sm:text-base">Grand Total</p>
                                {products.filter(p => p.name).length > 0 && (
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        {products.filter(p => p.name).map(p => `${p.name}${p.quantity > 1 ? ` ×${p.quantity}` : ''}`).join(' + ')}
                                    </p>
                                )}
                            </div>
                            <span className="text-2xl font-bold" style={{ color: ACCENT }}>₦{grandTotal.toLocaleString()}</span>
                        </div>
                    </section>

                    {/* ── 3. Scrap Details ─────────────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Scrap Product Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Scrap Brand *</label>
                                <select value={form.scrapBrand}
                                        onChange={e => { set('scrapBrand', e.target.value); set('scrapBrandOtherSpec', ''); }}
                                        className={`${inputCls} cursor-pointer`} onFocus={focusOn} onBlur={focusOff}>
                                    <option value="">— Select brand —</option>
                                    {allBrands.map((b, i) => <option key={i} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Location of Scrap *</label>
                                <input type="text" value={form.locationOfScrap}
                                       onChange={e => set('locationOfScrap', e.target.value)}
                                       className={inputCls} onFocus={focusOn} onBlur={focusOff}
                                       placeholder="Where is the scrap located?" />
                            </div>
                            {form.scrapBrand === 'Others' && (
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium mb-2" style={{ color: ACCENT }}>Specify Brand *</label>
                                    <input type="text" value={form.scrapBrandOtherSpec}
                                           onChange={e => set('scrapBrandOtherSpec', e.target.value)}
                                           className={inputCls} onFocus={focusOn} onBlur={focusOff}
                                           placeholder="Enter the brand name" />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── 4. Proof of Ownership ────────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Proof of Ownership *</h2>
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
                                                border:          form.receiptAvailable === opt ? 'none'  : '1px solid #374151',
                                            }}>{opt}</button>
                                ))}
                            </div>
                        </div>
                        {form.receiptAvailable === 'Yes' && (
                            <MediaField label="Receipt" required accept="image/*,application/pdf"
                                        hint="Upload or snap a photo/PDF of your receipt."
                                        value={media.receiptOrAffidavit} onChange={v => setMed('receiptOrAffidavit', v)} allowPhoto />
                        )}
                        {form.receiptAvailable === 'No' && (
                            <MediaField label="Sworn Affidavit" required accept="image/*,application/pdf"
                                        hint="A sworn affidavit confirming ownership of the scrap is required."
                                        value={media.receiptOrAffidavit} onChange={v => setMed('receiptOrAffidavit', v)} allowPhoto />
                        )}
                    </section>

                    {/* ── 5. Selfie ────────────────────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Selfie with Scrap *</h2>
                        <p className="text-gray-400 text-sm mb-4">Stand beside the scrap and take a clear selfie showing both you and the appliance.</p>
                        <MediaField label="Selfie with scrap" required accept="image/*"
                                    value={media.selfieWithScrap} onChange={v => setMed('selfieWithScrap', v)} allowPhoto />
                    </section>

                    {/* ── 6. Photos ────────────────────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Real-Time Photos of Scrap *</h2>
                        <p className="text-gray-400 text-sm mb-4">Provide a clear, real-time photo of each part of the appliance.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[['scrapBody','Body'],['scrapTop','Top'],['scrapCompressor','Compressor'],['scrapInside','Inside']].map(([key, label]) => (
                                <MediaField key={key} label={label} required accept="image/*"
                                            value={media[key]} onChange={v => setMed(key, v)} allowPhoto />
                            ))}
                        </div>
                    </section>

                    {/* ── 7. Videos (no snap photo) ─────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Real-Time Videos of Scrap *</h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Upload or record a short video for each part.{' '}
                            <span style={{ color: ACCENT }}>Videos only — photo snap is not available here.</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[['videoBody','Body Video'],['videoTop','Top Video'],['videoCompressor','Compressor Video'],['videoInside','Inside Video']].map(([key, label]) => (
                                <MediaField key={key} label={label} required accept="video/*"
                                            value={media[key]} onChange={v => setMed(key, v)}
                                            allowPhoto={false}
                                            allowVideo />
                            ))}
                        </div>
                    </section>

                    {/* ── 8. Working Condition ─────────────────────────────────────── */}
                    <section className="border-b pb-6 mb-1" style={{ borderColor: ACCENT }}>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Working Condition *</h2>
                        <textarea value={form.workingCondition}
                                  onChange={e => set('workingCondition', e.target.value)}
                                  rows={4} className={inputCls} onFocus={focusOn} onBlur={focusOff}
                                  placeholder="Describe the current working condition of the scrap appliance in detail…" />
                    </section>

                    {/* ── 9. Known Issues ──────────────────────────────────────────── */}
                    <section className="pb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-white">Known Issues *</h2>
                        <p className="text-gray-400 text-sm mb-4">Select one or more issues pertaining to the scrap.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {scrapIssues.map(issue => {
                                const on = form.selectedIssues.includes(issue);
                                return (
                                    <button key={issue} type="button" onClick={() => toggleIssue(issue)}
                                            className="flex items-start gap-2 px-3 py-3 rounded-lg text-left text-sm font-medium transition cursor-pointer hover:opacity-90"
                                            style={{
                                                backgroundColor: on ? ACCENT   : '#111827',
                                                color:           on ? 'white'  : '#9ca3af',
                                                border:          on ? 'none'   : '1px solid #374151',
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

                    {/* ── Submit ───────────────────────────────────────────────────── */}
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

            {/* Full-screen submitting overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <Loader2 className="animate-spin" size={48} style={{ color: ACCENT }} />
                        <p className="text-white font-semibold text-lg">Submitting your form…</p>
                        <p className="text-gray-400 text-sm text-center">Please wait, uploading your files</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Scrap4New;