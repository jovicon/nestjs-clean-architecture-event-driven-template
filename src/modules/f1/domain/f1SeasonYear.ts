import { ValueObject } from '@shared/domain/ValueObject';
import { Result } from '@shared/core/Result';
import { Guard } from '@shared/core/Guard';

interface F1SeasonYearProps {
  value: string;
}

export class F1SeasonYear extends ValueObject<F1SeasonYearProps> {
  static acceptableYears: string[] = ['2022', '2021'];

  get value(): string {
    return this.props.value;
  }

  private constructor(props: F1SeasonYearProps) {
    super(props);
  }

  public static create(props: F1SeasonYearProps): Result<F1SeasonYear> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'season');
    const isOneOf = Guard.isOneOf(props.value, F1SeasonYear.acceptableYears, 'season');

    if (!nullGuardResult.succeeded) {
      return Result.fail<F1SeasonYear>(nullGuardResult.message as string);
    }
    if (!isOneOf.succeeded) {
      throw Error(isOneOf.message?.replace(/([^a-z0-9 ',._\-]+)/gi, ''));
    } else {
      return Result.ok<F1SeasonYear>(new F1SeasonYear(props));
    }
  }
}
