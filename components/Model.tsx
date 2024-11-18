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
      className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Enter the code from the device you're connecting with
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          To access the shared content, please enter the unique code displayed
          on the device that is sharing.
        </p>
        <Input
          type="text"
          placeholder="Enter the code"
          onChange={(e) => {
            setCode(e.target.value);
          }}
          className="w-full mb-4"
        />
        <Button
          type="button"
          onClick={() => router.push(`/receiver?code=${code}`)}
          className="w-full bg-[#062354] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-[#062354e6] transition duration-300"
        >
          Confirm
        </Button>
      </div>
    </motion.div>
  );
};

export default Model;
