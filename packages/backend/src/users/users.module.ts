import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "src/prisma.service";
import { ProfilesModule } from "src/profiles/profiles.module";

@Module({
  imports: [ProfilesModule],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
