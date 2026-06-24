// White-Label Storefront Deployment Configuration
// Configure this file with the settings of your main Weave 365 B2B instance.

export const STOREFRONT_CONFIG = {
  // Public URL of the main Weave 365 website where the API endpoints are hosted.
  // Dynamically points to local development port 3000 or the production domain.
  MAIN_WEBSITE_URL: 'https://www.weave365.com',

  // Fallback reseller slug to use in development or if custom domain lookup is not configured.
  RESELLER_SLUG: '50k',
};
