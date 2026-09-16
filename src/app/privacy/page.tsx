import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="text-emerald-400 font-bold text-sm hover:underline">
          ← Back to TapBiz Homepage
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            At TapBiz.ng (&ldquo;TapBiz&rdquo;), accessible from https://tapbiz.ng, one of our main priorities is the privacy of our visitors and business subscribers. This Privacy Policy document contains types of information that is collected and recorded by TapBiz and how we use it.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">1. Information We Collect</h2>
          <p>
            When you register for a TapBiz account or create a digital business profile, we may collect personal and business information such as your full name, email address, phone number, business handle, services, products, and contact details.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Card & QR Telemetry Data</h2>
          <p>
            When customers tap your physical smart card or sticker or scan your QR code, we log anonymous telemetry events (such as timestamp, approximate device category, and browser type) to compile analytics metrics for your business dashboard. We do NOT store invasive personal tracking data or private customer financial credentials.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">3. Contact & Support</h2>
          <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@tapbiz.ng.</p>
        </div>
      </div>
    </div>
  );
}
