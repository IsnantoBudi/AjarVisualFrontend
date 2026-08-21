"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { getHistory, deleteWorksheet, Worksheet, Soal } from "@/lib/api";
import {
  Plus, AlertTriangle, Inbox, Eye, Printer, Trash2, Loader2,
  ListChecks, Shuffle, BookText, Pencil, Search, X, ArrowUpDown,
  Filter, Sparkles, Ban, SlidersHorizontal, RotateCcw
} from "lucide-react";

// ── Derive question types from data_soal ────────────────────────────────────
function deriveTypes(soalList: Soal[]): { type: string; count: number }[] {
  const countMap: Record<string, number> = {};
  for (const s of soalList) {
    const t = s.tipe_soal || "pilihan_ganda";
    countMap[t] = (countMap[t] || 0) + 1;
  }
  return Object.entries(countMap).map(([type, count]) => ({ type, count }));
}

// ── Badge per tipe soal ──────────────────────────────────────────────────────
function TypeBadge({ type, count }: { type: string; count: number }) {
  const config: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
    pilihan_ganda:      { label: "Pilihan Ganda", bg: "#dbeafe", color: "#1e40af", icon: <ListChecks className="w-3 h-3" /> },
    lengkapi_suku_kata: { label: "Suku Kata", bg: "#fef3c7", color: "#92400e", icon: <Sparkles className="w-3 h-3" /> },
    huruf_depan:        { label: "Huruf Depan", bg: "#fce7f3", color: "#9d174d", icon: <Pencil className="w-3 h-3" /> },
    lingkari_kata:      { label: "Lingkari Kata", bg: "#e0e7ff", color: "#3730a3", icon: <Sparkles className="w-3 h-3" /> },
    susun_kata:         { label: "Susun Kata", bg: "#ede9fe", color: "#5b21b6", icon: <Shuffle className="w-3 h-3" /> },
    drill_matematika:   { label: "Drill Hitung", bg: "#dcfce7", color: "#15803d", icon: <Ban className="w-3 h-3" /> },
    mencocokkan:        { label: "Mencocokkan", bg: "#dcfce7", color: "#15803d", icon: <Shuffle className="w-3 h-3" /> },
    isian_singkat:      { label: "Isian", bg: "#fef3c7", color: "#92400e", icon: <Pencil className="w-3 h-3" /> },
    benar_salah:        { label: "Benar/Salah", bg: "#f3e8ff", color: "#7c3aed", icon: <BookText className="w-3 h-3" /> },
  };
  const c = config[type] || { label: type, bg: "#f1f5f9", color: "#475569", icon: <ListChecks className="w-3 h-3" /> };
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.color }}
    >
      {c.icon}
      {c.label}
      {count > 0 && <span className="opacity-70">({count})</span>}
    </span>
  );
}

// ── Topic icon: map keywords → emoji-style colored background ───────────────
type TopicIcon = { emoji: string; bg: string; color: string };

