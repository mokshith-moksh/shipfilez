"use client";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { BsCopy } from "react-icons/bs";
import { BiSolidCircle } from "react-icons/bi";
import { Input } from "./ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FileShareProps {
  files: File[];
}

const FileShare: React.FC<FileShareProps> = ({ files }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const urlRef = useRef<HTMLInputElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const shareCodeRef = useRef<string | null>(null);
  const clientCodeRef = useRef<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [NearByShareCode, setNearByShareCode] = useState<string | null>(null);
  const shareCodeCopyRef = useRef<HTMLButtonElement | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const CopyText = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error("Failed to copy text: ", err);
      });
      toast("Copied");
    } else {
      toast("Not able to copy text");
    }
  };

  const RequestNearByShareCode = () => {
    const socket = socketRef.current;
    if (!socket) return null;
    socket.send(
      JSON.stringify({
        event: "EVENT_REQUEST_NEAR_BY_SHARE_CODE",
        shareCode,
      })
    );
  };

  // createOffer: sender logic using ACK-based chunking
  const createOffer = async () => {
    const rtcConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };
    const socket = socketRef.current;
    if (!socket) return;

    const pc = new RTCPeerConnection(rtcConfiguration);
    pcRef.current = pc;

    // create data channel
    const dataChannel = pc.createDataChannel("fileTransfer");
    dataChannel.binaryType = "arraybuffer";

    // sender state
    let currentFileIndex = 0;
    let offset = 0;
    const maxChunkSize = 64 * 1024; // 64KB chunks

    const sendMetadata = (file: File) => {
      dataChannel.send(
        JSON.stringify({
          type: "meta",
          fileName: file.name,
          fileSize: file.size,
          chunkSize: maxChunkSize,
        })
      );
    };

    const sendNextChunk = async () => {
      const file = files[currentFileIndex];
      if (!file) return;

      if (offset >= file.size) {
        // finished this file
        dataChannel.send(JSON.stringify({ type: "done" }));
        currentFileIndex++;
        offset = 0;
        setProgress(0);

        if (currentFileIndex < files.length) {
          // send metadata for next file
          sendMetadata(files[currentFileIndex]);
        }
        return;
      }

      const chunk = file.slice(offset, offset + maxChunkSize);
      const arrayBuffer = await chunk.arrayBuffer();
      try {
        dataChannel.send(arrayBuffer);
      } catch (err) {
        console.error("Failed to send chunk:", err);
        // you might retry here in production
        return;
      }

      offset += maxChunkSize;
      const progressPercentage = Math.min(
        Math.round((offset / file.size) * 100),
        100
      );
      setProgress(progressPercentage);
    };

    // handle incoming control messages from receiver (ready / ack)
    dataChannel.onmessage = (event) => {
      const data = event.data;
      if (typeof data === "string") {
        try {
          const msg = JSON.parse(data);
          if (msg.type === "ack") {
            // receiver wrote the previous chunk, send next
            sendNextChunk();
          } else if (msg.type === "ready") {
            // receiver prepared file (save handle), begin sending first chunk
            sendNextChunk();
          }
        } catch {
          // ignore non-JSON string or malformed
        }
      }
    };

    dataChannel.onopen = () => {
      if (files.length > 0) {
        // start by sending metadata for first file
        sendMetadata(files[0]);
      }
    };

    dataChannel.onerror = (error) => {
      console.error("Data channel error:", error);
    };

    dataChannel.onclose = () => {
      console.log("Data channel closed");
    };

    pc.onicecandidate = (event) => {
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

    let isNegotiating = false;
    pc.onnegotiationneeded = async () => {
      if (isNegotiating) return;
      isNegotiating = true;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.send(
          JSON.stringify({
            event: "EVENT_OFFER",
            shareCode: shareCodeRef.current,
            clientId: clientCodeRef.current,
            offer,
          })
        );
      } catch (error) {
        console.error("Error during WebRTC negotiation:", error);
      } finally {
        isNegotiating = false;
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        pc.close();
        pcRef.current = null;
      }
    };
  };

  // WebSocket + signaling setup
  useEffect(() => {
    if (socketRef.current) return;

    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      // Ask server for a share code and register files metadata
      const initialMessage = {
        event: "EVENT_REQUEST_SHARE_CODE",
        fileName: files.map((f) => f.name),
        fileLength: files.length,
      };
      socket.send(JSON.stringify(initialMessage));

      heartbeatIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ event: "EVENT_HEART_BEAT" }));
        }
      }, 10000);
    };

    socket.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data);

      if (msg.event === "EVENT_REQUEST_SHARE_CODE") {
        setShareCode(msg.shareCode);
        shareCodeRef.current = msg.shareCode;
      } else if (msg.event === "EVENT_REQUEST_NEAR_BY_SHARE_CODE") {
        setNearByShareCode(msg.nearByShareCode);
      } else if (msg.event === "EVENT_REQUEST_HOST_TO_SEND_OFFER") {
        // start WebRTC offer creation as host/sender
        clientCodeRef.current = msg.clientId;
        shareCodeRef.current = msg.shareCode;
        createOffer();
      } else if (msg.event === "EVENT_ANSWER") {
        const pc = pcRef.current;
        if (!pc) return;
        try {
          await pc.setRemoteDescription(msg.answer);
        } catch (err) {
          console.error("Error setting remote description (answer):", err);
        }
      } else if (msg.event === "EVENT_ICE_CANDIDATE") {
        const pc = pcRef.current;
        if (!pc) return;
        try {
          const candidate = new RTCIceCandidate(msg.candidate);
          await pc.addIceCandidate(candidate);
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]); // re-run if files change

  return (
    <div className="flex h-auto w-full flex-col-reverse items-center justify-end gap-8 px-4 pt-8 text-white md:flex-row-reverse md:items-start md:justify-center md:px-8 md:pt-16">
      {/* Text Container */}
      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <div className="flex items-center gap-3 text-lg font-bold md:text-xl">
          {isConnected ? (
            <BiSolidCircle className="text-[#24cc3e]" />
          ) : (
            <BiSolidCircle className="text-[#f34f4f]" />
          )}
          <p>Status</p>
        </div>

        <div className="flex flex-col gap-6">
          {shareCode ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-3">
                <Input
                  ref={urlRef}
                  className="h-10 w-full rounded-lg bg-white px-2 text-sm text-black md:w-[85%] md:text-lg"
                  value={`https://shipfilez.vercel.app/receiver?code=${shareCode}`}
                  readOnly
                />
                <button
                  className="rounded-md text-xl text-white md:text-3xl"
                  onClick={() => CopyText(urlRef.current!.value)}
                >
                  <BsCopy />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm md:text-base">Waiting for message...</div>
          )}
          <div className="flex flex-col gap-5">
            {!NearByShareCode ? (
              <Button
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="md:text-md h-10 w-full bg-yellow-400 text-sm font-bold text-black hover:bg-yellow-500 md:h-11 md:w-60"
                onClick={RequestNearByShareCode}
              >
                Share with nearby devices
              </Button>
            ) : (
              <Button
                className="h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-yellow-400 text-base font-semibold text-black hover:bg-yellow-500 md:h-14 md:w-fit md:text-xl"
                ref={shareCodeCopyRef}
                onClick={() => CopyText(NearByShareCode)}
              >
                {NearByShareCode}
              </Button>
            )}
          </div>
          <Progress value={progress} className="w-full text-yellow-400" />
        </div>
      </div>

      {/* QR Code Container */}
      <div className="relative flex w-[70%] items-center justify-center md:w-auto">
        <QRCode
          bgColor="#ffffff"
          fgColor="#000000"
          style={{ height: "auto", width: "100%" }}
          value={`https://shipfilez.vercel.app/receiver?code=${shareCode}`}
          viewBox="0 0 256 256"
          className="w-1/2 sm:w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/5"
        />
      </div>
    </div>
  );
};

export default FileShare;
