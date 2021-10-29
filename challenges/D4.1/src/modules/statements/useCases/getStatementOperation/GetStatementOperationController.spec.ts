import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';
import { Connection } from 'typeorm';
import createConnection from '../../../../shared/infra/typeorm'

import { app } from '../../../../app';
import request from 'supertest';

let connection: Connection;

describe('Statement Controller', () => {
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
    
    
  it('should not be able to fetch balance of a new User in db with correct operation\'s description', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@finapi.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'Deposit Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const statement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 50,
        description: 'Withdraw Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
      
    const { id } = statement.body;
    
    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });
      
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.type).toBe('withdraw'); // failed - buggy
  });
});