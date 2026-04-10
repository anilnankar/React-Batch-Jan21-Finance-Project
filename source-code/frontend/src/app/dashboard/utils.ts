import type { LoanRow } from "./types";

export function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) {
    return value;
  }
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

export function kycStatusClass(status: string) {
  if (status === "VERIFIED") {
    return "text-success";
  }
  if (status === "PENDING") {
    return "text-warning";
  }
  if (status === "REJECTED" || status === "EXPIRED") {
    return "text-danger";
  }
  return "text-muted";
}

export function formatMoney(amount: string | number, currencyCode: string) {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(n)) {
    return "—";
  }
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currencyCode || "INR"} ${n}`;
  }
}

export function loanStatusBadgeClass(status: LoanRow["loan_status"]) {
  if (status === "ACTIVE" || status === "DISBURSED" || status === "APPROVED") {
    return "text-bg-success";
  }
  if (status === "APPLIED") {
    return "text-bg-info";
  }
  if (status === "NPA" || status === "WRITTEN_OFF") {
    return "text-bg-danger";
  }
  return "text-bg-secondary";
}

/** ISO date `YYYY-MM-DD` plus whole calendar months (loan tenure). */
export function addMonthsToIsoDate(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d || !Number.isFinite(months)) {
    return "";
  }
  const dt = new Date(y, m - 1 + months, d);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}
