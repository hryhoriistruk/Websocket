import { forwardRef, Module } from '@nestjs/common';

import { WebsocketModule } from '../websocket/websocket.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [forwardRef(() => WebsocketModule)],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
