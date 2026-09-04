// Storefront types for Weave365 White-Label Multi-Tenant Architecture

export interface StorefrontData {
  id?: string;
  reseller_id?: string;
  slug: string;
  store_name: string;
  tagline?: string;
  logo_url?: string;
  hero_banner_url?: string;
  theme_color?: string;
  accent_color?: string;
  whatsapp?: string;
  custom_domain?: string;
  owner_id?: string | null;
  is_active?: boolean;
}

export interface StorefrontProduct {
  id: string | number;
  tenant_id?: string;
  original_product_id?: string;
  sku?: string;
  title: string;
  description?: string | null;
  price: number;
  base_price?: number;
  retail_price?: number;
  formattedPrice?: string;
  image: string;
  images: string[];
  fabric?: string;
  category?: string;
  origin?: string;
  weaveTime?: string;
  zariType?: string;
  tag?: string;
  weave?: string;
  work?: string;
  is_published?: boolean;
  stock?: number;
  created_at?: string;
}

export interface StorefrontApiResponse {
  storefront: StorefrontData;
  products: StorefrontProduct[];
}
