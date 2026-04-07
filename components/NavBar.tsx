"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, History } from "lucide-react";

export default function NavBar() {
  const path = usePathname();
  const isActive = (href: string) => path === href;

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 no-print">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl gradient-hero flex items-center justify-center text-white text-lg font-black">
            A
          </div>
          <span className="font-black text-xl" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            AjarVisual
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {[
            { href: "/generate", label: "Buat Soal", icon: <Sparkles className="w-4 h-4" /> },
            { href: "/history", label: "Riwayat", icon: <History className="w-4 h-4" /> },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive(item.href)
                  ? "gradient-hero text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/generate" className="btn-primary text-sm py-2.5 px-6 no-underline shadow-[0_4px_0_0_#004683]">
          Coba (Tanpa Login)
        </Link>
      </div>
    </nav>
  );
}
