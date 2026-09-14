# Product Requirements Document (PRD)
## Website HIMA STIE 66 Kendari — Web Publik + Admin Panel

| | |
|---|---|
| **Status** | Draft v0.2 |
| **Klien** | HIMA STIE 66 Kendari |
| **Disusun oleh** | [Nama Kamu] |
| **Tanggal** | 15 September 2026 |
| **Referensi struktur** | himaiftelkom.com (referensi arsitektur informasi, bukan desain visual) |

### Changelog
**v0.1 → v0.2** — Perubahan besar: dari "situs showcase komunitas" generik menjadi produk yang akan dijual ke client — website HIMA kampus lengkap dengan admin panel agar client bisa kelola sendiri kontennya. Menambahkan: kebutuhan database (Supabase), arsitektur public + admin, model data, kebutuhan panel admin, dan checklist traceability fitur dari situs referensi. Fitur Lab Riset, IFTAR, dan Shop dikeluarkan dari scope sesuai instruksi client.

**v0.2 → v0.3** — Nama client dikonfirmasi: **HIMA STIE 66 Kendari** (Sekolah Tinggi Ilmu Ekonomi Enam Enam Kendari, Sulawesi Tenggara). Dikonfirmasi juga: fitur login/signup di web publik dihapus total, bukan lagi sekadar "diadaptasi" — hanya ada satu login di seluruh sistem, yaitu login Admin di `/admin`.

---

## 1. Ringkasan

HIMA STIE 66 Kendari butuh website dengan dua sisi:

1. **Sisi publik** — profil organisasi, susunan panitia/kepengurusan, berita, event, komunitas, open recruitment, dan galeri kegiatan. Ini yang dilihat mahasiswa, calon anggota, dosen, dan pihak luar.
2. **Sisi admin (CMS)** — panel privat tempat pengurus (biasanya divisi Humas/Media Informasi) meng-update semua konten di atas sendiri, tanpa harus minta bantuan developer tiap kali ada berita baru, event baru, atau — yang paling sering terjadi di organisasi mahasiswa — **pergantian kepengurusan (kabinet) setiap tahun.**

Poin penting: ini bukan proyek sekali pakai untuk satu organisasi. Karena akan dijual ke client, kode dan arsitekturnya perlu cukup rapi supaya **bisa dipakai ulang** untuk client HIMA lain di kampus berbeda — bukan cuma jalan untuk klien pertama saja. Lihat Bagian 16 untuk pertanyaan yang menentukan seberapa jauh reusability ini perlu didesain dari awal.

## 2. Latar Belakang & Masalah

Organisasi mahasiswa seperti HIMA punya pola khas: kepengurusan berganti tiap tahun (di situs referensi, misalnya, kabinet saat ini bernama "Kabinet Signa"), dan setiap pergantian itu berarti struktur organisasi, program kerja, dan kontak berubah total. Kalau website-nya statis atau kontennya tersebar di Instagram/WhatsApp:

- Struktur organisasi lama tetap terpampang meski sudah tidak berlaku
- Berita dan info event menumpuk di media yang sifatnya sementara (story hilang 24 jam)
- Kabinet baru bergantung penuh pada satu orang yang bisa coding untuk update apa pun — begitu orang itu lulus/sibuk, situsnya berhenti terurus

Solusinya: admin panel yang cukup sederhana sampai siapa pun di divisi Humas — tanpa bisa coding — bisa update struktur panitia, posting berita, tambah event, dan upload galeri sendiri.

## 3. Tujuan & Metrik Keberhasilan

| Tujuan | Metrik | Target (contoh, sesuaikan) |
|---|---|---|
| Admin non-teknis bisa publish konten sendiri | Waktu untuk publish 1 berita baru tanpa bantuan developer | < 5 menit |
| Pergantian kabinet tidak butuh developer | Waktu update susunan panitia periode baru | < 30 menit |
| Info open recruitment mudah ditemukan | Jumlah klik dari beranda ke halaman Open Recruitment | ≤ 3 klik |
| Situs cepat di HP (traffic utama dari bio Instagram) | LCP mobile / skor Lighthouse mobile | < 2.5 detik / ≥ 90 |
| Situs jadi rujukan, bukan sekadar pajangan | Traffic direct/search vs. dari sosial media | ≥ 30% direct/search dalam 3 bulan |

## 4. Target Pengguna

