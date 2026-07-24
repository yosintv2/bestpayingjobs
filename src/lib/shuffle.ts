export function seededShuffle<T>(array: T[], seed: string): T[] {
  const result = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  let a = (hash >>> 0) % result.length || 1;
  let b = ((hash >>> 8) ^ (hash >>> 16)) % result.length || 1;
  for (let i = result.length - 1; i > 0; i--) {
    a = (a * 16807 + i) % result.length;
    b = (b * 48271 + i) % result.length;
    const j = (a + b) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
