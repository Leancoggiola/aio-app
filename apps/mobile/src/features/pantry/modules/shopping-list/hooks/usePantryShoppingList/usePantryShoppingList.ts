import useSWR from 'swr';

import { API_KEYS } from '@/shared/api';

import type { PantryShoppingListItem } from '@omni/shared/pantry';

export function usePantryShoppingList() {
  const { data, error, isLoading } = useSWR<PantryShoppingListItem[]>(API_KEYS.pantry.shoppingList);
  return { items: data ?? [], isLoading, error };
}
