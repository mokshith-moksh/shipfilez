import React from "react";
import Image from "next/image";

export const Midground = () => {
  return (
    <div className="flex h-auto w-screen flex-col items-center justify-center gap-1 px-4 md:px-10">
      <h1 className="mb-8 text-3xl font-black text-white underline underline-offset-8 md:mb-16 md:text-5xl">
        How it Works?
      </h1>
      <div className="flex w-full justify-center">
        <Image
          src="/Frame-10.svg"
          alt="frame"
          width={600}
          height={400}
          className="max-h-[40vh] max-w-full object-contain md:max-h-[50vh] md:max-w-[80vw]"
        />
      </div>
      <div className="mt-8 flex flex-col flex-wrap justify-center gap-8 md:mt-12 md:flex-row md:gap-12">
        {/* Direct Connection */}
        <div className="flex max-w-xs items-start gap-4 md:gap-6">
          <Image
            src="/ball.svg"
            alt="ball"
            width={60}
            height={60}
            className="size-12 md:size-20"
          />
          <div>
            <div className="text-lg font-bold text-white md:text-2xl">
              Direct Connection
            </div>
            <p className="text-xs leading-relaxed tracking-tight text-gray-300 md:text-sm">
              Files are shared directly between devices, bypassing any
              third-party servers, ensuring faster transfers and complete
              privacy.
            </p>
          </div>
        </div>
        {/* No File Size Limit */}
        <div className="flex max-w-xs items-start gap-4 md:gap-6">
          <Image
            src="/turbo.svg"
            alt="turbo"
            width={60}
            height={60}
            className="size-12 md:size-20"
          />
          <div>
            <div className="text-lg font-bold text-white md:text-2xl">
              No File Size Limit
            </div>
            <p className="text-xs leading-relaxed tracking-tight text-gray-300 md:text-sm">
              Share files of any size, from small documents to large videos,
              without restrictions or the need for compression.
            </p>
          </div>
        </div>
        {/* Complete Encryption */}
        <div className="flex max-w-xs items-start gap-4 md:gap-6">
          <Image
            src="/shell.svg"
            alt="shell"
            width={60}
            height={60}
            className="size-12 md:size-20"
          />
          <div>
            <div className="text-lg font-bold text-white md:text-2xl">
              Complete Encryption
            </div>
            <p className="text-xs leading-relaxed tracking-tight text-gray-300 md:text-sm">
              Your files are fully encrypted during transfer, ensuring that only
              the sender and receiver can access them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
