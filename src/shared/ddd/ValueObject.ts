interface ValueObjectProps {
  [index: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */

export abstract class ValueObject<T extends ValueObjectProps> {
  public props: T;

  constructor(props: T) {
    const baseProps: any = {
      ...props,
    };

    this.props = baseProps as T;
  }
}
