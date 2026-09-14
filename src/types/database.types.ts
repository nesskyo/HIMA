export type AdminRole = 'super_admin' | 'editor';
export type PostStatus = 'draft' | 'published';
export type EventStatus = 'upcoming' | 'past';
export type RecruitmentStatus = 'open' | 'closed';
export type GalleryItemType = 'foto' | 'video';

export interface AdminUser {
  id: string;
  nama: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface Kabinet {
  id: string;
  nama: string;
  tahun_mulai: number;
  tahun_selesai: number;
  is_active: boolean;
  deskripsi: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface OrgMember {
  id: string;
  kabinet_id: string;
  nama: string;
  jabatan: string;
  badan: string; // e.g. 'BPH', 'Divisi Humas', 'Divisi Kaderisasi', etc.
  foto_url: string | null;
  urutan: number;
  kontak_sosmed: Record<string, string> | null;
  created_at: string;
  kabinet?: Kabinet;
}

export interface NewsPost {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string;
  cover_url: string | null;
  kategori: string;
  status: PostStatus;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at?: string | null;
  author?: AdminUser;
}

export interface EventItem {
  id: string;
  judul: string;
  slug: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  lokasi_atau_link: string | null;
  cover_url: string | null;
  link_pendaftaran: string | null;
  status: EventStatus;
  created_at: string;
}

export interface Community {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  logo_url: string | null;
  kontak: string | null;
  urutan: number;
  created_at: string;
}

export interface RecruitmentPost {
  id: string;
  judul: string;
  deskripsi: string | null;
  tanggal_buka: string;
  tanggal_tutup: string;
  link_form: string | null;
  status: RecruitmentStatus;
  created_at: string;
}

export interface GalleryAlbum {
  id: string;
  judul: string;
  deskripsi: string | null;
  cover_url: string | null;
  event_id: string | null;
  created_at: string;
  items?: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  album_id: string;
  url: string;
  tipe: GalleryItemType;
  caption: string | null;
  urutan: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      admin_user: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'created_at'> & { created_at?: string };
        Update: Partial<AdminUser>;
      };
      kabinet: {
        Row: Kabinet;
        Insert: Omit<Kabinet, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Kabinet>;
      };
      org_member: {
        Row: OrgMember;
        Insert: Omit<OrgMember, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<OrgMember>;
      };
      news_post: {
        Row: NewsPost;
        Insert: Omit<NewsPost, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<NewsPost>;
      };
      event: {
        Row: EventItem;
        Insert: Omit<EventItem, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<EventItem>;
      };
      community: {
        Row: Community;
        Insert: Omit<Community, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Community>;
      };
      recruitment_post: {
        Row: RecruitmentPost;
        Insert: Omit<RecruitmentPost, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<RecruitmentPost>;
      };
      gallery_album: {
        Row: GalleryAlbum;
        Insert: Omit<GalleryAlbum, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<GalleryAlbum>;
      };
      gallery_item: {
        Row: GalleryItem;
        Insert: Omit<GalleryItem, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<GalleryItem>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'id' | 'updated_at'> & { id?: string; updated_at?: string };
        Update: Partial<SiteSettings>;
      };
    };
  };
}
