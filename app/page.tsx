"use client";
import FileComponent from "@/components/Fileupload";

export default function Home() {
  return (
    <div className="relative mx-auto flex h-[80vh] w-screen flex-1 gap-10 px-6 max-lg:flex-col">
      <div className="flex h-full w-1/2 items-center justify-center max-lg:h-1/2 max-lg:w-full">
        <FileComponent />
      </div>
      <div className="flex w-1/2 flex-col items-center justify-center max-lg:size-full">
        SHARING MADE EASY
      </div>
    </div>
  );
}
