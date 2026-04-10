import type { FormEvent } from "react";
import type { AccountRow } from "../types";
import { formatEnumLabel } from "../utils";

type Props = {
  open: boolean;
  accounts: AccountRow[];
  message: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AddPayeeModal({ open, accounts, message, isSubmitting, onClose, onSubmit }: Props) {
  return (
    <>
      <div
        className={`modal fade${open ? " show d-block" : ""}`}
        id="addPayeeModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={open}
        aria-labelledby="addPayeeModalLabel"
        style={open ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="addPayeeModalLabel">
                Add Payee
              </h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={isSubmitting} />
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" htmlFor="payeeAccountId">
                      Your account <span className="text-danger">*</span>
                    </label>
                    <select id="payeeAccountId" name="account_id" className="form-select" defaultValue="" required disabled={accounts.length === 0}>
                      <option value="" disabled>
                        {accounts.length === 0 ? "No accounts available" : "Select account"}
                      </option>
                      {accounts.map((acc) => (
                        <option key={acc.account_id} value={acc.account_id}>
                          {acc.account_number} · {formatEnumLabel(acc.account_type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="beneficiaryName">
                      Beneficiary name <span className="text-danger">*</span>
                    </label>
                    <input id="beneficiaryName" name="beneficiary_name" type="text" className="form-control" placeholder="Full name as per bank" minLength={2} maxLength={150} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="beneficiaryAccountNumber">
                      Beneficiary account number <span className="text-danger">*</span>
                    </label>
                    <input id="beneficiaryAccountNumber" name="beneficiary_account_number" type="text" className="form-control" placeholder="Account / IBAN" minLength={5} maxLength={32} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ifscCode">
                      IFSC code
                    </label>
                    <input id="ifscCode" name="ifsc_code" type="text" className="form-control text-uppercase" placeholder="e.g. HDFC0001234" maxLength={11} pattern="^[A-Z]{4}0[A-Z0-9]{6}$" />
                    <div className="form-text">11 characters. Leave blank if not applicable.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="bankName">
                      Bank name
                    </label>
                    <input id="bankName" name="bank_name" type="text" className="form-control" placeholder="Beneficiary bank" maxLength={150} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="nickname">
                      Nickname
                    </label>
                    <input id="nickname" name="nickname" type="text" className="form-control" placeholder="Short label for this payee" maxLength={80} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="beneficiaryStatus">
                      Status
                    </label>
                    <select id="beneficiaryStatus" name="status" className="form-select" defaultValue="ACTIVE">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                    </select>
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
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || accounts.length === 0}>
                  {isSubmitting ? "Saving…" : "Save payee"}
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
