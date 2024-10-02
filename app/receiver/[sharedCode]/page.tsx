"use client";
import { useEffect, useRef, useState } from "react";
interface typeMessage {
  event: string;
  sdp?: any;
  destination?: string;
  origin?: string;
  nuberOfFile?: number;
  candidate?: any;
}

export default function Page({ params }: { params: { sharedCode: string } }) {
  const destination = params.sharedCode;
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<typeMessage>();

  const exchangeInformation = async () => {
    const socket = socketRef.current;
    if (!socket) return;
    const pc = new RTCPeerConnection();
    try {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.send(
          JSON.stringify({
            event: "EVENT_REMOTE_DESCRIPTION",
            sdp: pc.localDescription,
            destination,
            origin: message?.origin,
            from: "Client on negotiation",
          })
        );
      };
    } catch (err) {
      console.error("Error during negotiation:", err);
    }

    // ICE candidate handling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            event: "EVENT_ICE_CANDIDATE",
            candidate: event.candidate,
            destination,
            origin: message?.origin,
            from: "Client iceCandidate",
          })
        );
      }
    };

    // Handling WebSocket messages (SDP or ICE candidates)
    // two side onmessage works bez this is under a function but in host it is not possible
    socket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      //update this if you want to update the display
      setMessage(parsedMessage);
      console.log("Parsed message:", parsedMessage);
      if (parsedMessage.event === "EVENT_REMOTE_DESCRIPTION") {
        pc.setRemoteDescription(parsedMessage.sdp);
      } else if (parsedMessage.event === "EVENT_ICE_CANDIDATE") {
        pc.addIceCandidate(parsedMessage.candidate);
      }
    };

    // file transfer should happen here
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    pc.addTrack(stream.getVideoTracks()[0]);
  };

  useEffect(() => {
    // Check if the WebSocket is already connected
    if (socketRef.current) return;

    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // Send initial message after connection
      socket.send(
        JSON.stringify({
          event: "EVENT_CONNECTION_REQUEST",
          destination,
          from: "Client",
        })
      );
    };

    socket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      console.log("Parsed message:", parsedMessage);
      setMessage(parsedMessage);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      {isConnected ? "Connected" : "Disconnected"}
      <div>
        {message ? (
          <>
            {JSON.stringify(message)}{" "}
            <button onClick={exchangeInformation}>Download</button>
          </>
        ) : (
          <>Loading ...........</>
        )}
      </div>
    </div>
  );
}
