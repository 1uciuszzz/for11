import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  createAccount = async (
    name: string,
    balance: number,
    date: string,
    userId: string,
  ) => {
    const account = await this.prismaService.account.create({
      data: {
        name,
        balance,
        date,
        userId,
      },
    });
    return account;
  };

  deleteAccount = async (id: string) => {
    const account = await this.prismaService.account.delete({
      where: {
        id,
      },
    });
    return account;
  };

  getAccounts = async (
    name: string,
    month: string,
    offset: number,
    limit: number,
    userId: string,
  ) => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const accounts = await this.prismaService.account.findMany({
      orderBy: { date: "desc" },
      skip: offset,
      take: limit,
      where: {
        userId,
        name: name ? { contains: name } : undefined,
        date: {
          gte: month ? new Date(month).getTime().toString() : undefined,
          lte: month ? nextMonth.getTime().toString() : undefined,
        },
      },
    });
    return accounts;
  };

  getAccountsCount = async () => {
    const total = await this.prismaService.account.count();
    return total;
  };

  getStatistics = async (userId: string, year: number, month: number) => {
    if (month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      const accounts = await this.prismaService.account.findMany({
        where: {
          userId,
          date: {
            gte: new Date(year, month - 1).getTime().toString(),
            lte: new Date(year, month).getTime().toString(),
          },
        },
      });
      const statistics = days.map((day) => {
        const dayAccounts = accounts.filter(
          (account) => new Date(+account.date).getDate() == day,
        );

        const total = dayAccounts.reduce(
          (acc, account) => acc + account.balance,
          0,
        );
        return { label: day, value: total };
      });
      return statistics;
    } else {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const accounts = await this.prismaService.account.findMany({
        where: {
          userId,
          date: {
            gte: new Date(year, 0).getTime().toString(),
            lte: new Date(year + 1, 0).getTime().toString(),
          },
        },
      });
      const statistics = months.map((month) => {
        const monthAccounts = accounts.filter(
          (account) => new Date(+account.date).getMonth() + 1 == month,
        );
        const total = monthAccounts.reduce(
          (acc, account) => acc + account.balance,
          0,
        );
        return { label: month, value: total };
      });
      return statistics;
    }
  };
}
