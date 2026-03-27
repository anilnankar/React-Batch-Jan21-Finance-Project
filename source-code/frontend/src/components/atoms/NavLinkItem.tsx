import React from "react";
import Link from "next/link";

type NavLinkItemProps = {
  label: string;
  href: string;
  isActive?: boolean;
};

export default function NavLinkItem({ label, href, isActive }: NavLinkItemProps) {
  return (
    <Link
      href={href}
      className={`nav-link fw-bold${isActive ? " active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      style={{
        fontSize: 28,
        color: "var(--primary-text)",
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      {label}
    </Link>
  );
}

