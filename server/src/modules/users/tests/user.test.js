import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../app.js';
import { prisma } from '../../../db/prisma.js';

describe('Users Module', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Login como admin para obtener token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@gdi.com',
        password: 'admin123',
      });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    // Limpiar usuario de prueba si existe
    if (testUserId) {
      await prisma.user.deleteMany({
        where: { id: testUserId },
      });
    }
    await prisma.$disconnect();
  });

  describe('GET /api/users', () => {
    it('debe obtener lista de usuarios', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('debe fallar sin autenticación', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });

  describe('POST /api/users', () => {
    it('debe crear un nuevo usuario', async () => {
      const newUser = {
        email: 'test.user@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'USER',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.name).toBe(newUser.name);

      testUserId = response.body.data.id;
    });

    it('debe fallar con email duplicado', async () => {
      const duplicateUser = {
        email: 'admin@gdi.com',
        password: 'password123',
        name: 'Duplicate User',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:id', () => {
    it('debe obtener un usuario por ID', async () => {
      if (!testUserId) {
        // Crear usuario si no existe
        const createResponse = await request(app)
          .post('/api/users')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            email: 'get.test@example.com',
            password: 'password123',
            name: 'Get Test User',
          });
        testUserId = createResponse.body.data.id;
      }

      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testUserId);
    });

    it('debe fallar con ID inválido', async () => {
      await request(app)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debe actualizar un usuario', async () => {
      if (!testUserId) return;

      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debe eliminar un usuario', async () => {
      if (!testUserId) return;

      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que fue eliminado
      await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      testUserId = null;
    });
  });
});
