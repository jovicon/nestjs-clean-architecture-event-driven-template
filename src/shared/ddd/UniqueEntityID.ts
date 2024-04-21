import { nanoid } from 'nanoid';
import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string) {
    super(id || nanoid(24));
  }
}
