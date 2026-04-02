"use client";

import QueryProvider from "../provider/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
          <ToastContainer position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}