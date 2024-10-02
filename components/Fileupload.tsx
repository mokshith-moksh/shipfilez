"use client";
import React, { useEffect, useState } from "react";
import { FileUpload } from "./ui/File-Upload";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import FileShare from "./FileShare";

const FileComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const count = useSelector((state: RootState) => state.counter.value);

  const handleFileChange = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="relative flex h-4/5 w-3/5 flex-col items-center gap-10">
      <div className="mt-4 h-[35%] w-4/5">SELECT AND SHARE {count} </div>
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
