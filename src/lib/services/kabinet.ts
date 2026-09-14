import { createClient } from '@/lib/supabase/server';
import type { Kabinet, OrgMember } from '@/types/database.types';

// Fallback seed data matching database.md
const FALLBACK_KABINET: Kabinet = {
  id: '22222222-2222-2222-2222-222222222222',
  nama: 'Kabinet Sinergi Progresif',
  tahun_mulai: 2026,
  tahun_selesai: 2027,
  is_active: true,
  deskripsi: 'Kabinet yang mengusung semangat kolaborasi inklusif, inovasi kewirausahaan muda, dan penguatan riset ekonomi di lingkungan STIE 66 Kendari.',
  logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=300&auto=format&fit=crop',
  created_at: new Date().toISOString(),
};

const FALLBACK_MEMBERS: OrgMember[] = [
  {
    id: '33333333-3333-3333-3333-333333333331',
    kabinet_id: '22222222-2222-2222-2222-222222222222',
    nama: 'Muhammad Arya Pratama',
    jabatan: 'Ketua Umum',
    badan: 'BPH',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop',
    urutan: 1,
    kontak_sosmed: { instagram: 'https://instagram.com/aryapratama', linkedin: 'https://linkedin.com/in/aryapratama' },
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333332',
    kabinet_id: '22222222-2222-2222-2222-222222222222',
    nama: 'Siti Nurhaliza',
    jabatan: 'Wakil Ketua Umum',
    badan: 'BPH',
    foto_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop',
    urutan: 2,
    kontak_sosmed: { instagram: 'https://instagram.com/sitinurhaliza' },
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    kabinet_id: '22222222-2222-2222-2222-222222222222',
    nama: 'Andi Tenri Olle',
    jabatan: 'Sekretaris Umum',
    badan: 'BPH',
    foto_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500&auto=format&fit=crop',
    urutan: 3,
    kontak_sosmed: { instagram: 'https://instagram.com/anditenri' },
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    kabinet_id: '22222222-2222-2222-2222-222222222222',
    nama: 'Rahmat Hidayat',
    jabatan: 'Bendahara Umum',
    badan: 'BPH',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
    urutan: 4,
    kontak_sosmed: { instagram: 'https://instagram.com/rhidayat' },
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333335',
    kabinet_id: '22222222-2222-2222-2222-222222222222',
    nama: 'Fajar Kurniawan',
    jabatan: 'Kepala Divisi Hubungan Masyarakat & Medinfo',
    badan: 'Divisi Humas & Medinfo',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop',
    urutan: 5,
    kontak_sosmed: { instagram: 'https://instagram.com/fajark' },
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333336',
    kabinet_id: '22222222-2222-2222-2222-222222222222',
    nama: 'Dewi Sartika',
    jabatan: 'Kepala Divisi Pengembangan Sumber Daya Mahasiswa',
    badan: 'Divisi PSDM',
    foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop',
    urutan: 6,
    kontak_sosmed: { instagram: 'https://instagram.com/dewisartika' },
    created_at: new Date().toISOString(),
  },
];

export async function getActiveKabinet(): Promise<{ kabinet: Kabinet | null; members: OrgMember[] }> {
  try {
    const supabase = await createClient();
    const { data: kabinet, error: kabinetErr } = await (supabase
      .from('kabinet') as any)
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (kabinetErr || !kabinet) {
      return { kabinet: FALLBACK_KABINET, members: FALLBACK_MEMBERS };
    }

    const activeKabinet = kabinet as Kabinet;

    const { data: members, error: membersErr } = await (supabase
      .from('org_member') as any)
      .select('*')
      .eq('kabinet_id', activeKabinet.id)
      .order('urutan', { ascending: true });

    if (membersErr || !members || (members as OrgMember[]).length === 0) {
      return { kabinet: activeKabinet, members: FALLBACK_MEMBERS };
    }

    return { kabinet: activeKabinet, members: members as OrgMember[] };
  } catch {
    return { kabinet: FALLBACK_KABINET, members: FALLBACK_MEMBERS };
  }
}

export async function getAllKabinets(): Promise<Kabinet[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase
      .from('kabinet') as any)
      .select('*')
      .order('tahun_mulai', { ascending: false });

    if (error || !data || (data as Kabinet[]).length === 0) {
      return [FALLBACK_KABINET];
    }
    return data as Kabinet[];
  } catch {
    return [FALLBACK_KABINET];
  }
}
