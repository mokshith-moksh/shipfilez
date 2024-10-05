"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

interface typeFileDetail {
  fileName: string;
  fileLength: number;
}
export default function Page() {
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("code");
  console.log(shareCode);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [fileDetail, setFileDetail] = useState<typeFileDetail | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const requestHostToSendOffer = async () => {
    const requestHostToSendOfferMsg = {
      event: "EVENT_REQUEST_HOST_TO_SEND_OFFER",
      shareCode: shareCode,
      clientId: clientId,
    };
    const socket = socketRef.current;
    if (!socket) return;
    socket.send(JSON.stringify(requestHostToSendOfferMsg));
  };

  useEffect(() => {
    if (socketRef.current) return;
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;
    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      socket.send(
        JSON.stringify({
          event: "EVENT_REQUEST_CLIENT_ID",
          shareCode: shareCode,
        })
      );
    };

    socket.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);
      console.log("Parsed message:", parsedMessage);
      if (parsedMessage.event === "EVENT_REQUEST_CLIENT_ID") {
        setClientId(parsedMessage.clientId);
        setFileDetail({
          fileName: parsedMessage.fileName,
          fileLength: parsedMessage.fileLength,
        });
      }
      if (parsedMessage.event === "EVENT_OFFER") {
        console.log("event offer received form host");
        const pc = new RTCPeerConnection();
        pcRef.current = pc;
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(
              JSON.stringify({
                event: "EVENT_ICE_CANDIDATE",
                shareCode: shareCode,
                clientId: clientId,
                candidate: event.candidate,
              })
            );
          }
        };
        try {
          await pc.setRemoteDescription(parsedMessage.offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.send(
            JSON.stringify({
              event: "EVENT_ANSWER",
              answer: answer,
              shareCode: shareCode,
              clientId: clientId,
            })
          );
        } catch (error) {
          console.log("negosiation error", error);
        }
      }
      if (parsedMessage.event === "EVENT_ICE_CANDIDATE") {
        const candidate = new RTCIceCandidate(parsedMessage.candidate);
        const pc = pcRef.current;
        if (!pc) return;
        await pc.addIceCandidate(candidate);
      }
      if (pcRef.current) {
        pcRef.current.ontrack = (event) => {
          console.log(event.track);
          if (videoRef.current) {
            videoRef.current.srcObject = new MediaStream([event.track]);
          }
        };
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
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      {isConnected ? "Connected" : "Disconnected"}
      <div className="w-20 h-11">
        fileDetails
        <div>{fileDetail && <div>{JSON.stringify(fileDetail)}</div>}</div>
      </div>
      <div>
        <button
          onClick={requestHostToSendOffer}
          className="w-10 h-5 bg-amber-400 text-black font-bold p-2"
        >
          Download
        </button>
      </div>
      <div className="w-screen h-screen relative">
        <video className="w-full h-full" ref={videoRef} controls></video>
      </div>
    </div>
  );
}