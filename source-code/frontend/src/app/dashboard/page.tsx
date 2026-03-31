import Link from "next/link";

const accountSummary = [
  { accountNo: "SB-901234", accountType: "Savings", balance: "INR 1,24,500", status: "Active" },
  { accountNo: "CA-458922", accountType: "Current", balance: "INR 3,82,200", status: "Active" },
];

const loanSummary = [
  { loanId: "HL-7781", loanType: "Home Loan", outstanding: "INR 24,10,000", emi: "INR 28,500", status: "Running" },
  { loanId: "PL-5520", loanType: "Personal Loan", outstanding: "INR 1,15,000", emi: "INR 9,250", status: "Running" },
];

export default function DashboardPage() {
  return (
    <main className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Customer Dashboard</h1>
          <p className="text-muted mb-0">Welcome back. Here is your latest financial overview.</p>
        </div>
        <Link href="/login" className="btn btn-outline-secondary">
          Logout
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">Total Accounts</p>
              <h2 className="h4 mb-0">{accountSummary.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">Active Loans</p>
              <h2 className="h4 mb-0">{loanSummary.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">KYC Status</p>
              <h2 className="h4 mb-0 text-success">Completed</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card border-2 h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Accounts</h2>
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Account No</th>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountSummary.map((account) => (
                      <tr key={account.accountNo}>
                        <td>{account.accountNo}</td>
                        <td>{account.accountType}</td>
                        <td>{account.balance}</td>
                        <td>{account.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-2 h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Loan Details</h2>
              <div className="d-grid gap-3">
                {loanSummary.map((loan) => (
                  <div className="border rounded p-3" key={loan.loanId}>
                    <div className="d-flex justify-content-between mb-1">
                      <strong>{loan.loanType}</strong>
                      <span className="badge text-bg-warning">{loan.status}</span>
                    </div>
                    <div className="small text-muted">{loan.loanId}</div>
                    <div className="mt-2">Outstanding: {loan.outstanding}</div>
                    <div>EMI: {loan.emi}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-2 mt-4">
        <div className="card-body">
          <h2 className="h5 mb-3">Customer Information</h2>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <p className="mb-1 text-muted">Customer Name</p>
              <p className="mb-0 fw-semibold">Anil Kumar</p>
            </div>
            <div className="col-12 col-md-4">
              <p className="mb-1 text-muted">Registered Mobile</p>
              <p className="mb-0 fw-semibold">+91 9876543210</p>
            </div>
            <div className="col-12 col-md-4">
              <p className="mb-1 text-muted">Risk Category</p>
              <p className="mb-0 fw-semibold">Low</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
