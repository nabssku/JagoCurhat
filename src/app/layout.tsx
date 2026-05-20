
import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import BottomNavigation from "@/components/BottomNavigation";
import { Toaster } from "sonner";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JagoCurhat - Ruang Aman Untuk Ceritamu",
  description: "Platform sosial anonim untuk mengekspresikan emosi, curhat, dan saling mendukung tanpa penghakiman.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JagoCurhat",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${quicksand.variable} h-full antialiased dark`} style={{ colorScheme: "dark" }}>
  <body className="h-full bg-[#030303] flex items-center justify-center sm:p-8 overflow-hidden">
    <ThemeProvider>
      <AuthProvider>
            {/* Main app container – responsive, max‑width 28rem (≈ 448px) */}
            <div className="w-full max-w-md flex flex-col h-full bg-background rounded-lg overflow-hidden relative">
              {/* Safe‑area top spacer */}
              <div className="h-safe-top bg-background shrink-0" />

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {children}
              </div>

              {/* Persistent bottom navigation */}
              <BottomNavigation />
            </div>

            {/* Global toast configuration */}
            <Toaster
              theme="dark"
              position="top-center"
              closeButton
              richColors
              toastOptions={{
                style: {
                  background: "#0d0d0d",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  color: "#f5f5f5",
                  fontFamily: "var(--font-quicksand)",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
