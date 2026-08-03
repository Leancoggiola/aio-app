import type {
  AddShoppingListItemPayload,
  CompleteShoppingListItemPayload,
  CreatePantryProductPayload,
  ListPantryProductsParams,
  PantryProduct,
  PantryShoppingListItem,
  PantrySummary,
  SuggestPantryProductsParams,
  UpdatePantryProductPayload,
} from '@omni/shared/pantry';
import { isExpiringSoon, isLowStock } from '@omni/shared/pantry';
import { parseIsoDateString, startOfTodayInAppTz } from '@omni/shared/common';
import type { PantryProduct as PrismaPantryProduct } from '../generated/prisma/client';
import { paginationSkipTake } from '@omni/shared/common';

import { prisma } from '../common/db';
import { decimalToNumber, normalizeName, toIsoDateString, toIsoDateTimeString } from '../common/utils/lifestyle';

function mapProduct(row: PrismaPantryProduct, today = startOfTodayInAppTz()): PantryProduct {
  const quantity = decimalToNumber(row.quantity) ?? 0;
  const minQuantity = decimalToNumber(row.minQuantity);
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    quantity,
    minQuantity,
    expiresAt: row.expiresAt ? toIsoDateString(row.expiresAt) : null,
    isLowStock: isLowStock(quantity, minQuantity),
    isExpiringSoon: isExpiringSoon(row.expiresAt, today),
    createdAt: toIsoDateTimeString(row.createdAt),
    updatedAt: toIsoDateTimeString(row.updatedAt),
  };
}

function computeQuantityToBuy(quantity: number, minQuantity: number): number {
  const diff = minQuantity - quantity;
  return Math.max(Math.ceil(diff), 1);
}

async function getOwnedProduct(userId: string, productId: string) {
  const product = await prisma.pantryProduct.findFirst({ where: { id: productId, userId } });
  if (!product) throw { status: 404, message: 'Producto no encontrado' };
  return product;
}

export async function getSummary(userId: string): Promise<PantrySummary> {
  const today = startOfTodayInAppTz();
  const products = await prisma.pantryProduct.findMany({ where: { userId } });
  let lowStockCount = 0;
  let expiringSoonCount = 0;
  for (const p of products) {
    const quantity = decimalToNumber(p.quantity) ?? 0;
    const minQuantity = decimalToNumber(p.minQuantity);
    if (isLowStock(quantity, minQuantity)) lowStockCount += 1;
    if (isExpiringSoon(p.expiresAt, today)) expiringSoonCount += 1;
  }
  const shoppingListCount = await prisma.pantryShoppingListItem.count({
    where: { userId, checked: false },
  });
  return {
    totalProducts: products.length,
    expiringSoonCount,
    lowStockCount,
    shoppingListCount,
  };
}

export async function listProducts(userId: string, params: ListPantryProductsParams) {
  const { skip, take } = paginationSkipTake(params);
  const where = {
    userId,
    ...(params.category && { category: params.category }),
    ...(params.q && {
      OR: [
        { name: { contains: params.q, mode: 'insensitive' as const } },
        { nameNormalized: { contains: normalizeName(params.q), mode: 'insensitive' as const } },
      ],
    }),
  };
  const [items, total] = await Promise.all([
    prisma.pantryProduct.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
    prisma.pantryProduct.count({ where }),
  ]);
  const today = startOfTodayInAppTz();
  return { items: items.map(p => mapProduct(p, today)), total, page: params.page, limit: params.limit };
}

export async function suggestProducts(userId: string, params: SuggestPantryProductsParams) {
  const q = normalizeName(params.q);
  const items = await prisma.pantryProduct.findMany({
    where: {
      userId,
      OR: [{ nameNormalized: { contains: q } }, { name: { contains: params.q.trim(), mode: 'insensitive' } }],
    },
    take: params.limit,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, category: true, unit: true },
  });
  return items;
}

export async function getProduct(userId: string, productId: string) {
  const product = await getOwnedProduct(userId, productId);
  return mapProduct(product);
}

