const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface MatchingPair {
  kiri: string;
  kanan: string;
  kiri_is_image?: boolean;
  kanan_is_image?: boolean;
  kiri_url?: string;
  kanan_url?: string;
  kiri_prompt?: string;
  kanan_prompt?: string;
}

export interface Soal {
  pertanyaan: string;
  jawaban_benar?: string;
  opsi?: string[];
  pasangan?: Record<string, string>; // legacy
  pasangan_item?: MatchingPair[]; // new structured matching
  tipe_soal: string;
  tanpa_gambar: boolean;
  image_prompt?: string;
  image_url?: string;
}

export interface Worksheet {
  id: number;
  judul_materi: string;
  tingkat_kelas: number;
  data_soal: Soal[];
  created_at: string;
}

export interface GenerateRequest {
  topik: string;
  kelas: number;
  jumlah_soal: number;
  tipe_soal?: string;
  tanpa_gambar?: boolean;
  model?: string;
}

export async function generateWorksheet(data: GenerateRequest): Promise<{ worksheet: Worksheet; message: string }> {
  const res = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal generate soal");
  }
  return res.json();
}

export async function addWorksheetSoal(id: number, data: GenerateRequest): Promise<{ worksheet: Worksheet; message: string }> {
  const res = await fetch(`${API_URL}/api/history/${id}/add-soal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal tambah soal");
  }
  return res.json();
}

export async function getHistory(): Promise<Worksheet[]> {
  const res = await fetch(`${API_URL}/api/history`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal ambil riwayat");
  return res.json();
}

export async function getWorksheet(id: number): Promise<Worksheet> {
  const res = await fetch(`${API_URL}/api/history/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Worksheet tidak ditemukan");
  return res.json();
}

export async function deleteWorksheet(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/history/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Gagal hapus worksheet");
}

export async function regenerateImage(imagePrompt: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/regenerate-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_prompt: imagePrompt }),
  });
  if (!res.ok) throw new Error("Gagal regenerate gambar");
  const data = await res.json();
  return data.image_url;
}
