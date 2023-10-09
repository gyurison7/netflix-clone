export function makeImagePath(imageId: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format || "original"}/${imageId}`;
}
