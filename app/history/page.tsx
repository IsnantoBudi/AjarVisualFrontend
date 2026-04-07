"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { getHistory, deleteWorksheet, Worksheet, Soal } from "@/lib/api";
import {
  Plus, AlertTriangle, Inbox, Eye, Printer, Trash2, Loader2,
  ListChecks, Shuffle, BookText, Divide, FlaskConical, Globe2,
  Music, Palette, Apple, Calculator, Leaf, Map, Atom, HeartPulse,
  Star, Landmark, Languages, Pencil,
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
    pilihan_ganda:  { label: "Pilihan Ganda", bg: "#dbeafe", color: "#1e40af", icon: <ListChecks className="w-3 h-3" /> },
    mencocokkan:    { label: "Mencocokkan",   bg: "#dcfce7", color: "#15803d", icon: <Shuffle className="w-3 h-3" /> },
    isian:          { label: "Isian",         bg: "#fef3c7", color: "#92400e", icon: <Pencil className="w-3 h-3" /> },
    essay:          { label: "Essay",         bg: "#f3e8ff", color: "#7c3aed", icon: <BookText className="w-3 h-3" /> },
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

  return (
    <>
      <NavBar />
      <main className="min-h-screen py-8 px-6" style={{ paddingTop: "100px" }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "var(--font-headline)" }}>
                Riwayat Lembar Soal
              </h1>
              <p style={{ color: "var(--color-on-surface-variant)" }}>
                {worksheets.length} worksheet tersimpan di TiDB Cloud
              </p>
            </div>
            <Link href="/generate" className="btn-primary flex items-center gap-2 no-underline inline-block py-3 px-6">
              <Plus className="w-5 h-5" /> Buat Soal Baru
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bloom-dot w-4 h-4 rounded-full" style={{ background: "#1976D2", animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p style={{ color: "var(--color-on-surface-variant)" }}>Memuat riwayat...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card-xl flex flex-col items-center justify-center text-center py-12">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <p className="font-bold text-xl mb-2">Koneksi Bermasalah</p>
              <p style={{ color: "var(--color-on-surface-variant)" }} className="mb-6">{error}</p>
              <button onClick={loadHistory} className="btn-primary">Coba Lagi</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && worksheets.length === 0 && (
            <div className="card-xl flex flex-col items-center justify-center text-center py-20">
              <Inbox className="w-24 h-24 text-blue-200 mb-6" />
              <h2 className="text-2xl font-black mb-3" style={{ fontFamily: "var(--font-headline)" }}>Belum Ada Worksheet</h2>
              <p style={{ color: "var(--color-on-surface-variant)" }} className="mb-8">
                Mulai buat lembar soal pertamamu sekarang!
              </p>
              <Link href="/generate" className="flex items-center gap-2 btn-primary no-underline inline-block">
                <Plus className="w-4 h-4" /> Buat Soal Pertama
              </Link>
            </div>
          )}

          {/* Grid */}
          {!loading && worksheets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {worksheets.map((ws) => {
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
                          {ws.data_soal?.length || 0} soal
                        </span>
                      </div>

                      {/* Question type badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {types.map(({ type, count }) => (
                          <TypeBadge key={type} type={type} count={count} />
                        ))}
                      </div>

                      <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                        {formatDate(ws.created_at)}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleView(ws)}
                        className="btn-primary flex items-center justify-center gap-2 flex-1 py-2.5 text-sm"
                      >
                        <Eye className="w-4 h-4" /> Lihat
                      </button>
                      <button
                        onClick={() => handlePrint(ws)}
                        className="btn-secondary flex items-center justify-center py-2.5 px-4 text-sm"
                        title="Cetak"
                      >
                        <Printer className="w-5 h-5 opacity-80" />
                      </button>
                      <button
                        onClick={() => handleDelete(ws.id)}
                        disabled={deleting === ws.id}
                        className="flex items-center justify-center py-2.5 px-4 rounded-full text-sm font-semibold transition-all"
                        style={{ background: "#ffefee", color: "#b31b25" }}
                      >
                        {deleting === ws.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center text-xs opacity-60" style={{ color: "var(--color-on-surface-variant)" }}>
            Powered by Gemini 2.5 Flash • Pollinations.ai • TiDB Cloud
          </div>
        </div>
      </main>
    </>
  );
}
