import type { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ElasticService {
  private _repository: ElasticsearchService;

  constructor(private readonly elasticsearchService: ElasticsearchService) {
    this._repository = this.elasticsearchService;
  }

  create({ id, item }: { id: string; item: any }): Promise<any> {
    try {
      console.log('ElasticService - ITEM: ', item);
      return this._repository.create({
        id,
        index: 'test',
        body: {
          ...item,
        },
      });
    }
    catch (error) {
      console.error('ElasticService - ERROR: ', error);
      throw error;
    }
  }

  // update(id: string, item: T) {
  //   // return this._repository.findByIdAndUpdate(id, item);
  // }

  // delete(id: string): Promise<T> {
  //   // return this._repository.findByIdAndRemove(id);
  // }

  // find(id: string): Promise<any> {
  //   // return this._repository.find({ id }).populate(this._populateOnFind).exec();
  // }

  // findAll(): Promise<T[]> {
  //   // return this._repository.find().populate(this._populateOnFind).exec();
  // }
}
