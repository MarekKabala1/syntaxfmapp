import { GITHUB_RAW_URL } from '@/const';
import type { SnackPackData } from '@/types/snackpack';
import { useQuery } from '@tanstack/react-query';
import { fetchSnackPack } from '../api/snackpack';

export function useSnackPack(url: string = GITHUB_RAW_URL) {
  return useQuery<SnackPackData, Error>({
    queryKey: ['snackpack', url],
    queryFn: () => fetchSnackPack(url),
    enabled: !!url,
    // Show cached data immediately, refetch in background to check for updates
    staleTime: 0,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

