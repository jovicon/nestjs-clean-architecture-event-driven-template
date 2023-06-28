import { ApiProperty } from '@nestjs/swagger';

export class GetSeasonByYearDTO {
  @ApiProperty()
  year: string;
}

export class CreateClientDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;
}
