import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router';
import { AuthWrapper } from './components/auth-wrapper';
import { Toaster } from './components/ui/sonner';
import { BottomNav } from './components/bottom-nav';
import './index.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pb-16">
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </AuthWrapper>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
