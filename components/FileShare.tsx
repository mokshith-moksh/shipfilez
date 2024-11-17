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

  const CopyText = (text: string) => {
    if (text) {
      const textToCopy = text;
      navigator.clipboard.writeText(textToCopy).catch((err) => {
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

  const createOffer = async () => {
    const rtcConfiguration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };
    const socket = socketRef.current;
    if (!socket) return;
    const pc = new RTCPeerConnection(rtcConfiguration);
    pcRef.current = pc;

    const dataChannel = pc.createDataChannel("fileTransfer");

    dataChannel.onopen = async () => {
      dataChannel.binaryType = "blob";

      for (const file of files) {
        dataChannel.send(
          JSON.stringify({
            type: "metadata",
            fileName: file.name,
            fileSize: file.size,
          })
        );

        let offset = 0;
        const maxChunkSize = 64 * 1024;
        while (offset < file.size) {
          const chunk = file.slice(offset, offset + maxChunkSize);
          dataChannel.send(chunk);

          offset += maxChunkSize;

          const progressPercentage = Math.min(
            Math.round((offset / file.size) * 100),
            100
          );
          setProgress(progressPercentage);
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        dataChannel.send(
          JSON.stringify({
            type: "end-of-file",
            fileName: file.name,
          })
        );
      }
    };

    dataChannel.onerror = (error) => {
      console.error("Data channel error:", error);
    };

    dataChannel.onclose = () => {
      console.log("Data channel is closed");
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

  const acceptAnswer = async (RES_MSG: any) => {
    const pc = pcRef.current;
    if (!pc) return;
    try {
      await pc.setRemoteDescription(RES_MSG.answer);
    } catch (error) {
      console.log("Error during accepting the answer:", error);
    }
  };

  useEffect(() => {
    if (socketRef.current) return;
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;
    socket.onopen = () => {
      setIsConnected(true);
      const initialMessage = {
        event: "EVENT_REQUEST_SHARE_CODE",
      };
      socket.send(JSON.stringify(initialMessage));
    };
    socket.onmessage = async (event) => {
      const RES_MSG = JSON.parse(event.data);
      if (RES_MSG.event === "EVENT_REQUEST_SHARE_CODE") {
        setShareCode(RES_MSG.shareCode);
      } else if (RES_MSG.event === "EVENT_REQUEST_NEAR_BY_SHARE_CODE") {
        console.log("NearByShareCode -----> ", RES_MSG.nearByShareCode);
        setNearByShareCode(RES_MSG.nearByShareCode);
      } else if (RES_MSG.event === "EVENT_REQUEST_HOST_TO_SEND_OFFER") {
        clientCodeRef.current = RES_MSG.clientId;
        shareCodeRef.current = RES_MSG.shareCode;
        createOffer();
      } else if (RES_MSG.event === "EVENT_ANSWER") {
        acceptAnswer(RES_MSG);
      } else if (RES_MSG.event === "EVENT_ICE_CANDIDATE") {
        const candidate = new RTCIceCandidate(RES_MSG.candidate);
        const pc = pcRef.current;
        if (!pc) return;
        await pc.addIceCandidate(candidate);
      }
    };
    socket.onclose = () => {
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
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div className="flex size-full items-start justify-center gap-16 pt-36 text-white">
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-start gap-3 text-xl font-bold">
          {isConnected ? (
            <BiSolidCircle className="border-[#14992c] text-[#24cc3e]" />
          ) : (
            <BiSolidCircle className="text-[#f34f4f]" />
          )}{" "}
          <p>Status</p>
        </div>

        <div className="flex flex-col gap-6">
          {shareCode ? (
            <>
              <div className="flex justify-center gap-3 ">
                <Input
                  ref={urlRef}
                  className="flex h-10 w-[85%] rounded-lg bg-white px-1 text-2xl text-black"
                  value={`localhost:3000/receiver?code=${shareCode}`}
                  readOnly
                />
                <button
                  className="w-fit rounded-md text-3xl text-white"
                  onClick={() => CopyText(urlRef.current!.value)}
                >
                  <BsCopy />
                </button>
              </div>
            </>
          ) : (
            <div>Waiting for message...</div>
          )}
          <div className="flex flex-col gap-5">
            {!NearByShareCode ? (
              <Button
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="text-md h-11 w-60 bg-yellow-400 font-bold text-black hover:bg-yellow-500"
                onClick={RequestNearByShareCode}
              >
                Share with nearby devices
              </Button>
            ) : (
              <Button
                className="flex h-14 cursor-pointer items-center justify-center rounded-lg bg-yellow-400 text-xl font-semibold text-black hover:bg-yellow-500"
                ref={shareCodeCopyRef}
                onClick={() => CopyText(NearByShareCode)}
              >
                {NearByShareCode}
              </Button>
            )}
          </div>
          <Progress value={progress} />
        </div>
      </div>

      <div className="size-[35%]">
        <QRCode
          size={512}
          bgColor="#ffffff"
          fgColor="#000000"
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={`https://moksh-portfolio-com.netlify.app`}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  );
};

export default FileShare;
