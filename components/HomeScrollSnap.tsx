"use client";

import { useEffect } from "react";

/** Enables desktop-only step scroll-snap on <html> only while the home page is mounted. */
export default function HomeScrollSnap() {
  useEffect(() => {
    document.documentElement.classList.add("snap-page");
    return () => document.documentElement.classList.remove("snap-page");
  }, []);

  return null;
}
