import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "500", "600", "700", "800"],
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AjarVisual  Pembuat Soal AI untuk Guru",
  description: "Platform cerdas untuk guru dan orang tua membuat lembar soal kreatif dengan ilustrasi visual otomatis dari AI.",
  keywords: "pembuat soal, worksheet generator, AI, guru SD, lembar soal",
  openGraph: {
    title: "AjarVisual  AI Worksheet Generator",
    description: "Generate soal otomatis dengan ilustrasi AI untuk anak SD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${plusJakarta.variable} ${beVietnam.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
