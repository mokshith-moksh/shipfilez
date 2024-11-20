"use client";
import FileComponent from "@/components/Fileupload";
import Wave from "react-wavify";
import { Midground } from "@/components/Midground";

export default function Home() {
  return (
    <div>
      {/* Background Section */}
      <div
        className="relative mx-auto flex h-screen w-screen bg-slate-900 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
        }}
      >
        {/* Left Section */}
        <div className="w-full px-4 md:w-1/2 md:px-0">
          {/* Mobile View Text */}
          <div className="absolute top-20 px-6 text-center md:hidden">
            <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">
              Share Files Instantly, Without Limits or Servers.
            </h1>
            <h2 className="text-sm font-light leading-relaxed text-gray-300 sm:text-base">
              Transfer files securely and seamlessly without a middleman.
            </h2>
          </div>
          <FileComponent />
        </div>

        {/* Right Section */}
        <div className="hidden w-1/2 items-start justify-center pt-20 md:flex">
          <div className="mt-20 flex h-1/2 flex-col gap-8 px-8 text-center md:px-12 md:text-left lg:px-20">
            <h1 className="text-2xl font-extrabold leading-snug text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Share Files Instantly, Without Limits or Servers.
            </h1>
            <h2 className="text-sm font-light leading-relaxed text-gray-300 sm:text-lg md:text-xl lg:text-2xl">
              Transfer files securely and seamlessly without a middleman.
              Perfect for quick, private sharing.
            </h2>

            {/* Feature List */}
            <div className="flex flex-col items-center justify-center gap-6 text-sm text-white sm:flex-row sm:gap-12 sm:text-base md:items-start md:justify-start md:text-lg">
              <div className="flex flex-col items-center gap-4 sm:items-start">
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
              <div className="flex flex-col items-center gap-4 sm:items-start">
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

        {/* Wave Component */}
        <div className="absolute bottom-0 z-30 h-[20vh] w-full overflow-hidden sm:h-[25vh] md:h-[30vh]">
          <Wave
            style={{ height: "100%" }}
            fill="#052454"
            paused={false}
            options={{
              height: 20,
              amplitude: 15,
              speed: 0.3,
              points: 3,
            }}
          />
        </div>
      </div>

      {/* Midground Section */}
      <div className="relative h-screen w-screen bg-[#062354]">
        <Midground />
      </div>
    </div>
  );
}
