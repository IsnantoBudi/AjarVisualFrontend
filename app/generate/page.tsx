"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import ProgressBloom from "@/components/ProgressBloom";
import LkpdTypeSelector, { getLkpdType } from "@/components/LkpdTypeSelector";
import { generateWorksheet } from "@/lib/api";
import { Sparkles, BookOpen, GraduationCap, ListOrdered, Clock, AlertTriangle, Wand2, ImageIcon, Ban } from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();
  const [topik, setTopik] = useState("");
  const [kelas, setKelas] = useState(3);
  const [jumlahSoal, setJumlahSoal] = useState(5);
  const [isCustomJumlah, setIsCustomJumlah] = useState(false);
  const [tipeSoal, setTipeSoal] = useState("pilihan_ganda");
  const [tanpaGambar, setTanpaGambar] = useState(false);
  const [model, setModel] = useState("gemma4");
  const [imageModel, setImageModel] = useState("pollinations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggleGambar = (enabled: boolean) => {
    const newTanpaGambar = !enabled;
    setTanpaGambar(newTanpaGambar);
    
    const currentMeta = getLkpdType(tipeSoal);
    if (newTanpaGambar) {
      // Mode Gambar OFF -> hanya format tanpa_gambar dan opsional yang diizinkan
      if (currentMeta?.imageRequirement === "wajib") {
        setTipeSoal("pilihan_ganda");
      }
    } else {
      // Mode Gambar ON -> hanya format wajib dan opsional yang diizinkan
      if (currentMeta?.imageRequirement === "tanpa_gambar") {
        setTipeSoal("pilihan_ganda");
      }
    }
  };

  const handleTipeSoalChange = (newType: string) => {
    setTipeSoal(newType);
  };

  const kurikulumMerdekaPresets = [
    { text: "Penjumlahan Buah", icon: "🍎", kelas: 1, label: "Fase A (Kls 1)" },
    { text: "Mengenal Hewan & Habitat", icon: "🦁", kelas: 2, label: "Fase A (Kls 2)" },
    { text: "Siklus Air & Cuaca", icon: "💧", kelas: 3, label: "Fase B (Kls 3)" },
    { text: "Pancasila & Gotong Royong", icon: "🇮🇩", kelas: 4, label: "Fase B (Kls 4)" },
    { text: "Sistem Tata Surya", icon: "🪐", kelas: 5, label: "Fase C (Kls 5)" },
    { text: "Sejarah Kemerdekaan RI", icon: "📚", kelas: 6, label: "Fase C (Kls 6)" },
  ];

  const handleSelectPreset = (preset: { text: string; kelas: number }) => {
    setTopik(preset.text);
    setKelas(preset.kelas);
  };

  const handleGenerate = async () => {
    if (!topik.trim()) {
      setError("Topik tidak boleh kosong!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await generateWorksheet({
        topik,
        kelas,
        jumlah_soal: jumlahSoal,
        tipe_soal: tipeSoal,
        tanpa_gambar: tanpaGambar,
        model,
        image_model: imageModel,
      });
      // Store result in sessionStorage for preview page
      sessionStorage.setItem("currentWorksheet", JSON.stringify(result.worksheet));
      sessionStorage.setItem("selectedModel", model);
      sessionStorage.setItem("selectedImageModel", imageModel);
      router.push("/preview");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 pt-[80px] pb-12">
          {/* Decorative Gamified Background while Loading */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafc] opacity-60" style={{ backgroundImage: "radial-gradient(#94a3b8 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}>
            <div className="absolute top-[10%] left-[5%] w-[260px] sm:w-[500px] h-[260px] sm:h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[120px] opacity-40 animate-blob"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[260px] sm:w-[500px] h-[260px] sm:h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[120px] opacity-40 animate-blob" style={{ animationDelay: '2s' }}></div>
          </div>
          <ProgressBloom message={`Serahkan pada AjarVisual, Sedang menyihir soal "${topik}"...`} />
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen py-8 px-4 sm:py-12 sm:px-6 relative overflow-hidden flex flex-col justify-center" style={{ paddingTop: "100px" }}>
        
        {/* Decorative Gamified Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafc] opacity-60" style={{ backgroundImage: "radial-gradient(#94a3b8 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-2xl mx-auto w-full z-10">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-[#1e293b] leading-tight flex flex-wrap items-center justify-center md:justify-start gap-3 drop-shadow-sm" style={{ fontFamily: "var(--font-headline)" }}>
              Buat Lembar Soal <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 fill-yellow-100 drop-shadow-md animate-pulse" />
            </h1>
            <p className="text-gray-500 font-medium text-base md:text-lg">
              Sihir topik materi apapun menjadi petualangan visual interaktif!
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
            
            {/* Topik */}
            <div className="mb-8">
              <label className="flex items-center gap-2 font-bold mb-3 text-sm" style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}>
                <BookOpen className="w-4 h-4 text-blue-600" /> TOPIK MATERI
              </label>
              <textarea
                className="w-full bg-white border-2 border-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-5 rounded-2xl text-base transition-all font-medium resize-none shadow-inner"
                rows={3}
                placeholder="Contoh: Ekosistem Laut, Sejarah Candi Borobudur, atau Sayur-sayuran..."
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
              />
              {/* Quick suggestions (Kurikulum Merdeka) */}
              <div className="mt-4">
                <div className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  💡 Inspirasi Topik Kurikulum Merdeka (Klik untuk set topik & kelas otomatis):
                </div>
                <div className="flex flex-wrap gap-2">
                  {kurikulumMerdekaPresets.map((r) => (
                    <button
                      key={r.text}
                      type="button"
                      onClick={() => handleSelectPreset(r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 border border-gray-200 shadow-sm bg-white text-gray-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50"
                    >
                      <span>{r.icon}</span>
                      <span>{r.text}</span>
                      <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-md">
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kelas */}
            <div className="mb-8">
              <label className="flex items-center gap-2 font-bold mb-3 text-sm" style={{ fontFamily: "var(--font-headline)" }}>
                <GraduationCap className="w-4 h-4 text-blue-600" /> TINGKAT KELAS
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((k) => {
                  const isSelected = kelas === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setKelas(k)}
                      className={`py-3.5 rounded-[1.25rem] font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                        isSelected 
                        ? "bg-gradient-to-b from-[#005caa] to-[#0081f2] text-white shadow-[0_4px_16px_rgba(0,130,242,0.4)]" 
                        : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 border-2 border-transparent hover:border-blue-100"
                      }`}
                    >
                      KLS {k}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jumlah Soal */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 font-bold text-sm" style={{ fontFamily: "var(--font-headline)" }}>
                  <ListOrdered className="w-4 h-4 text-blue-600" /> JUMLAH SOAL
                </label>
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black shadow-sm border border-blue-100 flex items-center gap-1">
                   {jumlahSoal} SOAL
                </div>
              </div>
              
              <div className="flex flex-wrap items-stretch gap-3">
                 {[5, 10, 15].map((preset) => {
                    const isSelected = jumlahSoal === preset && !isCustomJumlah;
                    return (
                      <button
                        key={preset}
                        onClick={() => { setJumlahSoal(preset); setIsCustomJumlah(false); }}
                        className={`flex-1 min-w-[70px] py-3.5 rounded-[1.25rem] font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 border-2 ${
                          isSelected 
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" 
                          : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {preset}
                      </button>
                    )
                 })}
                 
                 <div className={`flex-1 min-w-[100px] flex items-center rounded-[1.25rem] transition-all bg-gray-50 border-2 ${isCustomJumlah ? 'border-blue-500 shadow-sm bg-white' : 'border-gray-100 hover:bg-gray-100'}`}>
                    <span className={`pl-4 font-bold text-sm select-none ${isCustomJumlah ? 'text-blue-500' : 'text-gray-400'}`}>Custom:</span>
                    <input 
                      type="number"
                      min={1}
                      max={50}
                      value={isCustomJumlah ? jumlahSoal : ""}
                      onChange={(e) => {
                         setIsCustomJumlah(true);
                         const val = parseInt(e.target.value);
                         setJumlahSoal(isNaN(val) ? 1 : val);
                      }}
                      onFocus={() => setIsCustomJumlah(true)}
                      placeholder="?"
                      className="w-full bg-transparent border-none py-3.5 px-3 font-bold text-gray-700 focus:ring-0 placeholder-gray-300"
                    />
                 </div>
              </div>

              <div
                className="mt-4 px-4 py-2.5 flex items-center justify-center gap-2 rounded-2xl text-xs font-bold text-center w-full md:w-max shadow-sm"
                style={{ background: "#fff8e1", color: "#664b00" }}
              >
                <Clock className="w-4 h-4" /> Mode {tipeSoal.replace('_', ' ')} • Estimasi Generasi: ~{tanpaGambar ? jumlahSoal * 3 : jumlahSoal * 8} detik
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-8 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2 font-bold mb-3 text-sm" style={{ fontFamily: "var(--font-headline)" }}>
                <Sparkles className="w-4 h-4 text-blue-600" /> MODEL GENERATOR AI
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all group ${model === 'gemma4' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                  <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5">
                     <input type="radio" name="modelAi" value="gemma4" checked={model === "gemma4"} onChange={(e) => setModel(e.target.value)} className="peer absolute w-full h-full opacity-0 cursor-pointer" />
                     <div className="w-full h-full rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-bold text-gray-700 leading-tight">Ollama Gemma 4</span>
                    <span className="text-[10px] text-gray-400 font-medium">Model handal & aman untuk pemahaman edukasi</span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all group ${model === 'minimax-m2.5' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                  <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5">
                     <input type="radio" name="modelAi" value="minimax-m2.5" checked={model === "minimax-m2.5"} onChange={(e) => setModel(e.target.value)} className="peer absolute w-full h-full opacity-0 cursor-pointer" />
                     <div className="w-full h-full rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-bold text-gray-700 leading-tight">Ollama MiniMax M2.5</span>
                    <span className="text-[10px] text-gray-400 font-medium">Pemrosesan super cepat & gaya kreatif</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Pengaturan Gambar & Pilihan Model AI Gambar */}
            <div className="mb-8 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2 font-bold mb-3 text-sm text-gray-900" style={{ fontFamily: "var(--font-headline)" }}>
                <Sparkles className="w-4 h-4 text-pink-500" /> PENGATURAN GAMBAR & ILUSTRASI
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <label 
                  className="flex items-center justify-between p-5 rounded-2xl border-2 transition-all bg-white cursor-pointer"
                  style={{
                    borderColor: !tanpaGambar ? "#bfdbfe" : "#f1f5f9",
                    boxShadow: !tanpaGambar ? "0 4px 14px rgba(37,99,235,0.08)" : "none"
                  }}
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <div className={`font-black text-sm ${!tanpaGambar ? 'text-blue-700' : 'text-gray-500'}`}>
                        Gambar
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        !tanpaGambar ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {!tanpaGambar ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-medium leading-relaxed max-w-[220px] xs:max-w-none">
                      {!tanpaGambar
                        ? "Mengaktifkan format soal bergambar & ilustrasi AI otomatis."
                        : "Format soal teks murni & numerasi tanpa gambar ilustrasi."}
                    </div>
                  </div>
                  
                  <div className="relative inline-block w-14 mr-0 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                    <input 
                      type="checkbox" 
                      checked={!tanpaGambar} 
                      onChange={(e) => handleToggleGambar(e.target.checked)} 
                      className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-[3px] border-gray-200 appearance-none cursor-pointer shadow-sm z-10" 
                      style={{ left: !tanpaGambar ? "1.75rem" : "0", borderColor: !tanpaGambar ? "#2563eb" : "#cbd5e1", transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)" }}
                    />
                    <div className="toggle-label block overflow-hidden h-7 rounded-full bg-gray-200 cursor-pointer" style={{ background: !tanpaGambar ? "#93c5fd" : "#e2e8f0", transition: "all 0.3s" }}></div>
                  </div>
                </label>

                {!tanpaGambar ? (
                  <div className="flex flex-col gap-2.5 p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100 animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Model Gambar AI:
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border-2 transition-all ${imageModel === 'pollinations' ? 'border-blue-500 bg-white shadow-sm' : 'border-gray-200 bg-white/70 hover:border-gray-300'}`}>
                        <div className="flex items-center gap-2.5">
                          <input type="radio" name="imageModelAi" value="pollinations" checked={imageModel === "pollinations"} onChange={(e) => setImageModel(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-800">Pollinations AI</span>
                            <span className="text-[10px] text-gray-400 font-medium">Cepat, ringan & stabil (Default)</span>
                          </div>
                        </div>
                        <span className="text-[9px] bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-full uppercase">Cepat</span>
                      </label>

                      <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border-2 transition-all ${imageModel === 'flux' ? 'border-pink-500 bg-white shadow-sm' : 'border-gray-200 bg-white/70 hover:border-gray-300'}`}>
                        <div className="flex items-center gap-2.5">
                          <input type="radio" name="imageModelAi" value="flux" checked={imageModel === "flux"} onChange={(e) => setImageModel(e.target.value)} className="w-4 h-4 text-pink-600 focus:ring-pink-500" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-800">Hugging Face FLUX.1-schnell</span>
                            <span className="text-[10px] text-gray-400 font-medium">Black Forest Labs • Kualitas HD & Super Detil</span>
                          </div>
                        </div>
                        <span className="text-[9px] bg-pink-100 text-pink-800 font-black px-2 py-0.5 rounded-full uppercase">HD Pro</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-base flex-shrink-0">
                      📄
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Format Teks & Numerasi (Hemat Kuota)</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Generator difokuskan membuat soal berbasis teks dan lembar drill hitung tanpa memproses gambar AI.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Format & Tipe Lembar Kerja (LKPD) Selector (Dynamically Filtered) */}
            <div className="mb-8 pt-4 border-t border-gray-100">
              <LkpdTypeSelector 
                value={tipeSoal} 
                onChange={handleTipeSoalChange} 
                tanpaGambar={tanpaGambar} 
              />
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2" style={{ background: "#ffefee", color: "#b31b25", border: "1px solid #fecdd3" }}>
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" /> {error}
              </div>
            )}

            <button onClick={handleGenerate} className="btn-primary flex items-center justify-center gap-2 w-full text-lg py-4.5 rounded-[1.25rem] shadow-[0_6px_0_0_#004683] active:shadow-none hover:-translate-y-1 active:translate-y-1 transition-all bg-gradient-to-b from-[#005caa] to-[#0081f2]">
              <Wand2 className="w-6 h-6" /> Buat Lembar Soal Sekarang
            </button>
          </div>

        </div>
      </main>
      
      {/* Inject styling animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
          will-change: transform;
        }
      `}} />
    </>
  );
}
