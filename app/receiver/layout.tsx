import React, { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-x-hidden">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
