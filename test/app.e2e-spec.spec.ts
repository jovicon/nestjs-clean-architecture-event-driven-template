import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HttpModule } from '@modules/order/application/ms/http/http.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => request(app.getHttpServer()).get('/').expect(200).expect('Hello World!'));

  it('/f1/season/2022 (GET)', () => request(app.getHttpServer()).get('/f1/season/2022').expect(200));
});
