import React from "react";
import { Metadata } from "next";

import { APP_NAME } from "../config";

export const metadata: Metadata = {
  title: APP_NAME,
  viewport: {
    width: "device-width",
    initialScale: 1,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
