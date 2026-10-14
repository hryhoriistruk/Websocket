import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class HttpGuard implements CanActivate {
  private readonly logger = new Logger(HttpGuard.name);

  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers.authorization;
    if (!token) {
      this.logger.warn('No token provided');
      return false;
    }

    try {
      // If the token is prefixed with 'Bearer ', extract the actual token value
      const actualToken = token.startsWith('Bearer ')
        ? token.slice(7).trim()
        : token;
      const decoded = this.jwtService.verify(actualToken);
      request.user = decoded;
      return true;
    } catch (e) {
      this.logger.error(`JWT verification failed: ${e.message}`);
      return false;
    }
  }
}
