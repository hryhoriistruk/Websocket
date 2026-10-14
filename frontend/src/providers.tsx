import React from "react";

import { NotificationsProvider } from "./contexts/NotificationsContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";

const Providers: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <WebSocketProvider>
      <NotificationsProvider>{children}</NotificationsProvider>
    </WebSocketProvider>
  );
};

export default Providers;