export async function createProduct(userId: string, dto: CreatePantryProductPayload) {
  const nameNormalized = normalizeName(dto.name);
  const existing = await prisma.pantryProduct.findUnique({
    where: { userId_nameNormalized: { userId, nameNormalized } },
  });
  if (existing) throw { status: 409, message: 'Ya existe un producto con ese nombre' };

  const product = await prisma.pantryProduct.create({
    data: {
      userId,
      name: dto.name.trim(),
      nameNormalized,
      category: dto.category,
      unit: dto.unit,
      quantity: dto.quantity,
      minQuantity: dto.minQuantity ?? null,
      expiresAt: dto.expiresAt ? parseIsoDateString(dto.expiresAt) : null,
    },
  });
  return mapProduct(product);
}

export async function updateProduct(userId: string, productId: string, dto: UpdatePantryProductPayload) {
  const current = await getOwnedProduct(userId, productId);
  let nameNormalized = current.nameNormalized;
  if (dto.name && normalizeName(dto.name) !== current.nameNormalized) {
    nameNormalized = normalizeName(dto.name);
    const conflict = await prisma.pantryProduct.findUnique({
      where: { userId_nameNormalized: { userId, nameNormalized } },
    });
    if (conflict && conflict.id !== productId) {
      throw { status: 409, message: 'Ya existe un producto con ese nombre' };
    }
  }

  const product = await prisma.pantryProduct.update({
    where: { id: productId },
    data: {
      ...(dto.name !== undefined && { name: dto.name.trim(), nameNormalized }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.unit !== undefined && { unit: dto.unit }),
      ...(dto.quantity !== undefined && { quantity: dto.quantity }),
      ...(dto.minQuantity !== undefined && { minQuantity: dto.minQuantity }),
      ...(dto.expiresAt !== undefined && {
        expiresAt: dto.expiresAt ? parseIsoDateString(dto.expiresAt) : null,
      }),
    },
  });
  return mapProduct(product);
}

export async function deleteProduct(userId: string, productId: string) {
  await getOwnedProduct(userId, productId);
  await prisma.pantryShoppingListItem.deleteMany({
    where: { pantryProductId: productId, source: 'AUTO', checked: false },
  });
  await prisma.pantryProduct.delete({ where: { id: productId } });
}

function mapShoppingItem(
  row: {
    id: string;
    name: string;
    source: 'AUTO' | 'MANUAL';
    quantityToBuy: PrismaPantryProduct['quantity'];
    unit: PrismaPantryProduct['unit'];
    checked: boolean;
    pantryProductId: string | null;
  },
  product?: PrismaPantryProduct | null,
  today = startOfTodayInAppTz()
): PantryShoppingListItem {
  const quantity = product ? (decimalToNumber(product.quantity) ?? 0) : null;
  const minQuantity = product ? decimalToNumber(product.minQuantity) : null;
  return {
    id: row.id,
    name: row.name,
    source: row.source,
    quantityToBuy: decimalToNumber(row.quantityToBuy) ?? 0,
    unit: row.unit,
    checked: row.checked,
    pantryProductId: row.pantryProductId,
    isLowStock: quantity != null && minQuantity != null ? isLowStock(quantity, minQuantity) : false,
    isExpiringSoon: product ? isExpiringSoon(product.expiresAt, today) : false,
    ...(product && {
      linkedProduct: {
        id: product.id,
        name: product.name,
        quantity: quantity ?? 0,
        unit: product.unit,
      },
    }),
  };
}

export async function listShoppingList(userId: string) {
  const items = await prisma.pantryShoppingListItem.findMany({
    where: { userId },
    include: { pantryProduct: true },
    orderBy: [{ checked: 'asc' }, { createdAt: 'desc' }],
  });
  const today = startOfTodayInAppTz();
  return items.map(i => mapShoppingItem(i, i.pantryProduct, today));
}

