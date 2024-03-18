import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    userId: string,
    name: string,
    description: string,
    count: number,
    price: number,
    preview: string,
  ) {
    return this.prisma.product.create({
      data: {
        name,
        description,
        count,
        price,
        createdAt: new Date().getTime().toString(),
        userId,
        preview,
      },
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async getProducts(userId: string, page: number, limit: number, name: string) {
    const offset = (page - 1) * limit;
    const products = await this.prisma.product.findMany({
      where: {
        userId,
        name: name || undefined,
      },
      take: limit,
      skip: offset,
    });
    const total = await this.prisma.product.count({
      where: {
        userId,
        name: name || undefined,
      },
    });
    return { products, total };
  }

  async markAsPurchased(id: string) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        purchasedAt: new Date().getTime().toString(),
      },
    });
  }
}
