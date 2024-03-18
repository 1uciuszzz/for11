import { Module } from "@nestjs/common";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, PrismaService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
