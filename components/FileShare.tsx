"use client";
import React, { useEffect, useRef, useState } from "react";

interface FileShareProps {
  files: File[];
}

const FileShare: React.FC<FileShareProps> = ({ files }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const urlRef = useRef<HTMLDivElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const shareCodeRef = useRef<string | null>(null);
  const clientCodeRef = useRef<string | null>(null);

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
  const createOffer = async (RES_MSG: any) => {
    console.log("Creating offer to client");
    const socket = socketRef.current;
    if (!socket) return;

    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    pc.onicecandidate = (event) => {
      console.log("ShareCode Inside Ice", shareCodeRef.current);
      console.log("ClientCode Inside ICE", clientCodeRef.current);
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            event: "EVENT_ICE_CANDIDATE",
            shareCode: shareCodeRef.current,
            clientId: clientCodeRef.current,
            candidate: event.candidate,
            from: "HOST",
          })
        );
      }
    };
    console.log("Creating offer to client negosiation started");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    pcRef.current?.addTrack(stream.getVideoTracks()[0]);
    let isNegotiating = false;

    pc.onnegotiationneeded = async () => {
      if (isNegotiating) return; // Prevent duplicate negotiations
      isNegotiating = true;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.send(
          JSON.stringify({
            event: "EVENT_OFFER",
            shareCode: shareCodeRef.current,
            clientId: clientCodeRef.current,
            offer: offer,
          })
        );
        console.log("Offer sent to the server");
      } catch (error) {
        console.error("Error during WebRTC negotiation:", error);
      } finally {
        isNegotiating = false;
      }
    };
  };
  const acceptAnswer = async (RES_MSG: any) => {
    const pc = pcRef.current;
    if (!pc) return;
    try {
      await pc.setRemoteDescription(RES_MSG.answer);
    } catch (error) {
      console.log("error during accepting the answer:", error);
    }
  };
  useEffect(() => {
    if (socketRef.current) return;
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;
    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      const initialMessage = {
        event: "EVENT_REQUEST_SHARE_CODE",
      };
      socket.send(JSON.stringify(initialMessage));
    };
    socket.onmessage = async (event) => {
      const RES_MSG = JSON.parse(event.data);
      if (RES_MSG.event === "EVENT_REQUEST_SHARE_CODE") {
        console.log("EVENT_REQUEST_SHARE_CODE");
        setShareCode(RES_MSG.shareCode);
      } else if (RES_MSG.event === "EVENT_REQUEST_HOST_TO_SEND_OFFER") {
        clientCodeRef.current = RES_MSG.clientId;
        shareCodeRef.current = RES_MSG.shareCode;
        console.log("ref sharecode", shareCodeRef.current);
        console.log("ref clientcode", clientCodeRef.current);
        console.log("EVENT_REQUEST_HOST_TO_SEND_OFFER");
        createOffer(RES_MSG);
      } else if (RES_MSG.event === "EVENT_ANSWER") {
        console.log("EVENT_ANSWER");
        acceptAnswer(RES_MSG);
      } else if (RES_MSG.event === "EVENT_ICE_CANDIDATE") {
        const candidate = new RTCIceCandidate(RES_MSG.candidate);
        const pc = pcRef.current;
        if (!pc) return;
        await pc.addIceCandidate(candidate);
      }
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
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
        {shareCode ? (
          <>
            <div>Name of the event: {shareCode}</div>
            <div className="flex gap-5 justify-center">
              {/* Display the share code in this div */}
              <div
                ref={urlRef}
                className="bg-white w-1/2 h-6 text-black px-1 overflow-hidden"
              >
                localhost:3000/receiver?code={shareCode}
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
