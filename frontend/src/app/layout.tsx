import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SuryaHimal — Autonomous Clean Energy Microgrid AI",
  description:
    "Autonomous Agentic AI Framework for Clean Energy Access and Microgrid Optimization in Off-Grid Himalayan Communities (AI4SDG NAVONMESHA 2026, UPES)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-body antialiased bg-background text-on-surface`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
