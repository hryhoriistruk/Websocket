import { forwardRef, Module } from '@nestjs/common';

import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationHandlerService } from './gateway-handler.service';
import { WebsocketGateway } from './gateway.service';

@Module({
  imports: [forwardRef(() => NotificationsModule)],
  providers: [WebsocketGateway, NotificationHandlerService],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
