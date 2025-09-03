'use client';

import { AuthProvider } from '@/features/auth/context/authProvider';
import { ClipProvider } from '@/features/clips/context/clipProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClipProvider>
        {children}
      </ClipProvider>
    </AuthProvider>
  );
}