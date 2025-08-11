"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BrowserWarningDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkBrowserAndFeatures = async () => {
      const userAgent = navigator.userAgent.toLowerCase();

      // 1. Check if Brave (explicit detection)
      const isBrave =
        (navigator as any).brave !== undefined ||
        userAgent.includes("brave") ||
        (window as any).BraveAds !== undefined;

      // 2. Check if Chromium (Chrome, Edge, etc.)
      const isChromium =
        (window as any).chrome !== undefined &&
        navigator.vendor === "Google Inc.";

      // 3. Check if File APIs are blocked (e.g., Brave Shields)
      let fileAPIsBlocked = false;
      try {
        // Attempt to use a File API feature
        // eslint-disable-next-line no-new
        new File([], "test.txt");
        if (!("showOpenFilePicker" in window)) {
          fileAPIsBlocked = true; // Brave may block this API
        }
      } catch (e) {
        fileAPIsBlocked = true;
      }

      // Show warning if:
      // - Not Chromium (Firefox, Safari, etc.) OR
      // - Brave with blocked File APIs
      if (!isChromium || (isBrave && fileAPIsBlocked)) {
        setOpen(true);
      }
    };

    checkBrowserAndFeatures();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg border-none text-white"
        style={{ backgroundColor: "#062354" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Browser Compatibility Issue
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {open
              ? "For large file transfers, please use Chrome, Edge, or disable Brave Shields for this site."
              : "Your browser may not support large file transfers optimally."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => setOpen(false)}
            style={{ backgroundColor: "#052454" }}
            className="hover:opacity-90"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
