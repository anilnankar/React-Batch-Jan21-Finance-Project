import type { FormEvent } from "react";
import type { AccountRow, LoanTypeRow } from "../types";
import { formatDate, formatEnumLabel } from "../utils";

type Props = {
  open: boolean;
  loanTypesLoadError: string;
  loadingLoanTypes: boolean;
  loanTypes: LoanTypeRow[];
  selectedTypeId: string;
  selectedTypeMeta: LoanTypeRow | null;
  applyLoanTenureStr: string;
  applyLoanStartDate: string;
  applyLoanComputedEndDate: string;
  message: string;
  isSubmitting: boolean;
  accounts: AccountRow[];
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTypeChange: (typeId: string) => void;
  onTenureChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
};

export function ApplyLoanModal(props: Props) {
  const {
    open,
    loanTypesLoadError,
    loadingLoanTypes,
    loanTypes,
    selectedTypeId,
    selectedTypeMeta,
    applyLoanTenureStr,
    applyLoanStartDate,
    applyLoanComputedEndDate,
    message,
    isSubmitting,
    accounts,
    onClose,
    onSubmit,
    onTypeChange,
    onTenureChange,
    onStartDateChange,
  } = props;

  return (
    <>
      <div
        className={`modal fade${open ? " show d-block" : ""}`}
        id="applyLoanModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={open}
        aria-labelledby="applyLoanModalLabel"
        style={open ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="applyLoanModalLabel">
                Apply for loan
              </h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={isSubmitting} />
            </div>
            <form key={open ? "apply-loan-open" : "apply-loan-closed"} onSubmit={onSubmit}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {loanTypesLoadError ? (
                  <div className="alert alert-warning py-2" role="alert">
                    {loanTypesLoadError}
                  </div>
                ) : null}
                <div className="alert alert-info py-2 mb-3" role="alert">
                  Loan account number is auto-generated when you submit the application.
                </div>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanTypeId">
                      Loan type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="loanTypeId"
                      name="loan_type_id"
                      className="form-select"
                      value={selectedTypeId}
                      onChange={(e) => onTypeChange(e.target.value)}
                      required
                      disabled={isSubmitting || loadingLoanTypes || loanTypes.length === 0}
                    >
                      <option value="" disabled>
                        {loadingLoanTypes ? "Loading loan types…" : loanTypes.length === 0 ? "No loan types available" : "Select loan type"}
                      </option>
                      {loanTypes.map((lt) => (
                        <option key={lt.loan_type_id} value={String(lt.loan_type_id)}>
                          {lt.loan_type} — ROI {lt.roi}% · {lt.min_tenure}–{lt.max_tenure} mo.
                        </option>
                      ))}
                    </select>
                    {selectedTypeMeta ? (
                      <div className="form-text">
                        Reference rate (ROI): {selectedTypeMeta.roi}% p.a. Allowed tenure: {selectedTypeMeta.min_tenure}–{selectedTypeMeta.max_tenure} months.
                      </div>
                    ) : null}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanLinkedAccountId">
                      Linked account
                    </label>
                    <select id="loanLinkedAccountId" name="linked_account_id" className="form-select" defaultValue="" disabled={isSubmitting || accounts.length === 0}>
                      <option value="">None</option>
                      {accounts.map((acc) => (
                        <option key={acc.account_id} value={acc.account_id}>
                          {acc.account_number} · {formatEnumLabel(acc.account_type)}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">Optional savings/current account to link.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanPrincipalAmount">
                      Principal amount <span className="text-danger">*</span>
                    </label>
                    <input id="loanPrincipalAmount" name="principal_amount" type="number" inputMode="decimal" className="form-control" placeholder="0.00" min={0.01} step={0.01} required disabled={isSubmitting} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanDisbursedAmount">
                      Disbursed amount
                    </label>
                    <input id="loanDisbursedAmount" type="text" className="form-control" value="0.00" readOnly disabled aria-readonly="true" />
                    <div className="form-text">Set to zero at application; updated after disbursement.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanInterestRate">
                      Interest rate (annual %)
                    </label>
                    <input id="loanInterestRate" type="text" className="form-control" value={selectedTypeMeta ? `${selectedTypeMeta.roi}%` : "Select loan type first"} readOnly disabled aria-readonly="true" />
                    <div className="form-text">Rate is auto-selected from loan type and cannot be edited.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanTenureMonths">
                      Tenure (months) <span className="text-danger">*</span>
                    </label>
                    <input
                      id="loanTenureMonths"
                      name="tenure_months"
                      type="number"
                      inputMode="numeric"
                      className="form-control"
                      placeholder={selectedTypeMeta ? `${selectedTypeMeta.min_tenure}–${selectedTypeMeta.max_tenure}` : "Select loan type first"}
                      value={applyLoanTenureStr}
                      onChange={(e) => onTenureChange(e.target.value)}
                      min={selectedTypeMeta?.min_tenure ?? 1}
                      max={selectedTypeMeta?.max_tenure ?? 600}
                      step={1}
                      required
                      disabled={isSubmitting || !selectedTypeId}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanStartDate">
                      Start date
                    </label>
                    <input id="loanStartDate" name="start_date" type="date" className="form-control" value={applyLoanStartDate} onChange={(e) => onStartDateChange(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanEndDate">
                      End date
                    </label>
                    <input id="loanEndDate" type="date" className="form-control bg-body-secondary" value={applyLoanComputedEndDate} readOnly tabIndex={-1} aria-readonly="true" autoComplete="off" />
                    <div className="form-text">
                      {applyLoanComputedEndDate
                        ? `Auto-calculated from start date + tenure (${formatDate(applyLoanComputedEndDate)}).`
                        : "Set start date and tenure to calculate end date."}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="form-label mb-1">Loan status</p>
                    <p className="form-control-plaintext mb-0 fw-semibold" id="loanStatusReadonly">
                      APPLIED
                    </p>
                    <div className="form-text">New applications are recorded as APPLIED.</div>
                  </div>
                </div>
                {message ? (
                  <div className="alert alert-danger mt-3 mb-0 py-2" role="alert">
                    {message}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || loadingLoanTypes || loanTypes.length === 0}>
                  {isSubmitting ? "Submitting…" : "Submit application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {open ? (
        <div
          className="modal-backdrop fade show"
          role="presentation"
          onClick={() => {
            if (!isSubmitting) {
              onClose();
            }
          }}
        />
      ) : null}
    </>
  );
}
