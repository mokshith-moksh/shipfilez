"use client";
import React, { useState } from "react";
import { FileUpload } from "./ui/File-Upload";
import FileShare from "./FileShare";

const FileComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (files: File[]) => {
    console.log(files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="flex size-full items-center">
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
