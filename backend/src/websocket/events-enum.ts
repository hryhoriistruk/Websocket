import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum EGatewayActions {
  // send notifications
  SEND_NOTIFICATION = 'sendNotification', // event notification sent

  // read notifications
  MARK_AS_READ = 'markAsRead', // notification read
  MARKED_AS_READ = 'markedAsRead', // event notification read
}

export interface WSPayload<
  T extends IEventNotification | IEventNotification2 | IMArkAsRead,
> {
  type: EGatewayActions;
  message: string;
  payload: T;
}

export interface IEventNotification {
  eventId: string;
  notification: any;
}

export interface IEventNotification2 {
  caption: string;
  dataframe: string;
}

export interface IMArkAsRead {
  notificationId: number;
}

export class MarkAsReadDto {
  @IsNumber()
  notificationId: number;
}

export class WSPayloadDto<T> {
  @IsString() type: EGatewayActions;
  @IsString() message: string;
  @ValidateNested() @Type(() => Object) payload: T;
}
