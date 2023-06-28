import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
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

  it('/f1/health (GET)', () => request(app.getHttpServer()).get('/f1/health').expect(200));

  it('/f1/health (GET)', () => request(app.getHttpServer()).get('/f1/health').expect(200));

  it('/f1/season/2022 (GET)', () => request(app.getHttpServer()).get('/f1/season/2022').expect(200));
});
