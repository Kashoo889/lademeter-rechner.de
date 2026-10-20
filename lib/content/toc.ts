export type TocEntry = {
  id: string;
  text: string;
};

function slugify(text: string, seen: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

/**
 * Adds `id` attributes to every <h2> in the rendered article HTML and returns
 * a matching table-of-contents list, so the on-page TOC can deep-link into
 * sections. Also wraps tables for horizontal scrolling on small screens.
 */
export function addHeadingIdsAndExtractToc(html: string): { html: string; toc: TocEntry[] } {
  const seen = new Map<string, number>();
  const toc: TocEntry[] = [];

  const updatedHtml = html
    .replace(/<h2>(.*?)<\/h2>/g, (_match, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const id = slugify(text, seen);
      toc.push({ id, text });
      return `<h2 id="${id}">${inner}</h2>`;
    })
    .replace(/<table>/g, '<div class="table-scroll" tabindex="0" role="region" aria-label="Tabelle"><table>')
    .replace(/<\/table>/g, "</table></div>");

  return { html: updatedHtml, toc };
}
