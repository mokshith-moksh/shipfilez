import React from "react";
import Image from "next/image";

export const Midground = () => {
  return (
    <div className="w-screen h-auto flex flex-col justify-center items-center gap-1 px-4 md:px-10">
      <h1 className="text-3xl md:text-5xl mb-8 md:mb-16 font-black text-white underline underline-offset-8">
        How it Works?
      </h1>
      <div className="w-full flex justify-center">
        <Image
          src="/Frame-10.svg"
          alt="frame"
          width={600}
          height={400}
          className="max-w-full md:max-w-[80vw] max-h-[40vh] md:max-h-[50vh] object-contain"
        />
      </div>
      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 md:gap-12 mt-8 md:mt-12">
        {/* Direct Connection */}
        <div className="flex items-start gap-4 md:gap-6 max-w-xs">
          <Image
            src="/ball.svg"
            alt="ball"
            width={60}
            height={60}
            className="w-12 h-12 md:w-20 md:h-20"
          />
          <div>
            <div className="text-lg md:text-2xl font-bold text-white">
              Direct Connection
            </div>
            <p className="text-gray-300 text-xs md:text-sm tracking-tight leading-relaxed">
              Files are shared directly between devices, bypassing any
              third-party servers, ensuring faster transfers and complete
              privacy.
            </p>
          </div>
        </div>
        {/* No File Size Limit */}
        <div className="flex items-start gap-4 md:gap-6 max-w-xs">
          <Image
            src="/turbo.svg"
            alt="turbo"
            width={60}
            height={60}
            className="w-12 h-12 md:w-20 md:h-20"
          />
          <div>
            <div className="text-lg md:text-2xl font-bold text-white">
              No File Size Limit
            </div>
            <p className="text-gray-300 text-xs md:text-sm tracking-tight leading-relaxed">
              Share files of any size, from small documents to large videos,
              without restrictions or the need for compression.
            </p>
          </div>
        </div>
        {/* Complete Encryption */}
        <div className="flex items-start gap-4 md:gap-6 max-w-xs">
          <Image
            src="/shell.svg"
            alt="shell"
            width={60}
            height={60}
            className="w-12 h-12 md:w-20 md:h-20"
          />
          <div>
            <div className="text-lg md:text-2xl font-bold text-white">
              Complete Encryption
            </div>
            <p className="text-gray-300 text-xs md:text-sm tracking-tight leading-relaxed">
              Your files are fully encrypted during transfer, ensuring that only
              the sender and receiver can access them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
