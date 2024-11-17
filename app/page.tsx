"use client";
import FileComponent from "@/components/Fileupload";
import Image from "next/image";
import Wave from "react-wavify";

export default function Home() {
  return (
    <div
      className="relative mx-auto flex h-screen w-screen bg-slate-900 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      <div className="w-full md:w-1/2 ">
        <div className="absolute top-20 px-14 text-wrap -my-4 md:hidden">
          <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
            Share Files Instantly, Without Limits or Servers.
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl font-light text-gray-300 tracking-tight leading-relaxed">
            Transfer files securely and seamlessly without a middleman.
          </h2>
        </div>
        <FileComponent />
      </div>
      <div className="hidden md:flex w-1/2 items-start justify-center pt-20">
        <div className="flex flex-col px-6 md:px-12 lg:px-20 gap-8 h-[50%] mt-20 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug">
            Share Files Instantly, Without Limits or Servers.
          </h1>

          <h2 className="text-lg md:text-xl lg:text-2xl font-light text-gray-300 tracking-tight leading-relaxed">
            Transfer files securely and seamlessly without a middleman. Perfect
            for quick, private sharing.
          </h2>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-center md:justify-start items-center md:items-start text-white text-base md:text-lg">
            <div className="flex flex-col gap-4 items-center md:items-start">
              <p className="flex items-center gap-2">
                <span role="img" aria-label="folder">
                  📂
                </span>
                <span>No File Size Limit</span>
              </p>
              <p className="flex items-center gap-2">
                <span role="img" aria-label="lock">
                  🔒
                </span>
                <span>End-to-End Encryption</span>
              </p>
            </div>

            <div className="flex flex-col gap-4 items-center md:items-start">
              <p className="flex items-center gap-2">
                <span role="img" aria-label="speed">
                  ⚡
                </span>
                <span>Blazing Fast Speeds</span>
              </p>
              <p className="flex items-center gap-2">
                <span role="img" aria-label="peer-to-peer">
                  🔄
                </span>
                <span>Peer-to-Peer Transfers</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 z-30 h-[30vh] w-full overflow-hidden">
        <Wave
          style={{ height: "30vh" }}
          fill="#052454"
          paused={false}
          options={{
            height: 30,
            amplitude: 20,
            speed: 0.5,
            points: 2,
          }}
        />
      </div>
    </div>
  );
}
