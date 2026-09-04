import { useEffect } from 'react';

export default function AdminRedirect() {
  const portalUrl = import.meta.env.VITE_ADMIN_PORTAL_URL || 'https://reseller.weave365.com';

  useEffect(() => {
    window.location.href = portalUrl + '?store=50k';
  }, [portalUrl]);

  return (
    <div className="min-h-screen bg-[#0c0d10] flex items-center justify-center p-4 antialiased text-zinc-100">
      <div className="max-w-sm w-full bg-[#111216] border border-white/[0.08] rounded-2xl p-6 text-center shadow-2xl space-y-4">
        <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 font-bold text-base flex items-center justify-center mx-auto">
          W
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-100">Opening Weave365 Reseller Portal</h3>
          <p className="text-xs text-zinc-400 font-mono">reseller.weave365.com</p>
        </div>
        <div className="pt-2">
          <a
            href={portalUrl + '?store=50k'}
            className="inline-flex items-center justify-center px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold text-xs rounded-xl transition-colors"
          >
            Launch Reseller Workspace
          </a>
        </div>
      </div>
    </div>
  );
}
