"use client";
import Model from "@/components/Model";
import React, { useState } from "react";

const Page = () => {
  const [ShowPopUp, setShowPopUp] = useState<boolean>(false);
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-red-500">
      <button onClick={() => setShowPopUp((prev) => !prev)}>
        Enter Shared Code
      </button>
      {ShowPopUp && <Model />}
    </div>
  );
};

export default Page;
