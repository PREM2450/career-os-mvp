import type { Metadata } from "next";
import "./globals.css";

// import ParticlesBackground from "@/components/ParticlesBackground";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeContext";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Career OS — Your AI Placement Companion",
  description:
    "A personalized AI career operating system for engineering students: daily missions, XP, streaks, and company readiness tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-[#070B17] text-white">
        <UserProvider>
         

         <ThemeProvider>
        {children}
    </ThemeProvider>

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </UserProvider>
      </body>
    </html>
  );
}