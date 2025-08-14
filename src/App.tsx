import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { AuthWrapper } from './components/auth-wrapper';
import { Toaster } from './components/ui/sonner';
import AppLayout from '@/components/layouts/AppLayout';
import './index.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AuthWrapper>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
