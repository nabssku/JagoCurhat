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
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${quicksand.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#030303] flex items-center justify-center sm:py-8">
        <ThemeProvider>
          <AuthProvider>
            {/* Phone Emulator Chassis */}
            <div className="w-full h-full min-h-screen sm:min-h-0 sm:h-[840px] sm:max-h-[92vh] sm:w-[410px] sm:rounded-[48px] sm:border-[10px] sm:border-[#121212] sm:shadow-[0_0_40px_rgba(168,85,247,0.12)] flex flex-col overflow-hidden bg-background relative z-10">
              
              {/* Speaker Notch for Emulator */}
              <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#121212] rounded-b-2xl z-50">
                <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mt-1" />
              </div>

              {/* Status bar spacer */}
              <div className="h-safe-top bg-background shrink-0 z-40" />

              {/* App Screen Content Scroll View */}
              <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
                {children}
              </div>

              {/* Persistent Bottom Bar */}
              <BottomNavigation />
              
              {/* Emulator Bottom Home Bar */}
              <div className="hidden sm:block absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-zinc-800 rounded-full z-50 pointer-events-none" />
            </div>

            {/* Global Toasts Config */}
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
