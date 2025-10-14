import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../app.js';
import { prisma } from '../../../db/prisma.js';

describe('Reports Module', () => {
  let authToken;

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
    await prisma.$disconnect();
  });

  describe('GET /api/reports/summary', () => {
    it('debe obtener resumen general', async () => {
      const response = await request(app)
        .get('/api/reports/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data).toHaveProperty('inventory');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data.users).toHaveProperty('total');
      expect(response.body.data.inventory).toHaveProperty('totalItems');
    });

    it('debe fallar sin autenticación', async () => {
      await request(app)
        .get('/api/reports/summary')
        .expect(401);
    });
  });

  describe('GET /api/reports/users', () => {
    it('debe obtener reporte de usuarios', async () => {
      const response = await request(app)
        .get('/api/reports/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data).toHaveProperty('stats');
      expect(response.body.data).toHaveProperty('total');
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });
  });

  describe('GET /api/reports/inventory', () => {
    it('debe obtener reporte de inventario', async () => {
      const response = await request(app)
        .get('/api/reports/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('stats');
      expect(Array.isArray(response.body.data.items)).toBe(true);
      expect(response.body.data.stats).toHaveProperty('totalItems');
      expect(response.body.data.stats).toHaveProperty('totalValue');
    });
  });
});
