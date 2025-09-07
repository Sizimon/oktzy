import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CustomThemeProvider from "@/themes/ThemeProvider";
import "./globals.css";
import Providers from "@/context/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clip Curator",
  description: "A tool for curating video clips with timestamps and notes.",
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
