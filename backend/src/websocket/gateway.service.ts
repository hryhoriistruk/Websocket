import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { config } from '../config';
import { EGatewayActions } from './events-enum';

@WebSocketGateway(config.wsPort)
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebsocketGateway');
  private clients = new Map<number, Socket>();

  constructor(private readonly jwtService: JwtService) {}

  public afterInit(server: Server) {
    this.logger.log('🚀 Init');
  }

  public handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const decoded = this.jwtService.verify(
        Array.isArray(token) ? token[0] : token,
      );
      const userId = decoded.userId;
      this.clients.set(userId, client);
      this.logger.log(
        `🔌 Client connected: ${client.id} with user ID: ${userId}`,
      );
    } catch (error) {
      this.logger.error(`❌ Error: ${error}`);
    }
  }

  public handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Disconnection attempt: ${client.id}`);
    try {
      for (const [userId, socket] of this.clients.entries()) {
        if (socket.id === client.id) {
          this.clients.delete(userId);
          this.logger.log(`🗑️ Removed client with user ID: ${userId}`);
          break;
        }
      }
      this.logger.log(`🔌 Client disconnected: ${client.id}`);
    } catch (error) {
      this.logger.error(`❌ Error: ${error}`);
    }
  }

  public sendNotificationToUser(
    userId: number,
    eventId: number,
    notification: any,
  ): boolean {
    const client = this.clients.get(userId);
    if (client) {
      client.emit(EGatewayActions.SEND_NOTIFICATION, {
        message: "You've got a new notification",
        payload: { eventId, notification },
      });
      return true;
    } else {
      // this.logger.warn(`Client with user ID ${userId} not found`);
      return false;
    }
  }

  public markedAsRead(
    userId: number,
    eventId: number,
    notificationId: number,
  ): void {
    const client = this.clients.get(userId);
    if (!client) return;
    client.emit(EGatewayActions.MARKED_AS_READ, {
      message: 'Notification marked as read',
      payload: {
        eventId,
        notificationId,
      },
    });
  }
}
