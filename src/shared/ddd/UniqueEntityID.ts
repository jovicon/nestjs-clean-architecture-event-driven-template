import { nanoid } from 'nanoid'

export class UniqueEntityID {
  private readonly _id: string

  get id(): string {
    return this._id
  }

  constructor(id?: string) {
    this._id = id || nanoid()
  }
}
