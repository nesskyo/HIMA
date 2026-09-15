import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, User, Share2, Tag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNewsBySlug, getPublishedNews } from "@/lib/services/news";
import { sanitizeHtml } from "@/lib/utils/sanitize-html";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export async function generateStaticParams() {
  try {
    const { getPublishedNews } = await import("@/lib/services/news");
    const news = await getPublishedNews();
    return news.map((item) => ({ slug: item.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return { title: "Berita Tidak Ditemukan" };
  }

  return {
    title: news.judul,
    description: news.ringkasan || "Baca selengkapnya di website resmi HIMA STIE 66 Kendari.",
    openGraph: {
      title: `${news.judul} | HIMA STIE 66 Kendari`,
      description: news.ringkasan || undefined,
      images: news.cover_url ? [{ url: news.cover_url }] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const [news, recentNews] = await Promise.all([
    getNewsBySlug(slug),
    getPublishedNews({ limit: 3 }),
  ]);

  if (!news) {
    notFound();
  }

  const otherNews = recentNews.filter((n) => n.id !== news.id).slice(0, 2);

  return (
    <article className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/berita"
            className="inline-flex items-center text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Kembali ke Katalog Berita
          </Link>
        </div>

        {/* Header Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#FACC15] text-[#1F2937]">
              {news.kategori}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] font-heading tracking-tight leading-tight">
            {news.judul}
          </h1>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] pt-2 pb-6 border-b border-gray-100">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[#84CC16]" />
              {new Date(news.published_at || news.created_at).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5 text-[#FACC15]" />
              Humas HIMA STIE 66
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {news.cover_url && (
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden my-8 shadow-sm">
            <Image
              src={news.cover_url}
              alt={news.judul}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="text-[#374151] leading-relaxed text-base space-y-4 pt-4 border-b border-gray-100 pb-10 [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>img]:rounded-2xl [&>img]:my-6 [&>img]:shadow-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.konten) }}
        />

        {/* Share Section */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
            <Share2 className="size-4 text-[#84CC16]" />
            <span>Bagikan artikel ini ke media sosial:</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `${news.judul} — Baca di: https://himastie66.ac.id/berita/${news.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="brand-lime" size="sm" className="rounded-full text-xs font-bold">
                WhatsApp
              </Button>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                news.judul
              )}&url=${encodeURIComponent(`https://himastie66.ac.id/berita/${news.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="rounded-full text-xs font-medium">
                X / Twitter
              </Button>
            </a>
          </div>
        </div>

        {/* Related News */}
        {otherNews.length > 0 && (
          <div className="pt-12">
            <h3 className="text-xl font-bold font-heading text-[#1F2937] mb-6">
              Berita Terkait Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm card-hover-lift space-y-3"
                >
                  <span className="text-xs font-bold text-[#84CC16] uppercase">
                    {item.kategori}
                  </span>
                  <h4 className="text-base font-bold font-heading text-[#1F2937] line-clamp-2">
                    <Link href={`/berita/${item.slug}`}>{item.judul}</Link>
                  </h4>
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center text-xs font-bold text-[#84CC16] hover:text-[#65A30D]"
                  >
                    <span>Baca</span>
                    <ChevronRight className="size-3.5 ml-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
