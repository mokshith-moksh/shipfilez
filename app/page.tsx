"use client";
import FileComponent from "@/components/Fileupload";
import Image from "next/image";
import Wave from "react-wavify";

export default function Home() {
  return (
    <div
      className="relative mx-auto flex h-screen w-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      <div className="mt-16 w-1/2">
        <FileComponent />
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <Image
          src="https://res.cloudinary.com/da3j9iqkp/image/upload/v1730990202/sirzhpyix2cpsohnru4s.svg"
          width={800}
          height={800}
          alt="Picture of the author"
        />
      </div>

      {/* Wave at the bottom of the hero section */}
      <div className="absolute bottom-0 z-30 h-[30vh] w-full bg-red-300">
        <Wave
          fill="#052454"
          paused={false}
          options={{
            height: 30,
            amplitude: 100,
            speed: 0.25,
            points: 2,
          }}
        />
      </div>
    </div>
  );
}
