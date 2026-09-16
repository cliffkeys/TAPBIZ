import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="text-emerald-400 font-bold text-sm hover:underline">
          ← Back to TapBiz Homepage
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Refund Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Subscriptions processed via Paystack for TapBiz PRO and BUSINESS plans can be cancelled at any time from your dashboard. If you believe an error occurred during billing, please contact billing@tapbiz.ng within 7 days of transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
