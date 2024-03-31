export function getIdFromUrl(url: string): string | null {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch (e) {
    return null;
  }
}
