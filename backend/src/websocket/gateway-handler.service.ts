import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserArgWS, UserIdWS, UserWS } from 'src/decorators/user-ws';

import { config } from '../config';
import { AuthGuardWS } from '../guards/ws.guard';
import { NotificationService } from '../notifications/notification.service';
import { IMArkAsRead, WSPayloadDto } from './events-enum';

@WebSocketGateway(config.wsPort)
export class NotificationHandlerService {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @UseGuards(AuthGuardWS)
  @SubscribeMessage('markAsRead')
  handleMarkAsRead(
    @MessageBody() body: WSPayloadDto<IMArkAsRead>,
    @UserArgWS() user: UserWS,
    @UserIdWS() userId: number,
  ): void {
    console.log('user', { userId, user });

    const { notificationId } = body.payload;
    this.notificationService.markAsRead(notificationId);
  }
}
