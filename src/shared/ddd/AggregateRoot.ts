/* eslint-disable no-underscore-dangle */
import { Entity } from './Entity';
// import { UniqueEntityID } from './UniqueEntityID';

export abstract class AggregateRoot<T> extends Entity<T> {}
