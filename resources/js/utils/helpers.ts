
/**
 * Format a date string
 * @param dateString - Date string to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date
 */
export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Strip HTML tags from a string
 * @param html - HTML string
 * @returns Text without HTML tags
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

/**
 * Create excerpt from text
 * @param text - Text to create excerpt from
 * @param length - Max length of excerpt
 * @returns Excerpt
 */
export const createExcerpt = (text: string, length: number = 150): string => {
  if (!text) return '';

  const strippedText = stripHtml(text);

  if (strippedText.length <= length) return strippedText;

  return strippedText.substring(0, length) + '...';
};
