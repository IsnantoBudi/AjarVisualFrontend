import Link from "next/link";
import { Sparkles, Palette, Printer, Cloud, ArrowRight, PlayCircle, Zap, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";

export default function Home() {
  const bentoFeatures = [
    {
      icon: <Sparkles className="w-10 h-10 text-[#005caa]" />,
      title: "AI Bikin Soal Otomatis",
      desc: "Hanya butuh satu topik, AI Gemini kami akan langsung menyusun soal-soal berkualitas yang pas banget untuk anak SD.",
      bgColor: "#e0f2fe", // light blue
      colSpan: "md:col-span-2",
    },
    {
      icon: <Palette className="w-10 h-10 text-[#ea580c]" />,
      title: "Ilustrasi Ajaib",
      desc: "Pollinations.ai bikin karakter kartun untuk setiap soal.",
      bgColor: "#ffedd5", // light orange
      colSpan: "col-span-1",
    },
    {
      icon: <Printer className="w-10 h-10 text-[#16a34a]" />,
      title: "Siap Cetak A4",
      desc: "Tampilan rapi, siap diprint kapan aja.",
      bgColor: "#dcfce7", // light green
      colSpan: "col-span-1",
    },
    {
      icon: <Cloud className="w-10 h-10 text-[#9333ea]" />,
      title: "Tersimpan Aman di Cloud",
      desc: "Semua worksheet kamu aman di database TiDB. Nggak takut hilang karena lupa di-save, semua otomatis rapi di Riwayat.",
      bgColor: "#f3e8ff", // light purple
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <>
      <NavBar />
      <main className="bg-[#f8fafc] overflow-hidden" style={{ paddingTop: "72px" }}>
        
        {/* ── HERO SECTION (Playful & Clean) ──────────────────────────────────────── */}
        <section className="relative py-12 px-4 sm:px-6 md:py-32 flex flex-col items-center text-center">
          {/* Floating decorative elements (hidden on mobile to prevent clutter & overflow) */}
          <div className="hidden md:block absolute top-20 left-[10%] animate-[float_5s_ease-in-out_infinite]">
            <div className="w-16 h-16 bg-[#FFC107] rounded-3xl rotate-12 shadow-lg flex items-center justify-center text-2xl">✨</div>
          </div>
          <div className="hidden md:block absolute bottom-32 right-[15%] animate-[float_7s_ease-in-out_infinite_reverse]">
            <div className="w-20 h-20 bg-[#4CAF50] rounded-full shadow-lg flex items-center justify-center text-4xl">📚</div>
          </div>
          <div className="hidden md:block absolute top-40 right-[10%] animate-[float_6s_ease-in-out_infinite]">
            <div className="w-14 h-14 bg-pink-400 rounded-2xl -rotate-12 shadow-lg flex items-center justify-center text-xl">🎨</div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Tech Stack Banner for Portfolio Demo */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 md:mb-8 bg-white shadow-sm border border-gray-100 text-gray-500">
              <span className="flex items-center gap-1 text-blue-600"><Zap className="w-3.5 h-3.5" /> Next.js & Go</span>
              <span className="text-gray-300">•</span>
              <span>Gemini AI</span>
              <span className="text-gray-300">•</span>
              <span>TiDB</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-[1.15] text-[#1e293b]" style={{ fontFamily: "var(--font-headline)" }}>
              Bikin Soal Belajar <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Jadi Menyenangkan!
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl mb-10 text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
              Alat bantu AI buat guru dan orang tua untuk menyusun lembar kerja visual dengan otomatis. <strong className="text-gray-700">Langsung klik, tanpa perlu daftar akun!</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
              <Link href="/generate" className="btn-primary flex items-center justify-center gap-2 text-base md:text-lg py-4 px-8 md:px-10 w-full sm:w-auto">
                <ArrowRight className="w-5 h-5" /> Coba Sekarang (Tanpa Login)
              </Link>
              <Link href="/history" className="btn-secondary flex items-center justify-center gap-2 text-base md:text-lg py-4 px-8 md:px-10 w-full sm:w-auto">
                <PlayCircle className="w-5 h-5 text-gray-400" /> Lihat Hasilnya
              </Link>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-500" /> 100% Gratis & Langsung Bisa Dipakai
            </div>
          </div>
        </section>

        {/* ── BENTO GRID FEATURES ─────────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 bg-white rounded-t-[2.5rem] md:rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#1e293b]" style={{ fontFamily: "var(--font-headline)" }}>
                Kenapa Pakai AjarVisual?
              </h2>
              <p className="text-lg md:text-xl text-gray-500 font-medium">Semua udah diatur rapi biar kamu gampang pakainya.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bentoFeatures.map((f, i) => (
                <div 
                  key={i} 
                  className={`rounded-[2.5rem] p-6 sm:p-8 lg:p-12 transition-transform duration-300 hover:-translate-y-2 ${f.colSpan}`}
                  style={{ backgroundColor: f.bgColor }}
                >
                  <div className="mb-6 bg-white/60 w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-[#1e293b]" style={{ fontFamily: "var(--font-headline)" }}>
                    {f.title}
                  </h3>
                  <p className="text-lg text-gray-700 font-medium leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (Modern Alternate Layout) ─────────────────────────────── */}
        <section className="py-24 px-6 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#1e293b]" style={{ fontFamily: "var(--font-headline)" }}>
                  Cuma Butuh 3 Langkah
                </h2>
                <p className="text-xl text-gray-500 font-medium mb-10">Beneran semudah itu. Nggak pusing mikirin format.</p>
                
                <div className="space-y-8">
                  {[
                    { num: "1", title: "Tulis Materinya", desc: "Ketik topik aja, misalnya 'Sistem Tata Surya' atau 'Tebak Hewan'." },
                    { num: "2", title: "Klik Generate", desc: "Tunggu Gemini AI & Pollinations menyihir idemu jadi soal bergambar." },
                    { num: "3", title: "Cetak & Bagikan", desc: "Langsung bisa kamu Print ukura A4. Beres!" }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-14 h-14 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-black shadow-inner">
                        {s.num}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-[#1e293b] mb-1">{s.title}</h4>
                        <p className="text-gray-500 text-lg font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fake UI Illustration for visual appeal */}
              <div className="bg-[#eef2ff] rounded-[3rem] p-10 flex items-center justify-center relative overflow-hidden shadow-sm border-8 border-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm relative z-10 border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full w-2/3 mb-4"></div>
                  <div className="h-12 bg-blue-50 border-2 border-blue-500 rounded-2xl mb-4 flex items-center px-4">
                    <span className="text-blue-600 font-bold">Hewan Kucing Lucu</span>
                  </div>
                  <div className="h-12 bg-blue-600 rounded-2xl shadow-[0_4px_0_0_#1d4ed8] flex items-center justify-center text-white font-bold mb-4">
                    Generate Soal
                  </div>
                  <div className="flex justify-between mt-6 pt-6 border-t border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BOTTOM ─────────────────────────────────────────────────────────── */}
        <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-blue-50 relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-[#1e293b]" style={{ fontFamily: "var(--font-headline)" }}>
              Tunggu Apa Lagi?
            </h2>
            <p className="text-xl text-gray-500 mb-10 font-medium">Ubah cara bikin soalmu jadi lebih modern hari ini.</p>
            <Link href="/generate" className="btn-primary inline-flex items-center justify-center gap-2 text-xl py-5 px-12 shadow-[0_6px_0_0_#004683]">
              <Sparkles className="w-6 h-6" /> Gas, Bikin Soal Sekarang!
            </Link>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
        <footer className="py-10 px-6 text-center bg-white border-t border-gray-100">
          <p className="text-gray-400 font-semibold text-sm">
            Interactive Portfolio Project • AjarVisual 
          </p>
        </footer>
      </main>

      {/* Tailwind specific animations for this page injected globally or via component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </>
  );
}
