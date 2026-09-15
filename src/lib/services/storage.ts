import { createClient } from "@/lib/supabase/client";

export type StorageBucket = "cover-berita" | "foto-panitia" | "galeri" | "general";

export interface UploadResult {
  url: string;
  path: string;
  error?: string | null;
}

/**
 * Uploads a file to Supabase Storage with graceful offline/demo fallback.
 */
export async function uploadToStorage(
  bucket: StorageBucket,
  file: File,
  folder: string = ""
): Promise<UploadResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Clean filename: timestamp + sanitized name
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${Date.now()}_${cleanName}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // If Supabase is not configured or in offline demo mode, return data URL
  if (!supabaseUrl || supabaseUrl.includes("your-project")) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          path: filePath,
          error: null,
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(file),
          path: filePath,
          error: null,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.warn(`Supabase Storage upload error on bucket '${bucket}':`, error.message);
      // Graceful fallback to Data URL if bucket RLS fails or bucket not yet created
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            path: filePath,
            error: null,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (err: any) {
    console.error("Storage upload exception:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          path: filePath,
          error: null,
        });
      };
      reader.readAsDataURL(file);
    });
  }
}
