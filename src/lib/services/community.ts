import { createClient } from '@/lib/supabase/server';
import type { Community } from '@/types/database.types';

const FALLBACK_COMMUNITIES: Community[] = [
  {
    id: '66666666-6666-6666-6666-666666666661',
    nama: 'Economic Research & Discussion Club',
    slug: 'economic-research-discussion-club',
    deskripsi: 'Komunitas telaah kebijakan fiskal, moneter, serta dinamika ekonomi regional Sulawesi Tenggara. Rutin mengadakan bedah jurnal dan simulasi forum kebijakan.',
    logo_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&auto=format&fit=crop',
    kontak: JSON.stringify({ instagram: 'https://instagram.com/erdc_stie66', whatsapp: '+6281234567891' }),
    urutan: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '66666666-6666-6666-6666-666666666662',
    nama: 'Young Entrepreneurs Community (YEC)',
    slug: 'young-entrepreneurs-community',
    deskripsi: 'Inkubator bisnis mahasiswa STIE 66 Kendari untuk merintis usaha rintisan, digital marketing, business plan competition, dan bazar kewirausahaan.',
    logo_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300&auto=format&fit=crop',
    kontak: JSON.stringify({ instagram: 'https://instagram.com/yec_stie66', whatsapp: '+6281234567892' }),
    urutan: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '66666666-6666-6666-6666-666666666663',
    nama: 'Galeri Investasi & Capital Market Society',
    slug: 'galeri-investasi-capital-market-society',
    deskripsi: 'Wadah edukasi pasar modal syariah dan konvensional, simulasi trading saham, serta pelatihan analisis fundamental dan teknikal.',
    logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300&auto=format&fit=crop',
    kontak: JSON.stringify({ instagram: 'https://instagram.com/gibei_stie66', whatsapp: '+6281234567893' }),
    urutan: 3,
    created_at: new Date().toISOString(),
  },
];

export async function getCommunities(): Promise<Community[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase
      .from('community') as any)
      .select('*')
      .order('urutan', { ascending: true });

    if (error || !data || (data as Community[]).length === 0) {
      return FALLBACK_COMMUNITIES;
    }
    return data as Community[];
  } catch {
    return FALLBACK_COMMUNITIES;
  }
}

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase
      .from('community') as any)
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_COMMUNITIES.find((c) => c.slug === slug) || null;
    }
    return data;
  } catch {
    return FALLBACK_COMMUNITIES.find((c) => c.slug === slug) || null;
  }
}
