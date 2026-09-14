import { createClient } from '@/lib/supabase/server';
import type { NewsPost } from '@/types/database.types';

const FALLBACK_NEWS: NewsPost[] = [
  {
    id: '44444444-4444-4444-4444-444444444441',
    judul: 'Pelantikan Serentak Pengurus HIMA STIE 66 Periode 2026/2027 Berlangsung Khidmat',
    slug: 'pelantikan-serentak-pengurus-hima-stie-66-periode-2026-2027',
    ringkasan: 'Ketua STIE 66 Kendari secara resmi melantik jajaran pengurus baru HIMA dengan mengusung tema Sinergi Progresif untuk kemajuan almamater dan ekonomi daerah.',
    konten: '<p>KENDARI — Pelantikan serentak pengurus Himpunan Mahasiswa Sekolah Tinggi Ilmu Ekonomi Enam Enam (HIMA STIE 66) Kendari periode 2026/2027 berjalan dengan penuh khidmat di Aula Utama Kampus STIE 66 Kendari.</p><p>Acara ini dihadiri oleh jajaran pimpinan kampus, dosen, perwakilan organisasi mahasiswa, serta tamu undangan dari berbagai perguruan tinggi di Sulawesi Tenggara. Dalam sambutannya, Ketua STIE 66 Kendari menyampaikan harapan besar agar kepengurusan baru ini mampu menjadi motor penggerak kreativitas, integritas, dan kewirausahaan mahasiswa di era digital.</p><p>Ketua Umum terpilih, Muhammad Arya Pratama, menegaskan komitmen kabinetnya untuk menghadirkan program kerja yang berdampak nyata, tidak hanya di lingkungan internal kampus tetapi juga memberikan kontribusi edukasi ekonomi bagi masyarakat Kendari.</p>',
    cover_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    kategori: 'Kegiatan',
    status: 'published',
    published_at: new Date().toISOString(),
    author_id: '11111111-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444442',
    judul: 'Workshop Literasi Finansial & Investasi Pasar Modal bagi Mahasiswa Milenial',
    slug: 'workshop-literasi-finansial-investasi-pasar-modal-stie66',
    ringkasan: 'HIMA STIE 66 Kendari berkolaborasi dengan Galeri Investasi BEI menggelar edukasi cerdas berinvestasi saham dan reksadana sejak bangku kuliah.',
    konten: '<p>KENDARI — HIMA STIE 66 Kendari sukses menggelar seminar dan workshop bertajuk "Cerdas Mengelola Finansial & Memulai Investasi Saham Sejak Muda". Acara ini diikuti oleh lebih dari 150 mahasiswa dari berbagai program studi.</p><p>Pemateri dari Bursa Efek Indonesia Kantor Perwakilan Sulawesi Tenggara menjelaskan pentingnya memahami instrumen pasar modal legal, diversifikasi portofolio, serta menghindari godaan investasi bodong dan pinjaman online ilegal yang marak menyasar kalangan muda.</p>',
    cover_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
    kategori: 'Akademik',
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    author_id: '11111111-1111-1111-1111-111111111111',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444443',
    judul: 'HIMA Peduli: Salurkan Bantuan Paket Sembako dan Alat Tulis untuk Panti Asuhan Kendari',
    slug: 'hima-peduli-salurkan-bantuan-sembako-panti-asuhan',
    ringkasan: 'Wujud pengabdian masyarakat, mahasiswa STIE 66 Kendari menyalurkan hasil donasi dan program amal tahunan ke panti asuhan lokal.',
    konten: '<p>KENDARI — Menutup rangkaian agenda sosial bulan ini, divisi Hubungan Masyarakat HIMA STIE 66 Kendari menyerahkan puluhan paket sembako serta perlengkapan belajar kepada anak-anak di Panti Asuhan Al-Ikhlas Kendari.</p><p>Kegiatan ini merupakan realisasi dari program HIMA Peduli yang didanai melalui donasi sukarela mahasiswa, dosen, dan penjualan merchandise resmi kampus.</p>',
    cover_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    kategori: 'Sosial',
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    author_id: '11111111-1111-1111-1111-111111111111',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export async function getPublishedNews(options?: {
  limit?: number;
  category?: string;
  search?: string;
}): Promise<NewsPost[]> {
  try {
    const supabase = await createClient();
    let query = (supabase.from('news_post') as any)
      .select('*, author:admin_user(nama, email)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (options?.category && options.category !== 'Semua') {
      query = query.eq('kategori', options.category);
    }

    if (options?.search) {
      query = query.ilike('judul', `%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let filtered = [...FALLBACK_NEWS];
      if (options?.category && options.category !== 'Semua') {
        filtered = filtered.filter((n) => n.kategori.toLowerCase() === options.category?.toLowerCase());
      }
      if (options?.search) {
        filtered = filtered.filter((n) => n.judul.toLowerCase().includes(options.search!.toLowerCase()));
      }
      if (options?.limit) {
        filtered = filtered.slice(0, options.limit);
      }
      return filtered;
    }

    return data;
  } catch {
    return FALLBACK_NEWS.slice(0, options?.limit || FALLBACK_NEWS.length);
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase
      .from('news_post') as any)
      .select('*, author:admin_user(nama, email)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error || !data) {
      const match = FALLBACK_NEWS.find((n) => n.slug === slug);
      return match || null;
    }
    return data;
  } catch {
    return FALLBACK_NEWS.find((n) => n.slug === slug) || null;
  }
}
