import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class BucketsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBucket(userId: string, name: string, description: string) {
    return await this.prisma.bucket.create({
      data: {
        userId,
        name,
        description,
        createdAt: new Date().getTime().toString(),
      },
    });
  }

  async deleteBucket(id: string) {
    return await this.prisma.bucket.delete({
      where: {
        id,
      },
    });
  }

  async getBuckets(userId: string, offset: number, limit: number) {
    return await this.prisma.bucket.findMany({
      where: {
        userId,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getBucketsCount(userId: string) {
    return await this.prisma.bucket.count({
      where: {
        userId,
      },
    });
  }

  async markAsFinished(id: string) {
    return await this.prisma.bucket.update({
      where: {
        id,
      },
      data: {
        finishedAt: new Date().getTime().toString(),
      },
    });
  }
}
