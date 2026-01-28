import { GITHUB_ROW_URL } from '@/const';
import type { SnackPackData } from '@/types/snackpack';
import { useQuery } from '@tanstack/react-query';
import { fetchSnackPack } from '../api/snackpack';

export function useSnackPack(url: string = GITHUB_ROW_URL) {
  return useQuery<SnackPackData, Error>({
    queryKey: ['snackpack', url],
    queryFn: () => fetchSnackPack(url),
    enabled: !!url,
    staleTime: 1000 * 60 * 60 * 6,
  });
}

