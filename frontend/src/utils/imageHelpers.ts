/**
 * Returns a safe image src string.
 * - If the value is already a valid data URI (starts with "data:image/"), return it as-is.
 * - If the value is a plain HTTP/HTTPS URL, return it as-is.
 * - Otherwise, return an empty string (or a fallback placeholder).
 *
 * This prevents the erroneous "data:image/jpeg;base64,https://..." pattern
 * that occurs when a base64 prefix is prepended to a plain URL string.
 */
export function getImageSrc(value: string | undefined | null): string {
  if (!value) return '';

  // Already a valid data URI
  if (value.startsWith('data:image/')) {
    return value;
  }

  // Plain HTTP/HTTPS URL
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  // Relative path or asset path
  if (value.startsWith('/') || value.startsWith('./') || value.startsWith('../')) {
    return value;
  }

  // Assume it's raw base64 without the prefix — treat as JPEG data URI
  if (value.length > 100) {
    return `data:image/jpeg;base64,${value}`;
  }

  return value;
}
