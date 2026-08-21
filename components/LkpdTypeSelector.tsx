"use client";

import { useState } from "react";
import { 
  Wand2, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  FileText, 
  Check, 
  Layers,
  Ban,
  ImageIcon
} from "lucide-react";

export type ImageRequirement = "wajib" | "opsional" | "tanpa_gambar";

export interface LkpdTypeOption {
  id: string;
  nama: string;
  kategori: "literasi" | "numerasi" | "asesmen";
  kategoriLabel: string;
  rekomendasiKelas: string;
  tagline: string;
  hasAiImage: boolean;
  imageRequirement: ImageRequirement;
  imageRequirementLabel: string;
  contohFormat: string;
}

export const LKPD_TYPES: LkpdTypeOption[] = [
  // Literasi & Bahasa (Wajib Bergambar)
  {
    id: "lengkapi_suku_kata",
    nama: "Lengkapi Suku Kata",
    kategori: "literasi",
    kategoriLabel: "Literasi TK-SD",
    rekomendasiKelas: "TK - SD 1",
    tagline: "Gambar + suku kata awal + 2 kotak pilihan suku kata",
    hasAiImage: true,
    imageRequirement: "wajib",
    imageRequirementLabel: "Wajib Bergambar",
    contohFormat: "Gambar 🍎  •  Sa ____  •  [ pa | pi ]",
  },
  {
    id: "huruf_depan",
    nama: "Tulis Huruf Depan",
    kategori: "literasi",
    kategoriLabel: "Literasi TK-SD",
    rekomendasiKelas: "TK - SD 1",
    tagline: "Gambar objek + kotak persegi tulis + sisa huruf kata",
    hasAiImage: true,
    imageRequirement: "wajib",
    imageRequirementLabel: "Wajib Bergambar",
    contohFormat: "Gambar ⚽  •  [   ] o l a",
  },
  {
    id: "lingkari_kata",
    nama: "Lingkari Kata",
    kategori: "literasi",
    kategoriLabel: "Literasi TK-SD",
    rekomendasiKelas: "SD 1 - 2",
    tagline: "Gambar berbingkai + 3 pilihan kata mirip untuk dilingkari",
    hasAiImage: true,
    imageRequirement: "wajib",
    imageRequirementLabel: "Wajib Bergambar",
    contohFormat: "Gambar 🧹  •  (Sapu)  Saku  Suka",
  },
  {
    id: "susun_kata",
    nama: "Menyusun Kata",
    kategori: "literasi",
    kategoriLabel: "Literasi TK-SD",
    rekomendasiKelas: "SD 1 - 3",
    tagline: "Gambar petunjuk + huruf kapital acak + garis isian",
    hasAiImage: true,
    imageRequirement: "wajib",
    imageRequirementLabel: "Wajib Bergambar",
    contohFormat: "Gambar 🍎  •  L P E A = _ _ _ _",
  },
  // Numerasi & Matematika (Tanpa Gambar)
  {
    id: "drill_matematika",
    nama: "Drill Matematika",
    kategori: "numerasi",
    kategoriLabel: "Numerasi & Hitung",
    rekomendasiKelas: "SD 1 - 4",
    tagline: "Grid 6 box × 5 baris aritmatika vertikal (total 30 soal)",
    hasAiImage: false,
    imageRequirement: "tanpa_gambar",
    imageRequirementLabel: "Tanpa Gambar",
    contohFormat: "6 Kotak Grid  •  1 + 2 = __",
  },
  // Asesmen Reguler (Gambar Fleksibel / Opsional)
  {
    id: "pilihan_ganda",
    nama: "Pilihan Ganda",
    kategori: "asesmen",
    kategoriLabel: "Asesmen Standar",
    rekomendasiKelas: "Semua Kelas",
    tagline: "Soal teks/ilustrasi dengan 4 opsi pilihan (A/B/C/D)",
    hasAiImage: true,
    imageRequirement: "opsional",
    imageRequirementLabel: "Gambar Opsional",
    contohFormat: "Pertanyaan  •  A, B, C, D",
  },
  {
    id: "mencocokkan",
    nama: "Mencocokkan (Garis)",
    kategori: "asesmen",
    kategoriLabel: "Asesmen Standar",
    rekomendasiKelas: "SD 1 - 6",
    tagline: "2 Kolom item/gambar dengan titik penghubung garis",
    hasAiImage: true,
    imageRequirement: "opsional",
    imageRequirementLabel: "Gambar Opsional",
    contohFormat: "Kolom Kiri • ──── • Kolom Kanan",
  },
  {
    id: "benar_salah",
    nama: "Benar / Salah",
    kategori: "asesmen",
    kategoriLabel: "Asesmen Standar",
    rekomendasiKelas: "SD 2 - 6",
    tagline: "Pernyataan validasi logika dengan opsi Benar / Salah",
    hasAiImage: true,
    imageRequirement: "opsional",
    imageRequirementLabel: "Gambar Opsional",
    contohFormat: "Pernyataan  •  [ ✓ Benar ]  [ ✕ Salah ]",
  },
  {
    id: "isian_singkat",
    nama: "Isian Singkat",
    kategori: "asesmen",
    kategoriLabel: "Asesmen Standar",
    rekomendasiKelas: "SD 1 - 6",
    tagline: "Pertanyaan terbuka dengan kolom jawaban 1-2 kata",
    hasAiImage: true,
    imageRequirement: "opsional",
    imageRequirementLabel: "Gambar Opsional",
    contohFormat: "Pertanyaan  •  [ ________________ ]",
  },
];

