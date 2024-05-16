import { ApiProperty } from '@nestjs/swagger';

export class CreateLogDTO {
  @ApiProperty({
    type: String,
  })
  trackingId: string;

  @ApiProperty({
    type: [String],
  })
  items: string[];
}
