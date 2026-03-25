import React from "react";
import LogoBadge from "../atoms/LogoBadge";
import NavLinkItem from "../atoms/NavLinkItem";

type TopHeaderProps = {
  logoText: string;
  links: string[];
};

export default function TopHeader({ logoText, links }: TopHeaderProps) {
  const activeIndex = 0;

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg bg-light"
        style={{
          backgroundColor: "var(--panel-bg)",
          border: "2px solid var(--border-color)",
        }}
      >
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="#"
            style={{
              padding: 0,
            }}
          >
            <LogoBadge text={logoText} />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#topNavbar"
            aria-controls="topNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="topNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {links.map((label, idx) => (
                <li key={label} className="nav-item">
                  <NavLinkItem label={label} isActive={idx === activeIndex} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

