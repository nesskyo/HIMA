import { createClient } from '@/lib/supabase/server';
import type { GalleryAlbum } from '@/types/database.types';

const FALLBACK_ALBUMS: GalleryAlbum[] = [
  {
    id: '99999999-9999-9999-9999-999999999991',
    judul: 'Dokumentasi Pelantikan & Rapat Kerja Pengurus',
    deskripsi: 'Suasana pelantikan pengurus di Aula Kampus STIE 66 Kendari dan sesi perumusan rencana program kerja 1 tahun kepengurusan.',
    cover_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    event_id: null,
    created_at: new Date().toISOString(),
    items: [
      {
        id: '99999999-9999-9999-9999-999999999998',
        album_id: '99999999-9999-9999-9999-999999999991',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
        tipe: 'foto',
        caption: 'Rapat koordinasi mingguan pengurus BPH dan para Kepala Divisi.',
        urutan: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: '99999999-9999-9999-9999-999999999999',
        album_id: '99999999-9999-9999-9999-999999999991',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
        tipe: 'foto',
        caption: 'Sesi asistensi kelompok belajar akuntansi dasar untuk mahasiswa baru.',
        urutan: 2,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  try {
    const supabase = await createClient();
    const { data: albums, error: albumErr } = await (supabase
      .from('gallery_album') as any)
      .select('*, items:gallery_item(*)')
      .order('created_at', { ascending: false });

    if (albumErr || !albums || (albums as GalleryAlbum[]).length === 0) {
      return FALLBACK_ALBUMS;
    }
    return albums as GalleryAlbum[];
  } catch {
    return FALLBACK_ALBUMS;
  }
}
