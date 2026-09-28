"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/content/attribution";

/**
 * Records the campaign parameters from the landing URL.
 *
 * Mounted in the root layout rather than in the form, so it runs on whichever
 * page the visitor arrives on — the form sits far down the homepage, and a
 * visitor could land on any route.
 */
export default function Attribution() {
  useEffect(() => {
    captureAttribution(window.location.search);
  }, []);

  return null;
}
