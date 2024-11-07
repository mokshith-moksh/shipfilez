import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div
      className="flex w-full items-center justify-center"
      {...getRootProps()}
    >
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10 "
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        {!files.length && (
          <motion.div
            layoutId="file-upload"
            variants={mainVariant}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className={cn(
              "border-dash-custom relative group-hover/file:shadow-2xl z-40 bg-[#003366] flex items-center justify-center h-[40vh] mt-4 w-[20vw] mx-auto rounded-3xl"
            )}
          >
            {isDragActive ? (
              <motion.div className="min-h-full min-w-full ">
                <Image
                  src="https://res.cloudinary.com/da3j9iqkp/image/upload/v1730913391/t4bws90sqw3vosvrzsy9.svg"
                  width={300}
                  height={300}
                  alt="Picture of the author"
                />
              </motion.div>
            ) : (
              <Image
                src="https://res.cloudinary.com/da3j9iqkp/image/upload/v1730913391/t4bws90sqw3vosvrzsy9.svg"
                width={100}
                height={100}
                alt="Picture of the author"
              />
            )}
          </motion.div>
        )}
        {!files.length && (
          <motion.div
            variants={secondaryVariant}
            className="absolute inset-0 z-30 mx-auto mt-14 flex h-[40vh] w-[20vw] items-center justify-center rounded-3xl border border-dashed border-sky-400 bg-transparent opacity-0"
          ></motion.div>
        )}
      </motion.div>
    </div>
  );
};
