import React, { createContext, useContext, useEffect, useState } from "react";

import {
  IEventNotification,
  INotifications,
} from "./websocket-types/payload.interface";
import { EGatewayActions } from "./websocket-types/ws-enums";
import { useWebSocketContext } from "./WebSocketContext";

interface NotificationsContextProps {
  notifications: INotifications;
  markAsRead: (eventId: number) => void;
  markAsReadAll: () => void;
}

const NotificationsContext = createContext<
  NotificationsContextProps | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { subscribeToNotifications, sendMessage } = useWebSocketContext();
  const [notifications, setNotifications] = useState<INotifications>({});

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    const handleMessage = (payload: IEventNotification) => {
      // console.log("📩 New Notification:", payload);
      setNotifications((prevNotifications) => {
        const eventId = payload.eventId;
        const notification = payload.notification;

        return {
          ...prevNotifications,
          [eventId]: {
            notificationId: notification.id,
            eventId,
            readAt: notification.readAt || null,
          },
        };
      });

      localStorage.setItem("notifications", JSON.stringify(notifications));
    };

    subscribeToNotifications(handleMessage);
  }, [subscribeToNotifications, notifications]);

  const markAsRead = (eventId: number) => {
    const notification = notifications[eventId];
    if (notification?.notificationId) {
      sendMessage(EGatewayActions.MARK_AS_READ, {
        payload: { eventId, notificationId: notification.notificationId },
      });

      setNotifications((prevNotifications) => {
        const updatedNotifications = {
          ...prevNotifications,
          [eventId]: {
            ...prevNotifications[eventId],
            readAt: new Date().toISOString(),
          },
        };

        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
    }
  };

  const markAsReadAll = () => {
    const updatedNotifications = { ...notifications };

    Object.keys(updatedNotifications).forEach((eventId) => {
      updatedNotifications[+eventId].readAt = new Date().toISOString();
    });

    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    Object.keys(notifications).forEach((eventId) => {
      const notification = notifications[+eventId];
      if (notification?.notificationId) {
        sendMessage(EGatewayActions.MARK_AS_READ, {
          payload: {
            eventId: +eventId,
            notificationId: notification.notificationId,
          },
        });
      }
    });
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, markAsRead, markAsReadAll }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
