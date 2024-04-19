import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';

import { Repository } from '@shared/adapters/repository/interface';

@Injectable()
export class MongoRepositoryService<T> implements Repository<T> {
  private _repository: Model<T>;

  private _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  update(id: string, item: T) {
    return this._repository.findByIdAndUpdate(id, item);
  }

  delete(id: string): Promise<any> {
    return this._repository.deleteOne({id: id});
  }

  find(id: string): Promise<any> {
    return this._repository.find({ id }).populate(this._populateOnFind).exec();
  }

  findAll(): Promise<T[]> {
    return this._repository.find().populate(this._populateOnFind).exec();
  }
}
