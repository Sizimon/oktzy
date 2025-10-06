'use client';

import { AuthProvider } from '@/features/auth/context/authProvider';
import { ClipProvider } from '@/features/clips/context/clipProvider';
import NavigationWrapper from '@/features/nav/NavigationWrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClipProvider>
        <NavigationWrapper />
        {children}
      </ClipProvider>
    </AuthProvider>
  );
}