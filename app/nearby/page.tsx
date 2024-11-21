import Model from "@/components/Model";
import React from "react";

const Page = () => {
  return (
    <div
      className="relative mx-auto flex h-screen w-screen overflow-y-hidden bg-slate-900 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      <Model />
    </div>
  );
};

export default Page;
