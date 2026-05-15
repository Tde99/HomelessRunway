"use client";

import { useEffect } from "react";

export default function SectionReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let revealObserver: IntersectionObserver | null = null;
    let staggerObserver: IntersectionObserver | null = null;
    let onScroll: (() => void) | null = null;

    // Section reveal
    const revealTargets = document.querySelectorAll(
      ".section, .page-hero, .ticker",
    );

    if (!reducedMotion && "IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 },
      );
      revealTargets.forEach((el) => {
        el.classList.add("will-reveal");
        revealObserver!.observe(el);
      });
    } else {
      revealTargets.forEach((el) => el.classList.add("is-revealed"));
    }

    // Staggered children
    const staggerGroups = document.querySelectorAll(
      ".stat-row, .placement-list, .rules-list, .faq-list, .review-flags, .dist-rules, .process-list",
    );

    if (!reducedMotion && "IntersectionObserver" in window) {
      staggerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              Array.from(entry.target.children).forEach((child, i) => {
                (child as HTMLElement).style.transitionDelay = `${i * 80}ms`;
                child.classList.add("is-revealed");
              });
              staggerObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );
      staggerGroups.forEach((group) => {
        Array.from(group.children).forEach((child) => {
          child.classList.add("will-reveal");
        });
        staggerObserver!.observe(group);
      });
    }

    // Hero drift
    if (!reducedMotion) {
      const heroImg = document.querySelector(".hero-img");
      if (heroImg) heroImg.classList.add("hero-drift");
    }

    // Nav scroll state
    const nav = document.querySelector(".nav");
    if (nav) {
      let ticking = false;
      onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            nav.classList.toggle("nav--scrolled", window.scrollY > 80);
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      revealObserver?.disconnect();
      staggerObserver?.disconnect();
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
