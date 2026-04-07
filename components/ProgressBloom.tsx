export default function ProgressBloom({ message = "Sedang membuat soal ajaib..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="flex items-center gap-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bloom-dot rounded-full"
            style={{
              width: `${16 + i * 4}px`,
              height: `${16 + i * 4}px`,
              background: i % 2 === 0
                ? "linear-gradient(135deg, #005caa, #5aa2ff)"
                : "#FFC107",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <p className="text-lg font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
        {message}
      </p>
      <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
        AI sedang menyiapkan soal dan ilustrasi untuk kamu 
      </p>
    </div>
  );
}
