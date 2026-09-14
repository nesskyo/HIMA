# Roadmap & Checklist Pengerjaan Website HIMA STIE 66 Kendari
> Berdasarkan [PRD.md](file:///c:/Users/MY%20VICTUS/Desktop/PROJECT/HIMA/PRD.md) dan [desain.md](file:///c:/Users/MY%20VICTUS/Desktop/PROJECT/HIMA/desain.md)

---

## 📌 Ringkasan Proyek
- **Klien**: HIMA STIE 66 Kendari (Sekolah Tinggi Ilmu Ekonomi Enam Enam Kendari)
- **Tech Stack**: Next.js (App Router) + TypeScript, Tailwind CSS + shadcn/ui, Supabase (PostgreSQL, Auth, Storage), Tiptap Rich Text Editor
- **Palet Warna**: Yellow STIE 66 (`#FACC15`), Lime Green (`#84CC16`), Neutral Dark (`#1F2937`), Light Gray (`#FAFAFA`)
- **Tipografi**: Heading (Poppins / Montserrat), Body/UI (Inter / Plus Jakarta Sans)
- **Arsitektur**: Dual Route Groups `(public)` & `(admin)` dengan Middleware Auth RLS

---

## 📋 Fase 0: Inisialisasi & Konfigurasi Fondasi Proyek
Persiapan lingkungan kerja, struktur folder, dependency, dan konfigurasi awal.

- [x] **0.1 Setup Next.js Project**
  - [x] Inisialisasi Next.js dengan App Router, TypeScript, ESLint, dan Tailwind CSS
  - [x] Konfigurasi path aliases (`@/*`) di `tsconfig.json`
  - [x] Setup struktur folder: `src/app/(public)`, `src/app/(admin)`, `src/components`, `src/lib`, `src/types`, `src/hooks`
- [x] **0.2 Konfigurasi Design System & Tokens (desain.md §2 & §3)**
  - [x] Konfigurasi warna kustom di `globals.css` / Tailwind:
    - `brand-yellow`: `#FACC15` (hover: `#EAB308`)
    - `brand-lime`: `#84CC16` (hover: `#65A30D`)
    - `dark-text`: `#1F2937`
    - `muted-text`: `#6B7280`
    - `light-bg`: `#FAFAFA`
  - [x] Setup Google Fonts (`next/font`): **Poppins** (Heading) & **Inter** (Body/UI)
  - [x] Setup utility styling untuk glassmorphism, ornamen geometris, dan hover effects
- [x] **0.3 Integrasi shadcn/ui & Komponen Dasar (desain.md §4 & §6)**
  - [x] Inisialisasi `shadcn/ui` (style: default, base color: neutral/slate)
  - [x] Install komponen dasar yang dibutuhkan:
    - Button, Input, Textarea, Card, Table, Dialog/Modal
    - Dropdown Menu, Select, Badge, Skeleton, Tabs, Toast (Sonner)
  - [x] Kustomisasi varian Button sesuai desain:
    - Primary: Lime Green (`#84CC16`) dengan teks putih
    - Secondary: Yellow (`#FACC15`) dengan teks gelap
    - Outline/Ghost dengan aksen border lime/kuning
  - [x] Setup Lucide Icons (`lucide-react`)
- [x] **0.4 Konfigurasi Klien Supabase**
  - [x] Install `@supabase/supabase-js` dan `@supabase/ssr`
  - [x] Setup file client: `src/lib/supabase/client.ts` (browser client), `src/lib/supabase/server.ts` (server client), dan `middleware.ts`

---

## 🗄️ Fase 1: Desain Database & Konfigurasi Supabase
Implementasi skema PostgreSQL, autentikasi, RLS (Row Level Security), dan Storage Buckets.

- [x] **1.1 Pembuatan Skema Tabel Database (PRD.md §11 & database.md §1)**
  - [x] Tabel `admin_user` (`id`, `nama`, `email`, `role['super_admin'|'editor']`, `created_at`)
  - [x] Tabel `kabinet` (`id`, `nama`, `tahun_mulai`, `tahun_selesai`, `is_active`, `deskripsi`, `logo_url`)
  - [x] Tabel `org_member` (`id`, `kabinet_id`, `nama`, `jabatan`, `badan`, `foto_url`, `urutan`, `kontak_sosmed`)
  - [x] Tabel `news_post` (`id`, `judul`, `slug`, `konten`, `ringkasan`, `cover_url`, `kategori`, `status['draft'|'published']`, `published_at`, `author_id`)
  - [x] Tabel `event` (`id`, `judul`, `slug`, `deskripsi`, `tanggal_mulai`, `tanggal_selesai`, `lokasi_atau_link`, `cover_url`, `link_pendaftaran`, `status['upcoming'|'past']`)
  - [x] Tabel `community` (`id`, `nama`, `slug`, `deskripsi`, `logo_url`, `kontak`, `urutan`)
  - [x] Tabel `recruitment_post` (`id`, `judul`, `deskripsi`, `tanggal_buka`, `tanggal_tutup`, `link_form`, `status['open'|'closed']`)
  - [x] Tabel `gallery_album` (`id`, `judul`, `deskripsi`, `cover_url`, `event_id` nullable, `created_at`)
  - [x] Tabel `gallery_item` (`id`, `album_id`, `url`, `tipe['foto'|'video']`, `caption`, `urutan`)
  - [x] Tabel `site_settings` (`id`, `key` unique, `value` jsonb/text) untuk kontak, sosmed, hero data, dan quick links
- [x] **1.2 Setup Storage Buckets (PRD.md §10 & §11 & database.md §4)**
  - [x] Bucket `foto-panitia` (public read)
  - [x] Bucket `cover-berita` (public read)
  - [x] Bucket `cover-event` (public read)
  - [x] Bucket `galeri` (public read)
  - [x] Bucket `komunitas` & `site-assets` (public read)
- [x] **1.3 Kebijakan Keamanan (Row Level Security - RLS) (PRD.md §7 & database.md §3)**
  - [x] Aktifkan RLS pada seluruh tabel
  - [x] Policy Public: `SELECT` hanya untuk data berstatus `published` atau data umum (kabinet aktif, event, galeri, settings)
  - [x] Policy Admin: `ALL` (INSERT, UPDATE, DELETE) hanya untuk user yang terautentikasi di Supabase Auth dan terdaftar di `admin_user`
  - [x] Role Guard: Hak akses khusus tabel `admin_user` hanya untuk role `super_admin`
- [x] **1.4 Seed Data Awal (PRD.md §15 & database.md §5)**
  - [x] Skrip seed SQL & Data Services layer di `src/lib/services/*`:
    - 1 Akun Super Admin awal (`admin@himastie66.com`)
    - Data Kabinet aktif berjalan (Kabinet Sinergi Progresif) + susunan pengurus lengkap
    - 3 Berita/Blog terbitan awal
    - 3 Event (1 upcoming + 2 past event)
    - 3 Profil Komunitas mahasiswa (ERDC, YEC, GIBEI)
    - Info Open Recruitment aktif
    - Data Galeri kegiatan
    - Data `site_settings` awal (kontak WhatsApp, email, sosmed, quick links)

---

## 🌐 Fase 2: Pengembangan Sisi Publik (`(public)`)
Implementasi antarmuka publik yang responsif, berestetika tinggi (Yellow & Lime Green), cepat (LCP < 2.5s), dan SEO-friendly.

- [x] **2.1 Layout Publik & Navigasi Global (desain.md §5.1)**
  - [x] **Navbar Desktop**: Sticky header dengan efek glassmorphism, logo STIE 66 Kendari, menu navigasi, hover underline kuning, dan CTA Button "Hubungi Kami" (Lime Green)
  - [x] **Navbar Mobile**: Drawer/hamburger menu responsif dengan tema kuning cerah STIE 66
  - [x] **Footer Global**: Logo, deskripsi singkat, kontak, tautan sosial media, quick links (Useful Links), dan copyright dinamis dari `site_settings`
- [x] **2.2 Halaman Beranda / Home (PRD.md §6, desain.md §5.2)**
  - [x] **Hero Section**:
    - Tipografi tebal dengan highlight kata kunci berwarna kuning STIE 66
    - Background foto/kegiatan berkualitas dengan gradien overlay gelap
    - Aksi ganda: Tombol "Lihat Program Kerja" (Lime Green) & "Tentang Kami" (Outline)
    - Ornamen aksen geometris dinamis kuning & lime di latar belakang
  - [x] **Ringkasan Kilas / Highlight Section**:
    - Statistik singkat (jumlah anggota, program kerja terlaksana, komunitas)
    - Banner Open Recruitment aktif (jika status buka)
  - [x] **Preview Berita Terkini**: Grid kartu berita terbaru dengan badge kategori kuning transparan
  - [x] **Preview Event Mendatang**: Kartu event dengan penanda tanggal jelas dan badge status
- [x] **2.3 Halaman Tentang / Profil (`/tentang`) (PRD.md §6 & §9)**
  - [x] Profil Organisasi HIMA STIE 66 Kendari & Sejarah singkat
  - [x] Visi & Misi organisasi dengan layout kartu beraksen
  - [x] Nilai-nilai organisasi (core values)
- [x] **2.4 Halaman Struktur Organisasi (`/struktur`) (PRD.md §6, desain.md §5.3)**
  - [x] Tampilan Kabinet Aktif (nama kabinet, filosofi, logo, periode tahun)
  - [x] Dropdown/Filter arsip kabinet periode terdahulu (Should Have)
  - [x] Pengelompokan per badan/divisi (BPH, Divisi Humas, Divisi Akademik, dll)
  - [x] Kartu Anggota: Foto profil rapi, nama font Poppins bold, jabatan aksen Lime Green, dan tautan sosmed
- [x] **2.5 Halaman Berita & Artikel (`/berita` & `/berita/[slug]`) (PRD.md §6)**
  - [x] **Katalog Berita**: Daftar berita dengan pagination/infinite scroll, filter kategori, kartu berita dengan hover effect
  - [x] **Detail Berita**:
    - Header judul, tanggal rilis, nama author, kategori badge
    - Cover image responsive (`next/image`)
    - Area baca artikel (styling tipografi ramah pembaca)
    - Rekomendasi berita terkait & tombol bagikan (Share to WhatsApp, Twitter, Copy Link)
- [x] **2.6 Halaman Event & Kegiatan (`/event` & `/event/[slug]`) (PRD.md §6)**
  - [x] Tab pemisah: **Event Mendatang (Upcoming)** vs **Arsip Event (Past)**
  - [x] Kartu Event: Cover, badge tanggal, lokasi/link online, status badge (Lime Green = Upcoming, Gray = Past)
  - [x] Halaman Detail Event: Jadwal lengkap, detail pembicara/pemateri, lokasi maps/tautan meeting, tombol pendaftaran eksternal/internal
- [x] **2.7 Halaman Komunitas (`/komunitas` & `/komunitas/[slug]`) (PRD.md §6)**
  - [x] Daftar komunitas minat/bakat di bawah naungan HIMA STIE 66
  - [x] Profil komunitas: logo, deskripsi kegiatan, jadwal kumpul, dan kontak narahubung
- [x] **2.8 Halaman Open Recruitment (`/oprec`) (PRD.md §6, desain.md §5.4)**
  - [x] Hero banner mencolok bertema Yellow STIE 66
  - [x] Komponen Countdown / Status aktif pendaftaran
  - [x] Timeline tahapan seleksi (alur vertikal dengan dot indicator warna Lime Green)
  - [x] Syarat & Ketentuan pendaftaran
  - [x] Tombol CTA utama pendaftaran (link ke Google Form atau form pendaftaran)
- [x] **2.9 Halaman Galeri Kegiatan (`/galeri`) (PRD.md §6)**
  - [x] Grid album dokumentasi kegiatan mahasiswa
  - [x] Modal/Lightbox viewer untuk preview foto beresolusi tinggi & embed video kegiatan
- [x] **2.10 Halaman Kontak (`/kontak`) (PRD.md §6)**
  - [x] Informasi alamat sekretariat kampus STIE 66 Kendari
  - [x] Quick click to WhatsApp, Email resmi, dan akun media sosial
  - [x] Embed Google Maps lokasi kampus

---

## 🔒 Fase 3: Sistem Autentikasi & Proteksi Sisi Admin (`(admin)`)
Implementasi alur login aman untuk staf pengurus/admin tanpa registrasi publik.

- [x] **3.1 Halaman Login Admin (`/admin/login`) (PRD.md §12)**
  - [x] Form email dan password berbasis Supabase Auth
  - [x] Validasi form (Zod + Server Actions)
  - [x] Fitur "Lupa Password" / Reset Password via email (`/admin/forgot-password`)
  - [x] Handling error yang informatif dan state loading yang elegan
- [x] **3.2 Middleware Proteksi Rute Admin (`src/middleware.ts`) (PRD.md §8)**
  - [x] Intersepsi semua rute di bawah `/admin/*`
  - [x] Verifikasi token sesi pengguna melalui Supabase SSR
  - [x] Pengecekan tabel `admin_user` untuk validasi status akun aktif & role
  - [x] Redirect otomatis ke `/admin/login` jika belum login, dan redirect ke `/admin/dashboard` jika sudah login
- [x] **3.3 Layout Dashboard Admin (desain.md §6)**
  - [x] Sidebar navigasi (Dark clean slate mode) dengan highlight menu aktif warna Lime Green
  - [x] Header admin: Profil pengurus yang login, badge role (Super Admin / Editor), tombol Logout
  - [x] Breadcrumbs navigasi per modul

---

## 📊 Fase 4: Modul CMS Admin Panel (`/admin`)
Implementasi fungsionalitas CRUD lengkap yang dirancang intuitif untuk pengurus non-teknis.

- [x] **4.1 Dashboard Utama (`/admin/dashboard`) (PRD.md §12)**
  - [x] Ringkasan statistik (Stat Cards): Total Berita, Event Aktif, Total Anggota Kabinet, Status Oprec
  - [x] Quick Action: Tombol cepat "Tulis Berita", "Tambah Event", "Update Struktur"
  - [x] Daftar aktivitas terbaru atau artikel draft
- [x] **4.2 Modul Kelola Struktur Organisasi & Kabinet (`/admin/struktur`)**
  - [x] Manajemen Kabinet: Tambah/Edit periode kabinet, toggle status "Kabinet Aktif"
  - [x] Manajemen Anggota:
    - Form Input: Nama, Jabatan, Badan/Divisi (bebas teks / dropdown custom), nomor urut
    - Komponen upload foto panitia langsung ke bucket Supabase `foto-panitia` dengan image preview & crop ratio 1:1 / 3:4
    - Tabel anggota dengan re-ordering / filter per divisi & per kabinet
- [x] **4.3 Modul Kelola Berita (`/admin/berita`)**
  - [x] Tabel list berita: pencarian judul, filter status (Draft/Published), filter kategori
  - [x] Form Tulis / Edit Berita:
    - Input Judul & Auto-generate URL slug ramah SEO
    - Integrasi Rich Text Editor & formatting bar
    - Kategori berita & ringkasan (excerpt)
    - Upload cover image ke bucket `cover-berita`
    - Switch toggle Draft / Published dan pemilih tanggal publikasi
- [x] **4.4 Modul Kelola Event (`/admin/event`)**
  - [x] Tabel event dengan status Upcoming / Past
  - [x] Form Event: Judul, slug, deskripsi, tanggal & jam mulai/selesai, lokasi (online link/offline), link pendaftaran, upload banner event
- [x] **4.5 Modul Kelola Komunitas (`/admin/komunitas`)**
  - [x] Tabel data komunitas binaan
  - [x] Form: Nama komunitas, deskripsi, upload logo, narahubung/kontak WA
- [x] **4.6 Modul Kelola Open Recruitment (`/admin/oprec`)**
  - [x] Form pengaturan Oprec: Judul oprec, deskripsi, tanggal buka & tutup, status aktif/tutup
  - [x] Input link form pendaftaran eksternal (Google Forms / Typeform)
  - [x] Pengaturan tahapan timeline pendaftaran
- [x] **4.7 Modul Kelola Galeri (`/admin/galeri`)**
  - [x] Buat & kelola album kegiatan (opsional relasi ke event tertentu)
  - [x] Multi-upload foto kegiatan ke bucket `galeri`
  - [x] Input URL video (YouTube embed / direct video link)
  - [x] Kelola caption dan urutan foto dalam album
- [x] **4.8 Modul Pengaturan Situs (`/admin/pengaturan`) (PRD.md §6 & §11)**
  - [x] Kelola data kontak resmi: Nomor WhatsApp, Email, Alamat Sekretariat Kampus
  - [x] Kelola link media sosial: Instagram, TikTok, YouTube, LinkedIn
  - [x] Kelola teks & highlight banner Hero beranda tanpa perlu redeploy kode
  - [x] Kelola daftar Quick Links di footer
- [x] **4.9 Modul Manajemen Akun Admin (`/admin/pengguna`) (Khusus Super Admin)**
  - [x] Hanya bisa diakses oleh user dengan role `super_admin`
  - [x] Tambah akun pengurus baru (mengirim undangan / setup akun Supabase Auth)
  - [x] Atur role pengguna (`super_admin` vs `editor`)
  - [x] Hapus / nonaktifkan akses pengurus yang telah demisioner

---

## ⚡ Fase 5: Media Handling, Rich Text & Optimasi Performa
Menjamin upload berkas berjalan lancar, gambar terkompresi, dan halaman memuat cepat.

- [ ] **5.1 Komponen Reusable Media Uploader**
  - [ ] Drag-and-drop file uploader dengan validasi tipe berkas (JPEG, PNG, WebP) dan batas ukuran (maks. 2MB)
  - [ ] Kompresi gambar sisi klien sebelum upload (menghemat kuota Supabase Storage)
  - [ ] Preview gambar sebelum dan sesudah upload dengan tombol hapus/ganti
- [ ] **5.2 Setup Tiptap Rich Text Editor**
  - [ ] Custom toolbar (Heading, Bold, Italic, Bullet List, Ordered List, Blockquote, Link, Code)
  - [ ] Fitur sisip gambar langsung ke dalam artikel (otomatis upload ke bucket Supabase)
  - [ ] Sanitasi HTML keluaran editor untuk mencegah celah XSS
- [ ] **5.3 Optimasi Performa & Core Web Vitals (Target: LCP < 2.5s)**
  - [ ] Terapkan Next.js `<Image />` dengan atribut `sizes`, format modern (WebP/AVIF), dan `priority` pada banner Hero
  - [ ] Implementasi ISR (Incremental Static Regeneration) / Cache Revalidation pada halaman publik (`/berita`, `/event`, `/struktur`)
  - [ ] Lazy loading untuk komponen modal galeri dan Tiptap editor

---

## 🛡️ Fase 6: SEO, Open Graph & Keamanan
Memastikan link website dapat dibagikan dengan rapi di grup WhatsApp / Instagram dan sistem aman.

- [ ] **6.1 Metadata Dinamis & Open Graph (PRD.md §7)**
  - [ ] Konfigurasi default metadata di `layout.tsx` (Title template: `%s | HIMA STIE 66 Kendari`, description, favicon)
  - [ ] Dynamic Open Graph tags pada halaman detail berita (`/berita/[slug]`) dan event (`/event/[slug]`):
    - Judul berita sebagai `og:title`
    - Ringkasan sebagai `og:description`
    - Cover artikel sebagai `og:image` (gambar preview saat dibagikan ke WhatsApp)
- [ ] **6.2 Sitemap & Robots**
  - [ ] Buat `src/app/sitemap.ts` untuk generate otomatis daftar URL halaman publik
  - [ ] Buat `src/app/robots.ts` (mengizinkan crawler untuk rute publik dan melarang indeks untuk rute `/admin/*`)
- [ ] **6.3 Pengerasan Keamanan (Security Hardening)**
  - [ ] Verifikasi bahwa API routes dan Server Actions memvalidasi sesi admin
  - [ ] Proteksi CSRF & validasi skema input (Zod)
  - [ ] Pastikan tidak ada environment variable privat (`SUPABASE_SERVICE_ROLE_KEY`) yang bocor ke browser bundle

---

## 🧪 Fase 7: Pengujian (QA), UAT & Panduan Serah Terima
Tahap akhir sebelum peluncuran resmi dan pelatihan untuk pengurus HIMA.

- [ ] **7.1 Pengujian Lintas Perangkat & Browser (Responsive QA)**
  - [ ] Pengujian tampilan di mobile screen (iPhone, Android viewport) — rujukan utama trafik dari bio Instagram
  - [ ] Pengujian desktop & tablet (Chrome, Firefox, Safari, Edge)
  - [ ] Audit Google Lighthouse (Target skor: Mobile Performance ≥ 90, SEO = 100, Accessibility ≥ 90)
- [ ] **7.2 Pengujian Alur Admin (CMS Usability Test)**
  - [ ] Simulasi skenario 1: Pengurus non-teknis mempublikasikan berita baru (< 5 menit)
  - [ ] Simulasi skenario 2: Pengurus memperbarui susunan kabinet & anggota baru (< 30 menit)
  - [ ] Simulasi skenario 3: Mengubah status Oprec dan kontak WhatsApp via panel pengaturan
- [ ] **7.3 Dokumentasi & Handover (PRD.md §17 & §18)**
  - [ ] Panduan Penggunaan CMS untuk Admin Humas/Medinfo (Panduan ringkas PDF / Markdown dengan screenshot)
  - [ ] Dokumentasi Teknis Serah Terima (Environment variables, akun Supabase, akun hosting Vercel, hak akses repo)
