'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, Zap } from 'lucide-react';
import Link from 'next/link';

export default function QrStudioPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user?.profiles?.[0]) {
        const prof = data.user.profiles[0];
        setProfile(prof);

        const profileUrl = `${window.location.origin}/p/${prof.username}?source=qr`;
        const qrUrl = await QRCode.toDataURL(profileUrl, {
          width: 600,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrDataUrl(qrUrl);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadPng() {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${profile.username}-tapbiz-qr.png`;
    a.click();
  }

  function handleCopyLink() {
    if (!profile) return;
    const url = `${window.location.origin}/p/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading QR Code Studio...</div>;
  if (!profile) return <div className="p-8 text-center text-slate-400">No profile found.</div>;

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://tapbiz.ng'}/p/${profile.username}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <QrCode className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-bold text-white">QR Code & Printable Standee Studio</h1>
          </div>
          <p className="text-xs text-slate-400">
            Generate high-resolution QR codes and print custom counter standees for your physical business location.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPng}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print Template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: QR Code Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-4">High-Res QR Code Preview</h2>

            <div className="bg-white p-6 rounded-2xl w-56 h-56 mx-auto flex items-center justify-center shadow-2xl mb-6">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Destination Profile URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={profileUrl}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition shrink-0 flex items-center gap-1 border border-slate-700"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">QR Code Resolution: 600x600 px</span>
            <Link href={`/p/${profile.username}`} target="_blank" className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Printable Standee Card Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Printable Business Card / Standee</h2>
          <p className="text-xs text-slate-400">
            This card template is formatted for printing onto desk acrylic standees or plastic business cards.
          </p>

          {/* Printable Element */}
          <div
            ref={printRef}
            className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-8 text-center text-white space-y-4 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-black tracking-widest text-xs uppercase">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>TAP OR SCAN TO CONNECT</span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">{profile.businessName}</h3>
              <p className="text-xs text-slate-400">{profile.category}</p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto shadow-xl">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />}
            </div>

            <div className="text-[11px] font-mono text-emerald-400 bg-slate-950/80 py-2 px-3 rounded-xl border border-slate-800 inline-block">
              tapbiz.ng/p/{profile.username}
            </div>

            <p className="text-[10px] text-slate-500">Hold phone near card or sticker, or scan QR code with camera</p>
          </div>
        </div>
      </div>
    </div>
  );
}
