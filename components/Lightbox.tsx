"use client";

import { useState, useEffect, useCallback } from "react";

export default function Lightbox() {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [open, setOpen] = useState(false);

  const closeLightbox = useCallback(() => {
    setOpen(false);
    setSrc("");
    setAlt("");
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest(".lightbox-trigger");
      if (!trigger) return;
      const img = trigger.querySelector("img");
      if (!img) return;
      setSrc(img.src);
      setAlt(img.alt);
      setOpen(true);
      document.body.style.overflow = "hidden";
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeLightbox]);

  if (!open) return null;

  return (
    <div
      className="lightbox-overlay is-open"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLightbox();
      }}
    >
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close image viewer"
        onClick={closeLightbox}
        autoFocus
      >
        Close ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </div>
  );
}
