import React from "react";
import type { CSSProperties, ReactNode } from "react";

type UiCardProps = {
  children: ReactNode;
  radius?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
};

export default function UiCard({
  children,
  radius = "md",
  className,
  style,
}: UiCardProps) {
  const radiusVar =
    radius === "sm"
      ? "var(--radius-sm)"
      : radius === "lg"
        ? "var(--radius-lg)"
        : "var(--radius-md)";

  return (
    <div
      className={`card border border-2 ${className ?? ""}`}
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--panel-bg)",
        borderRadius: radiusVar,
        color: "var(--primary-text)",
        ...style,
      }}
    >
      <div className="card-body p-0">{children}</div>
    </div>
  );
}

