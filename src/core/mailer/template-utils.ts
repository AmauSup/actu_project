
export const formatDate = (date: Date, format: 'short' | 'long' | 'full' = 'long'): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: '2-digit',
    ...(format !== 'short' && { hour: '2-digit', minute: '2-digit' }),
  };

  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' ans';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' mois';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' jours';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' heures';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes';

  return Math.floor(seconds) + ' secondes';
};

export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
};

export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]/g, '-')
    .replace(/-+/g, '-');
};

export const getColorFromText = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const color = (Math.abs(hash) % 16777215).toString(16);
  return '#' + '000000'.substring(0, 6 - color.length) + color;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const generateBadge = (
  text: string,
  backgroundColor = '#667eea',
  textColor = 'white',
): string => {
  const escaped = escapeHtml(text);
  return `<span style="background-color: ${backgroundColor}; color: ${textColor}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block;">${escaped}</span>`;
};

export const generateLink = (
  text: string,
  href: string,
  target = '_blank',
): string => {
  const escapedText = escapeHtml(text);
  const escapedHref = escapeHtml(href);
  return `<a href="${escapedHref}" target="${target}" style="color: #667eea; text-decoration: none;">${escapedText}</a>`;
};

export const generateList = (items: string[], ordered = false): string => {
  const tag = ordered ? 'ol' : 'ul';
  const itemsHtml = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<${tag}>${itemsHtml}</${tag}>`;
};

export const generateTable = (
  headers: string[],
  rows: string[][],
  striped = true,
): string => {
  const headerHtml = headers
    .map((h) => `<th style="padding: 8px; text-align: left; border-bottom: 2px solid #667eea;">${escapeHtml(h)}</th>`)
    .join('');

  const rowsHtml = rows
    .map(
      (row, idx) =>
        `<tr style="background-color: ${striped && idx % 2 === 1 ? '#f9f9f9' : 'transparent'};">
          ${row.map((cell) => `<td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(cell)}</td>`).join('')}
        </tr>`,
    )
    .join('');

  return `<table style="width: 100%; border-collapse: collapse;">${headerHtml}${rowsHtml}</table>`;
};

export const formatPrice = (price: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(price);
};

export const generateParagraphs = (text: string): string => {
  return text.split('\n\n').map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
};
