import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useRef } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Ensure the QueryClient is created only once per browser tab
  const queryClientRef = useRef<QueryClient>(new QueryClient());
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          refetchOnWindowFocus: true,
          retry: 3,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
