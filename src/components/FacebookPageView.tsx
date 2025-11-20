// components/FacebookPageView.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FacebookPageView = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
};

export default FacebookPageView;
