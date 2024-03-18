import { ApiProperty } from "@nestjs/swagger";

export class BucketInDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
