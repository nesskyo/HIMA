/**
 * Client-side image compression utility using HTML5 Canvas.
 * Reduces image file sizes before upload to save Supabase Storage bandwidth & quota.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.82)
  outputFormat?: "image/webp" | "image/jpeg";
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<{ compressedFile: File; originalSize: number; compressedSize: number; ratio: number }> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    outputFormat = "image/webp",
  } = options;

  // Don't compress non-image files or GIFs (which lose animation if converted via canvas)
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return {
      compressedFile: file,
      originalSize: file.size,
      compressedSize: file.size,
      ratio: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({
            compressedFile: file,
            originalSize: file.size,
            compressedSize: file.size,
            ratio: 0,
          });
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({
                compressedFile: file,
                originalSize: file.size,
                compressedSize: file.size,
                ratio: 0,
              });
            }

            // Generate clean extension
            const extension = outputFormat === "image/webp" ? "webp" : "jpg";
            const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const newFileName = `${baseName}.${extension}`;

            const compressedFile = new File([blob], newFileName, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            const ratio = Math.round(((file.size - compressedFile.size) / file.size) * 100);

            resolve({
              compressedFile,
              originalSize: file.size,
              compressedSize: compressedFile.size,
              ratio: Math.max(0, ratio),
            });
          },
          outputFormat,
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
