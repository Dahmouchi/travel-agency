// utils/safeHTML.ts
export function safeHtmlToText(html: string): string {
  // Clean the HTML and return plain text
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
