"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { compressImage, formatFileSize } from "@/lib/utils/image-compression";
import { uploadToStorage, StorageBucket } from "@/lib/services/storage";

interface MediaUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  bucket?: StorageBucket;
  folder?: string;
  aspectRatio?: "16/9" | "1/1" | "3/4" | "4/3" | "video";
  maxSizeMB?: number;
  label?: string;
  description?: string;
  autoCompress?: boolean;
}

export function MediaUploader({
  value,
  onChange,
  bucket = "cover-berita",
  folder = "",
  aspectRatio = "16/9",
  maxSizeMB = 2,
  label = "Unggah Gambar",
  description = "Format JPG, PNG, atau WebP (Maks. 2MB)",
  autoCompress = true,
}: MediaUploaderProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [compressionInfo, setCompressionInfo] = React.useState<{
    originalSize: number;
    compressedSize: number;
    ratio: number;
  } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync internal preview with external value change
  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Berkas harus berupa gambar (JPG, PNG, atau WebP)");
      return;
    }

    // Validate size before compression
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes && !autoCompress) {
      toast.error(`Ukuran file melebihi batas maksimal ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    setCompressionInfo(null);

    try {
      let uploadFile = file;

      // Perform client-side compression
      if (autoCompress) {
        const result = await compressImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
          outputFormat: "image/webp",
        });

        uploadFile = result.compressedFile;
        setCompressionInfo({
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          ratio: result.ratio,
        });

        if (result.ratio > 0) {
          toast.success(
            `Kompresi sukses: ${formatFileSize(result.originalSize)} ➔ ${formatFileSize(
              result.compressedSize
            )} (Hemat ${result.ratio}%)`
          );
        }
      }

      // Upload to Supabase Storage
      const res = await uploadToStorage(bucket, uploadFile, folder);

      if (res.error) {
        toast.error(`Gagal mengunggah gambar: ${res.error}`);
      } else {
        setPreview(res.url);
        onChange(res.url);
        toast.success("Gambar berhasil diunggah!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setCompressionInfo(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "1/1":
        return "aspect-square max-w-[240px] mx-auto";
      case "3/4":
        return "aspect-[3/4] max-w-[240px] mx-auto";
      case "4/3":
        return "aspect-[4/3]";
      case "video":
      case "16/9":
      default:
        return "aspect-[16/9]";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <ImageIcon className="size-3.5 text-gray-400" />
            {label}
          </label>
          {compressionInfo && (
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="size-3" />
              Hemat {compressionInfo.ratio}% ({formatFileSize(compressionInfo.compressedSize)})
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        /* Image Preview State */
        <div className={`relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 group ${getAspectClass()}`}>
          <Image
            src={preview}
            alt="Uploaded media preview"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-white/90 hover:bg-white text-gray-800 rounded-xl text-xs font-semibold gap-1.5 shadow-md"
            >
              <RefreshCw className={`size-3.5 ${isUploading ? "animate-spin" : ""}`} />
              Ganti Foto
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-md"
            >
              <X className="size-3.5" />
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        /* Upload Drag & Drop State */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center gap-3 ${
            isDragging
              ? "border-[#84CC16] bg-[#84CC16]/5 scale-[0.99]"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 bg-white"
          } ${getAspectClass()}`}
        >
          <div className="size-12 rounded-2xl bg-amber-50 text-[#FACC15] flex items-center justify-center border border-amber-200">
            {isUploading ? (
              <RefreshCw className="size-6 animate-spin text-[#84CC16]" />
            ) : (
              <UploadCloud className="size-6 text-amber-500" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-700">
              {isUploading ? "Mengompresi & Mengunggah..." : "Tarik & Lepas gambar, atau klik di sini"}
            </p>
            <p className="text-[11px] text-gray-400">{description}</p>
          </div>

          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            ⚡ Auto-kompresi WebP aktif
          </span>
        </div>
      )}
    </div>
  );
}
