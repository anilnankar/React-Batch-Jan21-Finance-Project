import type { FormEvent } from "react";
import type { AccountRow, BeneficiaryRow } from "../types";
import { formatEnumLabel, formatMoney } from "../utils";

type Props = {
  open: boolean;
  accounts: AccountRow[];
  paymentFromAccountId: string;
  paymentBeneficiaries: BeneficiaryRow[];
  loadingPaymentBeneficiaries: boolean;
  message: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPaymentFromAccountChange: (value: string) => void;
};

export function MakePaymentModal({
  open,
  accounts,
  paymentFromAccountId,
  paymentBeneficiaries,
  loadingPaymentBeneficiaries,
  message,
  isSubmitting,
  onClose,
  onSubmit,
  onPaymentFromAccountChange,
}: Props) {
  return (
    <>
      <div
        className={`modal fade${open ? " show d-block" : ""}`}
        id="makePaymentModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={open}
        aria-labelledby="makePaymentModalLabel"
        style={open ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="makePaymentModalLabel">
                Make payment
              </h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={isSubmitting} />
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" htmlFor="paymentFromAccount">
                      From account <span className="text-danger">*</span>
                    </label>
                    <select
                      id="paymentFromAccount"
                      name="from_account_id"
                      className="form-select"
                      value={paymentFromAccountId}
                      onChange={(e) => onPaymentFromAccountChange(e.target.value)}
                      required
                      disabled={accounts.length === 0}
                    >
                      <option value="" disabled>
                        {accounts.length === 0 ? "No accounts available" : "Select your account"}
                      </option>
                      {accounts.map((acc) => (
                        <option key={acc.account_id} value={String(acc.account_id)}>
                          {acc.account_number} · {formatEnumLabel(acc.account_type)} · {formatMoney(acc.available_balance, acc.currency_code)}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">Debit this account for the transfer.</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="paymentBeneficiary">
                      To account (payee) <span className="text-danger">*</span>
                    </label>
                    <select
                      id="paymentBeneficiary"
                      key={paymentFromAccountId || "no-from"}
                      name="beneficiary_id"
                      className="form-select"
                      defaultValue=""
                      required
                      disabled={!paymentFromAccountId || loadingPaymentBeneficiaries || accounts.length === 0}
                    >
                      <option value="" disabled>
                        {!paymentFromAccountId
                          ? "Select from account first"
                          : loadingPaymentBeneficiaries
                            ? "Loading payees…"
                            : paymentBeneficiaries.length === 0
                              ? "No active payees for this account"
                              : "Select payee"}
                      </option>
                      {paymentBeneficiaries.map((b) => (
                        <option key={b.beneficiary_id} value={b.beneficiary_id}>
                          {b.beneficiary_name} — {b.beneficiary_account_number}
                          {b.nickname ? ` (${b.nickname})` : ""}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">Active payees linked to the selected account.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="paymentAmountInr">
                      Amount (INR) <span className="text-danger">*</span>
                    </label>
                    <input id="paymentAmountInr" name="amount_in_inr" type="number" inputMode="decimal" className="form-control" placeholder="0.00" min={0.01} step={0.01} required />
                    <div className="form-text">Numbers only; paise up to two decimal places.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="paymentChannel">
                      Payment channel
                    </label>
                    <select id="paymentChannel" name="payment_channel" className="form-select" defaultValue="NETBANKING">
                      <option value="NETBANKING">Net banking</option>
                      <option value="MOBILE">Mobile</option>
                      <option value="BRANCH">Branch</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="paymentRemarks">
                      Remarks (optional)
                    </label>
                    <textarea id="paymentRemarks" name="remarks" className="form-control" rows={2} maxLength={255} placeholder="Note for your records" />
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
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || accounts.length === 0 || !paymentFromAccountId || paymentBeneficiaries.length === 0}>
                  {isSubmitting ? "Processing…" : "Pay now"}
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
