import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class ProfileInDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  firstName: string | undefined;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  lastName: string | undefined;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  email: string | undefined;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  phone: string | undefined;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  birthday: string | undefined;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  company: string | undefined;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  salary: number | undefined;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined)
  payday: number | undefined;
}
