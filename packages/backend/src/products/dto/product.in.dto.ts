import { ApiProperty } from "@nestjs/swagger";

export class ProductInDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  preview: string;
}
