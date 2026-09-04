import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { StorefrontData, StorefrontProduct } from '@/types/storefront';

interface UseStorefrontReturn {
  storefront: StorefrontData | null;
  products: StorefrontProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Resolves the boutique identifier/slug from the URL:
 * 1. Query param (?store=... or ?slug=...)
 * 2. First path segment (/storefront or /50k)
 * 3. Custom domain match
 * 4. Fallback: '50k'
 */
function resolveCurrentSlug(): { slug?: string; domain?: string } {
  if (typeof window === 'undefined') return { slug: '50k' };

  const urlParams = new URLSearchParams(window.location.search);
  const querySlug = urlParams.get('store') || urlParams.get('slug');
  if (querySlug) {
    return { slug: querySlug.toLowerCase().trim() };
  }

  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length > 0) {
    const candidate = parts[0].toLowerCase().trim();
    // Ignore internal app routes and asset paths
    if (!['admin', 'product', 'products', 'assets', 'images', 'api'].includes(candidate)) {
      return { slug: candidate };
    }
  }

  const hostname = window.location.hostname;
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return { domain: hostname };
  }

  return { slug: '50k' };
}

export function useStorefront(): UseStorefrontReturn {
  const [storefront, setStorefront] = useState<StorefrontData | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const target = resolveCurrentSlug();
      let tenantQuery = supabase.from('boutique_tenants').select('*');

      if (target.slug) {
        tenantQuery = tenantQuery.eq('slug', target.slug);
      } else if (target.domain) {
        tenantQuery = tenantQuery.eq('custom_domain', target.domain);
      }

      let { data: tenant } = await tenantQuery.maybeSingle();

      // If specific slug not found, fall back to '50k' or first available tenant
      if (!tenant) {
        const { data: fallbackTenant } = await supabase
          .from('boutique_tenants')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        tenant = fallbackTenant;
      }

      if (!tenant) {
        setStorefront({
          slug: '50k',
          store_name: '50K Heritage',
          tagline: 'Handcrafted Authentic Pure Silk Banarasi Sarees',
          whatsapp: '919919101369',
        });
        setProducts([]);
        return;
      }

      let config: any = {};
      if (tenant.about_text) {
        try {
          const parsed = JSON.parse(tenant.about_text);
          if (typeof parsed === 'object' && parsed !== null) {
            config = parsed;
          }
        } catch (e) {
          // ignore
        }
      }

      setStorefront({
        ...tenant,
        hero_banner_url: tenant.banner_url || tenant.hero_banner_url,
        config,
      });

      // Fetch products for this tenant
      const { data: prods, error: prodErr } = await supabase
        .from('boutique_products')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (prodErr) throw prodErr;

      const formattedProds: StorefrontProduct[] = (prods || []).map((p) => {
        const price = Number(p.retail_price || p.base_price || 0);
        const imagesList = Array.isArray(p.images) && p.images.length > 0 ? p.images : [];
        const primaryImage = imagesList[0] || '/images/hero-saree.jpg';

        return {
          id: p.id,
          tenant_id: p.tenant_id,
          original_product_id: p.original_product_id,
          sku: p.sku || `WV-${p.id}`,
          title: p.title,
          description: p.description || 'Exquisite handcrafted Banarasi masterpiece woven with delicate zari work and luxurious texture.',
          price,
          base_price: Number(p.base_price || 0),
          retail_price: price,
          formattedPrice: `₹${price.toLocaleString('en-IN')}`,
          image: primaryImage,
          images: imagesList.length > 0 ? imagesList : [primaryImage],
          category: p.category || 'Saree',
          fabric: p.fabric || 'Soft Silk',
          weave: p.weave || 'Powerloom',
          origin: 'Varanasi, India',
          weaveTime: '15-20 Days',
          zariType: 'Zari Work',
          work: p.work || 'Intricate Floral & Zari Weave',
          is_published: p.is_published !== false,
          stock: 10,
          created_at: p.created_at,
        };
      });

      setProducts(formattedProds);
    } catch (err: any) {
      console.error('[useStorefront] Error loading data:', err);
      setError(err?.message || 'Failed to load boutique');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { storefront, products, loading, error, refetch: loadData };
}
