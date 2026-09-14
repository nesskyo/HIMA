# Dokumentasi Skema Database & Migrasi Supabase
## Website HIMA STIE 66 Kendari — Web Publik + Admin Panel

Dokumen ini berisi seluruh query SQL yang diperlukan untuk membangun database di **Supabase (PostgreSQL)**, termasuk pembuatan tabel, relasi, tipe enum, trigger otomatisasi akun admin, konfigurasi Row Level Security (RLS) untuk database dan penyimpanan (Storage Buckets), serta data seed (awal) agar website memiliki data percontohan saat pertama kali dijalankan.

Anda dapat menyalin seluruh isi query SQL di bawah ini dan menjalankannya langsung di **SQL Editor** pada Dashboard Supabase Anda.

---

## 🛠️ Langkah-Langkah Instalan di Supabase

1. Buka **Dashboard Supabase** dan masuk ke proyek Anda.
2. Navigasikan ke menu **SQL Editor** di sidebar sebelah kiri.
3. Klik tombol **New query**.
4. Salin seluruh isi SQL di Bagian 1, Bagian 2, Bagian 3, dan Bagian 4 di bawah ini, lalu tempel (*paste*) ke dalam SQL Editor.
5. Klik tombol **Run** (atau tekan `Ctrl + Enter` / `Cmd + Enter`).
6. Pastikan pesan sukses muncul tanpa ada error.

---

## 1. Skema Database DDL & Tipe Data Kustom

Query di bawah ini akan membuat tipe kustom (*Enum*) dan tabel-tabel utama yang saling terhubung beserta relasi-relasinya.

