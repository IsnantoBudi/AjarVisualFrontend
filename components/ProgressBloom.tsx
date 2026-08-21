import { Sparkles, Wand2, BookOpen } from "lucide-react";

export default function ProgressBloom({ message = "Sedang membuat soal ajaib..." }: { message?: string }) {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 py-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,92,170,0.08)] border-2 border-blue-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Animated Magic Orb / Icon */}
        <div className="relative mb-5 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-blue-500/20 animate-pulse flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-bounce" />
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: "4s" }} />
        </div>

        {/* Dynamic Blooming Dots */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bloom-dot rounded-full transition-all"
              style={{
                width: `${10 + i * 3}px`,
                height: `${10 + i * 3}px`,
                background: i % 2 === 0
                  ? "linear-gradient(135deg, #005caa, #5aa2ff)"
                  : "#FFC107",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Main Message (Fluid Typography with Word Break) */}
        <h2 
          className="text-base sm:text-lg md:text-xl font-black text-gray-900 leading-snug break-words max-w-xs sm:max-w-sm mb-2"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          {message}
        </h2>

        {/* Subtitle Message */}
        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
          AI sedang merumuskan butir soal edukatif dan menghasilkan ilustrasi visual untuk siswa.
        </p>

        {/* Floating Mini Status Pill */}
        <div className="mt-5 pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-[11px] font-bold text-blue-700 bg-blue-50/50 py-2 px-3 rounded-xl">
          <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="truncate">Sesuai Kurikulum Merdeka</span>
        </div>
      </div>
    </div>
  );
}
