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
      const res = await addWorksheetSoal(worksheet.id, {
        topik: worksheet.judul_materi,
        kelas: worksheet.tingkat_kelas,
        ...appendForm,
        model: selectedModel,
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
                <div className="flex flex-wrap items-center gap-3 no-print">
                  <label className="flex items-center gap-2 cursor-pointer mr-2 py-2" style={{ minHeight: "44px" }}>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={showKey} 
                        onChange={(e) => setShowKey(e.target.checked)} 
                      />
                      <div className={`block w-12 h-7 rounded-full transition-colors ${showKey ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${showKey ? 'translate-x-5' : ''}`}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                      <Key className="w-4 h-4" /> Kunci Jawaban
                    </span>
                  </label>
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="btn-secondary flex items-center gap-2 py-3 px-5 text-sm"
                  >
                    {saved ? <><Check className="w-4 h-4" /> Tersimpan</> : saving ? "..." : <><Save className="w-4 h-4" /> Simpan</>}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn-primary flex items-center gap-2 py-3 px-5 text-sm shadow-[0_4px_0_0_#004683]"
                  >
                    <Printer className="w-4 h-4" /> Cetak (A4)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Print Header */}
          <div className="hidden print:block mb-4">
            <h1 className="text-xl font-black text-center mb-1">{worksheet.judul_materi}</h1>
            <p className="text-sm text-center mb-4">Lembar Soal Kelas {worksheet.tingkat_kelas} SD | {worksheet.data_soal.length} soal</p>

            <div className="flex justify-between border-b-2 border-black pb-1 mb-2">
              <p className="text-sm font-bold">Nama: _________________________</p>
              <p className="text-sm font-bold">Nilai: _______</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm font-bold">No. Absen: ______________________</p>
              <p className="text-sm font-bold">Tanggal: ____________________</p>
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
                  showKey={showKey}
                />
              ))}
            </div>

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
