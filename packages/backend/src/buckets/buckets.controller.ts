import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { BucketsService } from "./buckets.service";
import { BucketInDto } from "./dto/bucket.in.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("buckets")
export class BucketsController {
  constructor(private readonly bucketsService: BucketsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createBucket(@Request() request, @Body() payload: BucketInDto) {
    return await this.bucketsService.createBucket(
      request.user.id,
      payload.name,
      payload.description,
    );
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteBucket(@Param("id") id: string) {
    await this.bucketsService.deleteBucket(id);
    return "Bucket deleted";
  }

  @Get()
  @UseGuards(AuthGuard)
  async getBuckets(
    @Request() request,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    const offset = (page - 1) * limit;
    const buckets = await this.bucketsService.getBuckets(
      request.user.id,
      offset,
      limit,
    );
    const total = await this.bucketsService.getBucketsCount(request.user.id);
    return { buckets, total };
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async markAsFinished(@Param("id") id: string) {
    return await this.bucketsService.markAsFinished(id);
  }
}
