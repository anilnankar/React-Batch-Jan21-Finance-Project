import type { AccountRow } from "../types";
import { formatEnumLabel, formatMoney } from "../utils";

type Props = {
  isLoading: boolean;
  accounts: AccountRow[];
};

export function AccountsCard({ isLoading, accounts }: Props) {
  return (
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
  );
}
