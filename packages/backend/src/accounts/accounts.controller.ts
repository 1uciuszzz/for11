import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { AccountInDto } from "./dto/account.in.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createAccount(@Request() request, @Body() payload: AccountInDto) {
    const account = await this.accountsService.createAccount(
      payload.name,
      payload.balance,
      payload.date,
      request.user.id,
    );
    return account;
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteAccount(@Param("id") id: string) {
    await this.accountsService.deleteAccount(id);
    return "Account deleted";
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAccounts(
    @Request() request,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("name") name: string,
    @Query("month") month: string,
  ) {
    const offset = (page - 1) * limit;
    const accounts = await this.accountsService.getAccounts(
      name,
      month,
      offset,
      limit,
      request.user.id,
    );
    const total = await this.accountsService.getAccountsCount();
    return { accounts, total };
  }

  @Get("statistics")
  @UseGuards(AuthGuard)
  async getStatistics(
    @Request() request,
    @Query("year") year: string,
    @Query("month") month: string,
  ) {
    const statistics = await this.accountsService.getStatistics(
      request.user.id,
      +year,
      +month,
    );
    return statistics;
  }
}
