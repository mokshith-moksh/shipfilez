// @ts-nocheck
"use client";

import { useState, useEffect } from "react";

const isMobileDevice = () => {
  if (typeof navigator !== "undefined" && navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return isMobile;
};

export default useIsMobile;
