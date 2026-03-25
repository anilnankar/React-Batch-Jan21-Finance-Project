import React from "react";

type LogoBadgeProps = {
  text: string;
};

export default function LogoBadge({ text }: LogoBadgeProps) {
  return (
    <div
      className="border border-2 rounded-3 text-center fw-bold px-3 py-2"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--panel-bg)",
        color: "var(--primary-text)",
        minWidth: 120,
        fontSize: 34,
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
}
