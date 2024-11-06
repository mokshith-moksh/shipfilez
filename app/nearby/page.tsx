"use client";
import Model from "@/components/Model";
import React, { useState } from "react";

const Page = () => {
  const [ShowPopUp, setShowPopUp] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setShowPopUp((prev) => !prev)}>
        Enter Shared Code
      </button>
      {ShowPopUp && <Model />}
    </div>
  );
};

export default Page;
