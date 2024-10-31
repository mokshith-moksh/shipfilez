"use client";
import React, { useState } from "react";
import { FileUpload } from "./ui/File-Upload";
import FileShare from "./FileShare";
import ScanQr from "./ScanQr";
import useIsMobile from "@/hook/useIsMobile";
import Model from "./Model";

const FileComponent = () => {
  const isMobile = useIsMobile();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [ShowPopUp, setShowPopUp] = useState<boolean>(false);

  const handleFileChange = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="relative flex h-4/5 w-3/5 flex-col items-center gap-10">
      <div>
        <button onClick={() => setShowPopUp((prev) => !prev)}>
          Enter Shared Code
        </button>
        {ShowPopUp && <Model />}
      </div>
      <div className="my-5 h-full w-4/5">
        {uploadedFiles.length === 0 ? (
          <FileUpload onChange={handleFileChange} />
        ) : (
          <div className="bg-red-600">
            <FileShare files={uploadedFiles} />
          </div>
        )}
      </div>
      <div>{isMobile && <ScanQr />}</div>
    </div>
  );
};

export default FileComponent;
