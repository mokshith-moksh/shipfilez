"use client";
import React, { useState } from "react";
import { FileUpload } from "./ui/File-Upload";
import FileShare from "./FileShare";
import ScanQr from "./ScanQr";
import useIsMobile from "@/hook/useIsMobile";

const FileComponent = () => {
  const isMobile = useIsMobile();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="flex h-full items-center">
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
