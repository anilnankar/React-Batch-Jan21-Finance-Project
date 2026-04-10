import type { LoanRow } from "../types";
import { formatDate, formatEnumLabel, formatMoney, loanStatusBadgeClass } from "../utils";

type Props = {
  isLoading: boolean;
  customerLoans: LoanRow[];
  onOpenSubmitDocument: (loanId: number) => void;
  onOpenViewDocument: (loanId: number) => void;
};

export function LoansCard({ isLoading, customerLoans, onOpenSubmitDocument, onOpenViewDocument }: Props) {
  return (
    <div className="card border-2 h-100">
      <div className="card-body">
        <h2 className="h5 mb-3">Loan Details</h2>
        <div className="d-grid gap-3">
          {isLoading ? (
            <p className="text-muted mb-0">Loading loans…</p>
          ) : customerLoans.length === 0 ? (
            <p className="text-muted mb-0">No loans found for this customer.</p>
          ) : (
            customerLoans.map((loan) => {
              const principal = Number.parseFloat(loan.principal_amount || "0");
              const disbursed = Number.parseFloat(loan.disbursed_amount || "0");
              const outstanding = Number.isFinite(principal - disbursed) ? principal - disbursed : principal;
              return (
                <div className="border rounded p-3" key={loan.loan_id}>
                  <div className="d-flex justify-content-between mb-1">
                    <strong>{loan.loan_type || "Loan"}</strong>
                    <span className={`badge ${loanStatusBadgeClass(loan.loan_status)}`}>{formatEnumLabel(loan.loan_status)}</span>
                    <div className="dropdown">
                      <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button className="dropdown-item" type="button" onClick={() => onOpenSubmitDocument(loan.loan_id)}>
                            Submit Document
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" type="button" onClick={() => onOpenViewDocument(loan.loan_id)}>
                            View Document
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" type="button">
                            Cancel Loan
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="small text-muted">{loan.loan_account_number}</div>
                  <div className="mt-2">Principal: {formatMoney(loan.principal_amount, "INR")}</div>
                  <div>Outstanding: {formatMoney(outstanding, "INR")}</div>
                  <div>Rate: {loan.interest_rate_annual}% p.a.</div>
                  <div>Tenure: {loan.tenure_months} months</div>
                  <div>
                    Period: {formatDate(loan.start_date)} to {formatDate(loan.end_date)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
