import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) return false;
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
    return true;
  }
}
