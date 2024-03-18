import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { AuthGuard } from "src/auth/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Readable } from "stream";
import { Response } from "express";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @Request() request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const sha256 = await this.filesService.getSHA256(file);
    const isExistingFile = await this.filesService.getFileBySHA256(sha256);
    if (isExistingFile) {
      return isExistingFile;
    }
    return this.filesService.uploadFile(
      request.user.id,
      sha256,
      file.size,
      file.buffer,
      file.mimetype,
    );
  }

  @Get(":id")
  async getFiles(
    @Param("id") id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.filesService.getFiles(id);
    const stream = Readable.from(file.bytes);
    response.set({
      "Content-Disposition": `inline; filename="${file.id}"`,
      "Content-Type": file.mimeType,
    });
    return new StreamableFile(stream);
  }
}
