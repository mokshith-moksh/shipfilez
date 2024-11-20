"use client";
import React, { useState } from "react";
import { FileUpload } from "./ui/File-Upload";
import FileShare from "./FileShare";

const FileComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="relative flex h-full flex-col items-center ">
      <div className="mt-40 flex size-full items-start">
        {uploadedFiles.length === 0 ? (
          <FileUpload onChange={handleFileChange} />
        ) : (
          <div className="size-full">
            <FileShare files={uploadedFiles} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileComponent;
