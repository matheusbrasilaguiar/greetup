import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GreetUp · Operacional",
  description: "App de operação de eventos GreetUp",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={cn("h-full", sora.variable, jetbrains.variable, "font-sans", geist.variable)}>
      <body className="h-full overflow-hidden">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
