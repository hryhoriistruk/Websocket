import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuardWS implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;
    try {
      const decoded = this.jwtService.verify(
        Array.isArray(token) ? token[0] : token,
      );
      context.switchToWs().getData().user = decoded;
      (client.handshake as any).user = decoded;
      return true;
    } catch (e) {
      return false;
    }
  }
}
