import { z } from 'zod';
import { isoDateStringSchema } from '../common/dates';
import { PANTRY_CATEGORIES, PANTRY_UNITS } from './constants';
import { paginationSchema } from '../common/pagination';

export const listPantryProductsSchema = paginationSchema.extend({
  q: z.string().trim().optional(),
  category: z.enum(PANTRY_CATEGORIES).optional(),
});

export type ListPantryProductsParams = z.infer<typeof listPantryProductsSchema>;

export const suggestPantryProductsSchema = z.object({
  q: z.string().trim().min(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type SuggestPantryProductsParams = z.infer<typeof suggestPantryProductsSchema>;

export const createPantryProductSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(PANTRY_CATEGORIES),
  unit: z.enum(PANTRY_UNITS),
  quantity: z.number().nonnegative(),
  minQuantity: z.number().nonnegative().nullable().optional(),
  expiresAt: isoDateStringSchema.nullable().optional(),
});

export type CreatePantryProductPayload = z.infer<typeof createPantryProductSchema>;

export const updatePantryProductSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    category: z.enum(PANTRY_CATEGORIES).optional(),
    unit: z.enum(PANTRY_UNITS).optional(),
    quantity: z.number().nonnegative().optional(),
    minQuantity: z.number().nonnegative().nullable().optional(),
    expiresAt: isoDateStringSchema.nullable().optional(),
  })
  .strict();

export type UpdatePantryProductPayload = z.infer<typeof updatePantryProductSchema>;

export const addShoppingListItemSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    quantityToBuy: z.number().positive(),
    unit: z.enum(PANTRY_UNITS).optional(),
    pantryProductId: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.pantryProductId && !data.name) {
      ctx.addIssue({
        code: 'custom',
        message: 'El nombre es obligatorio si no vinculás un producto',
        path: ['name'],
      });
    }
    if (!data.pantryProductId && !data.unit) {
      ctx.addIssue({
        code: 'custom',
        message: 'La unidad es obligatoria si no vinculás un producto',
        path: ['unit'],
      });
    }
  });

export type AddShoppingListItemPayload = z.infer<typeof addShoppingListItemSchema>;

export const completeShoppingListItemSchema = z.object({
  quantityPurchased: z.number().positive().optional(),
  category: z.enum(PANTRY_CATEGORIES).optional(),
});

export type CompleteShoppingListItemPayload = z.infer<typeof completeShoppingListItemSchema>;
