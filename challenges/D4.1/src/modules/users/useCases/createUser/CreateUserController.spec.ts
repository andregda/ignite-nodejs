
import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';
import { Connection } from 'typeorm';
import createConnection from '../../../../shared/infra/typeorm'

import { app } from '../../../../app';
import request from 'supertest';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll( async () => {
    connection = await createConnection();
    await connection.runMigrations();
    
    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at, updated_at)
      VALUES ( $1, $2, $3, $4, $5, $6 )`,
      [
        id, 'admin', 'admin@finapi.com.br', password, 'now()', 'now()'
      ]
    );
  });
  
  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  });
    
    
    it('should not be able to create a new User in db', async () => {
      const response = await request(app).post('/api/v1/sessions').send({
        email: 'admin@finapi.com.br',
        password: 'admin',
      });

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('admin@finapi.com.br');
    });
});