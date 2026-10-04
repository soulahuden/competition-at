# COM@T — Competition At

Prototipe **frontend** platform kampus untuk membentuk tim lomba. Tanpa backend: semua data
berasal dari mock data in-memory.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build produksi + typecheck
```

## Tech stack

Vite · React 18 · TypeScript · Tailwind CSS · React Router · lucide-react

## Struktur

```
src/
├─ data/        mock data mentah (20 mahasiswa, 12 lomba, 6 tim, lamaran, notifikasi)
├─ services/    fungsi async pembungkus data — satu-satunya jalur akses data
├─ context/     state global (Auth, Store, Notification)
├─ components/  ui/ (reusable) · layout/ · space/ (starfield) · domain/
├─ features/    alur multi-langkah: create-team, checkout, peer-review
├─ pages/       satu file per rute
└─ lib/         format tanggal/rupiah, bobot poin, aturan skor reliabilitas
```

### Mengganti mock data dengan API

Semua komponen hanya memanggil `src/services/*`. Untuk integrasi backend, ganti isi tiap fungsi
di sana dengan `fetch` — tanda tangan fungsi (`getCompetitions()`, `applyToTeam()`, …) tidak perlu
berubah, sehingga komponen tidak tersentuh.

## Layar intro

Rute `/` adalah layar intro satu halaman penuh: komet kecil jatuh melintas, lalu busur cahaya
tergambar mengikuti lintasannya, headline naik bertahap, dan hanya ada satu tombol **Let's Go**.
Menekannya memicu animasi keluar (komet melesat + kilat cahaya) lalu mengarahkan ke `/dashboard`.
Materi presentasi (masalah + 3 keunggulan) ada di bawah layar intro, bisa dicapai dengan menggulir.

Seluruh animasi intro mati total saat `prefers-reduced-motion: reduce`: busur langsung tampil utuh
dan tombol langsung berpindah halaman.

## Alur demo lengkap

Gunakan **ganti persona** di dropdown avatar untuk berpindah antara pelamar dan kapten.

1. `/lomba` → buka detail lomba → **Daftarkan Tim**
2. Wizard 3 langkah: pilih lomba → nama tim & undang anggota → tandai slot kosong
   (lomba berbayar lanjut ke checkout mock: QRIS / Virtual Account / e-wallet)
3. Slot kosong otomatis tayang di `/cari-tim`
4. Ganti persona ke mahasiswa lain → **Lamar** → status berubah jadi "Lamaran terkirim"
5. Kembali ke persona kapten → `/tim` → **Lamaran masuk** → Terima (slot berkurang, anggota masuk)
6. `/penyelenggara` → tab **Input hasil** → pilih juara → lomba ditutup
7. `/tim` → **Beri Peer Review** (3 pertanyaan skala 1–5 per rekan, tanpa komentar bebas)
8. `/leaderboard` → poin keaktifan + kemenangan bertambah, baris sendiri disorot

## Catatan

- Tanggal acuan prototipe: **28 September 2026** (`TODAY` di `src/lib/format.ts`).
- Seluruh animasi (starfield, komet, transisi) dimatikan saat `prefers-reduced-motion: reduce`.
- Pembayaran dan harga Featured Listing hanya tampilan; tidak ada transaksi sungguhan.
# competition-at
