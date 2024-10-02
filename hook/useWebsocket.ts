"use client";
import { useState, useEffect, useRef } from "react";

interface typeData {
  shareCode: string;
}

interface typeMessage {
  event: string;
  data?: typeData;
}

interface typeEvent {
  event: string;
  destination?: string;
  origin?: string;
}

const useWebSocket = (url: string, event: typeEvent) => {
  const [message, setMessage] = useState<typeMessage>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;
    if (socketRef.current) return;

    socket.onopen = () => {
      console.log("WebSocket connected");
      sendMessage(event);
      console.log("message sent");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Parsed message:", message);
      setMessage(message);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up the socket when the component unmounts or URL changes
    return () => {
      console.log("Cleaning up WebSocket connection");
      if (socket) {
        socket.close();
      }
    };
  }, [url]);

  const sendMessage = (msg: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.warn("WebSocket is not open. Cannot send message");
    }
  };

  return { message, isConnected, sendMessage };
};

export default useWebSocket;
