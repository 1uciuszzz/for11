import { ApiProperty } from "@nestjs/swagger";

export class AccountInDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  date: string;
}
