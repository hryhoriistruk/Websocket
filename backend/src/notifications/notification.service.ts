import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { WebsocketGateway } from '../websocket/gateway.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(forwardRef(() => WebsocketGateway))
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  public notifyUser(userId: number, eventId: number, nextDate: Date): void {
    const isSent = this.websocketGateway.sendNotificationToUser(
      userId,
      eventId,
      {
        id: 1,
        notification: `Event is scheduled for ${nextDate.toISOString()}`,
      },
    );
    if (isSent) {
      this.logger.log(
        `Notification sent for user ID: ${userId} and event ID: ${eventId}`,
      );
    } else {
      this.logger.warn(
        `Notification failed for user ID: ${userId} and event ID: ${eventId}`,
      );
    }
  }

  public markAsRead(notificationId: number): void {
    // add your logic here and replace variables with actual values
    const userId = 1;
    const eventId = 1;
    this.websocketGateway.markedAsRead(userId, eventId, notificationId);
  }
}
