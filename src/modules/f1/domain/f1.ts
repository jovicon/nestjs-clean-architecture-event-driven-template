import { Result } from '@shared/core/Result';
import { Guard } from '@shared/core/Guard';
import { AggregateRoot } from '@shared/domain/AggregateRoot';

import { F1SeasonYear } from './f1SeasonYear';

export interface F1Props {
  season: any;
  seasonYear: F1SeasonYear;
}

export interface F1Json {
  seasonYear: string;
  season: any;
}

export class F1 extends AggregateRoot<F1Props> {
  private constructor(props: F1Props) {
    super(props);
  }

  toJson(): F1Json {
    return {
      season: this.props.season,
      seasonYear: this.props.seasonYear.value,
    };
  }

  public static create(props: F1Props): Result<F1> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.season, argumentName: 'season' },
      { argument: props.seasonYear, argumentName: 'seasonYear' },
    ]);

    if (!guardResult.succeeded) return Result.fail<F1>(guardResult.message as string);

    const advance = new F1({
      ...props,
    });

    return Result.ok<F1>(advance);
  }
}
