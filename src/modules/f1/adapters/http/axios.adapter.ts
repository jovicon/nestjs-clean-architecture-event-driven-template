import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { HttpAdapterService } from '@shared/adapters/http/axios/http.service';

@Injectable()
export class FormulaOneHttpAdapter {
  constructor(private readonly http: HttpAdapterService) {}

  async getF1SeasonByYear(year: string): Promise<any> {
    return this.http.get(`/${year}.json`).then((res) => res.pipe(map((response) => response)).toPromise());
  }
}
