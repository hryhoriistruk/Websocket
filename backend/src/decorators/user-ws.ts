import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserArgWS = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client.handshake?.user;
  },
);

export const UserIdWS = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client.handshake?.user?.userId;
  },
);

export interface UserWS {
  userId: number;
  sub: string;
  email: string;
}
