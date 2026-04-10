import type { CustomerRow } from "../types";
import { formatDate, formatEnumLabel } from "../utils";

type Props = {
  isLoading: boolean;
  customer: CustomerRow | null;
};

export function CustomerInfoCard({ isLoading, customer }: Props) {
  return (
    <div className="card border-2 mt-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Customer Information</h2>
        {isLoading ? (
          <p className="text-muted mb-0">Loading customer details…</p>
        ) : !customer ? (
          <p className="text-muted mb-0">Customer profile could not be loaded.</p>
        ) : (
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Full name</p>
              <p className="mb-0 fw-semibold">{customer.full_name}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Customer code</p>
              <p className="mb-0 fw-semibold">{customer.customer_code}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Customer type</p>
              <p className="mb-0 fw-semibold">{formatEnumLabel(customer.customer_type)}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Email</p>
              <p className="mb-0 fw-semibold">{customer.email || "—"}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Mobile number</p>
              <p className="mb-0 fw-semibold">{customer.mobile_number}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">PAN</p>
              <p className="mb-0 fw-semibold text-uppercase">{customer.pan_number}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Date of birth / incorporation</p>
              <p className="mb-0 fw-semibold">{formatDate(customer.date_of_birth_or_incorp)}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Account status</p>
              <p className="mb-0 fw-semibold">{formatEnumLabel(customer.status)}</p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p className="mb-1 text-muted">Risk category</p>
              <p className="mb-0 fw-semibold">{formatEnumLabel(customer.risk_category)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
