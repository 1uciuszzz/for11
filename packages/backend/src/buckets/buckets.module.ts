import { Module } from "@nestjs/common";
import { BucketsController } from "./buckets.controller";
import { BucketsService } from "./buckets.service";
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
  controllers: [BucketsController],
  providers: [BucketsService, PrismaService],
})
export class BucketsModule {}