export function getLkpdType(id: string): LkpdTypeOption | undefined {
  return LKPD_TYPES.find((t) => t.id === id);
}

// ── Mini Mockup Preview Component ──────────────────────────────────────────
function MiniMockupPreview({ typeId }: { typeId: string }) {
  switch (typeId) {
    case "lengkapi_suku_kata":
      return (
        <div className="w-full bg-blue-50/70 border border-blue-200 rounded-xl p-2 flex items-center justify-between gap-1.5 text-[11px] select-none">
          <div className="w-7 h-7 bg-white rounded-lg border border-blue-200 flex items-center justify-center text-xs flex-shrink-0">
            🍎
          </div>
          <div className="font-mono font-bold text-blue-900 flex items-center gap-1">
            <span>Sa</span>
            <span className="text-blue-400">_ _</span>
          </div>
          <div className="flex border border-blue-300 rounded bg-white text-[10px] font-bold text-blue-700 overflow-hidden">
            <span className="px-1.5 py-0.5 bg-blue-600 text-white">pa</span>
            <span className="px-1.5 py-0.5 border-l border-blue-200">pi</span>
          </div>
        </div>
      );

    case "huruf_depan":
      return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2 text-[11px] select-none">
          <div className="w-7 h-7 bg-white rounded-lg border border-slate-300 flex items-center justify-center text-xs flex-shrink-0">
            ⚽
          </div>
          <div className="w-6 h-6 border-2 border-slate-800 rounded bg-white flex items-center justify-center font-bold text-blue-600 text-xs shadow-inner">
            B
          </div>
          <span className="font-bold tracking-widest text-slate-800 text-xs font-sans">
            o l a
          </span>
        </div>
      );

    case "lingkari_kata":
      return (
        <div className="w-full bg-amber-50/60 border border-amber-200 rounded-xl p-2 flex items-center gap-2 text-[11px] select-none">
          <div className="w-7 h-7 bg-white rounded-lg border border-amber-300 flex items-center justify-center text-xs flex-shrink-0">
            🧹
          </div>
          <div className="flex-1 bg-white border border-amber-200 rounded-lg p-1 flex items-center justify-around text-[10px] font-bold">
            <span className="border-2 border-amber-500 bg-amber-100 text-amber-900 rounded-full px-1.5">
              Sapu
            </span>
            <span className="text-gray-400">Saku</span>
            <span className="text-gray-400">Suka</span>
          </div>
        </div>
      );

    case "susun_kata":
      return (
        <div className="w-full bg-emerald-50/70 border border-emerald-200 rounded-xl p-2 flex items-center gap-2 text-[11px] select-none">
          <div className="w-7 h-7 bg-white rounded-lg border border-emerald-300 flex items-center justify-center text-xs flex-shrink-0">
            🍎
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-[10px]">
            <span className="text-emerald-900">L P E A =</span>
            <span className="text-emerald-600 underline decoration-2 underline-offset-2">
              A P E L
            </span>
          </div>
        </div>
      );

    case "drill_matematika":
      return (
        <div className="w-full bg-indigo-50/70 border border-indigo-200 rounded-xl p-2 grid grid-cols-2 gap-1.5 text-[10px] font-mono select-none">
          <div className="bg-white border border-indigo-200 rounded p-1 flex flex-col gap-0.5 font-bold text-indigo-900">
            <div className="flex justify-between"><span>1+2=</span><span className="text-indigo-400">_</span></div>
            <div className="flex justify-between"><span>3+4=</span><span className="text-indigo-400">_</span></div>
          </div>
          <div className="bg-white border border-indigo-200 rounded p-1 flex flex-col gap-0.5 font-bold text-indigo-900">
            <div className="flex justify-between"><span>5+2=</span><span className="text-indigo-400">_</span></div>
            <div className="flex justify-between"><span>7+1=</span><span className="text-indigo-400">_</span></div>
          </div>
        </div>
      );

    case "pilihan_ganda":
      return (
        <div className="w-full bg-purple-50/60 border border-purple-200 rounded-xl p-2 flex flex-col gap-1 text-[10px] select-none">
          <div className="flex items-center justify-between text-purple-900 font-bold">
            <span className="truncate">Apa warna buah apel?</span>
            <span className="text-xs">🍎</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-purple-600 text-white rounded px-1.5 py-0.5 font-bold flex items-center gap-1">
              <span>A.</span><span>Merah</span>
            </div>
            <div className="bg-white border border-purple-200 text-gray-500 rounded px-1.5 py-0.5 flex items-center gap-1">
              <span>B.</span><span>Biru</span>
            </div>
          </div>
        </div>
      );

    case "mencocokkan":
      return (
        <div className="w-full bg-sky-50/70 border border-sky-200 rounded-xl p-2 flex items-center justify-between text-[10px] select-none">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 bg-white border border-green-300 rounded px-1 text-green-800 font-bold">
              <span>Kucing</span><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-1 bg-white border border-green-300 rounded px-1 text-green-800 font-bold">
              <span>Sapi</span><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="text-sky-400 font-bold">⟷</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 bg-white border border-blue-300 rounded px-1 text-blue-800 font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>Rumput</span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-blue-300 rounded px-1 text-blue-800 font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div><span>Ikan</span>
            </div>
          </div>
        </div>
      );

    case "benar_salah":
      return (
        <div className="w-full bg-teal-50/70 border border-teal-200 rounded-xl p-2 flex flex-col gap-1 text-[10px] select-none">
          <span className="font-medium text-teal-950 truncate">Matahari terbit dari arah timur.</span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="flex-1 bg-emerald-500 text-white rounded px-1.5 py-0.5 font-bold text-center">
              ✓ Benar
            </span>
            <span className="flex-1 bg-white border border-gray-200 text-gray-500 rounded px-1.5 py-0.5 text-center">
              ✕ Salah
            </span>
          </div>
        </div>
      );

    case "isian_singkat":
      return (
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 flex flex-col gap-1 text-[10px] select-none">
          <span className="font-medium text-gray-800 truncate">Ibu kota negara Indonesia adalah...</span>
          <div className="w-full bg-white border-2 border-dashed border-gray-300 rounded px-2 py-0.5 text-gray-400 italic">
            Tulis jawaban singkat...
          </div>
        </div>
      );

    default:
      return null;
  }
}

