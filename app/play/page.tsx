"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Soal, Worksheet, MatchingPair } from "@/lib/api";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, RefreshCcw, Star, Flame } from "lucide-react";

// Flatten questions for the interactive mode
type PlayItem =
  | { type: "mcq"; soal: Soal; index: number }
  | { type: "isian"; soal: Soal; index: number }
  | { type: "match"; soal: Soal; pairIndex: number; pair: MatchingPair; allRights: MatchingPair[]; index: number };

type AnswerRecord = {
  answer: string;
  isCorrect: boolean;
};

export default function PlayPage() {
  const router = useRouter();
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [playItems, setPlayItems] = useState<PlayItem[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, AnswerRecord>>({});
  const [isianInput, setIsianInput] = useState("");

  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  const [showResult, setShowResult] = useState(false);
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);

  // ── SEMUA HOOKS HARUS DI ATAS, SEBELUM CONDITIONAL RETURN ──

  useEffect(() => {
    const stored = sessionStorage.getItem("currentWorksheet");
    if (!stored) {
      router.push("/generate");
      return;
    }
    const ws: Worksheet = JSON.parse(stored);
    setWorksheet(ws);

    // Flatten all questions into turns
    const items: PlayItem[] = [];
    ws.data_soal.forEach((soal, sIdx) => {
      let finalPairs = soal.pasangan_item || [];
      if (finalPairs.length === 0 && soal.pasangan && Object.keys(soal.pasangan).length > 0) {
        finalPairs = Object.entries(soal.pasangan).map(([k, v]) => ({
          kiri: k, kanan: v, kiri_is_image: false, kanan_is_image: false
        }));
      }

      if (soal.tipe_soal === "mencocokkan" && finalPairs.length > 0) {
        const allRights = [...finalPairs];
        allRights.sort(() => Math.random() - 0.5);
        finalPairs.forEach((pair, pIdx) => {
          items.push({ type: "match", soal, pairIndex: pIdx, pair, allRights, index: sIdx });
        });
      } else if (soal.tipe_soal === "isian_singkat") {
        items.push({ type: "isian", soal, index: sIdx });
      } else {
        items.push({ type: "mcq", soal, index: sIdx });
      }
    });
    setPlayItems(items);
  }, [router]);

  // Reset input isian setiap kali soal berganti
  useEffect(() => {
    setIsianInput("");
  }, [currentIndex]);

  const handleAnswer = useCallback((answer: string, isCorrect: boolean) => {
    setUserAnswers(prev => {
      if (prev[currentIndex]) return prev; // already answered
      return { ...prev, [currentIndex]: { answer, isCorrect } };
    });

    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setGlow(true);
      setTimeout(() => setGlow(false), 800);
      setTimeout(() => {
        setCurrentIndex(ci => {
          if (ci < (playItems.length - 1)) return ci + 1;
          setShowResult(true);
          return ci;
        });
      }, 1200);
    } else {
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => {
        setCurrentIndex(ci => {
          if (ci < (playItems.length - 1)) return ci + 1;
          setShowResult(true);
          return ci;
        });
      }, 2000);
    }
  }, [currentIndex, playItems.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(ci => {
      if (ci < playItems.length - 1) return ci + 1;
      setShowResult(true);
      return ci;
    });
  }, [playItems.length]);

  const handleBack = useCallback(() => {
    setCurrentIndex(ci => (ci > 0 ? ci - 1 : ci));
  }, []);

  // ── CONDITIONAL RETURNS SETELAH SEMUA HOOKS ──

  if (!worksheet || playItems.length === 0) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Memuat Game...</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / playItems.length) * 100);
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafc]" style={{ backgroundImage: "radial-gradient(#e2e8f0 2px, transparent 2px)", backgroundSize: "32px 32px" }}>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl text-center border border-gray-100 relative z-10">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-black mb-2 text-[#1e293b]" style={{ fontFamily: "var(--font-headline)" }}>Luar Biasa!</h1>
          <p className="text-gray-500 mb-8 font-medium">Kamu telah menyelesaikan semua soal.</p>

          <div className="bg-[#f0fdf4] rounded-2xl p-6 mb-8 border border-green-100">
            <div className="text-6xl font-black text-green-600 mb-2">{percentage}%</div>
            <div className="text-sm font-bold text-green-800">Skor ({score} dari {playItems.length} Benar)</div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => window.location.reload()} className="btn-primary w-full py-4 text-lg shadow-[0_4px_0_0_#004683]">
              <RefreshCcw className="w-5 h-5 inline mr-2" /> Main Ulang
            </button>
            <button onClick={() => router.push("/history")} className="btn-secondary w-full py-4 text-lg bg-gray-50 border-gray-200">
              <ArrowLeft className="w-5 h-5 inline mr-2" /> Kembali ke Riwayat
            </button>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(20px, -30px) scale(1.05); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 15s infinite ease-in-out; will-change: transform; }
        `}} />
      </div>
    );
  }

  const currentItem = playItems[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progress = (answeredCount / playItems.length) * 100;
  const currentAnswerRecord = userAnswers[currentIndex];
  const isAnswered = !!currentAnswerRecord;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col relative overflow-hidden">

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafc]" style={{ backgroundImage: "radial-gradient(#94a3b8 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Bar */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-gray-100 z-10 sticky top-0">
        <button onClick={() => router.push("/history")} className="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-500 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="hidden md:inline">Tutup</span>
        </button>

        <div className="flex-1 max-w-md mx-6">
          <div className="flex justify-between items-end mb-1">
             <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Pertanyaan {Math.min(currentIndex + 1, playItems.length)} / {playItems.length}</span>
             {streak >= 3 && (
                <div className="flex items-center gap-1 text-orange-600 flex-shrink-0">
                  <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
                  <span className="text-xs font-black italic">{streak}x Beruntun!</span>
                </div>
             )}
          </div>
          <div className="bg-gray-200 h-3 rounded-full overflow-hidden flex-shrink-0 relative shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1"
              style={{ width: `${Math.max(progress, 2)}%`, background: "linear-gradient(90deg, #3b82f6, #06b6d4)", boxShadow: glow ? "0 0 15px rgba(59, 130, 246, 0.8)" : "none" }}
            >
               <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        <div className="font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full flex gap-1.5 items-center flex-shrink-0 border border-blue-100 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 drop-shadow-sm" />
          <span className="text-sm">{score}</span>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col items-center justify-center z-10">
        <div className={`w-full max-w-2xl ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>

          {/* Question Card */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 mb-6 text-center relative overflow-hidden group">
            {isAnswered && (
               <div className="absolute top-4 right-6 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                 Hanya Meninjau Ulang
               </div>
            )}

            {(currentItem.type === "mcq" || currentItem.type === "isian") && (
              <>
                <span className="text-xs font-black tracking-widest text-blue-500 uppercase mb-4 block">
                  {currentItem.type === "isian" ? "Isian Singkat" : "Pilihan Ganda"} · Soal {currentItem.index + 1}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#1e293b] leading-snug" style={{ fontFamily: "var(--font-headline)" }}>
                  {currentItem.soal.pertanyaan}
                </h2>
                {currentItem.soal.image_url && !currentItem.soal.tanpa_gambar && (
                  <img src={currentItem.soal.image_url} alt="Ilustrasi" className="mx-auto mt-6 rounded-2xl w-48 h-48 object-cover shadow-lg border-4 border-white" />
                )}
              </>
            )}

            {currentItem.type === "match" && (
              <>
                <span className="text-xs font-black tracking-widest text-[#9333ea] uppercase mb-4 block">
                  Mencocokkan · Bagian {currentItem.pairIndex + 1}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-[#1e293b] mb-6" style={{ fontFamily: "var(--font-headline)" }}>
                  Pilih pasangan yang tepat untuk:
                </h2>
                <div className="bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff] shadow-inner border-2 border-[#d8b4fe] p-6 rounded-3xl inline-block">
                  {currentItem.pair.kiri_is_image && currentItem.pair.kiri_url ? (
                    <img src={currentItem.pair.kiri_url} alt="Kiri" className="w-32 h-32 object-contain rounded-xl" />
                  ) : (
                    <span className="text-4xl font-black text-[#6b21a8]">{currentItem.pair.kiri}</span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Options Area */}
          <div className={`grid gap-4 ${currentItem.type === 'isian' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>

            {/* MCQ Options */}
            {currentItem.type === "mcq" && (currentItem.soal.opsi || []).map((opsi, i) => {
              const isCorrect = opsi === currentItem.soal.jawaban_benar;
              const isSelected = isAnswered && currentAnswerRecord.answer === opsi;

              let bgClass = "bg-white border-2 border-[#e2e8f0] shadow-[0_4px_0_0_#cbd5e1]";
              let textClass = "text-gray-700";

              if (isAnswered) {
                if (isCorrect) {
                  bgClass = "bg-[#dcfce7] border-2 border-[#22c55e] translate-y-1";
                  textClass = "text-[#166534]";
                } else if (isSelected) {
                  bgClass = "bg-[#fee2e2] border-2 border-[#ef4444] translate-y-1 opacity-80";
                  textClass = "text-[#991b1b]";
                } else {
                  bgClass = "bg-gray-50 border-2 border-gray-200 opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(opsi, isCorrect)}
                  className={`relative p-6 rounded-2xl text-left font-bold text-lg transition-all duration-200 ${bgClass} ${textClass} ${!isAnswered && 'hover:-translate-y-1 hover:shadow-[0_6px_0_0_#94a3b8] active:translate-y-1 active:shadow-none'}`}
                >
                  {opsi}
                  {isAnswered && isCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-green-500 fill-green-100" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-red-500 fill-red-100" />}
                </button>
              );
            })}

            {/* Isian Singkat */}
            {currentItem.type === "isian" && (
              <div className="flex flex-col gap-4 max-w-lg mx-auto w-full">
                <input
                  type="text"
                  disabled={isAnswered}
                  value={isAnswered ? currentAnswerRecord.answer : isianInput}
                  onChange={(e) => setIsianInput(e.target.value)}
                  placeholder="Ketik jawaban kamu..."
                  className={`w-full text-center text-xl md:text-2xl font-black p-6 rounded-3xl border-[3px] transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                    isAnswered
                    ? (currentAnswerRecord.isCorrect ? "bg-green-50 border-green-400 text-green-700" : "bg-red-50 border-red-400 text-red-700")
                    : "bg-white border-blue-200 text-slate-700 focus:border-blue-500 shadow-sm"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isAnswered && isianInput.trim()) {
                      const cleanInput = isianInput.trim().toLowerCase();
                      const cleanCorrect = (currentItem.soal.jawaban_benar || "").trim().toLowerCase();
                      handleAnswer(isianInput.trim(), cleanInput === cleanCorrect);
                    }
                  }}
                />

                {!isAnswered && (
                   <button
                     onClick={() => {
                        if (!isianInput.trim()) return;
                        const cleanInput = isianInput.trim().toLowerCase();
                        const cleanCorrect = (currentItem.soal.jawaban_benar || "").trim().toLowerCase();
                        handleAnswer(isianInput.trim(), cleanInput === cleanCorrect);
                     }}
                     disabled={!isianInput.trim()}
                     className="btn-primary py-4 text-xl shadow-[0_6px_0_0_#004683] disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Jawab
                   </button>
                )}

                {isAnswered && !currentAnswerRecord.isCorrect && (
                   <div className="bg-green-100 border-2 border-green-500 p-4 rounded-2xl flex flex-col items-center">
                      <span className="text-sm font-bold text-green-700 uppercase tracking-widest mb-1">Jawaban yang benar:</span>
                      <span className="text-2xl font-black text-green-900">{currentItem.soal.jawaban_benar}</span>
                   </div>
                )}
              </div>
            )}

            {/* Match Options */}
            {currentItem.type === "match" && currentItem.allRights.map((rightItem, i) => {
              const isCorrect = rightItem.kanan === currentItem.pair.kanan;
              const isSelected = isAnswered && currentAnswerRecord.answer === rightItem.kanan;

              let bgClass = "bg-white border-2 border-[#e2e8f0] shadow-[0_4px_0_0_#cbd5e1]";
              let textClass = "text-gray-700";

              if (isAnswered) {
                if (isCorrect) {
                   bgClass = "bg-[#dcfce7] border-2 border-[#22c55e] translate-y-1";
                   textClass = "text-[#166534]";
                } else if (isSelected) {
                   bgClass = "bg-[#fee2e2] border-2 border-[#ef4444] translate-y-1 opacity-80";
                   textClass = "text-[#991b1b]";
                } else {
                   bgClass = "bg-gray-50 border-2 border-gray-200 opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(rightItem.kanan, isCorrect)}
                  className={`relative p-5 rounded-3xl flex items-center justify-center font-bold text-lg min-h-[110px] transition-all duration-200 ${bgClass} ${textClass} ${!isAnswered && 'hover:-translate-y-1 hover:shadow-[0_6px_0_0_#94a3b8] active:translate-y-1'}`}
                >
                  {rightItem.kanan_is_image && rightItem.kanan_url ? (
                    <img src={rightItem.kanan_url} alt="Opsi Kanan" className="w-20 h-20 object-contain rounded-lg" />
                  ) : (
                    <span>{rightItem.kanan}</span>
                  )}
                  {isAnswered && isCorrect && <CheckCircle2 className="absolute right-3 top-3 w-7 h-7 text-green-500 fill-green-100" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="absolute right-3 top-3 w-7 h-7 text-red-500 fill-red-100" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          {Object.keys(userAnswers).length > 0 && (
             <div className="mt-10 mb-4 flex justify-between items-center w-full">
               <button
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className={`btn-secondary flex gap-2 items-center px-6 py-3 border-none bg-white shadow-sm ring-1 ring-gray-200 ${currentIndex === 0 ? 'opacity-0 select-none pointer-events-none' : 'hover:bg-gray-50 hover:shadow-md transition-all'}`}
               >
                 <ArrowLeft className="w-5 h-5" /> Kembali
               </button>

               {isAnswered && (
                 <button
                    onClick={handleNext}
                    className="btn-primary flex gap-2 items-center px-8 py-3 shadow-[0_4px_0_0_#004683] bg-gradient-to-r from-[#005caa] to-[#0081f2]"
                 >
                   {currentIndex === playItems.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'} <ArrowRight className="w-5 h-5" />
                 </button>
               )}
             </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 15s infinite ease-in-out; will-change: transform; }
      `}} />
    </div>
  );
}
