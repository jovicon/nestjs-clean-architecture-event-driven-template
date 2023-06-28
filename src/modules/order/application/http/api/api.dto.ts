import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDTO {
  @ApiProperty({
    type: [String],
  })
  items: string[];
}

export class CreateClientDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;
}
