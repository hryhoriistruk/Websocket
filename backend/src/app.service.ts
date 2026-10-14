import { Injectable } from '@nestjs/common';
import { NotificationService } from './notifications/notification.service';

@Injectable()
export class AppService {
  constructor(private readonly NotificationService: NotificationService) {}

  public testNotifications(): string {
    this.NotificationService.notifyUser(1, 1, new Date());
    this.NotificationService.markAsRead(1);
    return 'Notifications sent!';
  }
}
