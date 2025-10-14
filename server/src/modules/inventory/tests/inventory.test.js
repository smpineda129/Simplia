import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../app.js';
import { prisma } from '../../../db/prisma.js';

describe('Inventory Module', () => {
  let authToken;
  let testItemId;

  beforeAll(async () => {
    // Login para obtener token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@gdi.com',
        password: 'admin123',
      });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    // Limpiar items de prueba
    if (testItemId) {
      await prisma.inventoryItem.deleteMany({
        where: { id: testItemId },
      });
    }
    await prisma.$disconnect();
  });

  describe('GET /api/inventory', () => {
    it('debe obtener lista de items', async () => {
      const response = await request(app)
        .get('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debe fallar sin autenticación', async () => {
      await request(app)
        .get('/api/inventory')
        .expect(401);
    });
  });

  describe('POST /api/inventory', () => {
    it('debe crear un nuevo item', async () => {
      const newItem = {
        name: 'Laptop Dell',
        quantity: 10,
        category: 'Electrónica',
        price: 1500.00,
      };

      const response = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newItem)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newItem.name);
      expect(response.body.data.quantity).toBe(newItem.quantity);

      testItemId = response.body.data.id;
    });

    it('debe fallar con datos inválidos', async () => {
      const invalidItem = {
        name: 'T',
        quantity: -5,
        category: '',
        price: -100,
      };

      const response = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/inventory/:id', () => {
    it('debe obtener un item por ID', async () => {
      if (!testItemId) {
        const createResponse = await request(app)
          .post('/api/inventory')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Mouse Logitech',
            quantity: 50,
            category: 'Accesorios',
            price: 25.00,
          });
        testItemId = createResponse.body.data.id;
      }

      const response = await request(app)
        .get(`/api/inventory/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testItemId);
    });
  });

  describe('PUT /api/inventory/:id', () => {
    it('debe actualizar un item', async () => {
      if (!testItemId) return;

      const updateData = {
        quantity: 100,
        price: 1200.00,
      };

      const response = await request(app)
        .put(`/api/inventory/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(updateData.quantity);
    });
  });

  describe('GET /api/inventory/stats', () => {
    it('debe obtener estadísticas del inventario', async () => {
      const response = await request(app)
        .get('/api/inventory/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalItems');
      expect(response.body.data).toHaveProperty('totalQuantity');
      expect(response.body.data).toHaveProperty('totalValue');
    });
  });

  describe('DELETE /api/inventory/:id', () => {
    it('debe eliminar un item', async () => {
      if (!testItemId) return;

      const response = await request(app)
        .delete(`/api/inventory/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que fue eliminado
      await request(app)
        .get(`/api/inventory/${testItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      testItemId = null;
    });
  });
});