```sql
-- =========================================================================
-- 1. ENUM & EXTENSIONS
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Buat tipe data kustom enum
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'editor');
CREATE TYPE public.post_status AS ENUM ('draft', 'published');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'past');
CREATE TYPE public.recruitment_status AS ENUM ('open', 'closed');
CREATE TYPE public.gallery_item_type AS ENUM ('foto', 'video');

-- =========================================================================
-- 2. TABEL UTAMA & RELASI
-- =========================================================================

-- A. Tabel Admin User (Terhubung dengan Supabase Auth Users)
CREATE TABLE public.admin_user (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role public.admin_role NOT NULL DEFAULT 'editor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. Tabel Kabinet
CREATE TABLE public.kabinet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    tahun_mulai INTEGER NOT NULL,
    tahun_selesai INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT false NOT NULL,
    deskripsi TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. Tabel Anggota Organisasi (org_member)
CREATE TABLE public.org_member (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kabinet_id UUID REFERENCES public.kabinet(id) ON DELETE CASCADE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255) NOT NULL,
    badan VARCHAR(100) NOT NULL, -- Contoh: 'BPH', 'BPM', 'Divisi Humas', 'Divisi PSDM'
    foto_url TEXT,
    urutan INTEGER NOT NULL DEFAULT 0,
    kontak_sosmed JSONB DEFAULT '{}'::jsonb NOT NULL, -- Format: {"instagram": "...", "linkedin": "..."}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. Tabel Berita / Blog (news_post)
CREATE TABLE public.news_post (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    konten TEXT NOT NULL,
    ringkasan TEXT,
    cover_url TEXT,
    kategori VARCHAR(100) NOT NULL DEFAULT 'Umum',
    status public.post_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES public.admin_user(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. Tabel Kegiatan / Acara (event)
CREATE TABLE public.event (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    deskripsi TEXT NOT NULL,
    tanggal_mulai TIMESTAMP WITH TIME ZONE NOT NULL,
    tanggal_selesai TIMESTAMP WITH TIME ZONE NOT NULL,
    lokasi_atau_link TEXT NOT NULL,
    cover_url TEXT,
    link_pendaftaran TEXT,
    status public.event_status NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- F. Tabel Komunitas (community)
CREATE TABLE public.community (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    deskripsi TEXT NOT NULL,
    logo_url TEXT,
    kontak JSONB DEFAULT '{}'::jsonb NOT NULL, -- Format: {"instagram": "...", "whatsapp": "..."}
    urutan INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- G. Tabel Open Recruitment (recruitment_post)
CREATE TABLE public.recruitment_post (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    tanggal_buka TIMESTAMP WITH TIME ZONE NOT NULL,
    tanggal_tutup TIMESTAMP WITH TIME ZONE NOT NULL,
    link_form TEXT,
    status public.recruitment_status NOT NULL DEFAULT 'closed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- H. Tabel Album Galeri (gallery_album)
CREATE TABLE public.gallery_album (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    cover_url TEXT,
    event_id UUID REFERENCES public.event(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- I. Tabel Item Galeri (gallery_item)
CREATE TABLE public.gallery_item (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    album_id UUID REFERENCES public.gallery_album(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    tipe public.gallery_item_type NOT NULL DEFAULT 'foto',
    caption TEXT,
    urutan INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- J. Tabel Pengaturan Situs (site_settings)
CREATE TABLE public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 2. Otomatisasi Akun Admin via Triggers

Ketika Anda mendaftarkan admin baru melalui Supabase Auth (di dashboard Supabase atau lewat API admin), kita butuh data profil admin tersebut otomatis tersinkronisasi ke tabel `public.admin_user`. 

Berikut adalah fungsi dan trigger PostgreSQL untuk otomatis menyalin data dari schema `auth.users` ke `public.admin_user`:

```sql
-- =========================================================================
-- 1. FUNGSI DAN TRIGGER UNTUK PENDAFTARAN USER BARU
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_user (id, nama, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', 'Admin Baru'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.admin_role, 'editor'::public.admin_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 2. FUNGSI DAN TRIGGER UNTUK UPDATE USER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.admin_user
  SET 
    email = NEW.email,
    nama = COALESCE(NEW.raw_user_meta_data->>'nama', nama),
    role = COALESCE((NEW.raw_user_meta_data->>'role')::public.admin_role, role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_update_user();
```

---

## 3. Kebijakan Keamanan (Row Level Security - RLS)

Sesuai standar performa dan keamanan, semua tabel dilindungi oleh Row Level Security (RLS). 
- **Publik / Pengunjung**: Hanya memiliki akses membaca (`SELECT`) untuk data umum atau konten berita yang sudah diterbitkan (`status = 'published'`).
- **Admin**: Memiliki akses penuh (`INSERT`, `UPDATE`, `DELETE`, `SELECT`) ke seluruh konten jika sudah masuk login ter-autentikasi (`authenticated`).
- **Super Admin**: Memiliki kontrol penuh untuk mengelola pengguna/profil admin di tabel `admin_user`.

```sql
-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.admin_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kabinet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_post ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_post ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_album ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- KEBIJAKAN UNTUK TABEL: admin_user
-- =========================================================================
-- Izinkan semua admin yang terautentikasi untuk membaca profil admin lain (untuk author berita)
CREATE POLICY "Izinkan admin melihat profil sesama admin"
ON public.admin_user FOR SELECT
TO authenticated
USING (true);

-- Izinkan Super Admin untuk mengelola seluruh data admin
CREATE POLICY "Izinkan super_admin mengelola akun admin"
ON public.admin_user FOR ALL
TO authenticated
USING (COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'super_admin');

-- Izinkan user mengedit nama/profil mereka sendiri
CREATE POLICY "Izinkan admin mengedit profil sendiri"
ON public.admin_user FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- =========================================================================
-- KEBIJAKAN UNTUK TABEL-TABEL KONTEN (Publik bebas baca, Admin bebas kelola)
-- =========================================================================

-- KABINET
CREATE POLICY "Publik dapat melihat kabinet" ON public.kabinet FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola kabinet" ON public.kabinet FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ANGGOTA ORGANISASI
CREATE POLICY "Publik dapat melihat anggota" ON public.org_member FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola anggota" ON public.org_member FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- BERITA (Publik hanya bisa membaca berita yang diterbitkan)
CREATE POLICY "Publik dapat melihat berita terbit" ON public.news_post FOR SELECT TO public USING (status = 'published'::public.post_status);
CREATE POLICY "Admin dapat mengelola semua berita" ON public.news_post FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- KEGIATAN / EVENT
CREATE POLICY "Publik dapat melihat event" ON public.event FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola event" ON public.event FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- KOMUNITAS MINAT BAKAT
CREATE POLICY "Publik dapat melihat komunitas" ON public.community FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola komunitas" ON public.community FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- OPEN RECRUITMENT
CREATE POLICY "Publik dapat melihat oprec" ON public.recruitment_post FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola oprec" ON public.recruitment_post FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ALBUM GALERI
CREATE POLICY "Publik dapat melihat album" ON public.gallery_album FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola album" ON public.gallery_album FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ITEM GALERI
CREATE POLICY "Publik dapat melihat item galeri" ON public.gallery_item FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola item galeri" ON public.gallery_item FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PENGATURAN SITUS
CREATE POLICY "Publik dapat melihat pengaturan situs" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admin dapat mengelola pengaturan situs" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 4. Pembuatan Penyimpanan (Storage Buckets) & Kebijakan

Supabase Storage digunakan untuk mengunggah media (foto panitia, cover berita, pamflet event, dsb.). Anda dapat mendaftarkan bucket penyimpanan langsung melalui query SQL ini atau lewat menu **Storage** di Supabase Dashboard dengan nama-nama berikut.

```sql
-- Sisipkan bucket baru ke dalam tabel storage jika belum terdaftar
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('foto-panitia', 'foto-panitia', true),
  ('cover-berita', 'cover-berita', true),
  ('cover-event', 'cover-event', true),
  ('galeri', 'galeri', true),
  ('komunitas', 'komunitas', true),
  ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan akses Storage: Publik bebas melihat semua file di bucket terdaftar
CREATE POLICY "Akses publik membaca media storage"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('foto-panitia', 'cover-berita', 'cover-event', 'galeri', 'komunitas', 'site-assets'));

-- Kebijakan akses Storage: Admin yang login dapat melakukan unggah, ubah, dan hapus berkas
CREATE POLICY "Akses admin mengelola media storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id IN ('foto-panitia', 'cover-berita', 'cover-event', 'galeri', 'komunitas', 'site-assets'))
WITH CHECK (bucket_id IN ('foto-panitia', 'cover-berita', 'cover-event', 'galeri', 'komunitas', 'site-assets'));
```

---

## 5. Data Awal & Percontohan (Seed Data)

Guna memastikan website tidak kosong saat pertama kali dipasang, jalankan query berikut untuk memasukkan data uji coba realistis seputar **HIMA STIE 66 Kendari**.

Kita menggunakan static UUIDs agar hubungan relasional antar tabel tetap terjaga dengan aman di database.

```sql
-- =========================================================================
-- 1. AKUN ADMIN PERCOTOHAN (Supabase Auth & public.admin_user)
-- =========================================================================
-- Kata sandi terenkripsi default untuk pengujian: 'password123'
-- Akun 1: admin@himastie66.com (Super Admin)
-- Akun 2: editor@himastie66.com (Editor / Medinfo)

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111', 
    'admin@himastie66.com',
    crypt('password123', gen_salt('bf', 10)),
    now(),
    '{"nama": "Ketua HIMA STIE 66", "role": "super_admin"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222', 
    'editor@himastie66.com',
    crypt('password123', gen_salt('bf', 10)),
    now(),
    '{"nama": "Humas & Media HIMA", "role": "editor"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Catatan: Trigger on_auth_user_created di atas otomatis menyinkronkan 
-- data di atas ke dalam tabel public.admin_user secara otomatis!


-- =========================================================================
-- 2. DATA KABINET (Kabinet Aktif + Kabinet Terdahulu sebagai Arsip)
-- =========================================================================
INSERT INTO public.kabinet (id, nama, tahun_mulai, tahun_selesai, is_active, deskripsi, logo_url)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    'Kabinet Sinergi Inovatif',
    2026,
    2027,
    true,
    'Kabinet yang mengusung nilai integrasi, progresivitas, dan inovasi dalam membina kompetensi kepemimpinan dan kewirausahaan mahasiswa ekonomi STIE 66 Kendari.',
    'https://placehold.co/400x400?text=Logo+Sinergi+Inovatif'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Kabinet Prakarsa',
    2025,
    2026,
    false,
    'Kabinet pelopor yang meletakkan dasar penguatan literasi riset dan digitalisasi organisasi internal.',
    'https://placehold.co/400x400?text=Logo+Prakarsa'
  )
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 3. SUSUNAN PANITIA / PENGURUS (org_member)
-- =========================================================================
INSERT INTO public.org_member (kabinet_id, nama, jabatan, badan, foto_url, urutan, kontak_sosmed)
VALUES
  -- Badan Pengurus Harian (BPH) - Kabinet Aktif (Sinergi Inovatif)
  (
    '33333333-3333-3333-3333-333333333333', 
    'Fadel Muhammad', 
    'Ketua Umum', 
    'BPH', 
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop', 
    1, 
    '{"instagram": "https://instagram.com/fadel_mh", "linkedin": "https://linkedin.com/in/fadel-muhammad"}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    'Siti Rahma', 
    'Wakil Ketua Umum', 
    'BPH', 
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop', 
    2, 
    '{"instagram": "https://instagram.com/sitirahma_", "linkedin": "https://linkedin.com/in/sitirahma"}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    'Andi Saputra', 
    'Sekretaris Umum', 
    'BPH', 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', 
    3, 
    '{"instagram": "https://instagram.com/andisap", "linkedin": "https://linkedin.com/in/andisaputra"}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    'Lia Lestari', 
    'Bendahara Umum', 
    'BPH', 
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop', 
    4, 
    '{"instagram": "https://instagram.com/lialestari_66", "linkedin": "https://linkedin.com/in/lialestari"}'::jsonb
  ),

  -- Divisi Humas & Medinfo - Kabinet Aktif (Sinergi Inovatif)
  (
    '33333333-3333-3333-3333-333333333333', 
    'Rian Hidayat', 
    'Kepala Divisi', 
    'Divisi Humas & Medinfo', 
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop', 
    5, 
    '{"instagram": "https://instagram.com/rian_hid"}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    'Indah Permata', 
    'Anggota Divisi', 
    'Divisi Humas & Medinfo', 
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop', 
    6, 
    '{"instagram": "https://instagram.com/indah_prm"}'::jsonb
  ),

  -- Divisi PSDM - Kabinet Aktif (Sinergi Inovatif)
  (
    '33333333-3333-3333-3333-333333333333', 
    'Dian Pratama', 
    'Kepala Divisi', 
    'Divisi PSDM', 
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop', 
    7, 
    '{"instagram": "https://instagram.com/dian_prt"}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    'Nabila Az-Zahra', 
    'Anggota Divisi', 
    'Divisi PSDM', 
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop', 
    8, 
    '{"instagram": "https://instagram.com/nabila_azz"}'::jsonb
  ),

  -- Pengurus Lama - Kabinet Prakarsa (Arsip 2025-2026)
  (
    '44444444-4444-4444-4444-444444444444', 
    'Bambang Wijaya', 
    'Ketua Umum', 
    'BPH', 
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop', 
    1, 
    '{"instagram": "https://instagram.com/bambang_wij"}'::jsonb
  ),
  (
    '44444444-4444-4444-4444-444444444444', 
    'Dewi Lestari', 
    'Sekretaris Umum', 
    'BPH', 
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=300&auto=format&fit=crop', 
    2, 
    '{"instagram": "https://instagram.com/dewilest"}'::jsonb
  );


-- =========================================================================
-- 4. BERITA & BLOG (news_post)
-- =========================================================================
INSERT INTO public.news_post (judul, slug, konten, ringkasan, cover_url, kategori, status, published_at, author_id)
VALUES
  (
    'Luncurkan Kabinet Sinergi Inovatif, HIMA STIE 66 Siap Hadapi Tantangan Baru',
    'pelantikan-dan-launching-kabinet-sinergi-inovatif-2026',
    '<p><strong>KENDARI</strong> — Himpunan Mahasiswa Jurusan (HIMA) Sekolah Tinggi Ilmu Ekonomi (STIE) 66 Kendari resmi meluncurkan kepengurusan baru di bawah bendera <strong>Kabinet Sinergi Inovatif</strong> untuk periode 2026/2027.</p><p>Acara pelantikan yang digelar megah di Aula Utama Kampus STIE 66 Kendari dihadiri oleh Ketua STIE 66 Kendari, jajaran dosen, perwakilan organisasi mahasiswa (Ormawa) selingkup kampus, serta ratusan mahasiswa aktif.</p><p>Ketua Umum terpilih, <strong>Fadel Muhammad</strong>, dalam pidato perdananya menegaskan tekadnya untuk mentransformasikan organisasi agar lebih adaptif terhadap teknologi digital dan berorientasi pada pemberdayaan riset bisnis.</p><p>"Sinergi Inovatif bukan sekadar slogan, melainkan komitmen nyata kita untuk berkolaborasi secara luas, baik internal maupun eksternal, guna menghasilkan solusi kreatif di tengah disrupsi dunia ekonomi saat ini," ujarnya.</p>',
    'Himpunan Mahasiswa STIE 66 Kendari resmi meluncurkan kepengurusan periode baru dengan visi integrasi digital dan pemberdayaan riset kewirausahaan mahasiswa.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop',
    'Organisasi',
    'published',
    now(),
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Kolaborasi Bisnis Kreatif: Kunjungan Industri HIMA STIE 66 ke UMKM Kopi Lokal',
    'kolaborasi-bisnis-kreatif-kunjungan-industri-hima-stie-66-ke-umkm',
    '<p><strong>KENDARI</strong> — Divisi Hubungan Masyarakat HIMA STIE 66 Kendari melaksanakan kegiatan Kunjungan Industri ke salah satu pusat pengolahan kopi lokal terbesar di Kendari.</p><p>Tujuan dari kunjungan ini adalah membedah secara langsung strategi pemasaran, pengelolaan rantai pasok (supply chain), hingga penentuan harga pokok produksi (HPP) yang dilakukan oleh pengusaha kopi lokal di masa pemulihan ekonomi pasca pandemi.</p><p>Melalui kegiatan ini, mahasiswa STIE 66 diharapkan tidak hanya memahami teori akademis di ruang kuliah, melainkan juga memiliki wawasan praktis di lapangan bisnis yang sesungguhnya.</p>',
    'Melalui Divisi Humas, pengurus HIMA STIE 66 Kendari mengajak mahasiswa membedah manajemen operasional dan taktik pemasaran langsung dari pelaku usaha mikro di Kendari.',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop',
    'Kunjungan Industri',
    'published',
    now() - INTERVAL '3 days',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'Panduan Sukses Mengatur Waktu Antara Kuliah dan Aktif Berorganisasi',
    'tips-manajemen-waktu-mahasiswa-aktif-kuliah-dan-organisasi',
    '<p>Menyeimbangkan kegiatan akademik di kampus dengan tuntutan amanah organisasi seringkali menjadi tantangan tersendiri bagi aktivis mahasiswa.</p><p>Berikut adalah 3 tips praktis dari Biro Litbang HIMA STIE 66 Kendari:</p><ol><li><strong>Buat Matriks Prioritas Eisenhower:</strong> Kelompokkan tugas dalam kuadran penting-mendesak, penting-tidak mendesak, tidak penting-mendesak, dan tidak penting-tidak mendesak.</li><li><strong>Tetapkan Batas Waktu Harian:</strong> Tentukan jam khusus untuk menyelesaikan tugas kuliah dan jam khusus untuk merancang program kerja HIMA.</li><li><strong>Komunikasi yang Transparan:</strong> Komunikasikan batas kesibukan Anda kepada tim kepanitiaan dan kelompok belajar di kelas.</li></ol>',
    'Banyak mahasiswa kesulitan membagi waktu. Berikut adalah tips teruji untuk tetap meraih IPK cumlaude sekaligus aktif berprestasi di organisasi HIMA.',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop',
    'Edukasi',
    'draft', -- Berita ini masih berstatus draft untuk testing panel admin
    null,
    '11111111-1111-1111-1111-111111111111'
  );


-- =========================================================================
-- 5. ACARA / EVENT (event)
-- =========================================================================
INSERT INTO public.event (id, judul, slug, deskripsi, tanggal_mulai, tanggal_selesai, lokasi_atau_link, cover_url, link_pendaftaran, status)
VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    'Seminar Nasional Kewirausahaan Digital 2026',
    'seminar-nasional-kewirausahaan-digital-2026',
    'Seminar yang menghadirkan tokoh startup nasional dan pelaku e-commerce lokal untuk mengupas strategi inovasi produk, pemanfaatan iklan digital, dan transformasi bisnis UMKM di era digitalisasi regional.',
    now() + INTERVAL '10 days',
    now() + INTERVAL '10 days' + INTERVAL '4 hours',
    'Aula Graha STIE 66 Kendari & Zoom Meeting',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
    'https://forms.gle/ContohPendaftaranSeminar66',
    'upcoming'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Latihan Kepemimpinan Mahasiswa Tingkat Dasar (LKMM-TD)',
    'latihan-kepemimpinan-mahasiswa-tingkat-dasar-2026',
    'Pelatihan intensif kepemimpinan, kerja sama tim, penyelesaian konflik, serta administrasi keorganisasian yang wajib diikuti oleh seluruh calon pengurus baru HIMA STIE 66 Kendari.',
    now() - INTERVAL '30 days',
    now() - INTERVAL '28 days',
    'Villa Kampus, Konda, Konawe Selatan',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    null,
    'past'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Musyawarah Besar (MUBES) Luar Biasa HIMA STIE 66',
    'mubes-luar-biasa-hima-stie-66-kendari',
    'Musyawarah tertinggi pengurus HIMA STIE 66 Kendari untuk membahas amandemen Anggaran Dasar / Anggaran Rumah Tangga (AD/ART) serta serah terima jabatan ketua umum.',
    now() - INTERVAL '60 days',
    now() - INTERVAL '59 days',
    'Ruang Teater Kampus STIE 66',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    null,
    'past'
  )
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 6. KOMUNITAS MINAT BAKAT (community)
-- =========================================================================
INSERT INTO public.community (nama, slug, deskripsi, logo_url, kontak, urutan)
VALUES
  (
    'Economic Debate Club (EDC)',
    'economic-debate-club-stie-66',
    'Komunitas bagi mahasiswa pecinta diskursus ekonomi, kajian regulasi keuangan, serta pelatihan debat kritis untuk kompetisi berskala regional dan nasional.',
    'https://placehold.co/200x200?text=EDC+Logo',
    '{"instagram": "https://instagram.com/edc_stie66", "whatsapp": "+6281244445555"}'::jsonb,
    1
  ),
  (
    'Kolektif Kreatif Fotografi & Medinfo',
    'kolektif-kreatif-fotografi-dan-medinfo',
    'Wadah kreatif untuk menyalurkan minat di bidang fotografi jurnalistik, sinematografi, desain grafis sosial media, dan penulisan artikel web.',
    'https://placehold.co/200x200?text=Fotografi+Logo',
    '{"instagram": "https://instagram.com/lensahima66", "whatsapp": "+6281266667777"}'::jsonb,
    2
  ),
  (
    'Klub Kajian Ilmiah & Riset Ekonomi',
    'klub-kajian-ilmiah-dan-riset-ekonomi',
    'Komunitas penulisan karya tulis ilmiah (KTI), bedah jurnal akuntansi/manajemen, serta asistensi riset skripsi dan kewirausahaan.',
    'https://placehold.co/200x200?text=Riset+Logo',
    '{"instagram": "https://instagram.com/risethima66", "whatsapp": "+6281288889999"}'::jsonb,
    3
  )
ON CONFLICT (slug) DO NOTHING;


-- =========================================================================
-- 7. OPEN RECRUITMENT (recruitment_post)
-- =========================================================================
INSERT INTO public.recruitment_post (judul, deskripsi, tanggal_buka, tanggal_tutup, link_form, status)
VALUES
  (
    'Pendaftaran Anggota Muda HIMA STIE 66 Periode 2026/2027',
    'Himpunan Mahasiswa STIE 66 Kendari memanggil talenta terbaik mahasiswa aktif (Jurusan Manajemen & Akuntansi) Semester 1 dan 3 untuk bergabung membentuk roda perubahan bersama Kabinet Sinergi Inovatif. Kami membuka kesempatan pengembangan diri di Divisi Humas, PSDM, Litbang, Kewirausahaan, dan Keagamaan.',
    now() - INTERVAL '1 days',
    now() + INTERVAL '14 days',
    'https://forms.gle/FormulirOprecHima66',
    'open'
  )
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 8. ALBUM & ITEM GALERI (gallery_album & gallery_item)
-- =========================================================================

-- Album 1 (Mempunyai Relasi ke Event LKMM-TD)
INSERT INTO public.gallery_album (id, judul, deskripsi, cover_url, event_id)
VALUES
  (
    '88888888-8888-8888-8888-888888888888',
    'Dokumentasi LKMM-TD 2026',
    'Kumpulan foto-foto momen kebersamaan, latihan materi, dan games kepemimpinan selama LKMM-TD 2026 di Konda.',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    '66666666-6666-6666-6666-666666666666'
  )
ON CONFLICT (id) DO NOTHING;

-- Item Galeri untuk Album 1
INSERT INTO public.gallery_item (album_id, url, tipe, caption, urutan)
VALUES
  (
    '88888888-8888-8888-8888-888888888888',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
    'foto',
    'Sesi pemaparan materi etika organisasi oleh Dewan Senior.',
    1
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
    'foto',
    'Kegiatan games kerja sama tim di lapangan terbuka.',
    2
  );

-- Album 2 (Tanpa Relasi langsung ke Event spesifik)
INSERT INTO public.gallery_album (id, judul, deskripsi, cover_url, event_id)
VALUES
  (
    '99999999-9999-9999-9999-999999999999',
    'Aktivitas Harian di Sekretariat HIMA',
    'Momen santai, rapat internal mingguan, dan diskusi akademis di sekretariat HIMA STIE 66 Kendari.',
    'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800&auto=format&fit=crop',
    null
  )
ON CONFLICT (id) DO NOTHING;

-- Item Galeri untuk Album 2
INSERT INTO public.gallery_item (album_id, url, tipe, caption, urutan)
VALUES
  (
    '99999999-9999-9999-9999-999999999999',
    'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800&auto=format&fit=crop',
    'foto',
    'Rapat koordinasi mingguan pengurus BPH dan para Kepala Divisi.',
    1
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    'foto',
    'Sesi asistensi kelompok belajar akuntansi dasar untuk mahasiswa baru.',
    2
  );


-- =========================================================================
-- 9. PENGATURAN SITUS KEY-VALUE (site_settings)
-- =========================================================================
INSERT INTO public.site_settings (key, value)
VALUES
  (
    'contact_info',
    '{
      "whatsapp": "+6281234567890",
      "email": "hima@stie66.ac.id",
      "address": "Gedung PKM STIE 66 Kendari, Jl. KH. Ahmad Dahlan No.66, Kendari, Sulawesi Tenggara"
    }'::jsonb
  ),
  (
    'social_media',
    '{
      "instagram": "https://instagram.com/himastie66",
      "tiktok": "https://tiktok.com/@himastie66",
      "youtube": "https://youtube.com/@himastie66"
    }'::jsonb
  ),
  (
    'hero_section',
    '{
      "title": "Sinergi Inovatif Mahasiswa STIE 66 Kendari",
      "subtitle": "Wadah pengembangan potensi kepemimpinan, riset ekonomi, dan pengabdian masyarakat yang dinamis.",
      "cta_primary_text": "Lihat Program Kerja",
      "cta_secondary_text": "Tentang Kami"
    }'::jsonb
  ),
  (
    'quick_links',
    '[
      { "title": "Situs STIE 66 Kendari", "url": "https://stie66.ac.id" },
      { "title": "Portal Siakad Mahasiswa", "url": "https://siakad.stie66.ac.id" },
      { "title": "Situs Kemendikbud", "url": "https://kemdikbud.go.id" }
    ]'::jsonb
  )
ON CONFLICT (key) DO NOTHING;
```
