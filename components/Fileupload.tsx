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
    <div className="relative flex h-4/5 w-3/5 flex-col items-center gap-10">
      <div className="my-5 h-full w-4/5">
        {uploadedFiles.length === 0 ? (
          <FileUpload onChange={handleFileChange} />
        ) : (
          <div className="bg-red-600">
            <FileShare files={uploadedFiles} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileComponent;
