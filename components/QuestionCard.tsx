import { useState, useEffect } from "react";
import { Soal, MatchingPair } from "@/lib/api";
import { regenerateImage } from "@/lib/api";
import { RefreshCw, ImageOff, Pencil, Check } from "lucide-react";

interface Props {
  soal: Soal;
  index: number;
  onImageChange?: (index: number, newUrl: string) => void;
  onUpdateSoal?: (index: number, updatedSoal: Soal) => void;
  showKey?: boolean;
}

// ── Inline Editable Question Title ──────────────────────────────────────────
function EditableQuestionTitle({
  title,
  onSave,
}: {
  title: string;
  onSave?: (newTitle: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const handleBlurOrEnter = () => {
    setIsEditing(false);
    if (value.trim() !== title && onSave) {
      onSave(value.trim());
    }
  };

  return (
    <div className="flex-1 group relative">
      {/* Screen mode: editable */}
      <div className="print:hidden">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleBlurOrEnter}
              onKeyDown={(e) => e.key === "Enter" && handleBlurOrEnter()}
              autoFocus
              className="w-full text-base sm:text-lg font-semibold text-gray-900 border-2 border-blue-400 rounded-xl px-3 py-1 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleBlurOrEnter}
              className="p-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 cursor-pointer hover:bg-blue-50/50 p-1 -m-1 rounded-xl transition-colors"
            title="Klik untuk mengedit teks soal ini"
          >
            <h3
              className="text-base sm:text-lg font-semibold leading-snug"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              {value}
            </h3>
            <Pencil className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        )}
      </div>

      {/* Print mode: clean typography */}
      <h3
        className="hidden print:block text-base font-semibold leading-tight pt-1"
        style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
      >
        {value}
      </h3>
    </div>
  );
}

// ── Shimmer skeleton ────────────────────────────────────────────────────────
function ImageSkeleton({ width, height, rounded = "12px" }: { width: number | string; height: number | string; rounded?: string }) {
  return (
    <div
      className="img-skeleton"
      style={{
        width,
        height,
        borderRadius: rounded,
        background: "linear-gradient(90deg, #e8eaed 25%, #f5f6f7 50%, #e8eaed 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.5s infinite ease-in-out",
        flexShrink: 0,
      }}
    />
  );
}

// ── Matching Item Box ───────────────────────────────────────────────────────
function MatchingBox({
  content,
  isImage,
  imageUrl,
  side,
}: {
  content: string;
  isImage?: boolean;
  imageUrl?: string;
  side: "left" | "right";
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const borderColor = side === "left" ? "#22c55e" : "#3b82f6";
  const bgColor = side === "left" ? "#f0fdf4" : "#eff6ff";

  return (
    <div
      className="matching-box flex items-center justify-center rounded-xl text-center p-2 sm:p-3.5 text-xs sm:text-sm font-bold text-gray-900 break-words relative overflow-hidden"
      style={{
        border: `2px solid ${borderColor}`,
        background: bgColor,
        minHeight: isImage ? "82px" : "48px",
        fontFamily: "var(--font-headline)",
      }}
    >
      {isImage && imageUrl && !imgError ? (
        <div style={{ position: "relative", width: "68px", height: "68px" }}>
          {/* Skeleton shown until image loads */}
          {!imgLoaded && (
            <ImageSkeleton width={68} height={68} rounded="10px" />
          )}
          <img
            src={imageUrl}
            alt={content}
            className="object-contain rounded-lg"
            style={{
              width: "68px",
              height: "68px",
              position: imgLoaded ? "static" : "absolute",
              top: 0, left: 0,
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("&retry=")) {
                target.src = imageUrl + "&retry=1";
              } else {
                setImgError(true);
              }
            }}
          />
        </div>
      ) : isImage && (imgError || !imageUrl) ? (
        <div className="flex flex-col items-center justify-center text-gray-400" style={{ width: "68px", height: "68px" }}>
          <ImageOff className="w-6 h-6" />
          <span className="text-xs mt-1">{content}</span>
        </div>
      ) : (
        <span>{content}</span>
      )}
    </div>
  );
}

