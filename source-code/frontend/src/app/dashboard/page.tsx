"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AccountRow = {
  account_id: number;
  account_number: string;
  customer_id: number;
  account_type: string;
  currency_code: string;
  status: string;
  available_balance: string;
  ledger_balance: string;
};

type CustomerRow = {
  customer_id: number;
  customer_code: string;
  customer_type: string;
  full_name: string;
  date_of_birth_or_incorp: string | null;
  mobile_number: string;
  email: string | null;
  pan_number: string;
  kyc_status: string;
  risk_category: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

const loanSummary = [
  { loanId: "HL-7781", loanType: "Home Loan", outstanding: "INR 24,10,000", emi: "INR 28,500", status: "Running" },
  { loanId: "PL-5520", loanType: "Personal Loan", outstanding: "INR 1,15,000", emi: "INR 9,250", status: "Running" },
];

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(value: string | null) {
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

function kycStatusClass(status: string) {
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

function formatMoney(amount: string | number, currencyCode: string) {
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

export default function DashboardPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [customer, setCustomer] = useState<CustomerRow | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customerId = sessionStorage.getItem("customerId");
    if (!customerId) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoadError("");
      try {
        setIsLoading(true);
        const base = "http://localhost:5000/api/v1";
        const [accountsRes, customerRes] = await Promise.all([
          fetch(`${base}/accounts/customer/${customerId}`),
          fetch(`${base}/customers/${customerId}`),
        ]);

        const accountsJson = await accountsRes.json();
        const customerJson = await customerRes.json();

        if (cancelled) {
          return;
        }

        const messages: string[] = [];

        if (accountsRes.ok) {
          setAccounts(Array.isArray(accountsJson.data) ? accountsJson.data : []);
        } else {
          setAccounts([]);
          messages.push(accountsJson?.message || "Could not load accounts");
        }

        if (customerRes.ok && customerJson.data) {
          setCustomer(customerJson.data as CustomerRow);
        } else {
          setCustomer(null);
          messages.push(customerJson?.message || "Could not load customer profile");
        }

        setLoadError(messages.join(" "));
      } catch {
        if (!cancelled) {
          setLoadError("Unable to connect to backend API");
          setAccounts([]);
          setCustomer(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Customer Dashboard</h1>
          <p className="text-muted mb-0">
            {isLoading
              ? "Loading your profile…"
              : customer
                ? `Welcome back, ${customer.full_name}. Here is your latest financial overview.`
                : "Here is your latest financial overview."}
          </p>
        </div>
        <Link
          href="/login"
          className="btn btn-outline-secondary"
          onClick={() => sessionStorage.removeItem("customerId")}
        >
          Logout
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">Total Accounts</p>
              <h2 className="h4 mb-0">{isLoading ? "…" : accounts.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">Active Loans</p>
              <h2 className="h4 mb-0">{loanSummary.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">KYC Status</p>
              <h2 className={`h4 mb-0 ${customer ? kycStatusClass(customer.kyc_status) : "text-muted"}`}>
                {isLoading ? "…" : customer ? formatEnumLabel(customer.kyc_status) : "—"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="alert alert-warning" role="alert">
          {loadError}
        </div>
      ) : null}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card border-2 h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Accounts</h2>
              {isLoading ? (
                <p className="text-muted mb-0">Loading accounts…</p>
              ) : accounts.length === 0 ? (
                <p className="text-muted mb-0">No accounts found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped mb-0">
                    <thead>
                      <tr>
                        <th>Account No</th>
                        <th>Type</th>
                        <th>Available balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((account) => (
                        <tr key={account.account_id}>
                          <td>{account.account_number}</td>
                          <td>{formatEnumLabel(account.account_type)}</td>
                          <td>{formatMoney(account.available_balance, account.currency_code)}</td>
                          <td>{account.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-2 h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Loan Details</h2>
              <div className="d-grid gap-3">
                {loanSummary.map((loan) => (
                  <div className="border rounded p-3" key={loan.loanId}>
                    <div className="d-flex justify-content-between mb-1">
                      <strong>{loan.loanType}</strong>
                      <span className="badge text-bg-warning">{loan.status}</span>
                    </div>
                    <div className="small text-muted">{loan.loanId}</div>
                    <div className="mt-2">Outstanding: {loan.outstanding}</div>
                    <div>EMI: {loan.emi}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-2 mt-4">
        <div className="card-body">
          <h2 className="h5 mb-3">Customer Information</h2>
          {isLoading ? (
            <p className="text-muted mb-0">Loading customer details…</p>
          ) : !customer ? (
            <p className="text-muted mb-0">Customer profile could not be loaded.</p>
          ) : (
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Full name</p>
                <p className="mb-0 fw-semibold">{customer.full_name}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Customer code</p>
                <p className="mb-0 fw-semibold">{customer.customer_code}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Customer type</p>
                <p className="mb-0 fw-semibold">{formatEnumLabel(customer.customer_type)}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Email</p>
                <p className="mb-0 fw-semibold">{customer.email || "—"}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Mobile number</p>
                <p className="mb-0 fw-semibold">{customer.mobile_number}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">PAN</p>
                <p className="mb-0 fw-semibold text-uppercase">{customer.pan_number}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Date of birth / incorporation</p>
                <p className="mb-0 fw-semibold">{formatDate(customer.date_of_birth_or_incorp)}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Account status</p>
                <p className="mb-0 fw-semibold">{formatEnumLabel(customer.status)}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <p className="mb-1 text-muted">Risk category</p>
                <p className="mb-0 fw-semibold">{formatEnumLabel(customer.risk_category)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
