"use client";

import * as React from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { GalleryAlbum, GalleryItem } from "@/types/database.types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function GalleryClient({ albums }: { albums: GalleryAlbum[] }) {
  const [selectedItem, setSelectedItem] = React.useState<GalleryItem | null>(null);

  // Collect all items across albums with album context
  const allItems = albums.flatMap((a) => a.items || []);

  const currentIndex = selectedItem
    ? allItems.findIndex((i) => i.id === selectedItem.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedItem(allItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allItems.length - 1) {
      setSelectedItem(allItems[currentIndex + 1]);
    }
  };

  return (
    <>
      <div className="space-y-16">
        {albums.map((album) => (
          <div key={album.id} className="space-y-6">
            <div className="border-l-4 border-[#FACC15] pl-4">
              <h2 className="text-2xl font-bold font-heading text-[#1F2937]">
                {album.judul}
              </h2>
              {album.deskripsi && (
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{album.deskripsi}</p>
              )}
            </div>

            {/* Item Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(album.items || []).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative h-64 w-full rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm border border-gray-200/80 card-hover-lift"
                >
                  <Image
                    src={item.url}
                    alt={item.caption || "Dokumentasi HIMA STIE 66"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    {item.tipe === "video" ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-[#FACC15]">
                        <Play className="size-4 fill-current" />
                        <span>Video Kegiatan</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-bold text-[#84CC16]">
                        <ImageIcon className="size-4" />
                        <span>Foto Kegiatan</span>
                      </div>
                    )}
                    {item.caption && (
                      <p className="text-xs text-gray-200 mt-1 line-clamp-2">{item.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-0 text-white">
            <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
              {/* Media viewer */}
              {selectedItem.tipe === "video" ? (
                <div className="w-full aspect-video flex items-center justify-center p-4">
                  {selectedItem.url.includes("youtube.com") || selectedItem.url.includes("youtu.be") ? (
                    <iframe
                      src={selectedItem.url.replace("watch?v=", "embed/")}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={selectedItem.url} controls className="max-h-[70vh] rounded-lg" />
                  )}
                </div>
              ) : (
                <div className="relative w-full h-[65vh] sm:h-[75vh]">
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.caption || "Dokumentasi"}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* Navigation Controls */}
              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-6" />
                </button>
              )}

              {currentIndex < allItems.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-6" />
                </button>
              )}

              {/* Caption Bar */}
              {selectedItem.caption && (
                <div className="w-full p-4 bg-black/80 text-center text-xs sm:text-sm text-gray-200">
                  {selectedItem.caption}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
