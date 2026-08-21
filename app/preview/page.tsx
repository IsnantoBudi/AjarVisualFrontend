"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import QuestionCard from "@/components/QuestionCard";
import { Worksheet, addWorksheetSoal } from "@/lib/api";
import { Printer, Save, Check, History, PlusSquare, PlusCircle, Wand2, X, Play, Key } from "lucide-react";

export default function PreviewPage() {
  const router = useRouter();
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [includeAnswerKeyPage, setIncludeAnswerKeyPage] = useState(true);
  const [showAppend, setShowAppend] = useState(false);
  const [appendLoading, setAppendLoading] = useState(false);
  const [appendForm, setAppendForm] = useState({
    jumlah_soal: 5,
    tipe_soal: "pilihan_ganda",
    tanpa_gambar: false,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("currentWorksheet");
    if (!stored) {
      router.push("/generate");
      return;
    }
    setWorksheet(JSON.parse(stored));

    // Handle auto-print from history page
    if (sessionStorage.getItem("autoPrint") === "true") {
      sessionStorage.removeItem("autoPrint");
      setTimeout(() => {
        window.print();
      }, 500); // Allow time for images to attempt loading
    }
  }, [router]);

  const handleImageChange = (index: number, newUrl: string) => {
    if (!worksheet) return;
    const updated = { ...worksheet };
    updated.data_soal[index].image_url = newUrl;
    setWorksheet(updated);
    sessionStorage.setItem("currentWorksheet", JSON.stringify(updated));
  };

  const handleSoalUpdate = (index: number, updatedSoal: any) => {
    if (!worksheet) return;
    const updated = { ...worksheet };
    updated.data_soal[index] = updatedSoal;
    setWorksheet(updated);
    sessionStorage.setItem("currentWorksheet", JSON.stringify(updated));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setSaving(false);
  };

  const handleAppend = async () => {
    if (!worksheet) return;
    setAppendLoading(true);
    try {
      const selectedModel = sessionStorage.getItem("selectedModel") || undefined;
      const selectedImageModel = sessionStorage.getItem("selectedImageModel") || undefined;
      const res = await addWorksheetSoal(worksheet.id, {
        topik: worksheet.judul_materi,
        kelas: worksheet.tingkat_kelas,
        ...appendForm,
        model: selectedModel,
        image_model: selectedImageModel,
      });
      setWorksheet(res.worksheet);
      sessionStorage.setItem("currentWorksheet", JSON.stringify(res.worksheet));
      setShowAppend(false);
    } catch(err) {
      alert("Gagal menambahkan soal");
    } finally {
      setAppendLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!worksheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <main className="pt-[80px] print:pt-0">
        {/* Print-friendly A4 layout */}
        <div className="print-page">
          {/* Header */}
          <div className="py-4 px-4 sm:px-6 no-print" style={{ background: "var(--color-surface-low)" }}>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "var(--font-headline)" }}>
                    Preview: {worksheet.judul_materi}
                  </h1>
                  <p style={{ color: "var(--color-on-surface-variant)" }}>
                    Kelas {worksheet.tingkat_kelas} SD &bull; {worksheet.data_soal.length} soal
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 no-print">
                  {/* Interactive Key Preview Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={showKey} 
                        onChange={(e) => setShowKey(e.target.checked)} 
                      />
                      <div className={`block w-8 h-5 rounded-full transition-colors ${showKey ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${showKey ? 'translate-x-3' : ''}`}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-green-600" /> Mode Kunci
                    </span>
                  </label>

                  {/* Print Answer Key Attachment Page Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 accent-blue-600 rounded" 
                      checked={includeAnswerKeyPage} 
                      onChange={(e) => setIncludeAnswerKeyPage(e.target.checked)} 
                    />
                    <span className="text-xs font-bold text-gray-700">
                      + Kunci Guru (Cetak)
                    </span>
                  </label>

                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-xs font-bold"
                  >
                    {saved ? <><Check className="w-4 h-4 text-green-600" /> Tersimpan</> : saving ? "..." : <><Save className="w-4 h-4" /> Simpan</>}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs font-bold shadow-[0_4px_0_0_#004683]"
                  >
                    <Printer className="w-4 h-4" /> Cetak (A4)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Print Header (LKPD Style) */}
          <div className="hidden print:block mb-4">
            {/* Box Header Nama & Kelas */}
            <div className="flex items-center justify-between border-2 border-blue-400 rounded-2xl px-5 py-2.5 mb-4 text-sm font-bold text-blue-900 bg-blue-50/20">
              <div className="flex items-center gap-2">
                <span>Nama :</span>
                <span className="w-48 border-b-2 border-dotted border-blue-400 inline-block"></span>
              </div>
              <div className="flex items-center gap-2">
                <span>Kelas :</span>
                <span className="w-24 border-b-2 border-dotted border-blue-400 inline-block"></span>
              </div>
            </div>

            {/* Judul Materi LKPD & Instruksi */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-black uppercase tracking-wider text-blue-900 font-headline mb-1">
                {worksheet.judul_materi}
              </h1>
              <p className="text-xs text-gray-500 font-medium italic">
                {worksheet.data_soal[0]?.pertanyaan || `Lembar Kerja Peserta Didik (LKPD) - Kelas ${worksheet.tingkat_kelas} SD`}
              </p>
            </div>
          </div>

          {/* Questions */}
          <div className="max-w-4xl mx-auto py-8 px-6 print:py-0 print:px-0">
            <div className="flex flex-col gap-6 print:block">
              {worksheet.data_soal.map((soal, i) => (
                <QuestionCard
                  key={i}
                  soal={soal}
                  index={i}
                  onImageChange={handleImageChange}
                  onUpdateSoal={handleSoalUpdate}
                  showKey={showKey}
                />
              ))}
            </div>

            {/* ── Lampiran Kunci Jawaban Guru (Cetak Halaman Terpisah) ── */}
            {includeAnswerKeyPage && (
              <div className="hidden print:block pt-8 mt-12 border-t-2 border-dashed border-gray-400" style={{ pageBreakBefore: "always", breakBefore: "page" }}>
                <div className="text-center mb-6">
                  <div className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-700 mb-1">
                    Lampiran Pegangan Guru
                  </div>
                  <h2 className="text-xl font-black uppercase text-gray-900 font-headline">
                    KUNCI JAWABAN: {worksheet.judul_materi}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Kelas {worksheet.tingkat_kelas} SD &bull; Total {worksheet.data_soal.length} Butir Soal
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {worksheet.data_soal.map((s, idx) => {
                    let ansText = s.jawaban_benar || s.kata_target || "";
                    if (s.tipe_soal === "mencocokkan" && s.pasangan_item) {
                      ansText = s.pasangan_item.map((p) => `${p.kiri} → ${p.kanan}`).join(", ");
                    }
                    if (s.tipe_soal === "drill_matematika") {
                      ansText = "Latihan drill berhitung angka mandiri";
                    }

                    return (
                      <div key={idx} className="flex items-start gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                        <span className="font-black text-blue-900 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg flex-shrink-0">
                          Soal {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-1">{s.pertanyaan}</p>
                          <div className="text-emerald-700 font-bold text-[11px]">
                            Kunci Jawaban: <span className="font-black text-emerald-900">{ansText || "Lihat Lembar Jawaban"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 text-center no-print">
              <button
                onClick={() => setShowAppend(true)}
                className="btn-secondary inline-flex items-center justify-center gap-2 py-3 px-8 text-sm transition-all"
                style={{ background: "#eef3ff", color: "var(--color-primary)", border: "2px dashed #aecbfa" }}
              >
                <PlusCircle className="w-5 h-5" /> Generate Tambahan Soal Disini
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 px-3 py-3 rounded-full no-print w-[90%] max-w-max justify-center"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            zIndex: 40,
          }}
        >
          <button onClick={() => router.push("/generate")} className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm border-none shadow-none bg-gray-50 hover:bg-gray-100" style={{ minWidth: "44px", minHeight: "44px", justifyContent: "center" }}>
            <PlusSquare className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => router.push("/history")} className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm border-none shadow-none bg-gray-50 hover:bg-gray-100" style={{ minWidth: "44px", minHeight: "44px", justifyContent: "center" }}>
            <History className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm border-none shadow-none bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold" style={{ minWidth: "44px", minHeight: "44px", justifyContent: "center" }}>
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
          <div className="w-[1px] h-8 bg-gray-200 mx-1"></div>
          <button onClick={() => router.push("/play")} className="btn-primary flex items-center gap-2 py-2.5 px-5 sm:px-6 text-sm shadow-[0_4px_0_0_#004683] bg-gradient-to-r from-orange-500 to-red-500" style={{ minHeight: "44px", justifyContent: "center" }}>
            <Play className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">Mainkan Interaktif</span>
            <span className="inline sm:hidden">Main</span>
          </button>
        </div>

        {/* Append Modal */}
        {showAppend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setShowAppend(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-black mb-1">Tambah Soal</h3>
              <p className="text-xs text-gray-500 mb-5">Untuk worksheet: {worksheet.judul_materi}</p>
              
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-sm font-bold mb-1.5 block">Tipe Soal Tambahan</label>
                  <select 
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors bg-white font-medium text-sm" 
                    value={appendForm.tipe_soal} 
                    onChange={e => setAppendForm({...appendForm, tipe_soal: e.target.value})}
                  >
                    <option value="pilihan_ganda">Pilihan Ganda</option>
                    <option value="mencocokkan">Mencocokkan</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold mb-1.5 block">Jumlah Tambahan (1 - 10)</label>
                  <input 
                    type="number" min={1} max={10} 
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors font-medium text-sm" 
                    value={appendForm.jumlah_soal} 
                    onChange={e => setAppendForm({...appendForm, jumlah_soal: Number(e.target.value)})}
                  />
                </div>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border-2 border-transparent hover:border-gray-200 transition-all">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" checked={appendForm.tanpa_gambar} onChange={e => setAppendForm({...appendForm, tanpa_gambar: e.target.checked})} />
                  <span className="text-sm font-semibold">Tanpa Gambar <span className="text-xs font-normal text-gray-500 block">(Generasi lebih cepat)</span></span>
                </label>
              </div>

              <button 
                onClick={handleAppend}
                disabled={appendLoading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base"
              >
                {appendLoading ? "Sedang generate..." : <><Wand2 className="w-5 h-5" /> Buat Sekarang</>}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
