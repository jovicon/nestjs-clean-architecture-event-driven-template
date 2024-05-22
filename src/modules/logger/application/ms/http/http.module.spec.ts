import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
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

  it('/order/health (GET)', () => request(app.getHttpServer()).get('/logger/health').expect(200));

  it('/order/health (GET)', () => request(app.getHttpServer()).get('/logger/health').expect(200));

  // it('/order/season/2022 (GET)', () => request(app.getHttpServer()).get('/order/season/2022').expect(200));
});
