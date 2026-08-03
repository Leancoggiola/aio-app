import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { api, API_KEYS, invalidateNotificationDigest } from '@/shared/api';

import type {
  AddShoppingListItemPayload,
  CompleteShoppingListItemPayload,
  CreatePantryProductPayload,
  PantryProduct,
  PantryShoppingListItem,
  UpdatePantryProductPayload,
} from '@omni/shared/pantry';

export function usePantryMutations() {
  const { mutate } = useSWRConfig();

  const invalidateSummary = useCallback(async () => {
    await mutate(API_KEYS.pantry.summary, undefined, { revalidate: true });
  }, [mutate]);

  const invalidateProducts = useCallback(async () => {
    await mutate((key: unknown) => typeof key === 'string' && key.startsWith(API_KEYS.pantry.products), undefined, {
      revalidate: true,
    });
  }, [mutate]);

  const invalidateShoppingList = useCallback(async () => {
    await mutate(API_KEYS.pantry.shoppingList, undefined, { revalidate: true });
  }, [mutate]);

  const invalidatePantry = useCallback(async () => {
    await Promise.all([
      invalidateSummary(),
      invalidateProducts(),
      invalidateShoppingList(),
      invalidateNotificationDigest(mutate),
    ]);
  }, [invalidateProducts, invalidateShoppingList, invalidateSummary, mutate]);

  const createProduct = useCallback(
    async (payload: CreatePantryProductPayload) => {
      const product = await api.post<PantryProduct>(API_KEYS.pantry.products, payload);
      await invalidatePantry();
      return product;
    },
    [invalidatePantry]
  );

  const updateProduct = useCallback(
    async (productId: string, payload: UpdatePantryProductPayload) => {
      const product = await api.patch<PantryProduct>(API_KEYS.pantry.product(productId), payload);
      await invalidatePantry();
      return product;
    },
    [invalidatePantry]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      await api.delete(API_KEYS.pantry.product(productId));
      await invalidatePantry();
    },
    [invalidatePantry]
  );

  const generateShoppingList = useCallback(async () => {
    const items = await api.post<PantryShoppingListItem[]>(API_KEYS.pantry.shoppingListGenerate);
    await invalidatePantry();
    return items;
  }, [invalidatePantry]);

  const addShoppingListItem = useCallback(
    async (payload: AddShoppingListItemPayload) => {
      const item = await api.post<PantryShoppingListItem>(API_KEYS.pantry.shoppingListItems, payload);
      await Promise.all([invalidateShoppingList(), invalidateSummary()]);
      return item;
    },
    [invalidateShoppingList, invalidateSummary]
  );

  const completeShoppingListItem = useCallback(
    async (itemId: string, payload: CompleteShoppingListItemPayload) => {
      const result = await api.patch<{ item: PantryShoppingListItem; product?: PantryProduct }>(
        API_KEYS.pantry.shoppingListItemComplete(itemId),
        payload
      );
      await invalidatePantry();
      return result;
    },
    [invalidatePantry]
  );

  const deleteShoppingListItem = useCallback(
    async (itemId: string) => {
      await api.delete(API_KEYS.pantry.shoppingListItem(itemId));
      await Promise.all([invalidateShoppingList(), invalidateSummary()]);
    },
    [invalidateShoppingList, invalidateSummary]
  );

  const clearCheckedShoppingList = useCallback(async () => {
    await api.delete(API_KEYS.pantry.shoppingListChecked);
    await Promise.all([invalidateShoppingList(), invalidateSummary()]);
  }, [invalidateShoppingList, invalidateSummary]);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    generateShoppingList,
    addShoppingListItem,
    completeShoppingListItem,
    deleteShoppingListItem,
    clearCheckedShoppingList,
  };
}
