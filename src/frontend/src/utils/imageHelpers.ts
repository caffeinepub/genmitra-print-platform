/**
 * Safely returns an image src string.
 * - data URIs (starting with 'data:image/') are returned unchanged
 * - HTTP/HTTPS URLs are returned unchanged
 * - Relative paths are returned unchanged
 * - Raw base64 strings (no prefix) get 'data:image/jpeg;base64,' prepended
 * - Empty strings return empty string
 */
export function getImageSrc(imageData: string | undefined | null): string {
  if (!imageData) return "";

  // Already a data URI
  if (imageData.startsWith("data:image/")) {
    return imageData;
  }

  // HTTP or HTTPS URL
  if (imageData.startsWith("http://") || imageData.startsWith("https://")) {
    return imageData;
  }

  // Relative path (starts with / or ./)
  if (
    imageData.startsWith("/") ||
    imageData.startsWith("./") ||
    imageData.startsWith("../")
  ) {
    return imageData;
  }

  // Raw base64 string — prepend data URI prefix
  if (imageData.length > 0) {
    return `data:image/jpeg;base64,${imageData}`;
  }

  return "";
}
