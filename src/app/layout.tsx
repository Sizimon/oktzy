import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CustomThemeProvider from "@/themes/ThemeProvider";
import "./globals.css";
import Providers from "@/context/Providers";
import NavigationWrapper from "@/features/nav/NavigationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oktzy",
  description: "Timestamp, clip, and annotate videos instantly with Oktzy — organize your content and never miss a moment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomThemeProvider>
          <Providers>
            {children}
          </Providers>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
