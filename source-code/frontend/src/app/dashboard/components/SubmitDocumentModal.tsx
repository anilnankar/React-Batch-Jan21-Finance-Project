import type { FormEvent } from "react";

type Props = {
  open: boolean;
  isSubmitting: boolean;
  message: string;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SubmitDocumentModal({ open, isSubmitting, message, onClose, onSubmit }: Props) {
  return (
    <>
      <div
        className={`modal fade${open ? " show d-block" : ""}`}
        id="submitDocumentModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={open}
        aria-labelledby="submitDocumentModalLabel"
        style={open ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="submitDocumentModalLabel">
                Submit Document for Loan
              </h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={isSubmitting} />
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" htmlFor="document_type">
                      Select Document Type<span className="text-danger">*</span>
                    </label>
                    <select id="document_type" name="document_type" className="form-select" required>
                      <option value="adhhar">Adhar</option>
                      <option value="pan">Pan</option>
                      <option value="rent_agrreement">Rent Aggrement</option>
                      <option value="photo">Photo</option>
                      <option value="salary_slip">Salary Slip</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="document_file">
                      Upload Document <span className="text-danger">*</span>
                    </label>
                    <input type="file" name="document_file" id="document_file" />
                    <div className="form-text">Upload file with size less than 1mb</div>
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
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Processing…" : "Upload Document"}
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
