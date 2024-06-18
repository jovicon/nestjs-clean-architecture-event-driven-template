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

  public static isPositiveNumber(argument: number, argumentName: string): IGuardResult {
    if (argument <= 0) {
      return { succeeded: false, message: `${argumentName} is not greater than 0` };
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

  public static againstAtLeast(numChars: number, text: string, argumentName: string): IGuardResult {
    if (text.length < numChars) {
      return { succeeded: false, message: `${argumentName} is not at least ${numChars} chars.` };
    }
    return { succeeded: true };
  }

  public static againstAtMost(numChars: number, text: string, argumentName: string): IGuardResult {
    if (text.length > numChars) {
      return { succeeded: false, message: `${argumentName} is greater than ${numChars} chars.` };
    }
    return { succeeded: true };
  }

  public static isValidRut(value: string): IGuardResult {
    const validator = {
      validatingRut: (rut: string) => {
        if (!rut.includes('-')) {
          return false;
        }

        const cleanRut = validator.rutClean(rut);
        let rutDigits = parseInt(cleanRut.slice(0, -1), 10);
        let m = 0;
        let s = 1;

        while (rutDigits > 0) {
          s = (s + (rutDigits % 10) * (9 - (m++ % 6))) % 11;
          rutDigits = Math.floor(rutDigits / 10);
        }

        const checkDigit = s > 0 ? String(s - 1) : 'K';

        return checkDigit === cleanRut.slice(-1);
      },
      rutClean: (rut: string) => (typeof rut === 'string' ? rut.replace(/[^0-9kK]+/g, '').toUpperCase() : ''),
    };

    const isValidRut = validator.validatingRut(value);

    return {
      succeeded: isValidRut,
      message: isValidRut ? '' : 'Rut invalido',
    };
  }

  /**
   * Checks if value is empty. Accepts strings, numbers, booleans, objects and arrays.
   */
  static isEmpty(value: unknown): boolean {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return false;
    }
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    if (value instanceof Date) {
      return false;
    }
    if (value instanceof Object && !Object.keys(value).length) {
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true;
      }
      if (value.every((item) => Guard.isEmpty(item))) {
        return true;
      }
    }
    if (value === '') {
      return true;
    }

    return false;
  }
}
