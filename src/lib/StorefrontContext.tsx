import { createContext, useContext, type ReactNode } from 'react';
import { useStorefront } from '@/hooks/use-storefront';
import type { StorefrontData, StorefrontProduct } from '@/types/storefront';

interface StorefrontContextValue {
  storefront: StorefrontData | null;
  remoteProducts: StorefrontProduct[];
  loading: boolean;
  error: string | null;
  storeName: string;
  refetch: () => Promise<void>;
}

const StorefrontContext = createContext<StorefrontContextValue>({
  storefront: null,
  remoteProducts: [],
  loading: true,
  error: null,
  storeName: 'TAVISHI',
  refetch: async () => {},
});

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const { storefront, products, loading, error, refetch } = useStorefront();

  const storeName = storefront?.store_name || 'TAVISHI';

  return (
    <StorefrontContext.Provider
      value={{ 
        storefront, 
        remoteProducts: products, 
        loading, 
        error, 
        storeName,
        refetch 
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefrontContext() {
  return useContext(StorefrontContext);
}
