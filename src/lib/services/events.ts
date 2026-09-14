import { createClient } from '@/lib/supabase/server';
import type { EventItem } from '@/types/database.types';

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: '55555555-5555-5555-5555-555555555551',
    judul: 'Seminar Nasional Ekonomi & Kewirausahaan Kreatif 2026',
    slug: 'seminar-nasional-ekonomi-kewirausahaan-kreatif-2026',
    deskripsi: 'Seminar akbar menghadirkan pakar ekonomi nasional dan praktisi startup digital. Membahas strategi daya saing UMKM dan pemuda di Sulawesi Tenggara.',
    tanggal_mulai: new Date(Date.now() + 86400000 * 14).toISOString(),
    tanggal_selesai: new Date(Date.now() + 86400000 * 14 + 3600000 * 5).toISOString(),
    lokasi_atau_link: 'Auditorium STIE 66 Kendari / Live Zoom',
    cover_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
    link_pendaftaran: 'https://forms.gle/contohpendaftaransemnas',
    status: 'upcoming',
    created_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555552',
    judul: 'Latihan Dasar Kepemimpinan Mahasiswa (LDKM) HIMA STIE 66',
    slug: 'ldkm-hima-stie-66-kendari',
    deskripsi: 'Pelatihan intensif kepemimpinan, kerja sama tim, penyelesaian konflik, serta administrasi keorganisasian yang wajib diikuti oleh seluruh calon pengurus baru HIMA STIE 66 Kendari.',
    tanggal_mulai: new Date(Date.now() - 86400000 * 30).toISOString(),
    tanggal_selesai: new Date(Date.now() - 86400000 * 28).toISOString(),
    lokasi_atau_link: 'Villa Kampus, Konda, Konawe Selatan',
    cover_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
    link_pendaftaran: null,
    status: 'past',
    created_at: new Date(Date.now() - 86400000 * 35).toISOString(),
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    judul: 'Musyawarah Besar (MUBES) Luar Biasa HIMA STIE 66',
    slug: 'mubes-luar-biasa-hima-stie-66-kendari',
    deskripsi: 'Musyawarah tertinggi pengurus HIMA STIE 66 Kendari untuk membahas amandemen Anggaran Dasar / Anggaran Rumah Tangga (AD/ART) serta serah terima jabatan ketua umum.',
    tanggal_mulai: new Date(Date.now() - 86400000 * 60).toISOString(),
    tanggal_selesai: new Date(Date.now() - 86400000 * 59).toISOString(),
    lokasi_atau_link: 'Ruang Teater Kampus STIE 66',
    cover_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    link_pendaftaran: null,
    status: 'past',
    created_at: new Date(Date.now() - 86400000 * 65).toISOString(),
  },
];

export async function getEvents(status?: 'upcoming' | 'past'): Promise<EventItem[]> {
  try {
    const supabase = await createClient();
    let query = (supabase.from('event') as any)
      .select('*')
      .order('tanggal_mulai', { ascending: status === 'upcoming' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error || !data || (data as EventItem[]).length === 0) {
      if (status) {
        return FALLBACK_EVENTS.filter((e) => e.status === status);
      }
      return FALLBACK_EVENTS;
    }
    return data as EventItem[];
  } catch {
    if (status) {
      return FALLBACK_EVENTS.filter((e) => e.status === status);
    }
    return FALLBACK_EVENTS;
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase
      .from('event') as any)
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_EVENTS.find((e) => e.slug === slug) || null;
    }
    return data;
  } catch {
    return FALLBACK_EVENTS.find((e) => e.slug === slug) || null;
  }
}
