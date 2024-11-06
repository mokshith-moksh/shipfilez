"use client";
import FileComponent from "@/components/Fileupload";

export default function Home() {
  return (
    <div className="relative mx-auto flex h-screen w-screen">
      <div className="mt-16 w-1/2">
        <FileComponent />
      </div>
      <div className="w-1/2">msomod</div>
    </div>
  );
}