interface LkpdTypeSelectorProps {
  value: string;
  onChange: (newValue: string) => void;
  tanpaGambar?: boolean;
}

export default function LkpdTypeSelector({ value, onChange, tanpaGambar }: LkpdTypeSelectorProps) {
  const [kategoriFilter, setKategoriFilter] = useState<string>("semua");

  // Filter berdasarkan mode gambar (ON: wajib & opsional, OFF: tanpa_gambar & opsional)
  const imageFilteredTypes = LKPD_TYPES.filter((item) => {
    if (tanpaGambar === true) {
      return item.imageRequirement === "tanpa_gambar" || item.imageRequirement === "opsional";
    }
    if (tanpaGambar === false) {
      return item.imageRequirement === "wajib" || item.imageRequirement === "opsional";
    }
    return true;
  });

  const countSemua = imageFilteredTypes.length;
  const countLiterasi = imageFilteredTypes.filter((i) => i.kategori === "literasi").length;
  const countNumerasi = imageFilteredTypes.filter((i) => i.kategori === "numerasi").length;
  const countAsesmen = imageFilteredTypes.filter((i) => i.kategori === "asesmen").length;

  const filteredTypes = imageFilteredTypes.filter((item) => {
    if (kategoriFilter === "semua") return true;
    return item.kategori === kategoriFilter;
  });

  return (
    <div className="w-full">
      {/* Header Title & Subtitle */}
      <div className="mb-3">
        <label className="flex items-center gap-2 font-bold text-sm text-gray-900" style={{ fontFamily: "var(--font-headline)" }}>
          <Wand2 className="w-4 h-4 text-purple-600" /> FORMAT & TIPE LEMBAR KERJA (LKPD)
        </label>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {tanpaGambar 
            ? "Menampilkan format soal berbasis teks & numerasi (Mode Gambar Nonaktif)."
            : "Menampilkan format soal visual interaktif bergambar (Mode Gambar Aktif)."}
        </p>
      </div>
      
      {/* Segmented Tab Control (Full Width Responsive Grid) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl mb-4 border border-slate-200/70">
        <button
          type="button"
          onClick={() => setKategoriFilter("semua")}
          className={`py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 ${
            kategoriFilter === "semua"
              ? "bg-white text-purple-700 shadow-sm font-black border border-purple-100"
              : "text-gray-600 hover:text-gray-900 font-semibold"
          }`}
        >
          <Layers className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Semua</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${kategoriFilter === "semua" ? "bg-purple-100 text-purple-800" : "bg-gray-200/80 text-gray-600"}`}>
            {countSemua}
          </span>
        </button>

        {countLiterasi > 0 && (
          <button
            type="button"
            onClick={() => setKategoriFilter("literasi")}
            className={`py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 ${
              kategoriFilter === "literasi"
                ? "bg-white text-blue-700 shadow-sm font-black border border-blue-100"
                : "text-gray-600 hover:text-gray-900 font-semibold"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Literasi TK-SD</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${kategoriFilter === "literasi" ? "bg-blue-100 text-blue-800" : "bg-gray-200/80 text-gray-600"}`}>
              {countLiterasi}
            </span>
          </button>
        )}

        {countNumerasi > 0 && (
          <button
            type="button"
            onClick={() => setKategoriFilter("numerasi")}
            className={`py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 ${
              kategoriFilter === "numerasi"
                ? "bg-white text-indigo-700 shadow-sm font-black border border-indigo-100"
                : "text-gray-600 hover:text-gray-900 font-semibold"
            }`}
          >
            <Calculator className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Numerasi</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${kategoriFilter === "numerasi" ? "bg-indigo-100 text-indigo-800" : "bg-gray-200/80 text-gray-600"}`}>
              {countNumerasi}
            </span>
          </button>
        )}

        {countAsesmen > 0 && (
          <button
            type="button"
            onClick={() => setKategoriFilter("asesmen")}
            className={`py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 ${
              kategoriFilter === "asesmen"
                ? "bg-white text-teal-700 shadow-sm font-black border border-teal-100"
                : "text-gray-600 hover:text-gray-900 font-semibold"
            }`}
          >
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Asesmen</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${kategoriFilter === "asesmen" ? "bg-teal-100 text-teal-800" : "bg-gray-200/80 text-gray-600"}`}>
              {countAsesmen}
            </span>
          </button>
        )}
      </div>

      {/* Grid of Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTypes.map((item) => {
          const isSelected = value === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`group relative flex flex-col justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 bg-white ${
                isSelected
                  ? "border-purple-600 shadow-md ring-4 ring-purple-50"
                  : "border-gray-200 hover:border-purple-300 hover:shadow-sm"
              }`}
            >
              <div>
                {/* Row 1: Top Meta Bar (Badge Rekomendasi Kelas di kiri, Radio di kanan) */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.kategori === "literasi"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : item.kategori === "numerasi"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-purple-50 text-purple-700 border border-purple-200"
                  }`}>
                    🎯 {item.rekomendasiKelas}
                  </span>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected 
                      ? "bg-purple-600 text-white shadow-sm" 
                      : "border-2 border-gray-300 group-hover:border-purple-400 bg-white"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Row 2: Full-Width Title (Bebas dari tumpang tindih) */}
                <h4 className="font-black text-gray-900 text-sm sm:text-base leading-snug mb-1">
                  {item.nama}
                </h4>

                {/* Row 3: Deskripsi Tagline (Tinggi Terkontrol) */}
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-3 min-h-[32px] line-clamp-2">
                  {item.tagline}
                </p>
              </div>

              {/* Row 4: Visual Mini Mockup Area */}
              <div className="w-full min-h-[56px] flex items-center mb-1">
                <MiniMockupPreview typeId={item.id} />
              </div>

              {/* Row 5: Footer Meta & Image Requirement Badge (Rapi, Terstruktur & Proporsional) */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                {item.imageRequirement === "wajib" && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2 py-0.5 rounded-lg font-bold text-[10px] tracking-tight">
                    <Sparkles className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>Wajib Bergambar</span>
                  </span>
                )}
                {item.imageRequirement === "tanpa_gambar" && (
                  <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg font-bold text-[10px] tracking-tight">
                    <Ban className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span>Tanpa Gambar</span>
                  </span>
                )}
                {item.imageRequirement === "opsional" && (
                  <span className="inline-flex items-center gap-1.5 text-purple-700 bg-purple-50/90 border border-purple-200/80 px-2 py-0.5 rounded-lg font-bold text-[10px] tracking-tight">
                    <ImageIcon className="w-3 h-3 text-purple-600 flex-shrink-0" />
                    <span>Gambar Opsional</span>
                  </span>
                )}

                <span className="text-gray-400 font-mono text-[10px] flex-shrink-0">
                  {item.kategoriLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
