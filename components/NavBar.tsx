"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, History, Menu, X } from "lucide-react";

export default function NavBar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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

        {/* Desktop Menu */}
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

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/generate" className="btn-primary text-sm py-2.5 px-6 no-underline shadow-[0_4px_0_0_#004683]">
            Coba (Tanpa Login)
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
            style={{ minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden glass-nav border-t border-gray-100 py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {[
            { href: "/generate", label: "Buat Soal", icon: <Sparkles className="w-4 h-4" /> },
            { href: "/history", label: "Riwayat", icon: <History className="w-4 h-4" /> },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-base font-bold transition-all duration-200 ${
                isActive(item.href)
                  ? "gradient-hero text-white shadow-md"
                  : "text-gray-600 bg-gray-50/50 hover:bg-blue-50 hover:text-blue-700"
              }`}
              style={{ minHeight: "48px" }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <Link
            href="/generate"
            onClick={() => setIsOpen(false)}
            className="btn-primary text-center text-sm py-3 px-6 no-underline shadow-[0_4px_0_0_#004683] block mt-2"
            style={{ minHeight: "48px" }}
          >
            Coba (Tanpa Login)
          </Link>
        </div>
      )}
    </nav>
  );
}
