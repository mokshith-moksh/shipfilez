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
  const shareCodeRef = useRef<string | null>(null);
  const clientCodeRef = useRef<string | null>(null);

  const requestHostToSendOffer = async () => {
    const requestHostToSendOfferMsg = {
      event: "EVENT_REQUEST_HOST_TO_SEND_OFFER",
      shareCode,
      clientId,
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
          shareCode,
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
        const rtcConfiguration = {
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302", // Google's public STUN server
            },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        };
        console.log("Offer received from host");
        clientCodeRef.current = parsedMessage.clientId;
        shareCodeRef.current = parsedMessage.shareCode;

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

        // Listen for the 'datachannel' event to receive the DataChannel
        pc.ondatachannel = (event) => {
          const dataChannel = event.channel;
          console.log("DataChannel received from host");
          dataChannel.binaryType = "blob";
          // File receiving logic
          let receivedBuffer: Blob[] = [];
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
                console.log("DataChannel parsed message:", parsedMessage);

                if (parsedMessage.type === "metadata") {
                  // Initialize file metadata
                  receivedFileMetadata = {
                    fileName: parsedMessage.fileName,
                    fileSize: parsedMessage.fileSize,
                  };
                  receivedBuffer = []; // Clear the buffer for incoming file data
                  console.log("File metadata received:", receivedFileMetadata);
                } else if (parsedMessage.type === "end-of-file") {
                  // Combine received Blob chunks into a single Blob
                  const fileBlob = new Blob(receivedBuffer);
                  const downloadLink = document.createElement("a");
                  downloadLink.href = URL.createObjectURL(fileBlob);
                  if (!receivedFileMetadata) return;
                  downloadLink.download = receivedFileMetadata.fileName;
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);

                  // Clear buffer and metadata after the file is saved
                  receivedBuffer = [];
                  receivedFileMetadata = null;
                }
              } catch (error) {
                console.error("Error parsing message:", error);
              }
            } else if (message instanceof Blob) {
              // Add the received Blob chunk to the buffer
              if (receivedFileMetadata) {
                receivedBuffer.push(message); // Store the Blob chunk
                console.log(
                  "Received Blob chunk, buffer size:",
                  receivedBuffer.length
                );
              }
            }
          };

          dataChannel.onopen = () => {
            console.log("Data channel is open and ready to receive data");
          };

          dataChannel.onclose = () => {
            console.log("Data channel closed");
          };
        };

        try {
          // Set the remote offer and create the answer
          await pc.setRemoteDescription(parsedMessage.offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          // Send the answer back to the host
          socket.send(
            JSON.stringify({
              event: "EVENT_ANSWER",
              answer,
              shareCode: shareCodeRef.current,
              clientId: clientCodeRef.current,
            })
          );
          console.log("Answer sent to the server");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isConnected ? "Connected" : "Disconnected"}
      <div className="h-11 w-20">
        fileDetails
        <div>{fileDetail && <div>{JSON.stringify(fileDetail)}</div>}</div>
      </div>
      <div>
        <button
          onClick={requestHostToSendOffer}
          className="h-5 w-10 bg-amber-400 p-2 font-bold text-black"
        >
          Download
        </button>
      </div>
      <div className="relative h-screen w-screen">
        <video
          className="size-full"
          ref={videoRef}
          controls={true}
          autoPlay={true}
        ></video>
      </div>
    </div>
  );
}