| Persona | Siapa | Butuh apa |
|---|---|---|
| Pengunjung umum / calon anggota | Mahasiswa yang belum terlibat | Info jelas: HIMA ini apa, ada event apa, cara gabung |
| Anggota aktif | Sudah terlibat di HIMA | Jadwal event terbaru, arsip dokumentasi kegiatan |
| Pihak eksternal (dosen, sponsor, kampus lain) | Mengevaluasi kredibilitas organisasi | Bukti aktivitas & struktur organisasi yang jelas |
| Admin/Panitia (Humas/Medinfo) | Non-teknis, ganti orang tiap tahun | Cara update konten yang benar-benar sederhana, tanpa perlu paham kode |
| Super Admin | Ketua/PJ IT organisasi (atau kamu sebagai developer di awal) | Kelola akun admin lain, akses penuh semua modul |

## 5. Ruang Lingkup (MoSCoW)

**Must have (MVP)**
- Beranda, Tentang/Profil
- Struktur Organisasi (susunan panitia, per kabinet/periode)
- Berita/Blog
- Event + arsip event
- Komunitas
- Open Recruitment
- Galeri kegiatan (foto & video)
- Kontak & tautan sosial media
- Admin panel: login + CRUD semua modul di atas

**Should have (fast-follow)**
- Arsip struktur organisasi periode lama (bukan ditimpa saat ganti kabinet)
- Kategori/tag untuk Berita
- Dua role admin: Super Admin vs Editor
- Status draft/published untuk tiap konten (preview sebelum tayang)

**Could have (nanti, kalau ada demand)**
- Newsletter / broadcast WA opt-in
- Pencarian & filter di arsip berita/event
- Activity log (siapa mengubah apa, kapan)

**Won't have (di luar scope v1 — sesuai instruksi)**
- **Lab Riset** — dikeluarkan
- **IFTAR** (materi kuliah async) — dikeluarkan
- **Shop/e-commerce** — dikeluarkan
- Akun/login untuk pengunjung publik — hanya admin yang login; publik tidak perlu daftar akun (lihat Bagian 14 soal fitur Login di situs referensi)

## 6. Kebutuhan Fitur

| Fitur | Sisi Publik | Sisi Admin |
|---|---|---|
| Beranda | Hero + berita/event terbaru | Atur konten hero via Pengaturan Situs |
| Tentang/Profil | Deskripsi organisasi, sejarah | Edit teks & gambar profil |
| Struktur Organisasi | Daftar panitia per badan (mis. BPH, BPM), foto + jabatan | CRUD anggota, kelola per periode kabinet |
| Berita/Blog | List + halaman detail per berita, kategori | CRUD, editor rich-text, upload cover, draft/publish |
| Event | List upcoming + detail + arsip past event | CRUD, tanggal, lokasi/link, link pendaftaran, cover |
| Komunitas | List profil komunitas di bawah HIMA | CRUD nama, deskripsi, logo, kontak |
| Open Recruitment | Info & timeline oprec, link form pendaftaran | CRUD, atur tanggal buka/tutup |
| Galeri | Album foto & video per event | Upload/hapus item, kelompokkan per album/event |
| Kontak & Sosial Media | WA, email, alamat, ikon sosial media | Edit lewat Pengaturan Situs (key-value, tanpa redeploy) |
| Manajemen Akun Admin | — | Super Admin tambah/hapus akun Editor |

## 7. Kebutuhan Non-Fungsional

- **Performa**: Core Web Vitals baik di mobile, gambar dioptimasi (`next/image`), bukan upload mentah dari kamera HP.
- **Responsif**: mobile-first — traffic utama dari link di bio Instagram.
- **SEO**: meta title/description per halaman, Open Graph untuk preview link saat dibagikan di grup WA, sitemap otomatis.
- **Keamanan**: Row Level Security (RLS) di Supabase — publik hanya bisa baca konten berstatus `published`, hanya admin ter-autentikasi yang bisa tulis. HTTPS default via Vercel.
- **Kepemilikan data**: karena ini dijual ke client, pastikan client tetap pegang akses ke project Supabase & repo kode-nya sendiri (bukan terkunci di akun kamu) — poin penting untuk kontrak dan serah terima.
- **Maintainability**: orang yang update konten setelah launch hampir pasti bukan kamu sebagai developer — admin panel harus benar-benar bisa dipakai orang non-teknis.

## 8. Arsitektur Sistem

```
[Pengunjung publik] → Next.js Public Pages (SSG/ISR) → Supabase (read-only, RLS: published saja)
[Admin/Panitia]      → /admin (Next.js, protected route) → Supabase Auth (login)
                                                          → Supabase DB + Storage (CRUD, hanya jika authenticated)
```

Satu aplikasi Next.js dengan dua route group: `(public)` dan `(admin)`. Rute admin dilindungi middleware yang mengecek sesi Supabase Auth. Backend sepenuhnya di Supabase: Postgres (semua entitas konten), Auth (login admin), Storage (foto struktur organisasi, galeri, cover berita/event).

## 9. Peta Situs

