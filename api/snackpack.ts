import type { SnackPackData } from '@/types/snackpack';

export async function fetchSnackPack(url: string): Promise<SnackPackData> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    const suffix = errorBody ? ` - ${errorBody.slice(0, 200)}` : '';
    throw new Error(`SnackPack fetch error: ${res.status}${suffix}`);
  }

  const data = (await res.json()) as SnackPackData;

  if (!data?.metadata || !Array.isArray(data.issues)) {
    throw new Error('Invalid SnackPack data shape');
  }

  return data;
}
