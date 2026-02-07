import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { CoreModule } from '@modules/order/application/ms/http/core/core.module';
import { Test } from '@nestjs/testing';

import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', () =>
    request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'success', message: 'NestJS is working!!!' }));
});