**Publik**
```
Beranda
├── Tentang (Profil, Sejarah)
├── Struktur Organisasi (per periode/kabinet)
├── Berita/[slug]
├── Event/[slug] + Arsip
├── Komunitas/[slug]
├── Open Recruitment
├── Galeri
└── Kontak
```

**Admin (`/admin`)**
```
Login
├── Dashboard (ringkasan konten)
├── Kelola Berita
├── Kelola Event
├── Kelola Struktur Organisasi
├── Kelola Komunitas
├── Kelola Open Recruitment
├── Kelola Galeri
├── Pengaturan Situs (kontak, sosmed, quick links)
└── Kelola Akun Admin (khusus Super Admin)
```

## 10. Kebutuhan Teknis

| Layer | Rekomendasi | Alasan |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | SSG/ISR untuk halaman publik = cepat & murah di-hosting |
| Styling | Tailwind CSS + shadcn/ui | Base komponen form/table yang mempercepat build admin panel |
| Database & Backend | **Supabase** (Postgres) | Sesuai requirement — relasional, cocok untuk data event/berita/struktur organisasi yang saling terhubung |
| Auth | Supabase Auth (email/password) | Bawaan, tidak perlu bangun sistem login sendiri, cukup untuk beberapa akun admin |
| Storage | Supabase Storage | Bucket terpisah: `foto-panitia`, `galeri`, `cover-berita`, `cover-event` |
| Hosting | Vercel (frontend) + Supabase Cloud (backend) | Keduanya managed, tier gratis cukup untuk skala web HIMA kampus |
| Editor konten | Tiptap (rich text) | Berita/event butuh format teks, bukan textarea polos |
| Analytics | Plausible atau GA4 | Supaya bisa lapor performa situs ke client secara berkala |

## 11. Model Data (sketsa, disederhanakan)

```
kabinet          (id, nama, tahun_mulai, tahun_selesai, is_active)
org_member       (id, kabinet_id→kabinet, nama, jabatan, badan['BPH'|'BPM'|...], foto_url, urutan)
news_post        (id, judul, slug, konten, cover_url, kategori, status['draft'|'published'], published_at, author_id→admin_user)
event            (id, judul, slug, deskripsi, tanggal_mulai, tanggal_selesai, lokasi_atau_link, cover_url, link_pendaftaran, status['upcoming'|'past'])
community        (id, nama, slug, deskripsi, logo_url, kontak)
recruitment_post (id, judul, deskripsi, tanggal_buka, tanggal_tutup, link_form, status)
gallery_album    (id, judul, event_id→event nullable)
gallery_item     (id, album_id→gallery_album, url, tipe['foto'|'video'], caption)
site_settings    (id, key, value)   -- kontak, sosmed, quick links: key-value biar fleksibel tanpa migrasi schema
admin_user       (id, nama, email, role['super_admin'|'editor'])
```

`badan` di `org_member` sengaja dibuat bebas teks/enum yang bisa diatur, bukan di-hardcode "BPH/BPM" — tiap kampus punya penyebutan struktur organisasi yang bisa beda, dan ini yang bikin skema-nya reusable untuk client HIMA lain.

## 12. Kebutuhan Panel Admin

- **Login**: form email/password, halaman lupa password (bawaan Supabase Auth).
- **Dashboard**: ringkasan angka — jumlah berita, event mendatang, status open recruitment.
- **Per modul konten** (Berita, Event, Struktur, Komunitas, Oprec, Galeri): halaman List (tabel + pencarian), form Create/Edit, aksi Delete, toggle Draft/Published.
- **Upload gambar**: drag-drop atau file picker dengan preview, langsung ke Supabase Storage.
- **Role**:
  - *Super Admin* — akses penuh + kelola akun admin lain
  - *Editor* — CRUD konten, tidak bisa kelola akun admin
- **Activity log** — nice-to-have, bukan MVP (masuk Should/Could have).

## 13. Arahan Desain

Dua mode desain yang beda tujuannya:
- **Situs publik** harus terasa khas milik HIMA tersebut — satu warna aksen + palet netral, tipografi yang dipilih sengaja, foto asli kegiatan (bukan stok foto), bukan template Elementor generik seperti referensi.
- **Admin panel** sebaliknya: prioritaskan kejelasan & efisiensi, bukan estetika. Pakai pola dashboard standar (tabel, form, sidebar navigasi) — komponen shadcn/ui apa adanya sudah cukup di sini, jangan over-desain bagian yang cuma dilihat 2-3 orang admin.

## 14. Checklist Fitur dari Situs Referensi (Traceability)

