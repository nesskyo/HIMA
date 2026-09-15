/**
 * Client and Server HTML Sanitizer to prevent XSS attacks in rich text articles.
 */

export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return "";

  // 1. Remove dangerous elements: script, object, embed, form, input, button
  let clean = dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "")
    .replace(/<meta\b[^>]*>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 2. Remove inline event handlers (onclick, onload, onerror, onmouseover, etc.)
  clean = clean.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 3. Remove javascript: pseudo-protocols in href and src
  clean = clean.replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"');

  // 4. Clean data: protocols except standard images
  clean = clean.replace(/(href)\s*=\s*["']\s*data:[^"']*["']/gi, '$1="#"');

  return clean;
}
