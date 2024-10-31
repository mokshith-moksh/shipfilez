"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Model = () => {
  const router = useRouter();

  const [code, setCode] = useState<string>("");
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <input
        type="text"
        placeholder="Enter the code"
        onChange={(e) => {
          setCode(e.target.value);
        }}
      />
      <button
        type="button"
        onClick={() => router.push(`/receiver?code=${code}`)}
      >
        Confirm
      </button>
    </motion.div>
  );
};

export default Model;
