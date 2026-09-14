# Dokumen Desain (Design System & UI/UX Guidelines)
## Website HIMA STIE 66 Kendari — Web Publik + Admin Panel

| | |
|---|---|
| **Status** | Final Draft v1.0 |
| **Klien** | HIMA STIE 66 Kendari |
| **Referensi Dokumen** | PRD.md |
| **Tema Utama** | STIE 66 Kendari (Kuning & Lime Green) |

---

## 1. Filosofi & Arah Visual

Desain website HIMA STIE 66 Kendari harus mencerminkan semangat mahasiswa yang **enerjik, modern, profesional, dan inovatif**, sekaligus mempertahankan identitas kampus. 

Kombinasi warna **Kuning (Yellow)** dan **Hijau Jeruk Nipis (Lime Green)** akan digunakan untuk menciptakan antarmuka yang segar (fresh) dan mengundang (inviting), tanpa mengorbankan keterbacaan (readability) dan kredibilitas sebagai organisasi akademis.

*   **Sisi Publik:** Akan terasa sangat "branded" dengan aksen kuning dan lime green yang menonjol pada elemen interaktif, dekorasi background, dan hero section.
*   **Sisi Admin:** Akan jauh lebih bersih (clean) dan fungsional (minimalist), menggunakan warna aksen kuning/lime green hanya untuk tombol aksi utama (Call to Action) atau indikator status.

---

## 2. Palet Warna (Color Palette)

Palet warna didesain agar kompatibel dengan sistem utility class seperti Tailwind CSS.

### 2.1. Warna Utama (Brand Colors)
*   **Yellow STIE 66 (Primary Brand Color)**
    *   **Hex:** `#FACC15` (Setara Tailwind `yellow-400`)
    *   **Fungsi:** Aksen utama, latar belakang hero section (kombinasi gradien), highlight teks penting, dan elemen dekoratif. Memberikan kesan optimis dan intelektual.
    *   **Variasi Hover:** `#EAB308` (`yellow-500`)
*   **Lime Green (Secondary / Action Color)**
    *   **Hex:** `#84CC16` (Setara Tailwind `lime-500`)
    *   **Fungsi:** Tombol Call to Action (CTA) utama (misal: "Daftar Oprec", "Baca Selengkapnya"), badge/label status aktif, dan elemen interaktif lainnya. Memberikan kesan pertumbuhan (growth) dan kesegaran.
    *   **Variasi Hover:** `#65A30D` (`lime-600`)

### 2.2. Warna Netral (Typography & Background)
*   **Background Utama (Light):** `#FAFAFA` (Abu-abu sangat terang, hampir putih) atau `#FFFFFF` (Putih murni). Memastikan warna kuning dan lime green terlihat kontras dan pop-out.
*   **Teks Utama (Dark):** `#1F2937` (`gray-800`) untuk heading dan teks body utama. Jangan gunakan hitam murni (`#000000`) agar tidak terlalu harsh di mata.
*   **Teks Sekunder (Muted):** `#6B7280` (`gray-500`) untuk meta data, tanggal event, caption galeri.
*   **Border & Divider:** `#E5E7EB` (`gray-200`) untuk pemisah bagian dan border kartu.

---

## 3. Tipografi (Typography)

Untuk memberikan kesan modern namun tetap rapi sebagai representasi program studi ekonomi:

*   **Font Heading (H1, H2, H3):** **Poppins** atau **Montserrat**
    *   Karakteristik: Geometris, modern, tebal, dan sangat cocok disandingkan dengan warna cerah seperti kuning.
    *   Penggunaan: Judul halaman, judul berita, nama kabinet.
    *   Style: *Bold* (700) atau *SemiBold* (600).
*   **Font Body & UI (Paragraf, Navigasi, Tombol):** **Inter** atau **Plus Jakarta Sans**
    *   Karakteristik: Bersih, sangat mudah dibaca di layar HP (karena trafik utama dari bio Instagram), profesional.
    *   Penggunaan: Isi artikel, deskripsi event, form pendaftaran, tabel admin.
    *   Style: *Regular* (400) dan *Medium* (500).

---

## 4. Panduan Komponen UI (UI Components)

### 4.1. Tombol (Buttons)
*   **Primary Button:** Background **Lime Green** (`#84CC16`), teks Putih. Sudut agak melengkung (`rounded-lg` atau `rounded-full`). Digunakan untuk aksi utama (Submit, Pendaftaran Oprec).
*   **Secondary Button:** Background **Yellow** (`#FACC15`), teks Gelap (`#1F2937`). Digunakan untuk tombol "Selengkapnya" atau arsip event.
*   **Outline/Ghost Button:** Tanpa background, border warna Lime Green/Yellow, teks menyesuaikan. Digunakan untuk filter berita atau navigasi kategori.

