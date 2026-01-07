import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpModule } from './http.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/order/health (GET)', () => request(app.getHttpServer()).get('/order/health').expect(200));

  it('/order/health (GET)', () => request(app.getHttpServer()).get('/order/health').expect(200));
});
