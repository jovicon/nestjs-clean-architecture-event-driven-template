import { Test, TestingModule } from '@nestjs/testing';

import { HttpAdapterModule } from '@shared/adapters/http/axios/http.module';

import { GetSeasonByYearController } from '../useCases/GetSeasonByYear/GetSeasonByYear.controller';
import { GetSeasonByYearUseCase } from '../useCases/GetSeasonByYear/GetSeasonByYear.usecase';

import { FormulaOneHttpAdapter } from '../../adapters/http/axios.adapter';

import { Logger } from './config/logger';

import { CoreModule } from './core/core.module';
import CoreController from './core/core.controller';

import { FormulaOneModule } from './api/api.module';
import { ApiController } from './api/api.controller';
import ApiService from './api/api.service';

describe('CoreController', () => {
  let appController: CoreController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    appController = app.get<CoreController>(CoreController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck().status).toBe('success');
    });
  });
});

describe('ApiController', () => {
  let appController: ApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [FormulaOneModule, HttpAdapterModule, Logger],
      controllers: [ApiController],
      providers: [ApiService, GetSeasonByYearController, GetSeasonByYearUseCase, FormulaOneHttpAdapter],
    }).compile();

    appController = app.get<ApiController>(ApiController);
  });

  describe('getSeasonByYear', () => {
    it('should return "success"', async () => {
      const dto = {
        year: '2022',
      };
      expect(await (await appController.getSeasonByYear(dto)).status).toBe('success');
    });

    it('should return "error"', async () => {
      const dto = {
        year: '2023',
      };

      expect(await (await appController.getSeasonByYear(dto)).status).toBe('error');
    });
  });
});