// ── Dot connector ───────────────────────────────────────────────────────────
function Dot({ color = "#22c55e" }: { color?: string }) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 0 3px ${color}33`,
      }}
    />
  );
}

// ── Main Matching Section ───────────────────────────────────────────────────
function MatchingSection({ pairs, showKey }: { pairs: MatchingPair[], showKey?: boolean }) {
  const [shuffledRights, setShuffledRights] = useState<MatchingPair[]>([]);

  // Shuffle right sides only once on mount
  useState(() => {
    const rights = [...pairs];
    for (let i = rights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rights[i], rights[j]] = [rights[j], rights[i]];
    }
    setShuffledRights(rights);
  });

  return (
    <div className="matching-section w-full" style={{ marginTop: "12px" }}>
      <div className="grid gap-2.5">
        {pairs.map((pair, i) => {
          const rightItem = showKey ? pair : (shuffledRights[i] || pair);
          return (
            <div
              key={i}
              className="grid grid-cols-[1fr_20px_20px_1fr] sm:grid-cols-[1fr_28px_28px_1fr] items-center gap-1.5 sm:gap-2"
            >
              <MatchingBox content={pair.kiri} isImage={pair.kiri_is_image} imageUrl={pair.kiri_url} side="left" />
              <div className="flex justify-center">
                <Dot color="#22c55e" />
              </div>
              <div className="flex justify-center">
                <Dot color="#3b82f6" />
              </div>
              <MatchingBox content={rightItem.kanan} isImage={rightItem.kanan_is_image} imageUrl={rightItem.kanan_url} side="right" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Legacy matching (old pasangan map format) ────────────────────────────────
function LegacyMatchingSection({ pasangan }: { pasangan: Record<string, string> }) {
  return (
    <div className="matching-section w-full" style={{ marginTop: "12px" }}>
      <div className="grid gap-2.5">
        {Object.entries(pasangan).map(([kiri, kanan], i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_20px_20px_1fr] sm:grid-cols-[1fr_28px_28px_1fr] items-center gap-1.5 sm:gap-2"
          >
            <MatchingBox content={kiri} side="left" />
            <div className="flex justify-center">
              <Dot color="#22c55e" />
            </div>
            <div className="flex justify-center">
              <Dot color="#3b82f6" />
            </div>
            <MatchingBox content={kanan} side="right" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main question illustration (pilihan ganda) ──────────────────────────────
function QuestionImage({
  imgUrl,
  index,
  imagePrompt,
  onImageChange,
}: {
  imgUrl?: string;
  index: number;
  imagePrompt?: string;
  onImageChange?: (index: number, newUrl: string) => void;
}) {
  const [currentUrl, setCurrentUrl] = useState(imgUrl);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  const handleRegen = async () => {
    setRegenLoading(true);
    setImgLoaded(false);
    setImgError(false);
    try {
      const selectedImageModel = typeof window !== "undefined" ? sessionStorage.getItem("selectedImageModel") || undefined : undefined;
      const newUrl = await regenerateImage(imagePrompt || "", selectedImageModel);
      setCurrentUrl(newUrl);
      onImageChange?.(index, newUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setRegenLoading(false);
    }
  };

  return (
    <div className="flex-shrink-0">
      <div
        className="relative rounded-2xl overflow-hidden question-image flex items-center justify-center"
        style={{ width: "160px", height: "160px", background: "#f0f4f8" }}
      >
        {/* Loading state: shimmer + spinner overlay */}
        {!imgLoaded && !imgError && !regenLoading && (
          <>
            <ImageSkeleton width={160} height={160} rounded="0" />
            {/* Subtle pulsing dot in center */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="bloom-dot"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#005caa",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: "0.65rem", color: "#888", fontWeight: 600 }}>loading image...</span>
            </div>
          </>
        )}

        {/* Regen spinner overlay */}
        {regenLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              zIndex: 2,
            }}
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bloom-dot"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#FFC107",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "0.65rem", color: "#666", fontWeight: 600 }}>generating...</span>
          </div>
        )}

        {/* Error state */}
        {imgError && !regenLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageOff className="w-8 h-8 mb-1" />
            <span className="text-xs font-semibold mt-1">Gagal muat</span>
          </div>
        )}

        {/* Actual image */}
        {currentUrl && !imgError && (
          <img
            src={currentUrl}
            alt={`Ilustrasi soal ${index + 1}`}
            className="w-full h-full object-cover"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
              position: imgLoaded ? "static" : "absolute",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              setTimeout(() => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("&retry=")) {
                  target.src = (currentUrl || "") + "&retry=1";
                } else {
                  setImgError(true);
                }
              }, 2000);
            }}
          />
        )}
      </div>

      {/* Regen button */}
      <button
        onClick={handleRegen}
        disabled={regenLoading}
        className="no-print mt-2 text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 w-full"
        style={{
          background: regenLoading ? "#e6e8ea" : "#FFC107",
          color: regenLoading ? "#999" : "#443100",
        }}
      >
        {regenLoading
          ? "Generating..."
          : <><RefreshCw className="w-3 h-3" /> Ganti Gambar</>}
      </button>
    </div>
  );
}

// ── 1. Lengkapi Suku Kata ──────────────────────────────────────────────────
function LengkapiSukuKataRow({
  soal,
  index,
  showKey,
  onImageChange,
}: {
  soal: Soal;
  index: number;
  showKey?: boolean;
  onImageChange?: (index: number, newUrl: string) => void;
}) {
  const [selectedPilihan, setSelectedPilihan] = useState<string | null>(null);
  const pilihan = soal.pilihan_suku_kata || ["pa", "pi"];
  const sukuAwal = soal.suku_kata_awal || "Sa";

  return (
    <div className="lkpd-card flex items-center justify-between border-2 border-blue-300 rounded-2xl p-2 sm:p-3 bg-white mb-3 print:mb-2 print:border-blue-400">
      {/* Kolom Gambar */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center bg-blue-50/50 rounded-xl overflow-hidden border border-blue-100 print:border-none">
        {soal.image_url ? (
          <img src={soal.image_url} alt={soal.pertanyaan} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-xl">🖼️</span>
        )}
      </div>

      {/* Kolom Suku Kata Awal + Garis Isian */}
      <div className="flex-1 px-4 sm:px-8 flex items-baseline gap-2 sm:gap-3">
        <span className="text-2xl sm:text-3xl font-black text-blue-800 tracking-wider font-mono">
          {sukuAwal.split("").join(" ")}
        </span>
        <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono tracking-widest">
          {showKey && soal.jawaban_benar ? (
            <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-lg underline decoration-green-500">
              {soal.jawaban_benar.split("").join(" ")}
            </span>
          ) : (
            "_ _ _ _"
          )}
        </span>
      </div>

      {/* Kolom 2 Kotak Pilihan Suku Kata */}
      <div className="flex items-stretch border-2 border-blue-300 rounded-xl overflow-hidden bg-blue-50/30 print:border-blue-400">
        {pilihan.map((p, i) => {
          const isCorrect = p === soal.jawaban_benar;
          const isSelected = selectedPilihan === p;
          const isKeyActive = showKey && isCorrect;

          return (
            <button
              key={i}
              disabled={showKey}
              onClick={() => setSelectedPilihan(p)}
              className={`px-3.5 py-2.5 sm:px-5 sm:py-3 text-lg sm:text-2xl font-black transition-all ${
                i > 0 ? "border-l-2 border-blue-300 print:border-blue-400" : ""
              } ${
                isKeyActive
                  ? "bg-green-400 text-white font-black"
                  : isSelected
                  ? "bg-blue-600 text-white"
                  : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 2. Tulis Huruf Depan ────────────────────────────────────────────────────
function HurufDepanRow({
  soal,
  index,
  showKey,
  onImageChange,
}: {
  soal: Soal;
  index: number;
  showKey?: boolean;
  onImageChange?: (index: number, newUrl: string) => void;
}) {
  const [inputVal, setInputVal] = useState("");
  const sisa = soal.sisa_kata || "ola";
  const hurufAwal = soal.huruf_depan || soal.jawaban_benar || "B";

  return (
    <div className="lkpd-card flex items-center gap-4 sm:gap-6 p-2 sm:p-3 bg-white rounded-2xl mb-3 print:mb-2 border border-gray-100 print:border-none">
      {/* Gambar Objek */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 print:border-black">
        {soal.image_url ? (
          <img src={soal.image_url} alt={soal.pertanyaan} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-2xl">🍎</span>
        )}
      </div>

      {/* Kotak Tulis Huruf Depan */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-black rounded-lg flex items-center justify-center bg-white shadow-sm print:border-black">
        {showKey ? (
          <span className="text-2xl sm:text-3xl font-black text-green-700">{hurufAwal}</span>
        ) : (
          <input
            type="text"
            maxLength={1}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
            className="w-full h-full text-center text-2xl sm:text-3xl font-black text-gray-800 uppercase outline-none bg-transparent"
          />
        )}
      </div>

      {/* Sisa Huruf Kata */}
      <div className="text-3xl sm:text-4xl font-bold tracking-[0.25em] text-gray-800 font-sans">
        {sisa.split("").join(" ")}
      </div>
    </div>
  );
}

// ── 3. Lingkari Kata Sesuai Gambar ──────────────────────────────────────────
function LingkariKataRow({
  soal,
  index,
  showKey,
  onImageChange,
}: {
  soal: Soal;
  index: number;
  showKey?: boolean;
  onImageChange?: (index: number, newUrl: string) => void;
}) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const opsi = soal.opsi_kata || ["Sapu", "Saku", "Suka"];

  return (
    <div className="lkpd-card flex items-center gap-3 sm:gap-4 p-2 bg-white rounded-2xl mb-3 print:mb-2">
      {/* Kolom Gambar di Kotak Berborder */}
      <div className="w-20 h-18 sm:w-24 sm:h-20 flex-shrink-0 flex items-center justify-center bg-white rounded-xl overflow-hidden border-2 border-gray-300 print:border-black">
        {soal.image_url ? (
          <img src={soal.image_url} alt={soal.pertanyaan} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-2xl">🧹</span>
        )}
      </div>

      {/* Kotak Rounded Berisi 3 Kata Pilihan */}
      <div className="flex-1 flex items-center justify-around border-2 border-gray-300 rounded-2xl py-3 px-2 sm:px-4 bg-white print:border-black">
        {opsi.map((kata, i) => {
          const isCorrect = kata === soal.jawaban_benar;
          const isSelected = selectedWord === kata;
          const isKeyActive = showKey && isCorrect;

          return (
            <button
              key={i}
              disabled={showKey}
              onClick={() => setSelectedWord(kata)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-base sm:text-xl font-bold transition-all ${
                isKeyActive
                  ? "border-2 border-green-600 bg-green-100 text-green-800"
                  : isSelected
                  ? "border-2 border-blue-600 bg-blue-50 text-blue-800 font-black"
                  : "text-gray-800 hover:bg-gray-50 border-2 border-transparent"
              }`}
            >
              {kata}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 4. Menyusun Kata (Anagram / Scramble) ───────────────────────────────────
function SusunKataRow({
  soal,
  index,
  showKey,
  onImageChange,
}: {
  soal: Soal;
  index: number;
  showKey?: boolean;
  onImageChange?: (index: number, newUrl: string) => void;
}) {
  const hurufAcak = soal.huruf_acak || "L P E A";
  const jumlahHuruf = soal.jumlah_huruf || 4;
  const dashes = Array(jumlahHuruf).fill("_").join("  ");

  return (
    <div className="lkpd-card flex items-center gap-4 sm:gap-6 p-2 bg-white rounded-2xl mb-3 print:mb-2">
      {/* Gambar Objek */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center bg-white rounded-xl overflow-hidden border-2 border-gray-800 print:border-black">
        {soal.image_url ? (
          <img src={soal.image_url} alt={soal.pertanyaan} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-2xl">🍎</span>
        )}
      </div>

      {/* Huruf Acak = Garis Isian */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-wider font-mono">
          {hurufAcak} =
        </span>
        <span className="text-2xl sm:text-3xl font-black text-gray-600 tracking-widest font-mono">
          {showKey && soal.jawaban_benar ? (
            <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-lg underline decoration-green-500">
              {soal.jawaban_benar.split("").join(" ")}
            </span>
          ) : (
            dashes
          )}
        </span>
      </div>
    </div>
  );
}

// ── 5. Drill Berhitung Matematika (Multi-Kolom Grid) ────────────────────────
function DrillMatematikaGrid({ soal }: { soal: Soal }) {
  const blocks = soal.math_blocks || [
    { judul_blok: "Kotak 1", items: ["1 + 2 =", "2 + 4 =", "4 + 6 =", "7 + 8 =", "9 + 1 ="] },
    { judul_blok: "Kotak 2", items: ["3 + 3 =", "2 + 2 =", "4 + 5 =", "6 + 3 =", "7 + 9 ="] },
    { judul_blok: "Kotak 3", items: ["8 + 4 =", "6 + 2 =", "2 + 3 =", "7 + 1 =", "5 + 6 ="] },
    { judul_blok: "Kotak 4", items: ["5 + 1 =", "8 + 4 =", "4 + 3 =", "7 + 5 =", "6 + 1 ="] },
    { judul_blok: "Kotak 5", items: ["1 + 9 =", "8 + 2 =", "7 + 6 =", "6 + 6 =", "5 + 9 ="] },
    { judul_blok: "Kotak 6", items: ["2 + 9 =", "3 + 4 =", "7 + 4 =", "1 + 3 =", "4 + 1 ="] },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 print:grid-cols-3 print:gap-3 my-4">
      {blocks.map((block, idx) => (
        <div
          key={idx}
          className="border-2 border-blue-300 rounded-2xl p-3 sm:p-4 bg-white shadow-sm print:border-blue-400 print:shadow-none"
        >
          <div className="flex flex-col gap-2.5">
            {block.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="flex items-center justify-between text-base sm:text-lg font-black text-gray-800 font-mono border-b border-gray-100 pb-1"
              >
                <span>{item}</span>
                <span className="w-10 border-b-2 border-gray-300 inline-block ml-2"></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main QuestionCard ───────────────────────────────────────────────────────
export default function QuestionCard({ soal, index, onImageChange, onUpdateSoal, showKey }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const optionLabels = ["A", "B", "C", "D"];
  const tipe = soal.tipe_soal;

  // 1. Lengkapi Suku Kata
  if (tipe === "lengkapi_suku_kata") {
    return <LengkapiSukuKataRow soal={soal} index={index} showKey={showKey} onImageChange={onImageChange} />;
  }

  // 2. Tulis Huruf Depan
  if (tipe === "huruf_depan") {
    return <HurufDepanRow soal={soal} index={index} showKey={showKey} onImageChange={onImageChange} />;
  }

  // 3. Lingkari Kata Sesuai Gambar
  if (tipe === "lingkari_kata") {
    return <LingkariKataRow soal={soal} index={index} showKey={showKey} onImageChange={onImageChange} />;
  }

  // 4. Menyusun Kata (Anagram)
  if (tipe === "susun_kata") {
    return <SusunKataRow soal={soal} index={index} showKey={showKey} onImageChange={onImageChange} />;
  }

  // 5. Drill Matematika
  if (tipe === "drill_matematika") {
    return <DrillMatematikaGrid soal={soal} />;
  }

  const isMatching = tipe === "mencocokkan";
  const isIsian = tipe === "isian_singkat";
  const isPilihan = !isMatching && !isIsian;
  
  let finalPairs = soal.pasangan_item || [];
  if (finalPairs.length === 0 && soal.pasangan && Object.keys(soal.pasangan).length > 0) {
    finalPairs = Object.entries(soal.pasangan).map(([k, v]) => ({
      kiri: k, kanan: v, kiri_is_image: false, kanan_is_image: false
    }));
  }
  const hasPairs = finalPairs.length > 0;

  return (
    <div className="card-xl question-card print:mb-6 p-5 sm:p-8">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 mb-4 print:mb-2">
        <div
          className="print-number w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #005caa, #5aa2ff)" }}
        >
          {index + 1}
        </div>
        <EditableQuestionTitle 
          title={soal.pertanyaan} 
          onSave={(newTitle) => onUpdateSoal?.(index, { ...soal, pertanyaan: newTitle })} 
        />
      </div>

      {/* ── Illustration for choices/isian WITH image ── */}
      {!isMatching && !soal.tanpa_gambar && (
        <div className="flex flex-col md:flex-row gap-6 mb-6 print:gap-4 print:mb-2">
          <div className="flex justify-center md:block flex-shrink-0">
            <QuestionImage
              imgUrl={soal.image_url}
              index={index}
              imagePrompt={soal.image_prompt}
              onImageChange={onImageChange}
            />
          </div>

          {/* Multiple choice options */}
          {isPilihan && (
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-2.5 print:gap-1.5">
                {(soal.opsi || []).map((opsi, i) => {
                  const isCorrect = opsi === soal.jawaban_benar;
                  const isSelectedByUser = selectedOption === opsi;
                  const displayAsCorrect = showKey ? isCorrect : (isSelectedByUser && isCorrect);
                  const displayAsWrong = !showKey && isSelectedByUser && !isCorrect;
                  const isActive = showKey ? isCorrect : isSelectedByUser;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => !showKey && setSelectedOption(opsi)}
                      disabled={showKey}
                      className="print-option flex items-center gap-3 p-3.5 print:p-1.5 rounded-2xl text-left transition-all duration-200 font-medium text-sm"
                      style={{
                        background: displayAsCorrect ? "#91f78e" : displayAsWrong ? "#fb5151" : "#f5f6f7",
                        color: displayAsCorrect ? "#005e17" : displayAsWrong ? "#570008" : "var(--color-on-surface)",
                        border: `2px solid ${displayAsCorrect ? "#4CAF50" : displayAsWrong ? "#f44" : "transparent"}`,
                        cursor: showKey ? "default" : "pointer",
                        opacity: showKey && !isCorrect ? 0.6 : 1,
                      }}
                    >
                      <span
                        className="print-number w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{
                          background: isActive ? "rgba(0,0,0,0.15)" : "var(--color-primary-brand, #005caa)",
                          color: "white",
                        }}
                      >
                        {optionLabels[i]}
                      </span>
                      {opsi}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Isian Singkat Input */}
          {isIsian && (
            <div className="flex-1 flex flex-col justify-center">
               <input 
                 type="text" 
                 placeholder="Ketik jawaban di sini..." 
                 className="w-full border-2 border-gray-200 rounded-2xl p-4 font-bold text-gray-700 bg-gray-50 focus:border-blue-500 focus:bg-white transition-all outline-none"
                 disabled={showKey}
               />
               {showKey && (
                 <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                   <span className="font-bold text-green-700 text-sm">Kunci Jawaban:</span>
                   <span className="font-bold text-green-900 border-b-2 border-green-400">{soal.jawaban_benar}</span>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      {/* ── No-image choices/isian ── */}
      {isPilihan && soal.tanpa_gambar && (
        <div className="grid grid-cols-1 gap-2.5 print:gap-1.5 mb-2">
          {(soal.opsi || []).map((opsi, i) => {
            const isCorrect = opsi === soal.jawaban_benar;
            const isSelectedByUser = selectedOption === opsi;
            const displayAsCorrect = showKey ? isCorrect : (isSelectedByUser && isCorrect);
            const displayAsWrong = !showKey && isSelectedByUser && !isCorrect;
            const isActive = showKey ? isCorrect : isSelectedByUser;

            return (
              <button
                key={i}
                onClick={() => !showKey && setSelectedOption(opsi)}
                disabled={showKey}
                className="print-option flex items-center gap-3 p-3.5 print:p-1.5 rounded-2xl text-left transition-all duration-200 font-medium text-sm"
                style={{
                  background: displayAsCorrect ? "#91f78e" : displayAsWrong ? "#fb5151" : "#f5f6f7",
                  color: displayAsCorrect ? "#005e17" : displayAsWrong ? "#570008" : "var(--color-on-surface)",
                  border: `2px solid ${displayAsCorrect ? "#4CAF50" : displayAsWrong ? "#f44" : "transparent"}`,
                  cursor: showKey ? "default" : "pointer",
                  opacity: showKey && !isCorrect ? 0.6 : 1,
                }}
              >
                <span
                  className="print-number w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    background: isActive ? "rgba(0,0,0,0.15)" : "var(--color-primary-brand, #005caa)",
                    color: "white",
                  }}
                >
                  {optionLabels[i]}
                </span>
                {opsi}
              </button>
            );
          })}
        </div>
      )}

      {isIsian && soal.tanpa_gambar && (
         <div className="mb-4">
           <input 
             type="text" 
             placeholder="Ketik jawaban Anda..." 
             className="w-full border-2 border-gray-200 rounded-2xl p-4 font-bold text-gray-700 bg-gray-50 focus:border-blue-500 focus:bg-white transition-all outline-none"
             disabled={showKey}
           />
           {showKey && (
             <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 max-w-sm">
               <span className="font-bold text-green-700 text-sm">Kunci Jawaban:</span>
               <span className="font-bold text-green-900 border-b-2 border-green-400">{soal.jawaban_benar}</span>
             </div>
           )}
         </div>
      )}

      {/* ── Matching: structured format ── */}
      {isMatching && hasPairs && (
        <MatchingSection pairs={finalPairs} showKey={showKey} />
      )}
    </div>
  );
}
