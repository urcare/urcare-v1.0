import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { Toaster } from "sonner";

import LandingDiabetes from "@/pages/LandingDiabetes";
import "@/index.css";

declare global {
  interface Window {
    URCARE_LANDING_ASSET_MAP?: Record<string, string>;
  }
}

function rewriteAssetUrls(root: HTMLElement) {
  const map = window.URCARE_LANDING_ASSET_MAP;
  if (!map) return;

  const applyToUrl = (rawUrl: string) => {
    try {
      const url = new URL(rawUrl, window.location.origin);
      const mapped = map[url.pathname];
      return mapped ?? rawUrl;
    } catch {
      return rawUrl;
    }
  };

  root.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    const next = applyToUrl(img.src);
    if (next !== img.src) img.src = next;
  });

  root.querySelectorAll<HTMLSourceElement>("source").forEach((source) => {
    const next = applyToUrl(source.src);
    if (next !== source.src) source.src = next;
  });
}

function mount() {
  const el = document.getElementById("urcare-landing-diabetes-root");
  if (!el) return;

  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <MemoryRouter>
        <LandingDiabetes />
        <Toaster richColors closeButton />
      </MemoryRouter>
    </React.StrictMode>
  );

  // Post-render rewrite so hardcoded `/...` asset paths work in Shopify.
  requestAnimationFrame(() => rewriteAssetUrls(el));
  setTimeout(() => rewriteAssetUrls(el), 250);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
