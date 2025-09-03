'use client';

import { AuthProvider } from '@/context/authProvider';
import { ClipProvider } from '@/context/clipProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClipProvider>
        {children}
      </ClipProvider>
    </AuthProvider>
  );
}