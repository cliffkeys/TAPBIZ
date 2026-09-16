import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="text-emerald-400 font-bold text-sm hover:underline">
          ← Back to TapBiz Homepage
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to TapBiz.ng! These terms and conditions outline the rules and regulations for the use of TapBiz Digital Profile SaaS Platform.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">1. Business Profile Handles</h2>
          <p>
            User handles (e.g. tapbiz.ng/p/handle) are assigned on a first-come, first-served basis. TapBiz reserves the right to reclaim handles that violate trademarks or reserved system names.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Physical Smart Cards & Stickers</h2>
          <p>
            Physical smart cards and stickers point to your secure TapBiz profile URL. TapBiz is not responsible for physical card damage caused by third-party handling or misuse.
          </p>
        </div>
      </div>
    </div>
  );
}
