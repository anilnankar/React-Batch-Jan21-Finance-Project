import type { CustomerRow, LoanRow } from "../types";
import { formatEnumLabel, kycStatusClass } from "../utils";

type Props = {
  isLoading: boolean;
  accountsCount: number;
  customerLoans: LoanRow[];
  customer: CustomerRow | null;
};

export function SummaryCards({ isLoading, accountsCount, customerLoans, customer }: Props) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <div className="card h-100 border-2">
          <div className="card-body">
            <p className="text-muted mb-1">Total Accounts</p>
            <h2 className="h4 mb-0">{isLoading ? "…" : accountsCount}</h2>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card h-100 border-2">
          <div className="card-body">
            <p className="text-muted mb-1">Active Loans</p>
            <h2 className="h4 mb-0">
              {isLoading ? "…" : customerLoans.filter((loan) => ["ACTIVE", "APPROVED", "DISBURSED"].includes(loan.loan_status)).length}
            </h2>
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
  );
}
