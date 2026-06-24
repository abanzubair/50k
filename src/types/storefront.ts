// Storefront types for the Weave365 white-label API response

export interface StorefrontData {
  reseller_id: string;
  store_name: string;
  logo_url?: string;
  theme_color?: string;
  whatsapp?: string;
}

export interface StorefrontProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  images?: string[];
  fabric: string;
  origin: string;
  weaveTime: string;
  zariType: string;
  tag?: string;
  weave?: string;
  work?: string;
}

export interface StorefrontApiResponse {
  storefront: StorefrontData;
  products: StorefrontProduct[];
}
