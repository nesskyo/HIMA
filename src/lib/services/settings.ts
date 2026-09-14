import { createClient } from '@/lib/supabase/server';

export interface SiteSettingsConfig {
  contact_info: {
    whatsapp: string;
    email: string;
    address: string;
  };
  social_media: {
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  hero_section: {
    title: string;
    subtitle: string;
    cta_primary_text: string;
    cta_secondary_text: string;
  };
  quick_links: Array<{
    title: string;
    url: string;
  }>;
}

const DEFAULT_SETTINGS: SiteSettingsConfig = {
  contact_info: {
    whatsapp: '+6281234567890',
    email: 'hima@stie66.ac.id',
    address: 'Gedung PKM STIE 66 Kendari, Jl. KH. Ahmad Dahlan No.66, Kendari, Sulawesi Tenggara',
  },
  social_media: {
    instagram: 'https://instagram.com/himastie66',
    tiktok: 'https://tiktok.com/@himastie66',
    youtube: 'https://youtube.com/@himastie66',
  },
  hero_section: {
    title: 'Sinergi Inovatif Mahasiswa STIE 66 Kendari',
    subtitle: 'Wadah pengembangan potensi kepemimpinan, riset ekonomi, dan pengabdian masyarakat yang dinamis.',
    cta_primary_text: 'Lihat Program Kerja',
    cta_secondary_text: 'Tentang Kami',
  },
  quick_links: [
    { title: 'Situs STIE 66 Kendari', url: 'https://stie66.ac.id' },
    { title: 'Portal Siakad Mahasiswa', url: 'https://siakad.stie66.ac.id' },
    { title: 'Situs Kemendikbud', url: 'https://kemdikbud.go.id' },
  ],
};

export async function getSiteSettings(): Promise<SiteSettingsConfig> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase.from('site_settings') as any).select('key, value');

    if (error || !data || data.length === 0) {
      return DEFAULT_SETTINGS;
    }

    const settings = { ...DEFAULT_SETTINGS };
    (data as Array<{ key: string; value: any }>).forEach((row) => {
      if (row.key === 'contact_info') settings.contact_info = row.value;
      if (row.key === 'social_media') settings.social_media = row.value;
      if (row.key === 'hero_section') settings.hero_section = row.value;
      if (row.key === 'quick_links') settings.quick_links = row.value;
    });

    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
