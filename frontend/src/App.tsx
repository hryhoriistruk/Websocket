import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { EGatewayActions } from "./contexts/websocket-types/ws-enums";
import { useWebSocketContext } from "./contexts/WebSocketContext";

const HTTP_URL = process.env.REACT_APP_HTTP_URL!;

function App() {
  const { subscribeToAllMessages, sendMessage, wsLogin } =
    useWebSocketContext();

  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // Http call for login and get auth token
  const handleLogin = async () => {
    try {
      const response = await fetch(`${HTTP_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@gmail.com",
          password: "1",
        }),
      });
      const data = await response.json();
      setAuthToken(data.token);
      localStorage.setItem("token", data.token);
      wsLogin(data.token);
      toast.success("Logged in successfully");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed");
    }
  };

  // HTTP send message: calls backend endpoint using token
  const handleSendMessageHTTP = async () => {
    try {
      const response = await fetch(`${HTTP_URL}/test-notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const text = await response.text();
      console.log("HTTP response:", text);
    } catch (err) {
      console.error("HTTP message error:", err);
    }
  };

  // WebSocket send message: uses the context function
  const handleSendMessageWS = () => {
    // Adjust payload as expected by your backend
    const body = {
      type: "sendMessage",
      message: "Hello via WebSocket",
      payload: { eventId: 1, notificationId: 1 },
    };
    sendMessage(EGatewayActions.MARK_AS_READ, body);
  };

  // Optionally subscribe to incoming notifications via context
  useEffect(() => {
    subscribeToAllMessages((eventName: EGatewayActions, payload: any) => {
      toast.info(`Incoming message: ${eventName}, \n${payload.message}`);
    });
  }, [subscribeToAllMessages]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          WebSocket Test App
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={authToken}
            margin="normal"
            disabled={true}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 1 }}
          >
            Login
          </Button>
        </Box>
        <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessageHTTP}
          >
            Send HTTP Message
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSendMessageWS}
          >
            Send WebSocket Message
          </Button>
          <Button variant="outlined" onClick={handleSendMessageWS}>
            Mark as Read
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2">
            Notifications
          </Typography>
          <Paper style={{ maxHeight: 300, overflow: "auto" }}></Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
