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
        <div className="w-full md:w-1/2 px-4 md:px-0">
          {/* Mobile View Text */}
          <div className="absolute top-20 px-6 text-center md:hidden">
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Share Files Instantly, Without Limits or Servers.
            </h1>
            <h2 className="text-sm sm:text-base font-light text-gray-300 leading-relaxed">
              Transfer files securely and seamlessly without a middleman.
            </h2>
          </div>
          <FileComponent />
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 items-start justify-center pt-20">
          <div className="flex flex-col px-8 md:px-12 lg:px-20 gap-8 h-[50%] mt-20 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-snug">
              Share Files Instantly, Without Limits or Servers.
            </h1>
            <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-light text-gray-300 leading-relaxed">
              Transfer files securely and seamlessly without a middleman.
              Perfect for quick, private sharing.
            </h2>

            {/* Feature List */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center md:justify-start items-center md:items-start text-white text-sm sm:text-base md:text-lg">
              <div className="flex flex-col gap-4 items-center sm:items-start">
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
              <div className="flex flex-col gap-4 items-center sm:items-start">
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
        <div className="absolute bottom-0 z-30 h-[20vh] sm:h-[25vh] md:h-[30vh] w-full overflow-hidden">
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
      <div className="w-screen h-screen bg-[#062354] relative">
        <Midground />
      </div>
    </div>
  );
}
