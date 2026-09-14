import { createClient } from '@/lib/supabase/server';
import type { RecruitmentPost } from '@/types/database.types';

const FALLBACK_RECRUITMENT: RecruitmentPost = {
  id: '88888888-8888-8888-8888-888888888888',
  judul: 'Open Recruitment Pengurus HIMA STIE 66 Kendari Gelombang 1',
  deskripsi: 'Kesempatan emas bagi seluruh mahasiswa aktif STIE 66 Kendari untuk bergabung menjadi pengurus HIMA periode 2026/2027. Bersama kita asah kepemimpinan, kembangkan jaringan relasi, dan ciptakan karya bermakna untuk almamater.',
  tanggal_buka: new Date(Date.now() - 86400000 * 5).toISOString(),
  tanggal_tutup: new Date(Date.now() + 86400000 * 20).toISOString(),
  link_form: 'https://forms.gle/contohrecruitmenthima66',
  status: 'open',
  created_at: new Date().toISOString(),
};

export async function getActiveRecruitment(): Promise<RecruitmentPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase
      .from('recruitment_post') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_RECRUITMENT;
    }
    return data;
  } catch {
    return FALLBACK_RECRUITMENT;
  }
}
