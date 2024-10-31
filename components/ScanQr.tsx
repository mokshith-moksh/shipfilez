"use client";
import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScanQr = () => {
  const [showToggle, setShowToggle] = useState<boolean>(false);
  const toggleScanner = () => {
    setShowToggle((prev) => !prev);
  };
  const handleScan = (data: any) => {
    console.log(data);
    if (data) {
      window.location.href = data;
    }
  };
  return (
    <div>
      <button onClick={toggleScanner}>Scan QR</button>
      {showToggle && <Scanner onScan={handleScan} />}
    </div>
  );
};

export default ScanQr;
