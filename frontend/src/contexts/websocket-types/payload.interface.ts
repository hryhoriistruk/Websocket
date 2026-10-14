import { EGatewayActions } from "./ws-enums";

export interface WSPayloadMessage<
  T extends IEventNotification | IMarkAsReadInput,
> {
  type: EGatewayActions;
  message: string;
  payload: T;
}

export interface WSPayload<T extends IEventNotification | IMarkAsReadInput> {
  payload: T;
}

export interface IEventNotification {
  eventId: number;
  notification: any;
}

export interface IMarkAsReadInput {
  notificationId: string;
}

export interface INotifications {
  [eventId: number]: {
    notificationId: number;
    eventId: number;
    readAt: string | null;
  };
}
