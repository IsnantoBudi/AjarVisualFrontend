"use client";
import { useState } from "react";
import { Soal, MatchingPair } from "@/lib/api";
import { regenerateImage } from "@/lib/api";
import { RefreshCw, ImageOff } from "lucide-react";

interface Props {
  soal: Soal;
  index: number;
  onImageChange?: (index: number, newUrl: string) => void;
  showKey?: boolean;
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
      className="matching-box flex items-center justify-center rounded-xl text-center"
      style={{
        border: `2px solid ${borderColor}`,
        background: bgColor,
        minHeight: isImage ? "82px" : "50px",
        padding: isImage ? "6px" : "8px 14px",
        fontFamily: "var(--font-headline)",
        fontWeight: 700,
        fontSize: "0.92rem",
        color: "#1a1a1a",
        wordBreak: "break-word",
        position: "relative",
        overflow: "hidden",
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
      <div style={{ display: "grid", gap: "10px" }}>
        {pairs.map((pair, i) => {
          const rightItem = showKey ? pair : (shuffledRights[i] || pair);
          return (
            <div
              key={i}
              className="matching-row"
              style={{ display: "grid", gridTemplateColumns: "1fr 28px 28px 1fr", alignItems: "center", gap: "8px" }}
            >
              <MatchingBox content={pair.kiri} isImage={pair.kiri_is_image} imageUrl={pair.kiri_url} side="left" />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Dot color="#22c55e" />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
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
      <div style={{ display: "grid", gap: "10px" }}>
        {Object.entries(pasangan).map(([kiri, kanan], i) => (
          <div
            key={i}
            className="matching-row"
            style={{ display: "grid", gridTemplateColumns: "1fr 28px 28px 1fr", alignItems: "center", gap: "8px" }}
          >
            <MatchingBox content={kiri} side="left" />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Dot color="#22c55e" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
      const newUrl = await regenerateImage(imagePrompt || "");
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

// ── Main QuestionCard ───────────────────────────────────────────────────────
export default function QuestionCard({ soal, index, onImageChange, showKey }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const optionLabels = ["A", "B", "C", "D"];
  const isMatching = soal.tipe_soal === "mencocokkan";
  const isIsian = soal.tipe_soal === "isian_singkat";
  const isPilihan = !isMatching && !isIsian;
  
  let finalPairs = soal.pasangan_item || [];
  if (finalPairs.length === 0 && soal.pasangan && Object.keys(soal.pasangan).length > 0) {
    finalPairs = Object.entries(soal.pasangan).map(([k, v]) => ({
      kiri: k, kanan: v, kiri_is_image: false, kanan_is_image: false
    }));
  }
  const hasPairs = finalPairs.length > 0;

  return (
    <div className="card-xl question-card print:mb-6">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 mb-4 print:mb-2">
        <div
          className="print-number w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #005caa, #5aa2ff)" }}
        >
          {index + 1}
        </div>
        <h3
          className="text-lg font-semibold print:text-base leading-tight pt-1"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
        >
          {soal.pertanyaan}
        </h3>
      </div>

      {/* ── Illustration for choices/isian WITH image ── */}
      {!isMatching && !soal.tanpa_gambar && (
        <div className="flex flex-col md:flex-row gap-6 mb-6 print:gap-4 print:mb-2">
          <QuestionImage
            imgUrl={soal.image_url}
            index={index}
            imagePrompt={soal.image_prompt}
            onImageChange={onImageChange}
          />

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
