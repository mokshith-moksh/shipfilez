import React from "react";
import Image from "next/image";

export const Midground = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-10 px-10">
      <h1 className="text-5xl mb-16 font-black text-white underline underline-offset-8">
        How it Works?
      </h1>
      <div className="w-full flex justify-center">
        <Image
          src="/Frame-10.svg"
          alt="frame"
          width={600}
          height={400}
          className="max-w-[80vw] max-h-[50vh] object-contain"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-12 mt-12">
        {/* Direct Connection */}
        <div className="flex items-start gap-6 max-w-xs">
          <Image src="/ball.svg" alt="ball" width={80} height={80} />
          <div>
            <div className="text-2xl font-bold text-white">
              Direct Connection
            </div>
            <p className="text-gray-300 text-sm tracking-tight leading-relaxed">
              Files are shared directly between devices, bypassing any
              third-party servers, ensuring faster transfers and complete
              privacy.
            </p>
          </div>
        </div>
        {/* No File Size Limit */}
        <div className="flex items-start gap-6 max-w-xs">
          <Image src="/turbo.svg" alt="turbo" width={80} height={80} />
          <div>
            <div className="text-2xl font-bold text-white">
              No File Size Limit
            </div>
            <p className="text-gray-300 text-sm tracking-tight leading-relaxed">
              Share files of any size, from small documents to large videos,
              without restrictions or the need for compression.
            </p>
          </div>
        </div>
        {/* Complete Encryption */}
        <div className="flex items-start gap-6 max-w-xs">
          <Image src="/shell.svg" alt="shell" width={80} height={80} />
          <div>
            <div className="text-2xl font-bold text-white">
              Complete Encryption
            </div>
            <p className="text-gray-300 text-sm tracking-tight leading-relaxed">
              Your files are fully encrypted during transfer, ensuring that only
              the sender and receiver can access them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
