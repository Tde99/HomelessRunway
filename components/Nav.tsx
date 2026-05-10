"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavProps {
  links?: { href: string; label: string; isCta?: boolean }[];
}

const defaultLinks = [
  { href: "/", label: "Home" },
  { href: "/#support", label: "Participant Support" },
  { href: "/#series", label: "Series 001" },
  { href: "/#garment", label: "Garment System" },
  { href: "/allocation", label: "Partner Allocation" },
  { href: "/submit", label: "Submit Allocation" },
  { href: "/submit", label: "Apply", isCta: true },
];

export default function Nav({ links = defaultLinks }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Main navigation">
      <Link href="/" className="nav-brand" aria-label="HOMELESS RUNWAY home">
        <Image
          src="/images/branding/hr-monogram.png"
          alt="HOMELESS RUNWAY monogram"
          className="nav-monogram"
          width={26}
          height={26}
        />
      </Link>
      <button
        type="button"
        className={`nav-toggle${open ? " nav-toggle--open" : ""}`}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
      </button>
      <ul className={`nav-links${open ? " nav-links--open" : ""}`} role="list">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className={`${link.isCta ? "nav-cta" : ""}${
                !link.isCta && pathname === link.href ? " nav-active" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
