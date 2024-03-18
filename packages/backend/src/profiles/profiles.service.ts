import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(userId: string) {
    return this.prisma.profile.create({
      data: {
        createdAt: new Date().getTime().toString(),
        userId,
      },
    });
  }

  async updateProfile(
    userId: string,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    phone: string | undefined,
    birthday: string | undefined,
    company: string | undefined,
    salary: number | undefined,
    payday: number | undefined,
  ) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        firstName,
        lastName,
        email,
        phone,
        birthday,
        company,
        salary,
        payday,
      },
    });
  }

  async deleteProfile(userId: string) {
    return this.prisma.profile.delete({
      where: { userId },
    });
  }

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }
}
