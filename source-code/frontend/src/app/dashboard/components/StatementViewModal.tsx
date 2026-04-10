import type { StatementRow } from "../types";

type Props = {
  open: boolean;
  isLoading: boolean;
  statements: StatementRow[];
  onClose: () => void;
};

export function StatementViewModal({ open, isLoading, statements, onClose }: Props) {
  return (
    <div
      className={`modal fade${open ? " show d-block" : ""}`}
      id="statementViewModal"
      tabIndex={-1}
      role="dialog"
      aria-modal={open}
      aria-labelledby="statementViewModalLabel"
      style={open ? undefined : { display: "none" }}
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5" id="statementViewModalLabel">
              Account Statements
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {isLoading ? (
              <p className="text-muted mb-0">Loading accounts…</p>
            ) : statements.length === 0 ? (
              <p className="text-muted mb-0">No statements found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Transction ID</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Beneficiary Name</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map((statement) => (
                      <tr key={statement.transaction_id}>
                        <td>{statement.transaction_id}</td>
                        <td>{statement.amount}</td>
                        <td>{statement.transaction_type}</td>
                        <td>{statement.beneficiary_name}</td>
                        <td>{statement.status}</td>
                        <td>{statement.created_at}</td>
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
