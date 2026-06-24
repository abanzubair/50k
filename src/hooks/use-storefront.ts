import { useState, useEffect } from 'react';
import { STOREFRONT_CONFIG } from '@/lib/config';
import type { StorefrontData, StorefrontProduct, StorefrontApiResponse } from '@/types/storefront';

interface UseStorefrontReturn {
  storefront: StorefrontData | null;
  products: StorefrontProduct[];
  loading: boolean;
  error: string | null;
}

/**
 * Resolves the reseller slug from the URL (query param, path segment, hostname, or fallback).
 * Mirrors the exact slug resolution logic from the 30K white-label site.
 */
function resolveQuery(): string {
  const urlParams = new URLSearchParams(window.location.search);
  let slug = urlParams.get('store');

  // Resolve via subfolder path segment if present (e.g., /boutique-name/...)
  if (!slug) {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const possibleSlug = parts[0];
      // Exclude common static resource folder names or HTML filenames
      if (!possibleSlug.endsWith('.html') && possibleSlug !== 'assets' && possibleSlug !== 'views') {
        slug = possibleSlug;
      }
    }
  }

  if (slug) {
    return `slug=${encodeURIComponent(slug)}`;
  } else if (STOREFRONT_CONFIG.RESELLER_SLUG) {
    return `slug=${encodeURIComponent(STOREFRONT_CONFIG.RESELLER_SLUG)}`;
  } else {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `domain=${encodeURIComponent(hostname)}`;
    }
  }

  return '';
}

/**
 * Custom hook that fetches storefront branding and product catalog
 * from the main Weave365 website API (/api/storefront).
 *
 * Returns { storefront, products, loading, error }.
 */
export function useStorefront(): UseStorefrontReturn {
  const [storefront, setStorefront] = useState<StorefrontData | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStorefrontData() {
      try {
        const query = resolveQuery();
        if (!query) {
          setLoading(false);
          return;
        }

        const baseUrl = STOREFRONT_CONFIG.MAIN_WEBSITE_URL.replace(/\/+$/, '');
        const apiUrl = `${baseUrl}/api/storefront?${query}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: StorefrontApiResponse = await response.json();

        if (!cancelled) {
          if (data && data.storefront) {
            setStorefront(data.storefront);
            setProducts(data.products || []);
          }
        }
      } catch (err) {
        console.error('Failed to load storefront data:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load storefront');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStorefrontData();
    return () => { cancelled = true; };
  }, []);

  return { storefront, products, loading, error };
}
