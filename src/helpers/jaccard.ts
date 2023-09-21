export function jaccardSimilarity(str1: string, str2: string) {
  const set1 = new Set(str1.split(''));
  const set2 = new Set(str2.split(''));

  const intersection = new Set([...set1].filter(element => set2.has(element)));
  const union = new Set([...set1, ...set2]);

  const similarity = (intersection.size / union.size) * 100;

  return similarity;
}

export function chunkArray(
  array: unknown[],
  chunkSize: number,
  question: string
) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  const search = chunks.map(chunk => {
    return new Promise((resolve, _reject) => {
      for (let index = 0; index < chunk.length; index++) {
        if (jaccardSimilarity(chunk[index] as any, question) >= 70)
          resolve(true);
      }
      resolve(false);
    });
  });
  return search;
}
