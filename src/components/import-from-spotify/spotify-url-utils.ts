export function getIdFromUrl(url: string): string | null {
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // Remove any query parameters
    const queryIndex = lastPart.indexOf('?');
    if (queryIndex !== -1) {
      return lastPart.substring(0, queryIndex);
    }
    return lastPart;
  } catch (e) {
    return null;
  }
}
