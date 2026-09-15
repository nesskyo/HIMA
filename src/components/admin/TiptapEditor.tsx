"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/utils/image-compression";
import { uploadToStorage } from "@/lib/services/storage";
import { toast } from "sonner";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Tulis isi artikel berita di sini...",
}: TiptapEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#84CC16] hover:underline font-semibold",
        },
      }),
      ImageExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-2xl max-w-full my-4 border border-gray-200 shadow-sm",
        },
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[220px] p-4 font-sans text-gray-800 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false,
  });

  // Keep internal content synced if content prop changes drastically
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-2xl min-h-[260px] bg-gray-50 flex items-center justify-center text-xs text-gray-400">
        Memuat editor teks...
      </div>
    );
  }

  // Action: Add Link
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL tautan:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // Action: Insert Image from URL
  const addImageFromUrl = () => {
    const url = window.prompt("Masukkan URL gambar:", "https://");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Action: Upload Image directly into content
  const handleDirectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Berkas harus berupa gambar");
      return;
    }

    setIsUploadingImage(true);
    try {
      const { compressedFile } = await compressImage(file, {
        maxWidth: 1400,
        quality: 0.82,
        outputFormat: "image/webp",
      });

      const res = await uploadToStorage("cover-berita", compressedFile, "inline-news");
      if (res.url) {
        editor.chain().focus().setImage({ src: res.url }).run();
        toast.success("Gambar berhasil disisipkan ke dalam artikel!");
      } else {
        toast.error("Gagal mengunggah gambar");
      }
    } catch (err: any) {
      toast.error("Gagal menyisipkan gambar");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#84CC16] transition-all">
      {/* Hidden file input for inline image insert */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleDirectImageUpload}
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="bg-gray-50/80 border-b border-gray-200 p-1.5 flex flex-wrap items-center gap-1">
        {/* Bold */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 rounded-lg ${
            editor.isActive("bold") ? "bg-gray-200 text-black font-bold" : "text-gray-600 hover:text-black"
          }`}
          title="Tebal (Ctrl+B)"
        >
          <Bold className="size-3.5" />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 rounded-lg ${
            editor.isActive("italic") ? "bg-gray-200 text-black italic" : "text-gray-600 hover:text-black"
          }`}
          title="Miring (Ctrl+I)"
        >
          <Italic className="size-3.5" />
        </Button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Heading 2 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 px-2 rounded-lg text-xs font-bold ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black" : "text-gray-600 hover:text-black"
          }`}
          title="Judul Bab (H2)"
        >
          <Heading2 className="size-3.5 mr-0.5" /> H2
        </Button>

        {/* Heading 3 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-8 px-2 rounded-lg text-xs font-bold ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-black" : "text-gray-600 hover:text-black"
          }`}
          title="Sub Judul (H3)"
        >
          <Heading3 className="size-3.5 mr-0.5" /> H3
        </Button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Bullet List */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 rounded-lg ${
            editor.isActive("bulletList") ? "bg-gray-200 text-black" : "text-gray-600 hover:text-black"
          }`}
          title="Daftar Poin"
        >
          <List className="size-3.5" />
        </Button>

        {/* Ordered List */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 rounded-lg ${
            editor.isActive("orderedList") ? "bg-gray-200 text-black" : "text-gray-600 hover:text-black"
          }`}
          title="Daftar Nomor"
        >
          <ListOrdered className="size-3.5" />
        </Button>

        {/* Blockquote */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 p-0 rounded-lg ${
            editor.isActive("blockquote") ? "bg-gray-200 text-black" : "text-gray-600 hover:text-black"
          }`}
          title="Kutipan (Quote)"
        >
          <Quote className="size-3.5" />
        </Button>

        {/* Code */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`h-8 w-8 p-0 rounded-lg ${
            editor.isActive("code") ? "bg-gray-200 text-black" : "text-gray-600 hover:text-black"
          }`}
          title="Kode / Monospace"
        >
          <Code className="size-3.5" />
        </Button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Link */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={`h-8 w-8 p-0 rounded-lg ${
            editor.isActive("link") ? "bg-gray-200 text-black" : "text-gray-600 hover:text-black"
          }`}
          title="Sisipkan Tautan"
        >
          <LinkIcon className="size-3.5" />
        </Button>

        {/* Insert Image from URL */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImageFromUrl}
          className="h-8 w-8 p-0 rounded-lg text-gray-600 hover:text-black"
          title="Sisipkan Gambar dari URL"
        >
          <ImageIcon className="size-3.5" />
        </Button>

        {/* Upload Image directly */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          className="h-8 px-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-black gap-1"
          title="Unggah Gambar ke Artikel"
        >
          <Upload className={`size-3.5 ${isUploadingImage ? "animate-spin text-[#84CC16]" : ""}`} />
          {isUploadingImage ? "Mengunggah..." : "Upload Foto"}
        </Button>

        <div className="h-4 w-px bg-gray-300 mx-1 ml-auto" />

        {/* Undo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-black disabled:opacity-30"
          title="Undo"
        >
          <Undo className="size-3.5" />
        </Button>

        {/* Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-black disabled:opacity-30"
          title="Redo"
        >
          <Redo className="size-3.5" />
        </Button>
      </div>

      {/* Editor Body */}
      <div className="bg-white min-h-[220px]">
        <EditorContent editor={editor} />
      </div>

      {/* Editor Footer Help */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-gray-400 font-medium">
        <span>Tiptap Editor Aktif</span>
        <span>Mendukung heading, list, quote, link, & upload foto</span>
      </div>
    </div>
  );
}
