import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ProfilesService } from "./profiles.service";
import { ProfileInDto } from "./dto/profile.in.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("profiles")
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Patch()
  @UseGuards(AuthGuard)
  async updateProfile(@Request() request, @Body() payload: ProfileInDto) {
    return this.profilesService.updateProfile(
      request.user.id,
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.phone,
      payload.birthday,
      payload.company,
      payload.salary,
      payload.payday,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getProfile(@Request() request) {
    return this.profilesService.getProfile(request.user.id);
  }
}
