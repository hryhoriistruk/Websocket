import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

import { WSPayloadMessage } from "./websocket-types/payload.interface";
import { EGatewayActions } from "./websocket-types/ws-enums";

const WEBSOCKET_URL = process.env.REACT_APP_WS_URL!;

interface WebSocketContextType {
  sendMessage: (event: EGatewayActions, payload: any) => void;
  subscribeToAllMessages: (
    callback: (eventName: EGatewayActions, payload: any) => void
  ) => void;
  subscribeToNotifications: (callback: (payload: any) => void) => void;
  status: string | null;
  setStatus: (status: string | null) => void;
  wsLogin: (token: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) setToken(authToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const socketInstance: Socket = io(WEBSOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ WebSocket connection established");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

    socketInstance.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        console.error("❌ WebSocket connection closed unexpectedly");
      } else {
        console.log("🔒 WebSocket connection closed", reason);
      }
    });
  }, [token]);

  const sendMessage = (event: EGatewayActions, payload: any) => {
    if (socket && socket.connected) socket.emit(event, payload);
    else console.error("WebSocket is not connected");
  };

  const subscribeToAllMessages = useCallback(
    (callback: (eventName: EGatewayActions, message: any) => void) => {
      if (socket) socket.onAny(callback);
    },
    [socket]
  );

  const subscribeToNotifications = useCallback(
    (callback: (payload: any) => void) => {
      if (socket) {
        socket.on(EGatewayActions.SEND_NOTIFICATION, (data) => {
          callback(data.payload);
        });
      }
    },
    [socket]
  );

  // DEBUG: ForTests
  useEffect(() => {
    if (socket) socket.on("message", globalMessageHandler);
  }, [socket]);

  const globalMessageHandler = (message: WSPayloadMessage<any>) => {
    const type = message.type;
    switch (type) {
      case EGatewayActions.MARK_AS_READ:
        break;
      case EGatewayActions.SEND_NOTIFICATION:
        break;
      case EGatewayActions.MARKED_AS_READ:
        break;
      default:
        console.log("Unknown message type:", type);
    }
  };

  const wsLogin = (token: string) => {
    setToken(token);
  };

  return (
    <WebSocketContext.Provider
      value={{
        sendMessage,
        subscribeToAllMessages,
        subscribeToNotifications,
        status,
        setStatus,
        wsLogin,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
