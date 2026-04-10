export type AccountRow = {
  account_id: number;
  account_number: string;
  customer_id: number;
  account_type: string;
  currency_code: string;
  status: string;
  available_balance: string;
  ledger_balance: string;
};

export type BeneficiaryRow = {
  beneficiary_id: number;
  account_id: number;
  beneficiary_name: string;
  beneficiary_account_number: string;
  ifsc_code: string | null;
  bank_name: string | null;
  nickname: string | null;
  status: string;
};

export type CustomerRow = {
  customer_id: number;
  customer_code: string;
  customer_type: string;
  full_name: string;
  date_of_birth_or_incorp: string | null;
  mobile_number: string;
  email: string | null;
  pan_number: string;
  kyc_status: string;
  risk_category: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export type LoanTypeRow = {
  loan_type_id: number;
  loan_type: "Personal" | "Home" | "Gold" | "Property" | "Car";
  roi: number;
  min_tenure: number;
  max_tenure: number;
  status: "ACTIVE" | "INACTIVE";
  created_date?: string;
  updated_date?: string;
};

export type LoanRow = {
  loan_id: number;
  loan_account_number: string;
  loan_type_id: number;
  loan_type: string | null;
  product_roi: string | number | null;
  customer_id: number;
  linked_account_id: number | null;
  linked_account_number: string | null;
  principal_amount: string;
  disbursed_amount: string;
  interest_rate_annual: string;
  tenure_months: number;
  start_date: string | null;
  end_date: string | null;
  loan_status: "APPLIED" | "APPROVED" | "DISBURSED" | "ACTIVE" | "CLOSED" | "NPA" | "WRITTEN_OFF";
  created_at: string;
  updated_at: string;
};

export type LoanDocumentRow = {
  document_id: number;
  document_type: string;
  document_file: string;
  status: string;
};

export type StatementRow = {
  transaction_id: number;
  amount: string | number;
  transaction_type: string;
  beneficiary_name: string | null;
  status: string;
  created_at: string;
};