function getTopicIcon(title: string): TopicIcon {
  const t = title.toLowerCase();
  if (/buah|sayur|makanan|makan|penjumlahan|angka|bilangan|hitung|kurang|tambah|bagi|kali/.test(t))
    return { emoji: "🍎", bg: "#fef9c3", color: "#854d0e" };
  if (/matematik|angka|bilangan|pecahan|desimal|fraksi|geometri|bangun|luas|keliling/.test(t))
    return { emoji: "🔢", bg: "#eff6ff", color: "#1d4ed8" };
  if (/bahasa|indonesia|inggris|kata|kalimat|paragraph|puisi|cerpen|bacaan|membaca/.test(t))
    return { emoji: "📖", bg: "#f0fdf4", color: "#166534" };
  if (/ipa|sains|biologi|fisika|kimia|listrik|magnet|cahaya|energi|gaya|gerak|atom|sel/.test(t))
    return { emoji: "🔬", bg: "#ecfeff", color: "#0e7490" };
  if (/ips|sejarah|ekonomi|sosial|budaya|peta|geografi|benua|negara|kota|provinsi/.test(t))
    return { emoji: "🌍", bg: "#fff7ed", color: "#c2410c" };
  if (/pkn|pancasila|demokrasi|hukum|kewarga|negara|undang/.test(t))
    return { emoji: "🏛️", bg: "#fdf4ff", color: "#7e22ce" };
  if (/musik|seni|lagu|nada|melodi|instrumen/.test(t))
    return { emoji: "🎵", bg: "#fdf2f8", color: "#9d174d" };
  if (/gambar|lukis|warna|seni|karya|kreasi/.test(t))
    return { emoji: "🎨", bg: "#fff1f2", color: "#be123c" };
  if (/agama|doa|ibadah|sholat|quran|alkitab|tuhan/.test(t))
    return { emoji: "🌙", bg: "#fefce8", color: "#713f12" };
  if (/olahraga|jasmani|gerak|lari|renang|sepak|basket|voli/.test(t))
    return { emoji: "⚽", bg: "#f0fdf4", color: "#14532d" };
  if (/hewan|binatang|mamalia|reptil|burung|serangga|ikan/.test(t))
    return { emoji: "🦁", bg: "#fefce8", color: "#92400e" };
  if (/tumbuhan|tanaman|pohon|bunga|daun|akar|biji/.test(t))
    return { emoji: "🌿", bg: "#f0fdf4", color: "#166534" };
  if (/cuaca|iklim|musim|hujan|angin|panas|dingin/.test(t))
    return { emoji: "🌤️", bg: "#eff6ff", color: "#1e40af" };
  if (/tubuh|organ|kesehatan|gizi|nutrisi|vitamin|kebersihan/.test(t))
    return { emoji: "❤️", bg: "#fff1f2", color: "#be123c" };
  // default
  return { emoji: "📚", bg: "#eef3ff", color: "#3730a3" };
}