### 4.2. Kartu (Cards - Berita, Event, Anggota)
*   **Base:** Background putih murni (`#FFFFFF`), sudut melengkung (`rounded-xl`), bayangan lembut (`shadow-sm` atau `shadow-md`).
*   **Hover Effect:** Saat di-hover (desktop), kartu sedikit terangkat (translate-y) dengan bayangan yang lebih besar, dan muncul aksen garis **Lime Green** di bagian bawah atau atas kartu.
*   **Image Cover:** Menutupi area atas kartu penuh (cover object-fit).

### 4.3. Label & Badge
*   **Badge Kategori Berita:** Background Kuning transparan (Kuning dengan opacity 20%) dan teks kuning tua.
*   **Badge Status Event:** 
    *   *Upcoming:* Lime Green (Background hijau terang, teks putih).
    *   *Past:* Abu-abu (Background gray-200, teks gray-600).

---

## 5. Implementasi Layout Sisi Publik

### 5.1. Header & Navigasi
*   **Desktop:** Sticky header transparan yang berubah menjadi putih (glassmorphism) saat di-scroll. Logo HIMA STIE 66 di kiri, link navigasi di tengah (teks hitam, hover garis bawah kuning), tombol "Hubungi Kami" berwarna Lime Green di kanan.
*   **Mobile:** Hamburger menu. Saat dibuka, menu full-screen dengan warna background Kuning cerah khas STIE 66, list navigasi berukuran besar.

### 5.2. Hero Section (Beranda)
*   Visual yang kuat: Foto asli mahasiswa HIMA STIE 66 (berkualitas tinggi) dengan overlay gradasi hitam-transparan agar teks terbaca.
*   Headline tebal berwarna putih dengan highlight/aksen **Kuning** pada kata-kata kunci (misal: "Penggerak *Ekonomi* Mahasiswa").
*   Terdapat dua CTA: "Lihat Program Kerja" (Lime Green) dan "Tentang Kami" (Outline putih).
*   *Ornamen dekoratif:* Bentuk geometris abstrak (lingkaran/garis bergelombang) berwarna kuning dan lime green di sudut layar untuk menambah kesan dinamis.

### 5.3. Struktur Organisasi
*   Layout berbentuk grid (kartu profil anggota).
*   Header section menggunakan aksen garis Kuning tebal di sebelah kiri judul.
*   Kartu anggota: Foto jelas, nama dengan font Poppins (bold), jabatan dicetak dengan warna Lime Green agar terlihat menonjol.

### 5.4. Open Recruitment (Oprec)
*   Desain dibuat sangat mencolok (stand-out). Background section bisa menggunakan warna Kuning full (`#FACC15`) untuk menarik perhatian.
*   Informasi timeline dibuat vertikal dengan indikator titik berwarna Lime Green.
*   Tombol pendaftaran besar dan mengundang.

---

## 6. Implementasi Layout Sisi Admin (CMS)

*Prinsip: Function over Form.* 
Desain untuk sisi admin tidak boleh terlalu mencolok hingga mengganggu fokus kerja pengurus Humas/Medinfo yang sedang input data.

*   **Framework UI:** Berbasis *shadcn/ui* (warna default slate/zinc).
*   **Sidebar Navigasi:** Warna gelap (Dark mode) atau putih bersih dengan highlight menu yang sedang aktif berupa background tipis berwarna Lime Green.
*   **Tabel Data:** Bersih, garis tipis. Aksi "Edit" menggunakan warna Kuning (warning/edit), "Delete" menggunakan warna Merah, dan "Tambah Data Baru" menggunakan tombol solid Lime Green.
*   **Form Input:** Fokus pada aksesibilitas. Border input jelas, teks placeholder informatif, dan validasi error berwarna merah jelas.
*   **Dashboard:** Menampilkan metrik sederhana dengan kartu statistik. Ikon pada metrik bisa diberi warna brand (Kuning/Lime Green).

---

## 7. Aset & Media (Fotografi & Grafis)

Sesuai catatan di PRD, situs ini *menghindari* penggunaan stok foto generik.
*   **Style Foto:** Candid, menampilkan mahasiswa aktif, rapat kepengurusan, atau suasana acara STIE 66.
*   **Treatment Gambar:** Setiap cover image yang diunggah ke CMS (Berita/Event) akan otomatis diberi border radius melengkung di sisi publik untuk menjaga konsistensi desain modern.
*   **Ikonografi:** Gunakan ikon bersudut halus (misal: *Lucide Icons* atau *Heroicons*) dengan stroke medium (tidak terlalu tipis, tidak terlalu tebal).
