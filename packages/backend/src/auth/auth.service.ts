import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { compare } from "src/utils/hash";
import { TokenPayload } from "./dto/token.payload";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  signIn = async (username: string, password: string) => {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  };

  signUp = async (username: string, password: string) => {
    const user = await this.usersService.getUserByUsername(username);
    if (user) {
      throw new UnauthorizedException("User already exists");
    }
    const newUser = await this.usersService.createUser(username, password);
    return newUser;
  };

  generateToken = async (payload: TokenPayload) => {
    const token = await this.jwtService.signAsync(payload);
    return token;
  };

  getProfile = async (username: string) => {
    const user = await this.usersService.getUserByUsername(username);
    return user;
  };
}
