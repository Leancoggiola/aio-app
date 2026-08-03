import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { createTestApp } from '../../test/createTestApp';
import { AUTH_HEADER, TEST_USER } from '../../test/constants';
import { paginatedEmpty, pantryProduct, pantryShoppingListItem, pantrySummary } from '../../test/fixtures/lifestyle';
import * as pantryService from '../../pantry/pantry.service';

vi.mock('../../pantry/pantry.service');

const mockedPantry = vi.mocked(pantryService);

describe('pantry routes', () => {
  const app = createTestApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedPantry.getSummary.mockResolvedValue(pantrySummary);
    mockedPantry.listProducts.mockResolvedValue(paginatedEmpty);
    mockedPantry.suggestProducts.mockResolvedValue([]);
    mockedPantry.getProduct.mockResolvedValue(pantryProduct);
    mockedPantry.createProduct.mockResolvedValue(pantryProduct);
    mockedPantry.updateProduct.mockResolvedValue(pantryProduct);
    mockedPantry.deleteProduct.mockResolvedValue(undefined);
    mockedPantry.listShoppingList.mockResolvedValue([]);
    mockedPantry.generateShoppingList.mockResolvedValue([]);
    mockedPantry.addShoppingListItem.mockResolvedValue(pantryShoppingListItem);
    mockedPantry.completeShoppingListItem.mockResolvedValue({ item: pantryShoppingListItem, product: pantryProduct });
    mockedPantry.deleteShoppingListItem.mockResolvedValue(undefined);
    mockedPantry.clearCheckedShoppingList.mockResolvedValue(undefined);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/pantry/summary');
    expect(res.status).toBe(401);
  });

  it('GET /summary returns pantry summary', async () => {
    const res = await request(app).get('/api/pantry/summary').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(pantrySummary);
    expect(mockedPantry.getSummary).toHaveBeenCalledWith(TEST_USER.userId);
  });

  it('GET /products returns paginated products', async () => {
    const res = await request(app).get('/api/pantry/products').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(mockedPantry.listProducts).toHaveBeenCalledWith(TEST_USER.userId, expect.any(Object));
  });

  it('GET /products/suggest requires q param', async () => {
    const res = await request(app).get('/api/pantry/products/suggest').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(400);
  });

  it('GET /products/suggest returns suggestions', async () => {
    const res = await request(app).get('/api/pantry/products/suggest?q=ar').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(mockedPantry.suggestProducts).toHaveBeenCalled();
  });

  it('POST /products creates product', async () => {
    const payload = {
      name: 'Arroz',
      category: 'GRAINS',
      unit: 'UNITS',
      quantity: 2,
    };
    const res = await request(app).post('/api/pantry/products').set('Authorization', AUTH_HEADER).send(payload);
    expect(res.status).toBe(201);
    expect(mockedPantry.createProduct).toHaveBeenCalledWith(TEST_USER.userId, payload);
  });

  it('PATCH /products/:id updates product', async () => {
    const res = await request(app)
      .patch('/api/pantry/products/prod-1')
      .set('Authorization', AUTH_HEADER)
      .send({ quantity: 3 });
    expect(res.status).toBe(200);
    expect(mockedPantry.updateProduct).toHaveBeenCalledWith(TEST_USER.userId, 'prod-1', { quantity: 3 });
  });

  it('DELETE /products/:id returns 204', async () => {
    const res = await request(app).delete('/api/pantry/products/prod-1').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(204);
    expect(mockedPantry.deleteProduct).toHaveBeenCalledWith(TEST_USER.userId, 'prod-1');
  });

  it('GET /shopping-list returns items', async () => {
    const res = await request(app).get('/api/pantry/shopping-list').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(mockedPantry.listShoppingList).toHaveBeenCalledWith(TEST_USER.userId);
  });

  it('POST /shopping-list/generate generates list', async () => {
    const res = await request(app).post('/api/pantry/shopping-list/generate').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(mockedPantry.generateShoppingList).toHaveBeenCalledWith(TEST_USER.userId);
  });

  it('POST /shopping-list/items creates item', async () => {
    const payload = { name: 'Leche', quantityToBuy: 1, unit: 'UNITS' };
    const res = await request(app)
      .post('/api/pantry/shopping-list/items')
      .set('Authorization', AUTH_HEADER)
      .send(payload);
    expect(res.status).toBe(201);
    expect(mockedPantry.addShoppingListItem).toHaveBeenCalledWith(TEST_USER.userId, payload);
  });

  it('DELETE /shopping-list/checked returns 204', async () => {
    const res = await request(app).delete('/api/pantry/shopping-list/checked').set('Authorization', AUTH_HEADER);
    expect(res.status).toBe(204);
    expect(mockedPantry.clearCheckedShoppingList).toHaveBeenCalledWith(TEST_USER.userId);
  });
});
