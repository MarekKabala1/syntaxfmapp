import * as Sentry from '@sentry/react-native';
import type { SnackPackData } from '@/types/snackpack';

const FETCH_TIMEOUT_MS = 20_000;

export async function fetchSnackPack(url: string): Promise<SnackPackData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      const suffix = errorBody ? ` - ${errorBody.slice(0, 200)}` : '';
      const err = new Error(`SnackPack fetch error: ${res.status}${suffix}`);
      Sentry.captureException(err, { extra: { url, status: res.status } });
      throw err;
    }

    const data = (await res.json()) as SnackPackData;
    if (!data?.metadata || !Array.isArray(data.issues)) {
      const err = new Error('Invalid SnackPack data shape');
      Sentry.captureException(err, { extra: { url } });
      throw err;
    }
    return data;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error) {
      const isTimeout = e.name === 'AbortError';
      const message = isTimeout
        ? 'Request timed out. Check your connection and try again.'
        : e.message;
      const err = new Error(message);
      Sentry.captureException(err, { extra: { url, original: e.message } });
      throw err;
    }
    throw e;
  }
}