| Fitur di himaiftelkom.com | Status di PRD ini | Catatan |
|---|---|---|
| Beranda + blog terkini | ✅ Masuk | Jadi Beranda + Berita |
| About (BPH, BPM) | ✅ Masuk | Jadi Struktur Organisasi, dikelola per kabinet lewat admin |
| Blog | ✅ Masuk | Jadi Berita, dengan kategori |
| IFTAR | ❌ Dikeluarkan | Sesuai instruksi |
| Lab Riset | ❌ Dikeluarkan | Sesuai instruksi |
| Komunitas | ✅ Masuk | |
| Open Recruitment | ✅ Masuk | |
| Shop | ❌ Dikeluarkan | Sesuai instruksi |
| Login/Sign Up (publik) | ❌ Dihapus dari web publik | Di referensi ini akun WordPress untuk publik. **Dikonfirmasi client: tidak dipakai.** Satu-satunya login di sistem ini adalah login Admin di `/admin`, karena kebutuhan sebenarnya adalah client bisa update situs, bukan pengunjung publik bikin akun. |
| Galeri HIMA IF | ✅ Masuk | |
| Kalender HIMA IF | ✅ Masuk | Digabung ke fitur Event (list + tanggal), bukan embed kalender eksternal |
| Profil [Jurusan] (Media Upload/video) | ✅ Masuk | Digabung ke Galeri (dukung foto + video) |
| Connect With Us (sosmed) | ✅ Masuk | Dikelola lewat Pengaturan Situs |
| Useful Website (link footer) | ✅ Masuk | Jadi "Quick Links" di Pengaturan Situs |
| Contact Us | ✅ Masuk | |

## 15. Konten yang Dibutuhkan Sebelum Development

- Data struktur organisasi periode berjalan (nama, jabatan, foto tiap anggota)
- Minimal 3–5 berita/event lama untuk seed data awal (situs kosong saat launch = kurang meyakinkan buat calon klien lain juga)
- Logo & warna brand (kalau sudah ada)
- Kontak resmi: nomor WA, email, alamat, akun sosial media
- Deskripsi tiap komunitas di bawah HIMA (kalau ada)

## 16. Asumsi & Pertanyaan Terbuka

1. **Ini proyek sekali jual untuk satu client, atau template yang mau dijual berulang ke HIMA/BEM kampus lain?** Ini menentukan seberapa jauh perlu didesain reusable (theming/config terpisah per client) dari awal, vs cukup fork kode per client nanti.
2. Siapa yang pegang akun hosting (Vercel) dan project Supabase setelah proyek selesai — kamu atau client? Penting untuk kontrak & serah terima.
3. Cukup 1 role admin, atau memang perlu Super Admin vs Editor dari awal?
4. Struktur organisasi client itu badannya apa saja (BPH, BPM, atau beda istilah)? Referensi pakai BPH+BPM, tapi tiap kampus beda.
5. Struktur organisasi periode lama perlu tetap bisa dilihat publik (arsip historis), atau cukup tampilkan kabinet aktif saja?

## 17. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Admin baru tiap tahun belum pernah pakai sistemnya | Admin panel harus sesederhana mungkin (form biasa); sediakan dokumentasi singkat/video walkthrough saat handover |
| Client lupa cara pakai setelah training awal | Sesi handover + dokumentasi tertulis, bukan cuma demo lisan |
| Supabase/Vercel free tier ada limit bandwidth & storage | Jelaskan ke client kapan perlu upgrade ke paid tier kalau traffic besar |
| Kalau ini jadi template dijual ke banyak client tapi tiap client minta kustomisasi beda | Perlu batasan jelas: apa yang "standar" (included) vs "kustomisasi" (biaya tambahan) — keputusan bisnis, bukan teknis, tapi perlu diputuskan sebelum jual ke client kedua |

## 18. Timeline (indikatif)

| Fase | Durasi | Deliverable |
|---|---|---|
| Discovery (jawab Bagian 16) | Minggu 1 | Scope final, struktur data organisasi client dikonfirmasi |
| Desain | Minggu 2–3 | Wireframe → desain halaman kunci (beranda, detail berita/event, admin dashboard) |
| Setup backend | Minggu 3–4 | Schema Supabase, RLS policy, Auth admin |
| Development | Minggu 4–7 | Situs publik + admin panel, terhubung ke Supabase |
| Konten & QA | Minggu 8 | Seed data awal, testing lintas perangkat |
| Launch & handover | Minggu 9 | Live, training admin, dokumentasi diserahkan |

## 19. Langkah Selanjutnya

1. Jawab pertanyaan di Bagian 16 — terutama soal **single client vs template produk**, itu paling menentukan arah teknisnya.
2. Konfirmasi badan struktur organisasi client (BPH/BPM atau istilah lain).
3. Setelah itu bisa lanjut ke schema SQL Supabase yang sesungguhnya + mulai scaffold project Next.js-nya.
