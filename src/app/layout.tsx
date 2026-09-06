import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Tasks — AI Orbit Ecosystem",
  description: "Explore practical AI tasks, challenges, and projects designed to help you build and evaluate AI skills.",
  keywords: ["AI Tasks", "Machine Learning", "Generative AI", "Computer Vision", "AI Agents", "LLM", "Robotics"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var saved = localStorage.getItem('orbit_theme');
                if (saved === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            })();`
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-orbit-app text-orbit-primary transition-colors duration-200 selection:bg-[#8B5CF6]/30">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-full overflow-x-clip">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
