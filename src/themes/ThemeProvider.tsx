'use client';

import { ThemeProvider } from 'next-themes';

export default function CustomThemeProvider({ 
    children 
}: {
    children: React.ReactNode 
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            themes={['dark']}
            disableTransitionOnChange={false}
        >
            {children}
        </ThemeProvider>
    );
}