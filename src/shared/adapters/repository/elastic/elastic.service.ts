import { Injectable } from '@nestjs/common';

import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService<T> {
  private _repository: ElasticsearchService;

  constructor(private readonly elasticsearchService: ElasticsearchService) {
    this._repository = elasticsearchService;
  }

  create(item: T): Promise<any> {
    console.log('ElasticService', item);
    return this._repository.create({ id: '1', index: 'test', body: item });
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
