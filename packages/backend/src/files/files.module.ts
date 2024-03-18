import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
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
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
