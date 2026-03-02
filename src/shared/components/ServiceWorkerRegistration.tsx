"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[SW] Registered:", registration.scope);

            // Cek update saat tab difokuskan
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (!newWorker) return;
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Ada versi baru tersedia, reload otomatis
                  window.location.reload();
                }
              });
            });
          })
          .catch((error) => {
            console.error("[SW] Registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
