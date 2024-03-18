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
import { ProductsService } from "./products.service";
import { ProductInDto } from "./dto/product.in.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Request() request, @Body() payload: ProductInDto) {
    return await this.productsService.createProduct(
      request.user.id,
      payload.name,
      payload.description,
      payload.count,
      payload.price,
      payload.preview,
    );
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteProduct(@Param("id") id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getProducts(
    @Request() request,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("name") name: string,
  ) {
    return this.productsService.getProducts(request.user.id, page, limit, name);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async markAsPurchased(@Param("id") id: string) {
    return this.productsService.markAsPurchased(id);
  }
}
