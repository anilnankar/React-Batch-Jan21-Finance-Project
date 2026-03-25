"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Load bootstrap JS only in the browser to avoid SSR "document is not defined".
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}

