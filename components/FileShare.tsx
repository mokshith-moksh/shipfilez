"use client";
import React, { useEffect, useRef, useState } from "react";

interface typeData {
  shareCode: string;
}

interface typeMessage {
  event: string;
  shareCode: string;
  destination?: string;
  origin?: string;
  sdp: any;
  candidate: any;
}

interface FileShareProps {
  files: File[];
}

const FileShare: React.FC<FileShareProps> = ({ files }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<typeMessage | null>(null);
  const urlRef = useRef<HTMLDivElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null); // WebRTC Peer Connection reference

  // Function to copy text to clipboard
  const CopyText = () => {
    if (urlRef.current) {
      const textToCopy = urlRef.current.innerText;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log("Text copied to clipboard:", textToCopy);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  // Function to handle WebRTC negotiation
  const startWebRTCNegotiation = async (parsedMessage: typeMessage) => {
    const socket = socketRef.current;
    if (!socket) return;

    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // Generate offer and handle ICE candidates
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("Host negotiation started");
        socket.send(
          JSON.stringify({
            event: "EVENT_REMOTE_DESCRIPTION",
            sdp: pc.localDescription,
            destination: parsedMessage.origin,
            from: "HOST",
          })
        );
      } catch (error) {
        console.error("Error during WebRTC negotiation:", error);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            event: "EVENT_ICE_CANDIDATE",
            candidate: event.candidate,
            destination: parsedMessage.origin,
            from: "HOST",
          })
        );
      }
    };

    pc.ontrack = (track) => {
      console.log("Received track:", track);
    };

    // Process incoming WebRTC signaling messages
    if (parsedMessage.event === "EVENT_REMOTE_DESCRIPTION") {
      console.log("Connection reached to host");
      await pc.setRemoteDescription(parsedMessage.sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.send(
        JSON.stringify({
          event: "EVENT_REMOTE_DESCRIPTION",
          destination: parsedMessage.origin,
          sdp: pc.localDescription,
          from: "HOST",
        })
      );
    } else if (parsedMessage.event === "EVENT_ICE_CANDIDATE") {
      pc.addIceCandidate(parsedMessage.candidate);
    }
  };

  useEffect(() => {
    if (socketRef.current) return; // Prevent reinitialization

    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // Request share code from the server
      const initialMessage = {
        event: "EVENT_REQUEST_SHARE_CODE",
      };
      socket.send(JSON.stringify(initialMessage));
    };

    socket.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);
      setMessage(parsedMessage);
      console.log("WebSocket message received:", parsedMessage);

      // Handle connection requests
      if (parsedMessage.event === "EVENT_CONNECTION_REQUEST") {
        const msg = {
          event: "EVENT_CONNECTION_ACCEPT",
          origin: parsedMessage.origin,
          destination: parsedMessage.shareCode,
          numberOfFiles: files.length,
          from: "HOST",
        };
        socket.send(JSON.stringify(msg));
      }

      // Handle WebRTC events in one place
      await startWebRTCNegotiation(parsedMessage);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup WebSocket and PeerConnection
    return () => {
      console.log("Cleaning up WebSocket and WebRTC connection");
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [files]);

  return (
    <div>
      <div>WebSocket Status: {isConnected ? "Connected" : "Disconnected"}</div>
      <div>
        {message ? (
          <>
            <div>Name of the event: {message.event}</div>
            <div className="flex gap-5 justify-center">
              {/* Display the share code in this div */}
              <div
                ref={urlRef}
                className="bg-white w-1/2 h-6 text-black px-1 overflow-hidden"
              >
                localhost:3000/receiver/{message.shareCode}
              </div>

              {/* Button to copy the content of the div */}
              <button
                className="bg-blue-600 w-1/3 rounded-md"
                onClick={CopyText}
              >
                Copy
              </button>
            </div>
          </>
        ) : (
          <div>Waiting for message...</div>
        )}
      </div>
    </div>
  );
};

export default FileShare;
