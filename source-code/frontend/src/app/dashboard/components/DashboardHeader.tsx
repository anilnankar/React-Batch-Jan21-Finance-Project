import Link from "next/link";
import type { CustomerRow } from "../types";

type Props = {
  isLoading: boolean;
  customer: CustomerRow | null;
  onOpenAddPayee: () => void;
  onOpenPayment: () => void;
  onOpenStatements: () => void;
  onOpenApplyLoan: () => void;
};

export function DashboardHeader({
  isLoading,
  customer,
  onOpenAddPayee,
  onOpenPayment,
  onOpenStatements,
  onOpenApplyLoan,
}: Props) {
  return (
    <div className="d-flex justify-content-between align-items-start align-items-md-center flex-wrap gap-3 mb-4">
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

      <div className="d-flex flex-wrap align-items-center gap-2 ms-md-auto">
        <div className="dropdown">
          <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Manage Payee
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" type="button" onClick={onOpenAddPayee}>
                Add Payee
              </button>
            </li>
            <li>
              <button className="dropdown-item" type="button">
                Remove Payee
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Transactions
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" type="button" onClick={onOpenPayment}>
                Make Payment
              </button>
            </li>
            <li>
              <button className="dropdown-item" type="button" onClick={onOpenStatements}>
                Statements
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Loans
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" type="button" onClick={onOpenApplyLoan}>
                Apply Loan
              </button>
            </li>
            <li>
              <button className="dropdown-item" type="button">
                Foreclose Request
              </button>
            </li>
            <li>
              <button className="dropdown-item" type="button">
                Statement
              </button>
            </li>
          </ul>
        </div>

        <Link href="/login" className="btn btn-outline-secondary" onClick={() => sessionStorage.removeItem("customerId")}>
          Logout
        </Link>
      </div>
    </div>
  );
}
