import { useState, useEffect } from 'react';
import { Save, Check, Loader2, Store, Phone, Globe, Image}  from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminTenant } from '@/lib/AdminTenantContext';

export default function AdminProfile() {
  const { tenant, refreshTenant } = useAdminTenant();
  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [heroBannerUrl, setHeroBannerUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenant) {
      setStoreName(tenant.store_name || '');
      setWhatsapp(tenant.whatsapp || '');
      setTagline(tenant.tagline || '');
      setLogoUrl(tenant.logo_url || '');
      setHeroBannerUrl(tenant.hero_banner_url || '');
      setCustomDomain(tenant.custom_domain || '');
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?.id) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const { error: updateErr } = await supabase
        .from('boutique_tenants')
        .update({
          store_name: storeName.trim(),
          whatsapp: whatsapp.trim(),
          tagline: tagline.trim(),
          logo_url: logoUrl.trim() || null,
          hero_banner_url: heroBannerUrl.trim() || null,
          custom_domain: customDomain.trim() || null,
        })
        .eq('id', tenant.id);

      if (updateErr) throw updateErr;

      await refreshTenant();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save boutique settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Boutique Branding & Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure your boutique's public identity, WhatsApp order destination, and domain
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Boutique settings saved and published successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider">
            <Store className="w-4 h-4 text-amber-500" />
            <span>Store Identity & WhatsApp</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Boutique Store Name *
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. 50K Heritage Sarees"
              className="w-full h-11 px-4 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              WhatsApp Order Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 919919101369"
                className="w-full h-11 pl-10 pr-4 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Include country code without '+' (e.g. 91 for India). Customer inquiries will be routed to this number.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Tagline / Headline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Handcrafted Pure Silk Banarasi Sarees & Couture"
              className="w-full h-11 px-4 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Media & Artwork */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider">
            <Image className="w-4 h-4 text-amber-500" />
            <span>Media & Branding</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Logo Image URL (Optional)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://yourdomain.com/logo.png"
              className="w-full h-11 px-4 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Hero Banner Image URL (Optional)
            </label>
            <input
              type="url"
              value={heroBannerUrl}
              onChange={(e) => setHeroBannerUrl(e.target.value)}
              placeholder="https://assets.weave365.com/banner.jpg"
              className="w-full h-11 px-4 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Custom Domain */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4 text-amber-500" />
            <span>Custom Domain (Optional)</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Custom Domain Name
            </label>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g. www.myboutique.com"
              className="w-full h-11 px-4 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Point a CNAME record to your deployed template URL to serve this boutique under your own custom domain.
            </p>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
