import React from "react";
import type { CSSProperties, ReactNode } from "react";

type UiButtonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function UiButton({ children, className, style }: UiButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-outline-dark w-100 text-center ${className ?? ""}`}
      style={{
        borderColor: "var(--border-color)",
        color: "var(--primary-text)",
        borderRadius: "var(--radius-md)",
        padding: 0,
        height: 92,
        fontSize: 24,
        fontWeight: 500,
        cursor: "pointer",
        backgroundColor: "transparent",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

