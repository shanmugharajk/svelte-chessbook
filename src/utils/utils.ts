export async function sleep(ms: number = 500) {
  return new Promise((resolve, _) => setTimeout(() => resolve(true), ms));
}
