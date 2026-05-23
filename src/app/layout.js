import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AlihanVS | Personal Development",
  description: "Futuristic personal development dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-full bg-black text-white`}>
        {/* Ambient background glow effects */}
        <div className="fixed top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/20 blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/20 blur-[120px] pointer-events-none z-0" />

        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth">
          <div className="min-h-full p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
