import { EventHandler } from '@shared/commons/core/Event.handler';
import { UniqueEntityID } from './UniqueEntityID';

export abstract class Entity<T> extends EventHandler {
  protected readonly _id: UniqueEntityID;

  public readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    super();

    this._id = id || new UniqueEntityID();
    this.props = props;
  }

  get id(): UniqueEntityID {
    return this._id;
  }
}
