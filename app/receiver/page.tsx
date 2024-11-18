"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BiSolidCircle } from "react-icons/bi";
let streamSaver: any;

interface typeFileDetail {
  fileName: string[];
  fileLength: number;
}

let worker: any;

export default function Page() {
  const searchParams = useSearchParams();
  const IshareCode = searchParams.get("code");
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [fileDetail, setFileDetail] = useState<typeFileDetail | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const shareCodeRef = useRef<string | null>(null);
  const clientCodeRef = useRef<string | null>(null);
  const fileNameRef = useRef<string | null>(null);
  const [percentage, setpercentage] = useState<string>("0");

  const requestHostToSendOffer = async () => {
    const requestHostToSendOfferMsg = {
      event: "EVENT_REQUEST_HOST_TO_SEND_OFFER",
      shareCode: shareCodeRef.current,
      clientId,
    };
    const socket = socketRef.current;
    if (!socket) return;
    socket.send(JSON.stringify(requestHostToSendOfferMsg));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      worker = new Worker(new URL("./worker.ts", import.meta.url));
      import("streamsaver")
        .then((StreamSaver) => {
          streamSaver = StreamSaver;
        })
        .catch((error) => {
          console.error("Error loading StreamSaver:", error);
        });
    }
    if (socketRef.current) return;
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;
    socket.onopen = () => {
      setIsConnected(true);
      socket.send(
        JSON.stringify({
          event: "EVENT_REQUEST_CLIENT_ID",
          shareCode: IshareCode,
        })
      );
    };

    socket.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.event === "EVENT_REQUEST_CLIENT_ID") {
        setClientId(parsedMessage.clientId);
        setFileDetail({
          fileName: parsedMessage.fileName,
          fileLength: parsedMessage.fileLength,
        });
        shareCodeRef.current = parsedMessage.sharedCode;
      }
      if (parsedMessage.event === "EVENT_OFFER") {
        const rtcConfiguration = {
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302", // Google's public STUN server
            },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        };
        clientCodeRef.current = parsedMessage.clientId;
        shareCodeRef.current = parsedMessage.sharedCode;

        // Create RTCPeerConnection
        const pc = new RTCPeerConnection(rtcConfiguration);
        pcRef.current = pc;

        // Handle incoming ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(
              JSON.stringify({
                event: "EVENT_ICE_CANDIDATE",
                shareCode: shareCodeRef.current,
                clientId: clientCodeRef.current,
                candidate: event.candidate,
                from: "CLIENT",
              })
            );
          }
        };
        let receivedFileSize = 0;
        pc.ondatachannel = (event) => {
          const dataChannel = event.channel;
          dataChannel.binaryType = "blob";
          let receivedFileMetadata: {
            fileName: string;
            fileSize: number;
          } | null = null;

          dataChannel.onmessage = (event: MessageEvent) => {
            dataChannel.binaryType = "blob";
            const message = event.data;

            if (typeof message === "string") {
              try {
                const parsedMessage = JSON.parse(message);

                if (parsedMessage.type === "metadata") {
                  receivedFileMetadata = {
                    fileName: parsedMessage.fileName,
                    fileSize: parsedMessage.fileSize,
                  };
                  fileNameRef.current = parsedMessage.fileName;
                } else if (parsedMessage.type === "end-of-file") {
                  setTimeout(() => {
                    worker.postMessage("download");
                    worker.addEventListener("message", (event: any) => {
                      if (!fileNameRef.current) return;
                      const stream = event.data.stream();
                      const fileStream = streamSaver.createWriteStream(
                        fileNameRef.current
                      );
                      stream.pipeTo(fileStream);
                    });
                  }, 1000);
                }
              } catch (error) {
                console.error("Error parsing message:", error);
              }
            } else if (message instanceof Blob) {
              if (receivedFileMetadata) {
                worker.postMessage(message);
                const blobSize = message.size;
                receivedFileSize += blobSize;
                const downloadPercent =
                  (receivedFileSize / receivedFileMetadata.fileSize) * 100;
                setpercentage(downloadPercent.toFixed(2));
              }
            }
          };
        };

        try {
          // Set the remote offer and create the answer
          await pc.setRemoteDescription(parsedMessage.offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.send(
            JSON.stringify({
              event: "EVENT_ANSWER",
              answer,
              shareCode: shareCodeRef.current,
              clientId: clientCodeRef.current,
            })
          );
        } catch (error) {
          console.error("Error during WebRTC negotiation:", error);
        }
      }

      if (parsedMessage.event === "EVENT_ICE_CANDIDATE") {
        const candidate = new RTCIceCandidate(parsedMessage.candidate);
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className="relative mx-auto flex h-screen w-screen bg-slate-900 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-10 px-4 md:px-10">
        {/* Connection Status */}
        <h2 className="text-white text-2xl md:hidden font-extrabold">
          Receive Files Seamlessly
        </h2>
        <div className="text-center text-white text-lg sm:text-xl font-semibold">
          {isConnected ? (
            <div className="flex gap-2 justify-center items-center">
              <BiSolidCircle className="text-[#24cc3e]" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex gap-2 justify-center items-center">
              <BiSolidCircle className="text-[#f34f4f]" />
              <span>Disconnected</span>
            </div>
          )}
        </div>

        {/* File Details */}
        <div className="h-24 w-full md:w-3/4 bg-gray-800 rounded-md p-4 text-white overflow-auto">
          <h3 className="font-bold text-lg">File Details</h3>
          <div className="mt-2 text-sm">
            {fileDetail ? (
              <div className="flex gap-3 flex-wrap flex-1">
                {fileDetail.fileName.map((name) => (
                  <p key={name}>{name}</p>
                ))}
              </div>
            ) : (
              <p>No file selected yet.</p>
            )}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={requestHostToSendOffer}
          className="h-10 w-32 bg-amber-400 rounded-md text-black font-bold shadow-lg hover:bg-amber-500 transition"
        >
          Download
        </button>

        {/* Percentage Progress */}
        <div className="text-white text-lg sm:text-2xl font-semibold">
          Progress: {percentage}%
          <div>{percentage === "100" && <div>Scanning file......</div>}</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-start px-10 gap-8">
        {/* Title */}
        <h2 className="text-white text-3xl lg:text-4xl font-extrabold">
          Receive Files Seamlessly
        </h2>
        {/* Description */}
        <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
          Share and receive files instantly without interruptions. Ensure
          private, secure, and blazing-fast file transfers with our peer-to-peer
          technology. Whether it’s documents, media, or any data, our platform
          has got you covered.
        </p>
        {/* Additional Features */}
        <div className="flex flex-col gap-4 text-gray-200 text-sm lg:text-base">
          <div className="flex items-center gap-2">
            <span role="img" aria-label="secure">
              🔒
            </span>
            <span>100% End-to-End Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span role="img" aria-label="speed">
              ⚡
            </span>
            <span>Fast and Reliable Transfers</span>
          </div>
          <div className="flex items-center gap-2">
            <span role="img" aria-label="file">
              📂
            </span>
            <span>No File Size Restrictions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