// ── Card thumbnail with emoji + gradient ────────────────────────────────────
function WorksheetThumbnail({ title }: { title: string }) {
  const { emoji, bg, color } = getTopicIcon(title);
  return (
    <div
      className="h-28 rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden"
      style={{ background: bg }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
        style={{ background: color }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full opacity-15"
        style={{ background: color }}
      />
      <span style={{ fontSize: "2.6rem", lineHeight: 1, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))" }}>
        {emoji}
      </span>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const router = useRouter();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  // Search & Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<number | "all">("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title_asc" | "title_desc" | "grade_asc" | "grade_desc" | "soal_desc">("newest");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setWorksheets(data || []);
    } catch {
      setError("Gagal memuat riwayat. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (ws: Worksheet) => {
    sessionStorage.setItem("currentWorksheet", JSON.stringify(ws));
    router.push("/preview");
  };

  const handlePrint = (ws: Worksheet) => {
    sessionStorage.setItem("currentWorksheet", JSON.stringify(ws));
    sessionStorage.setItem("autoPrint", "true");
    router.push("/preview");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus worksheet ini?")) return;
    setDeleting(id);
    try {
      await deleteWorksheet(id);
      setWorksheets((prev) => prev.filter((w) => w.id !== id));
    } catch {
      alert("Gagal menghapus.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGrade("all");
    setSelectedType("all");
    setSortBy("newest");
  };

  // ── Filter & Search & Sort Logic (Comprehensive & Detail) ──────────────────
  const filteredAndSortedWorksheets = useMemo(() => {
    return worksheets
      .filter((ws) => {
        // 1. Search Query Filter (Matches Title & Questions & Answers)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = ws.judul_materi.toLowerCase().includes(q);
          const matchQuestions = (ws.data_soal || []).some((s) => {
            const pert = (s.pertanyaan || "").toLowerCase();
            const ans = (s.jawaban_benar || "").toLowerCase();
            const awal = (s.suku_kata_awal || "").toLowerCase();
            const target = ((s as any).kata_target || "").toLowerCase();
            const math = (s.math_blocks || []).some(b => (b.items || []).some(item => item.toLowerCase().includes(q)));
            return pert.includes(q) || ans.includes(q) || awal.includes(q) || target.includes(q) || math;
          });
          if (!matchTitle && !matchQuestions) return false;
        }

        // 2. Grade Filter
        if (selectedGrade !== "all" && ws.tingkat_kelas !== selectedGrade) {
          return false;
        }

        // 3. Question Type Filter
        if (selectedType !== "all") {
          const hasType = (ws.data_soal || []).some((s) => (s.tipe_soal || "pilihan_ganda") === selectedType);
          if (!hasType) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime() || b.id - a.id;
        }
        if (sortBy === "oldest") {
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime() || a.id - b.id;
        }
        if (sortBy === "title_asc") {
          return a.judul_materi.localeCompare(b.judul_materi, "id-ID");
        }
        if (sortBy === "title_desc") {
          return b.judul_materi.localeCompare(a.judul_materi, "id-ID");
        }
        if (sortBy === "grade_asc") {
          return a.tingkat_kelas - b.tingkat_kelas;
        }
        if (sortBy === "grade_desc") {
          return b.tingkat_kelas - a.tingkat_kelas;
        }
        if (sortBy === "soal_desc") {
          return (b.data_soal?.length || 0) - (a.data_soal?.length || 0);
        }
        return 0;
      });
  }, [worksheets, searchQuery, selectedGrade, selectedType, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedGrade !== "all" || selectedType !== "all" || sortBy !== "newest";

  const LKPD_FILTER_OPTIONS = [
    { value: "all", label: "Semua Format" },
    { value: "lengkapi_suku_kata", label: "Suku Kata" },
    { value: "huruf_depan", label: "Huruf Depan" },
    { value: "lingkari_kata", label: "Lingkari Kata" },
    { value: "susun_kata", label: "Susun Kata" },
    { value: "drill_matematika", label: "Drill Hitung" },
    { value: "pilihan_ganda", label: "Pilihan Ganda" },
    { value: "mencocokkan", label: "Mencocokkan" },
    { value: "isian_singkat", label: "Isian Singkat" },
    { value: "benar_salah", label: "Benar/Salah" },
  ];

  return (
    <>
      <NavBar />
      <main className="min-h-screen py-8 px-4 sm:px-6" style={{ paddingTop: "96px" }}>
        <div className="max-w-6xl mx-auto">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1.5" style={{ fontFamily: "var(--font-headline)" }}>
                Riwayat Lembar Soal
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                {worksheets.length} lembar kerja LKPD tersimpan di basis data
              </p>
            </div>
            <Link href="/generate" className="btn-primary inline-flex items-center justify-center gap-2 no-underline py-3 px-6 w-full md:w-auto shadow-md hover:shadow-lg transition-all">
              <Plus className="w-5 h-5" /> Buat Soal Baru
            </Link>
          </div>

          {/* ── Mobile-First Search, Filter & Sort Control Bar ── */}
          {!loading && !error && worksheets.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-8 flex flex-col gap-4">
              
              {/* Row 1: Search Bar & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari judul materi atau kata soal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50/80 hover:bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative w-full sm:w-auto">
                    <ArrowUpDown className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full sm:w-auto bg-gray-50/80 hover:bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl pl-9 pr-8 py-2.5 text-sm font-semibold text-gray-700 outline-none cursor-pointer appearance-none transition-all"
                    >
                      <option value="newest">Terbaru Dibuat</option>
                      <option value="oldest">Terlama Dibuat</option>
                      <option value="title_asc">Judul Materi (A - Z)</option>
                      <option value="title_desc">Judul Materi (Z - A)</option>
                      <option value="grade_asc">Tingkat Kelas (1 → 6)</option>
                      <option value="grade_desc">Tingkat Kelas (6 → 1)</option>
                      <option value="soal_desc">Soal Terbanyak</option>
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      title="Reset Semua Filter"
                      className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Swipeable Grade Filter Chips */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-blue-600" /> Tingkat Kelas
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    Menampilkan <strong className="text-blue-600">{filteredAndSortedWorksheets.length}</strong> dari {worksheets.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                  <button
                    onClick={() => setSelectedGrade("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedGrade === "all"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                        : "bg-gray-100/90 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Semua Kelas
                  </button>
                  {[1, 2, 3, 4, 5, 6].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                        selectedGrade === grade
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                          : "bg-gray-100/90 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Kelas {grade} SD
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Swipeable LKPD Format Filter Chips */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" /> Tipe Lembar Kerja (LKPD)
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                  {LKPD_FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedType(opt.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                        selectedType === opt.value
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                          : "bg-gray-100/90 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bloom-dot w-4 h-4 rounded-full" style={{ background: "#1976D2", animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p style={{ color: "var(--color-on-surface-variant)" }} className="font-semibold text-sm">Memuat riwayat lembar kerja...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card-xl flex flex-col items-center justify-center text-center py-12">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <p className="font-bold text-xl mb-2">Koneksi Bermasalah</p>
              <p style={{ color: "var(--color-on-surface-variant)" }} className="mb-6">{error}</p>
              <button onClick={loadHistory} className="btn-primary">Coba Lagi</button>
            </div>
          )}

          {/* Empty Database State */}
          {!loading && !error && worksheets.length === 0 && (
            <div className="card-xl flex flex-col items-center justify-center text-center py-20">
              <Inbox className="w-24 h-24 text-blue-200 mb-6" />
              <h2 className="text-2xl font-black mb-3" style={{ fontFamily: "var(--font-headline)" }}>Belum Ada Worksheet</h2>
              <p style={{ color: "var(--color-on-surface-variant)" }} className="mb-8 max-w-sm">
                Mulai rancang lembar kerja edukasi pertamamu dengan ilustrasi ajaib sekarang!
              </p>
              <Link href="/generate" className="flex items-center gap-2 btn-primary no-underline inline-block">
                <Plus className="w-4 h-4" /> Buat Soal Pertama
              </Link>
            </div>
          )}

          {/* No Filter Results State */}
          {!loading && !error && worksheets.length > 0 && filteredAndSortedWorksheets.length === 0 && (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center flex flex-col items-center justify-center shadow-sm">
              <Search className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak Ditemukan Lembar Soal</h3>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                Tidak ada worksheet yang cocok dengan kriteria pencarian atau filter yang dipilih.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-secondary flex items-center gap-2 py-2.5 px-5 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Reset Semua Filter
              </button>
            </div>
          )}

          {/* Worksheet Grid */}
          {!loading && filteredAndSortedWorksheets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedWorksheets.map((ws) => {
                const types = deriveTypes(ws.data_soal || []);
                return (
                  <div key={ws.id} className="card-xl flex flex-col gap-4 group hover:shadow-xl transition-all duration-300">
                    {/* Dynamic Thumbnail */}
                    <WorksheetThumbnail title={ws.judul_materi} />

                    <div>
                      <h3 className="font-black text-lg mb-2" style={{ fontFamily: "var(--font-headline)" }}>
                        {ws.judul_materi}
                      </h3>

                      {/* Badges row */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="chip-correct">Kelas {ws.tingkat_kelas} SD</span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: "#fff8e1", color: "#664b00" }}
                        >
                          {ws.data_soal?.length || 0} butir soal
                        </span>
                      </div>

                      {/* Question type badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {types.map(({ type, count }) => (
                          <TypeBadge key={type} type={type} count={count} />
                        ))}
                      </div>

                      <p className="text-xs text-gray-400 font-medium">
                        {formatDate(ws.created_at)}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleView(ws)}
                        className="btn-primary flex items-center justify-center gap-2 flex-1 py-3 text-sm font-bold shadow-sm"
                      >
                        <Eye className="w-4 h-4" /> Buka Soal
                      </button>
                      <button
                        onClick={() => handlePrint(ws)}
                        className="btn-secondary flex items-center justify-center py-3 px-4 text-sm"
                        title="Cetak A4 Langsung"
                      >
                        <Printer className="w-5 h-5 opacity-80" />
                      </button>
                      <button
                        onClick={() => handleDelete(ws.id)}
                        disabled={deleting === ws.id}
                        className="flex items-center justify-center py-3 px-4 rounded-full text-sm font-semibold transition-all hover:bg-red-100"
                        style={{ background: "#ffefee", color: "#b31b25", minHeight: "44px", minWidth: "44px" }}
                        title="Hapus Worksheet"
                      >
                        {deleting === ws.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center text-xs opacity-60 text-gray-400">
            AjarVisual AI Worksheet Generator • Sesuai Kurikulum Merdeka
          </div>
        </div>
      </main>
    </>
  );
}
