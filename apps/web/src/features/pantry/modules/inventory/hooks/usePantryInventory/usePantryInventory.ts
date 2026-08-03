import useSWR from 'swr';

import { buildQueryString, SWR_KEYS } from '@/shared/api';

import type { PaginatedResponse } from '@omni/shared/common';
import type { PantryProduct, PantrySummary, ListPantryProductsParams } from '@omni/shared/pantry';

const DEFAULT_PRODUCT_PARAMS: ListPantryProductsParams = { page: 1, limit: 50 };

export function usePantrySummary() {
  const { data, error, isLoading } = useSWR<PantrySummary>(SWR_KEYS.pantry.summary);
  return { summary: data ?? null, isLoading, error };
}

export function usePantryProducts(params: Partial<ListPantryProductsParams> = {}) {
  const query = { ...DEFAULT_PRODUCT_PARAMS, ...params };
  const key = `${SWR_KEYS.pantry.products}${buildQueryString(query)}`;
  const { data, error, isLoading } = useSWR<PaginatedResponse<PantryProduct>>(key);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? query.page,
    limit: data?.limit ?? query.limit,
    isLoading,
    error,
  };
}

export function usePantryProduct(productId: string | null | undefined) {
  const key = productId ? SWR_KEYS.pantry.product(productId) : null;
  const { data, error, isLoading } = useSWR<PantryProduct>(key);
  return { product: data ?? null, isLoading, error };
}

export function usePantryProductsSuggest(q: string, limit = 10) {
  const trimmed = q.trim();
  const key = trimmed ? `${SWR_KEYS.pantry.productsSuggest}${buildQueryString({ q: trimmed, limit })}` : null;
  const { data, error, isLoading } = useSWR<Pick<PantryProduct, 'id' | 'name' | 'category' | 'unit'>[]>(key);
  return { items: data ?? [], isLoading, error };
}
