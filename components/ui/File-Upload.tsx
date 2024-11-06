import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

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
        className="group/file border-dash-custom relative flex h-[45vh] w-[25vw] cursor-pointer items-center justify-center overflow-hidden rounded-lg border p-10"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        {files.length > 0 &&
          files.map((file, idx) => (
            <motion.div
              key={"file" + idx}
              layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
              className={cn(
                "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                "shadow-sm"
              )}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                >
                  {file.name}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className="shadow-input w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </motion.p>
              </div>

              <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="rounded-md bg-gray-100 px-1 py-0.5 dark:bg-neutral-800 "
                >
                  {file.type}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                >
                  modified {new Date(file.lastModified).toLocaleDateString()}
                </motion.p>
              </div>
            </motion.div>
          ))}
        {!files.length && (
          <motion.div
            layoutId="file-upload"
            variants={mainVariant}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
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
      </motion.div>
    </div>
  );
};
