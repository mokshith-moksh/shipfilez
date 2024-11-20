"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Model = () => {
  const router = useRouter();
  const [code, setCode] = useState<string>("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-semibold">
          Enter the code from the device you are connecting with
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          To access the shared content, please enter the unique code displayed
          on the device that is sharing.
        </p>
        <Input
          type="number"
          placeholder="Enter the code"
          onChange={(e) => {
            setCode(e.target.value);
          }}
          className="mb-4 w-full"
        />
        <Button
          type="button"
          onClick={() => router.push(`/receiver?code=${code}`)}
          className="w-full rounded-lg bg-[#062354] px-6 py-2 text-white shadow-lg transition duration-300 hover:bg-[#062354e6]"
        >
          Confirm
        </Button>
      </div>
    </motion.div>
  );
};

export default Model;
