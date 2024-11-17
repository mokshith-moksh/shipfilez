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

      <div className="absolute bottom-0 z-30 h-[35vh] w-full overflow-hidden">
        <Wave
          style={{ height: "40vh" }}
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
