export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
    if (argument === null || argument === undefined) {
      return { succeeded: false, message: `${argumentName} is null or undefined` };
    }
    return { succeeded: true };
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
    // eslint-disable-next-line no-restricted-syntax
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static isNumber(argument: any, argumentName: string): IGuardResult {
    if (typeof argument !== 'number') {
      return { succeeded: false, message: `${argumentName} is not a number` };
    }
    return { succeeded: true };
  }

  public static valueBetween(argument: any, argumentName: string, min: number, max: number): IGuardResult {
    if (argument < min || argument > max) {
      return { succeeded: false, message: `${argumentName} must be between ${min} and ${max}` };
    }
    return { succeeded: true };
  }

  public static isNaN(argument: any, argumentName: string): IGuardResult {
    if (isNaN(argument)) {
      return { succeeded: false, message: `${argumentName} is not a number` };
    }
    return { succeeded: true };
  }

  public static isOneOf(value: any, validValues: any[], argumentName: string): IGuardResult {
    let isValid = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true };
    }
    return {
      succeeded: false,
      message: `${argumentName} '${value}' isn't a correct value.`,
    };
  }

  public static isArray(argument: any, argumentName: string): IGuardResult {
    if (Array.isArray(argument)) {
      return { succeeded: true };
    }
    return { succeeded: false, message: `${argumentName} is not an array` };
  }

  public static checkArrayValues(argument: any, argumentName: string, validValues: any[]): IGuardResult {
    if (Array.isArray(argument)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const value of argument) {
        const result = this.isOneOf(value, validValues, argumentName);
        if (!result.succeeded) return result;
      }

      return { succeeded: true };
    }
    return { succeeded: false, message: `${argumentName} is not an array` };
  }
}
