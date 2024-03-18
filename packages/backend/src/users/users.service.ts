import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ProfilesService } from "src/profiles/profiles.service";
import { hash } from "src/utils/hash";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly profilesService: ProfilesService,
  ) {}

  getUserByUsername = async (username: string) => {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  };

  createUser = async (username: string, password: string) => {
    const hashed = await hash(password);
    const user = await this.prismaService.user.create({
      data: {
        username: username,
        password: hashed,
      },
    });
    await this.profilesService.createProfile(user.id);
    return user;
  };
}
