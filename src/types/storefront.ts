// Storefront types for Weave365 White-Label Multi-Tenant Architecture

export interface StorefrontNavLink {
  id: string;
  label: string;
  url: string;
  is_active: boolean;
  is_external?: boolean;
}

export interface StorefrontHero {
  type: 'image' | 'video';
  url: string;
  poster_url?: string;
  headline?: string;
  badge?: string;
  subtitle?: string;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
}

export interface StorefrontAnnouncement {
  enabled: boolean;
  text: string;
  link?: string;
}

export interface StorefrontTrustBadges {
  show_silk_mark: boolean;
  show_tested_zari: boolean;
  show_handloom_certified: boolean;
  show_direct_artisan: boolean;
}

export interface StorefrontConfig {
  reseller_id?: string;
  hero?: StorefrontHero;
  nav_links?: StorefrontNavLink[];
  announcement?: StorefrontAnnouncement;
  accent_color?: string;
  trust_badges?: StorefrontTrustBadges;
  whatsapp_greeting?: string;
}

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
  about_text?: string;
  whatsapp?: string;
  custom_domain?: string;
  owner_id?: string | null;
  is_active?: boolean;
  config?: StorefrontConfig;
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
