import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign.in.dto";
import { SignUpDto } from "./dto/sign.up.dto";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signIn")
  async signIn(@Body() payload: SignInDto) {
    const user = await this.authService.signIn(
      payload.username,
      payload.password,
    );
    const token = await this.authService.generateToken({
      id: user.id,
      username: user.username,
    });
    return token;
  }

  @Post("signUp")
  async signUp(@Body() payload: SignUpDto) {
    const user = await this.authService.signUp(
      payload.username,
      payload.password,
    );
    user.password = undefined;
    return user;
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  async getProfile(@Request() request) {
    const user = await this.authService.getProfile(request.user.username);
    user.password = undefined;
    return user;
  }
}