export async function generateShoppingList(userId: string) {
  const lowStock = await prisma.pantryProduct.findMany({
    where: {
      userId,
      minQuantity: { not: null },
    },
  });

  for (const product of lowStock) {
    const quantity = decimalToNumber(product.quantity) ?? 0;
    const minQuantity = decimalToNumber(product.minQuantity);
    if (minQuantity == null || quantity > minQuantity) continue;

    const quantityToBuy = computeQuantityToBuy(quantity, minQuantity);
    const existing = await prisma.pantryShoppingListItem.findFirst({
      where: {
        userId,
        pantryProductId: product.id,
        source: 'AUTO',
        checked: false,
      },
    });

    if (existing) {
      await prisma.pantryShoppingListItem.update({
        where: { id: existing.id },
        data: { quantityToBuy, name: product.name, unit: product.unit },
      });
    } else {
      await prisma.pantryShoppingListItem.create({
        data: {
          userId,
          pantryProductId: product.id,
          name: product.name,
          source: 'AUTO',
          quantityToBuy,
          unit: product.unit,
        },
      });
    }
  }

  return listShoppingList(userId);
}

export async function addShoppingListItem(userId: string, dto: AddShoppingListItemPayload) {
  if (dto.pantryProductId) {
    const product = await getOwnedProduct(userId, dto.pantryProductId);
    const item = await prisma.pantryShoppingListItem.create({
      data: {
        userId,
        pantryProductId: product.id,
        name: product.name,
        source: 'MANUAL',
        quantityToBuy: dto.quantityToBuy,
        unit: product.unit,
      },
    });
    return mapShoppingItem(item, product);
  }

  const item = await prisma.pantryShoppingListItem.create({
    data: {
      userId,
      name: dto.name!.trim(),
      source: 'MANUAL',
      quantityToBuy: dto.quantityToBuy,
      unit: dto.unit!,
    },
  });
  return mapShoppingItem(item);
}

export async function completeShoppingListItem(userId: string, itemId: string, dto: CompleteShoppingListItemPayload) {
  const item = await prisma.pantryShoppingListItem.findFirst({
    where: { id: itemId, userId },
  });
  if (!item) throw { status: 404, message: 'Ítem no encontrado' };

  const quantityPurchased = dto.quantityPurchased ?? decimalToNumber(item.quantityToBuy) ?? 1;
  let product: PantryProduct | undefined;
  let linkedRow: PrismaPantryProduct | null = null;

  if (item.pantryProductId) {
    const updated = await prisma.pantryProduct.update({
      where: { id: item.pantryProductId },
      data: { quantity: { increment: quantityPurchased } },
    });
    linkedRow = updated;
    product = mapProduct(updated);
  } else {
    const nameNormalized = normalizeName(item.name);
    const existing = await prisma.pantryProduct.findUnique({
      where: { userId_nameNormalized: { userId, nameNormalized } },
    });
    if (existing) {
      const updated = await prisma.pantryProduct.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantityPurchased } },
      });
      linkedRow = updated;
      product = mapProduct(updated);
    } else {
      if (!dto.category) {
        throw { status: 400, message: 'La categoría es obligatoria para productos nuevos' };
      }
      const created = await prisma.pantryProduct.create({
        data: {
          userId,
          name: item.name,
          nameNormalized,
          category: dto.category,
          unit: item.unit,
          quantity: quantityPurchased,
        },
      });
      linkedRow = created;
      product = mapProduct(created);
    }
  }

  await prisma.pantryShoppingListItem.update({
    where: { id: itemId },
    data: { checked: true },
  });

  return { item: mapShoppingItem({ ...item, checked: true }, linkedRow), product };
}

export async function deleteShoppingListItem(userId: string, itemId: string) {
  const item = await prisma.pantryShoppingListItem.findFirst({ where: { id: itemId, userId } });
  if (!item) throw { status: 404, message: 'Ítem no encontrado' };
  await prisma.pantryShoppingListItem.delete({ where: { id: itemId } });
}

export async function clearCheckedShoppingList(userId: string) {
  await prisma.pantryShoppingListItem.deleteMany({ where: { userId, checked: true } });
}
