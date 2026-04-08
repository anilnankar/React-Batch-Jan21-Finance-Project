const AppError = require("../../utils/app-error");
const { findCustomerById } = require("../customers/customers.repository");
const { findAccountWithCustomer } = require("../accounts/accounts.repository");
const { findLoanTypeById } = require("./loan-types.repository");
const { insertLoanDocument } = require("./loan-documents.repository");
const { insertLoan, findLoanById, findLoansByCustomerId } = require("./loans.repository");

const toMoney2 = (value) => Math.round(Number(value) * 100) / 100;
const toRate4 = (value) => Math.round(Number(value) * 10000) / 10000;
const generateLoanAccountNumber = () => {
  const stamp = Date.now();
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `LOAN${stamp}${suffix}`;
};

const createLoan = async (payload) => {
  const customer = await findCustomerById(payload.customer_id);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  const loanType = await findLoanTypeById(payload.loan_type_id);
  if (!loanType || String(loanType.status).toUpperCase() !== "ACTIVE") {
    throw new AppError("Loan type not found or inactive", 400);
  }

  const tenureMonths = Number(payload.tenure_months);
  const minTen = Number(loanType.min_tenure);
  const maxTen = Number(loanType.max_tenure);
  if (
    Number.isFinite(tenureMonths) &&
    Number.isFinite(minTen) &&
    Number.isFinite(maxTen) &&
    (tenureMonths < minTen || tenureMonths > maxTen)
  ) {
    throw new AppError(
      `Tenure must be between ${minTen} and ${maxTen} months for ${loanType.loan_type} loans`,
      400
    );
  }

  if (payload.linked_account_id != null) {
    const acc = await findAccountWithCustomer(payload.linked_account_id);
    if (!acc) {
      throw new AppError("Linked account not found", 404);
    }
    if (Number(acc.customer_id) !== Number(payload.customer_id)) {
      throw new AppError("Linked account does not belong to this customer", 403);
    }
  }

  const principal = toMoney2(payload.principal_amount);
  const disbursed = 0;
  const rate = toRate4(loanType.roi);

  let loanId;
  try {
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        loanId = await insertLoan({
          loan_account_number: generateLoanAccountNumber(),
          loan_type_id: payload.loan_type_id,
          customer_id: payload.customer_id,
          linked_account_id: payload.linked_account_id ?? null,
          principal_amount: principal,
          disbursed_amount: disbursed,
          interest_rate_annual: rate,
          tenure_months: payload.tenure_months,
          start_date: payload.start_date ?? null,
          end_date: payload.end_date ?? null,
          loan_status: payload.loan_status ?? "APPLIED",
        });
        lastError = null;
        break;
      } catch (err) {
        if (err && err.code === "ER_DUP_ENTRY") {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    if (!loanId && lastError) {
      throw new AppError("Could not generate unique loan account number", 500);
    }
  } catch (err) {
    if (err && err.code === "ER_NO_SUCH_TABLE") {
      throw new AppError("Loans storage is not configured (missing tables)", 500);
    }
    if (err && err.code === "ER_BAD_FIELD_ERROR") {
      throw new AppError("Database schema mismatch: run loan_types migration", 500);
    }
    throw err;
  }

  const saved = await findLoanById(loanId);
  if (!saved) {
    throw new AppError("Loan was created but could not be loaded", 500);
  }
  return saved;
};


const createLoanDocument = async (payload) => {
  const loan = await findLoanById(payload.loan_id);
  if (!loan) {
    throw new AppError("Loan not found", 404);
  }

  let loanId;
  try {
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        loanId = await insertLoanDocument({
          loan_id: payload.loan_id,
          document_type: payload.document_type,
          document_file: payload.document_file,
          status: payload.status ?? "Pending",
        });
        lastError = null;
        break;
      } catch (err) {
        if (err && err.code === "ER_DUP_ENTRY") {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    if (!loanId && lastError) {
      throw new AppError("Could not upload loan document", 500);
    }
  } catch (err) {
    if (err && err.code === "ER_NO_SUCH_TABLE") {
      throw new AppError("Loans document is not configured (missing tables)", 500);
    }
    if (err && err.code === "ER_BAD_FIELD_ERROR") {
      throw new AppError("Database schema mismatch: run loan document migration", 500);
    }
    throw err;
  }

  const saved = await findLoanById(loanId);
  if (!saved) {
    throw new AppError("Loan document was created but could not be loaded", 500);
  }
  return saved;
};


const getLoansByCustomerId = async (customerId) => {
  return findLoansByCustomerId(customerId);
};

module.exports = {
  createLoan,
  createLoanDocument,
  getLoansByCustomerId,
};
