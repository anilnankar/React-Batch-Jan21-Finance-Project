import type { LoanDocumentRow } from "../types";

type Props = {
  open: boolean;
  isLoading: boolean;
  isSubmittingDocument: boolean;
  documents: LoanDocumentRow[];
  onClose: () => void;
};

export function DocumentViewModal({ open, isLoading, isSubmittingDocument, documents, onClose }: Props) {
  return (
    <div
      className={`modal fade${open ? " show d-block" : ""}`}
      id="submittedDocumentsViewModal"
      tabIndex={-1}
      role="dialog"
      aria-modal={open}
      aria-labelledby="submittedDocumentsViewModalLabel"
      style={open ? undefined : { display: "none" }}
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5" id="submittedDocumentsViewModalLabel">
              View Submitted Documents for Loan
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} disabled={isSubmittingDocument} />
          </div>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {isLoading ? (
              <p className="text-muted mb-0">Loading accounts…</p>
            ) : documents.length === 0 ? (
              <p className="text-muted mb-0">No documents found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Type</th>
                      <th>File</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document) => (
                      <tr key={document.document_id}>
                        <td>{document.document_id}</td>
                        <td>{document.document_type}</td>
                        <td>{document.document_file}</td>
                        <td>{document.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
