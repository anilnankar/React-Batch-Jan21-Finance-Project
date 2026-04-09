"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type AccountRow = {
  account_id: number;
  account_number: string;
  customer_id: number;
  account_type: string;
  currency_code: string;
  status: string;
  available_balance: string;
  ledger_balance: string;
};

type BeneficiaryRow = {
  beneficiary_id: number;
  account_id: number;
  beneficiary_name: string;
  beneficiary_account_number: string;
  ifsc_code: string | null;
  bank_name: string | null;
  nickname: string | null;
  status: string;
};

type CustomerRow = {
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

type LoanTypeRow = {
  loan_type_id: number;
  loan_type: "Personal" | "Home" | "Gold" | "Property" | "Car";
  roi: number;
  min_tenure: number;
  max_tenure: number;
  status: "ACTIVE" | "INACTIVE";
  created_date?: string;
  updated_date?: string;
};

type LoanRow = {
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

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) {
    return value;
  }
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

function kycStatusClass(status: string) {
  if (status === "VERIFIED") {
    return "text-success";
  }
  if (status === "PENDING") {
    return "text-warning";
  }
  if (status === "REJECTED" || status === "EXPIRED") {
    return "text-danger";
  }
  return "text-muted";
}

function formatMoney(amount: string | number, currencyCode: string) {
  const n = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(n)) {
    return "—";
  }
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currencyCode || "INR"} ${n}`;
  }
}

function loanStatusBadgeClass(status: LoanRow["loan_status"]) {
  if (status === "ACTIVE" || status === "DISBURSED" || status === "APPROVED") {
    return "text-bg-success";
  }
  if (status === "APPLIED") {
    return "text-bg-info";
  }
  if (status === "NPA" || status === "WRITTEN_OFF") {
    return "text-bg-danger";
  }
  return "text-bg-secondary";
}

/** ISO date `YYYY-MM-DD` plus whole calendar months (loan tenure). */
function addMonthsToIsoDate(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d || !Number.isFinite(months)) {
    return "";
  }
  const dt = new Date(y, m - 1 + months, d);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [customer, setCustomer] = useState<CustomerRow | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [addPayeeModalOpen, setAddPayeeModalOpen] = useState(false);
  const [payeeSubmitMessage, setPayeeSubmitMessage] = useState("");
  const [isSubmittingPayee, setIsSubmittingPayee] = useState(false);
  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);
  const [submitDocumentModalOpen, setSubmitDocumentModalOpen] = useState(false);
  const [submitDocumentLoanId, setSubmitDocumentLoanId] = useState();
  const [submitDocumentMessage, setSubmitDocumentMessage] = useState("");
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [documentViewModalOpen, setDocumentViewModalOpen] = useState(false);
  const [documentList, setDocumentList] = useState<any[]>([]);
  const [documentViewLoanId, setDocumentViewLoanId] = useState();

  const [statementViewModalOpen, setStatementViewModalOpen] = useState(false);
  const [statementList, setStatementList] = useState<any[]>([]);
  
  const [paymentFromAccountId, setPaymentFromAccountId] = useState("");
  const [paymentBeneficiaries, setPaymentBeneficiaries] = useState<BeneficiaryRow[]>([]);
  const [loadingPaymentBeneficiaries, setLoadingPaymentBeneficiaries] = useState(false);
  const [paymentSubmitMessage, setPaymentSubmitMessage] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [applyLoanModalOpen, setApplyLoanModalOpen] = useState(false);
  const [loanTypes, setLoanTypes] = useState<LoanTypeRow[]>([]);
  const [loadingLoanTypes, setLoadingLoanTypes] = useState(false);
  const [loanTypesLoadError, setLoanTypesLoadError] = useState("");
  const [applyLoanSubmitMessage, setApplyLoanSubmitMessage] = useState("");
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);
  const [applyLoanSelectedTypeId, setApplyLoanSelectedTypeId] = useState("");
  const [customerLoans, setCustomerLoans] = useState<LoanRow[]>([]);
  const [applyLoanStartDate, setApplyLoanStartDate] = useState("");
  const [applyLoanTenureStr, setApplyLoanTenureStr] = useState("");

  const selectedApplyLoanTypeMeta = useMemo(() => {
    if (!applyLoanSelectedTypeId) {
      return null;
    }
    return loanTypes.find((lt) => String(lt.loan_type_id) === applyLoanSelectedTypeId) ?? null;
  }, [loanTypes, applyLoanSelectedTypeId]);

  const applyLoanComputedEndDate = useMemo(() => {
    const start = applyLoanStartDate.trim();
    const tenureMonths = Number(applyLoanTenureStr.trim());
    if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) {
      return "";
    }
    if (!Number.isInteger(tenureMonths) || tenureMonths <= 0) {
      return "";
    }
    return addMonthsToIsoDate(start, tenureMonths);
  }, [applyLoanStartDate, applyLoanTenureStr]);

  useEffect(() => {
    const customerId = sessionStorage.getItem("customerId");
    if (!customerId) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoadError("");
      try {
        setIsLoading(true);
        const base = "http://localhost:5000/api/v1";
        const [accountsRes, customerRes, loansRes] = await Promise.all([
          fetch(`${base}/accounts/customer/${customerId}`),
          fetch(`${base}/customers/${customerId}`),
          fetch(`${base}/loans/customer/${customerId}`),
        ]);

        const accountsJson = await accountsRes.json();
        const customerJson = await customerRes.json();
        const loansJson = await loansRes.json();

        if (cancelled) {
          return;
        }

        const messages: string[] = [];

        if (accountsRes.ok) {
          setAccounts(Array.isArray(accountsJson.data) ? accountsJson.data : []);
        } else {
          setAccounts([]);
          messages.push(accountsJson?.message || "Could not load accounts");
        }

        if (customerRes.ok && customerJson.data) {
          setCustomer(customerJson.data as CustomerRow);
        } else {
          setCustomer(null);
          messages.push(customerJson?.message || "Could not load customer profile");
        }

        if (loansRes.ok) {
          setCustomerLoans(Array.isArray(loansJson.data) ? (loansJson.data as LoanRow[]) : []);
        } else {
          setCustomerLoans([]);
          messages.push(loansJson?.message || "Could not load loans");
        }

        setLoadError(messages.join(" "));
      } catch {
        if (!cancelled) {
          setLoadError("Unable to connect to backend API");
          setAccounts([]);
          setCustomer(null);
          setCustomerLoans([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!makePaymentModalOpen || !paymentFromAccountId) {
      setPaymentBeneficiaries([]);
      return;
    }

    let cancelled = false;

    const loadBeneficiaries = async () => {
      setLoadingPaymentBeneficiaries(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/beneficiaries/account/${paymentFromAccountId}`
        );
        const result = await response.json();
        if (cancelled) {
          return;
        }
        const rows = Array.isArray(result.data) ? result.data : [];
        setPaymentBeneficiaries(rows.filter((b: BeneficiaryRow) => b.status === "ACTIVE"));
      } catch {
        if (!cancelled) {
          setPaymentBeneficiaries([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingPaymentBeneficiaries(false);
        }
      }
    };

    void loadBeneficiaries();

    return () => {
      cancelled = true;
    };
  }, [makePaymentModalOpen, paymentFromAccountId]);

  
  useEffect(() => {
    if (!documentViewModalOpen) {
      setDocumentList([]);
      return;
    }

    let cancelled = false;

    const loadDocuments = async () => {
      setLoadingPaymentBeneficiaries(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/loan-documents/${documentViewLoanId}`
        );
        const result = await response.json();
        if (cancelled) {
          return;
        }
        const rows = Array.isArray(result.data) ? result.data : [];
        setDocumentList(rows);
      } catch {
        if (!cancelled) {
          setDocumentList([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingPaymentBeneficiaries(false);
        }
      }
    };

    void loadDocuments();

    return () => {
      cancelled = true;
    };
  }, [documentViewModalOpen]);

  
  useEffect(() => {
    if (!statementViewModalOpen) {
      setStatementList([]);
      return;
    }
    const customerId = sessionStorage.getItem("customerId");
    if (!customerId) {
      router.replace("/login");
      return;
    }


    let cancelled = false;

    const loadStatements = async () => {
      setLoadingPaymentBeneficiaries(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/transactions/${customerId}`
        );
        const result = await response.json();
        if (cancelled) {
          return;
        }
        const rows = Array.isArray(result.data) ? result.data : [];
        setStatementList(rows);
      } catch {
        if (!cancelled) {
          setStatementList([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingPaymentBeneficiaries(false);
        }
      }
    };

    void loadStatements();

    return () => {
      cancelled = true;
    };
  }, [statementViewModalOpen]);

  useEffect(() => {
    if (!applyLoanModalOpen) {
      return;
    }

    let cancelled = false;

    const loadLoanTypes = async () => {
      setLoadingLoanTypes(true);
      setLoanTypesLoadError("");
      try {
        const response = await fetch("http://localhost:5000/api/v1/loan-types");
        const result = await response.json();
        if (cancelled) {
          return;
        }
        if (response.ok && Array.isArray(result.data)) {
          setLoanTypes(result.data as LoanTypeRow[]);
        } else {
          setLoanTypes([]);
          setLoanTypesLoadError(typeof result?.message === "string" ? result.message : "Could not load loan types");
        }
      } catch {
        if (!cancelled) {
          setLoanTypes([]);
          setLoanTypesLoadError("Unable to connect to backend API");
        }
      } finally {
        if (!cancelled) {
          setLoadingLoanTypes(false);
        }
      }
    };

    void loadLoanTypes();

    return () => {
      cancelled = true;
    };
  }, [applyLoanModalOpen]);

  const closeAddPayeeModal = () => {
    setAddPayeeModalOpen(false);
    setPayeeSubmitMessage("");
  };

  const handleAddPayeeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const accountId = Number(formData.get("account_id"));
    if (!Number.isInteger(accountId) || accountId <= 0) {
      setPayeeSubmitMessage("Select a valid account.");
      return;
    }

    const payload: Record<string, unknown> = {
      account_id: accountId,
      beneficiary_name: String(formData.get("beneficiary_name") || "").trim(),
      beneficiary_account_number: String(formData.get("beneficiary_account_number") || "").trim(),
      status: String(formData.get("status") || "ACTIVE"),
    };

    const ifsc = String(formData.get("ifsc_code") || "").trim().toUpperCase();
    if (ifsc) {
      payload.ifsc_code = ifsc;
    }

    const bankName = String(formData.get("bank_name") || "").trim();
    if (bankName) {
      payload.bank_name = bankName;
    }

    const nickname = String(formData.get("nickname") || "").trim();
    if (nickname) {
      payload.nickname = nickname;
    }

    setPayeeSubmitMessage("");

    try {
      setIsSubmittingPayee(true);
      const response = await fetch("http://localhost:5000/api/v1/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        let msg = typeof result?.message === "string" ? result.message : "Could not add payee";
        const fieldErrors = result?.errors?.fieldErrors as Record<string, string[]> | undefined;
        if (fieldErrors && typeof fieldErrors === "object") {
          const parts = Object.entries(fieldErrors).flatMap(([key, msgs]) =>
            Array.isArray(msgs) ? msgs.map((m) => `${key}: ${m}`) : []
          );
          if (parts.length > 0) {
            msg = parts.join("; ");
          }
        }
        setPayeeSubmitMessage(msg);
        return;
      }

      form.reset();
      closeAddPayeeModal();
    } catch {
      setPayeeSubmitMessage("Unable to connect to backend API");
    } finally {
      setIsSubmittingPayee(false);
    }
  };

  const closeMakePaymentModal = () => {
    setMakePaymentModalOpen(false);
    setPaymentSubmitMessage("");
    setPaymentBeneficiaries([]);
    setPaymentFromAccountId("");
  };

  
  const closeSubmitDocumentModalOpen = () => {
    setSubmitDocumentModalOpen(false);
  };
 
  const closeDocumentViewModalOpen = () => {
    setDocumentViewModalOpen(false);
  };

  const closeStatementViewModalOpen = () => {
    setStatementViewModalOpen(false);
  };
  

  const openMakePaymentModal = () => {
    setPaymentSubmitMessage("");
    setPaymentBeneficiaries([]);
    setPaymentFromAccountId(accounts[0] ? String(accounts[0].account_id) : "");
    setMakePaymentModalOpen(true);
  };

  const handleMakePaymentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const customerIdRaw = sessionStorage.getItem("customerId");
    const customerId = customerIdRaw ? Number(customerIdRaw) : NaN;

    if (!Number.isInteger(customerId) || customerId <= 0) {
      setPaymentSubmitMessage("Session expired. Please log in again.");
      return;
    }

    const fromAccountId = Number(formData.get("from_account_id"));
    const beneficiaryId = Number(formData.get("beneficiary_id"));
    const amountRaw = String(formData.get("amount_in_inr") || "").trim();
    const amount = Number.parseFloat(amountRaw);

    if (!Number.isInteger(fromAccountId) || fromAccountId <= 0) {
      setPaymentSubmitMessage("Select a valid from account.");
      return;
    }
    if (!Number.isInteger(beneficiaryId) || beneficiaryId <= 0) {
      setPaymentSubmitMessage("Select a payee.");
      return;
    }
    if (Number.isNaN(amount) || amount <= 0) {
      setPaymentSubmitMessage("Enter a valid amount in INR.");
      return;
    }

    const payload: Record<string, unknown> = {
      customer_id: customerId,
      from_account_id: fromAccountId,
      beneficiary_id: beneficiaryId,
      amount,
      currency_code: "INR",
      transaction_type: "PAYMENT",
      status: "COMPLETED",
      payment_channel: String(formData.get("payment_channel") || "NETBANKING"),
    };

    const remarks = String(formData.get("remarks") || "").trim();
    if (remarks) {
      payload.remarks = remarks;
    }

    setPaymentSubmitMessage("");

    try {
      setIsSubmittingPayment(true);
      const response = await fetch("http://localhost:5000/api/v1/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        let msg = typeof result?.message === "string" ? result.message : "Payment could not be recorded";
        const fieldErrors = result?.errors?.fieldErrors as Record<string, string[]> | undefined;
        if (fieldErrors && typeof fieldErrors === "object") {
          const parts = Object.entries(fieldErrors).flatMap(([key, msgs]) =>
            Array.isArray(msgs) ? msgs.map((m) => `${key}: ${m}`) : []
          );
          if (parts.length > 0) {
            msg = parts.join("; ");
          }
        }
        setPaymentSubmitMessage(msg);
        return;
      }

      form.reset();
      closeMakePaymentModal();
    } catch {
      setPaymentSubmitMessage("Unable to connect to backend API");
    } finally {
      setIsSubmittingPayment(false);
    }
  };


  
  const handleSubmitDocumentAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const documentType = formData.get("document_type");
    const documentFile = formData.get("document_file") as File;

    console.log(documentFile?.name); // ✅ actual file name

    if (documentType == "") {
      setSubmitDocumentMessage("Select a document type.");
      return;
    }
    const payload: Record<string, unknown> = {
      loan_id: submitDocumentLoanId,
      document_type: documentType,
      document_file: documentFile?.name,
      status: "Pending"
    };
    console.log(payload, "payload");
    setSubmitDocumentMessage("");

    try {
      setIsSubmittingDocument(true);
      const response = await fetch("http://localhost:5000/api/v1/loan-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        let msg = typeof result?.message === "string" ? result.message : "Payment could not be recorded";
        const fieldErrors = result?.errors?.fieldErrors as Record<string, string[]> | undefined;
        if (fieldErrors && typeof fieldErrors === "object") {
          const parts = Object.entries(fieldErrors).flatMap(([key, msgs]) =>
            Array.isArray(msgs) ? msgs.map((m) => `${key}: ${m}`) : []
          );
          if (parts.length > 0) {
            msg = parts.join("; ");
          }
        }
        setSubmitDocumentMessage(msg);
        return;
      }

      form.reset();
      closeSubmitDocumentModalOpen();
    } catch {
      setSubmitDocumentMessage("Unable to connect to backend API");
    } finally {
      setIsSubmittingDocument(false);
    }
  };

  const closeApplyLoanModal = () => {
    setApplyLoanModalOpen(false);
    setApplyLoanSubmitMessage("");
    setLoanTypesLoadError("");
    setApplyLoanSelectedTypeId("");
    setApplyLoanStartDate("");
    setApplyLoanTenureStr("");
  };

  const openApplyLoanModal = () => {
    setApplyLoanSubmitMessage("");
    setLoanTypesLoadError("");
    setApplyLoanSelectedTypeId("");
    setApplyLoanStartDate("");
    setApplyLoanTenureStr("");
    setApplyLoanModalOpen(true);
  };

  
  const openSubmitDocumentLoanModal = (loan_id) => {
    setSubmitDocumentModalOpen(true);
    setSubmitDocumentLoanId(loan_id)
  };

  const openDocumentLoanViewModal = (loan_id) => {
    setDocumentViewModalOpen(true);
    setDocumentViewLoanId(loan_id)
  };

  
  const openStatementLoanViewModal = () => {
    setStatementViewModalOpen(true);
  };
  
  

  const handleApplyLoanSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const customerIdRaw = sessionStorage.getItem("customerId");
    const customerId = customerIdRaw ? Number(customerIdRaw) : Number.NaN;

    if (!Number.isInteger(customerId) || customerId <= 0) {
      setApplyLoanSubmitMessage("Session expired. Please log in again.");
      return;
    }

    const loanTypeId = Number(formData.get("loan_type_id"));
    const principalRaw = String(formData.get("principal_amount") || "").trim();
    const tenureMonths = Number(applyLoanTenureStr.trim());
    const chosenType = loanTypes.find((lt) => lt.loan_type_id === loanTypeId);
    if (chosenType) {
      if (!Number.isInteger(tenureMonths) || tenureMonths <= 0) {
        setApplyLoanSubmitMessage("Enter a valid whole number of months for tenure.");
        return;
      }
      if (tenureMonths < chosenType.min_tenure || tenureMonths > chosenType.max_tenure) {
        setApplyLoanSubmitMessage(
          `Tenure must be between ${chosenType.min_tenure} and ${chosenType.max_tenure} months for ${chosenType.loan_type} loans.`
        );
        return;
      }
    }

    const payload: Record<string, unknown> = {
      loan_type_id: loanTypeId,
      customer_id: customerId,
      principal_amount: Number.parseFloat(principalRaw),
      tenure_months: tenureMonths,
    };

    const linkedRaw = String(formData.get("linked_account_id") || "").trim();
    if (linkedRaw) {
      payload.linked_account_id = Number(linkedRaw);
    }

    const startDate = applyLoanStartDate.trim();
    const endDate = applyLoanComputedEndDate.trim();
    if (startDate) {
      payload.start_date = startDate;
    }
    if (endDate) {
      payload.end_date = endDate;
    }

    setApplyLoanSubmitMessage("");

    try {
      setIsSubmittingLoan(true);
      const response = await fetch("http://localhost:5000/api/v1/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        let msg =
          typeof result?.message === "string" ? result.message : "Could not submit loan application";
        const fieldErrors = result?.errors?.fieldErrors as Record<string, string[]> | undefined;
        if (fieldErrors && typeof fieldErrors === "object") {
          const parts = Object.entries(fieldErrors).flatMap(([key, msgs]) =>
            Array.isArray(msgs) ? msgs.map((m) => `${key}: ${m}`) : []
          );
          if (parts.length > 0) {
            msg = parts.join("; ");
          }
        }
        setApplyLoanSubmitMessage(msg);
        return;
      }

      form.reset();
      closeApplyLoanModal();
    } catch {
      setApplyLoanSubmitMessage("Unable to connect to backend API");
    } finally {
      setIsSubmittingLoan(false);
    }
  };

  return (
    <main className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-start align-items-md-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Customer Dashboard</h1>
          <p className="text-muted mb-0">
            {isLoading
              ? "Loading your profile…"
              : customer
                ? `Welcome back, ${customer.full_name}. Here is your latest financial overview.`
                : "Here is your latest financial overview."}
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 ms-md-auto">
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Manage Payee
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setPayeeSubmitMessage("");
                    setAddPayeeModalOpen(true);
                  }}
                >
                  Add Payee
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button">
                  Remove Payee
                </button>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Transactions
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" type="button" onClick={openMakePaymentModal}>
                  Make Payment
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={openStatementLoanViewModal}>
                  Statements
                </button>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Loans
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" type="button" onClick={openApplyLoanModal}>
                  Apply Loan
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button">
                  Foreclose Request
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button">
                  Statement
                </button>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="btn btn-outline-secondary"
            onClick={() => sessionStorage.removeItem("customerId")}
          >
            Logout
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">Total Accounts</p>
              <h2 className="h4 mb-0">{isLoading ? "…" : accounts.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">Active Loans</p>
              <h2 className="h4 mb-0">
                {isLoading
                  ? "…"
                  : customerLoans.filter((loan) =>
                      ["ACTIVE", "APPROVED", "DISBURSED"].includes(loan.loan_status)
                    ).length}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 border-2">
            <div className="card-body">
              <p className="text-muted mb-1">KYC Status</p>
              <h2 className={`h4 mb-0 ${customer ? kycStatusClass(customer.kyc_status) : "text-muted"}`}>
                {isLoading ? "…" : customer ? formatEnumLabel(customer.kyc_status) : "—"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="alert alert-warning" role="alert">
          {loadError}
        </div>
      ) : null}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
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
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-2 h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Loan Details</h2>
              <div className="d-grid gap-3">
                {isLoading ? (
                  <p className="text-muted mb-0">Loading loans…</p>
                ) : customerLoans.length === 0 ? (
                  <p className="text-muted mb-0">No loans found for this customer.</p>
                ) : (
                  customerLoans.map((loan) => {
                    const principal = Number.parseFloat(loan.principal_amount || "0");
                    const disbursed = Number.parseFloat(loan.disbursed_amount || "0");
                    const outstanding = Number.isFinite(principal - disbursed) ? principal - disbursed : principal;
                    return (
                      <div className="border rounded p-3" key={loan.loan_id}>
                        <div className="d-flex justify-content-between mb-1">
                          <strong>{loan.loan_type || "Loan"}</strong>
                          <span className={`badge ${loanStatusBadgeClass(loan.loan_status)}`}>
                            {formatEnumLabel(loan.loan_status)}
                          </span>
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-primary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button className="dropdown-item" type="button" onClick={() =>openSubmitDocumentLoanModal(loan.loan_id)}>
                                  Submit Document
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" type="button" onClick={() =>openDocumentLoanViewModal(loan.loan_id)}>
                                  View Document
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" type="button">
                                  Cancel Loan
                                </button>
                              </li>
                            </ul>
                          </div>

                        </div>
                        <div className="small text-muted">{loan.loan_account_number}</div>
                        <div className="mt-2">
                          Principal: {formatMoney(loan.principal_amount, "INR")}
                        </div>
                        <div>Outstanding: {formatMoney(outstanding, "INR")}</div>
                        <div>Rate: {loan.interest_rate_annual}% p.a.</div>
                        <div>Tenure: {loan.tenure_months} months</div>
                        <div>
                          Period: {formatDate(loan.start_date)} to {formatDate(loan.end_date)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <div
        className={`modal fade${addPayeeModalOpen ? " show d-block" : ""}`}
        id="addPayeeModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={addPayeeModalOpen}
        aria-labelledby="addPayeeModalLabel"
        style={addPayeeModalOpen ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="addPayeeModalLabel">
                Add Payee
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeAddPayeeModal}
                disabled={isSubmittingPayee}
              />
            </div>
            <form onSubmit={handleAddPayeeSubmit}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" htmlFor="payeeAccountId">
                      Your account <span className="text-danger">*</span>
                    </label>
                    <select
                      id="payeeAccountId"
                      name="account_id"
                      className="form-select"
                      defaultValue=""
                      required
                      disabled={accounts.length === 0}
                    >
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
                    <input
                      id="beneficiaryName"
                      name="beneficiary_name"
                      type="text"
                      className="form-control"
                      placeholder="Full name as per bank"
                      minLength={2}
                      maxLength={150}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="beneficiaryAccountNumber">
                      Beneficiary account number <span className="text-danger">*</span>
                    </label>
                    <input
                      id="beneficiaryAccountNumber"
                      name="beneficiary_account_number"
                      type="text"
                      className="form-control"
                      placeholder="Account / IBAN"
                      minLength={5}
                      maxLength={32}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ifscCode">
                      IFSC code
                    </label>
                    <input
                      id="ifscCode"
                      name="ifsc_code"
                      type="text"
                      className="form-control text-uppercase"
                      placeholder="e.g. HDFC0001234"
                      maxLength={11}
                      pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                    />
                    <div className="form-text">11 characters. Leave blank if not applicable.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="bankName">
                      Bank name
                    </label>
                    <input
                      id="bankName"
                      name="bank_name"
                      type="text"
                      className="form-control"
                      placeholder="Beneficiary bank"
                      maxLength={150}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="nickname">
                      Nickname
                    </label>
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      className="form-control"
                      placeholder="Short label for this payee"
                      maxLength={80}
                    />
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
                {payeeSubmitMessage ? (
                  <div className="alert alert-danger mt-3 mb-0 py-2" role="alert">
                    {payeeSubmitMessage}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeAddPayeeModal}
                  disabled={isSubmittingPayee}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmittingPayee || accounts.length === 0}>
                  {isSubmittingPayee ? "Saving…" : "Save payee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {addPayeeModalOpen ? (
        <div
          className="modal-backdrop fade show"
          role="presentation"
          onClick={() => {
            if (!isSubmittingPayee) {
              closeAddPayeeModal();
            }
          }}
        />
      ) : null}

      <div
        className={`modal fade${makePaymentModalOpen ? " show d-block" : ""}`}
        id="makePaymentModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={makePaymentModalOpen}
        aria-labelledby="makePaymentModalLabel"
        style={makePaymentModalOpen ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="makePaymentModalLabel">
                Make payment
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeMakePaymentModal}
                disabled={isSubmittingPayment}
              />
            </div>
            <form onSubmit={handleMakePaymentSubmit}>
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
                      onChange={(e) => setPaymentFromAccountId(e.target.value)}
                      required
                      disabled={accounts.length === 0}
                    >
                      <option value="" disabled>
                        {accounts.length === 0 ? "No accounts available" : "Select your account"}
                      </option>
                      {accounts.map((acc) => (
                        <option key={acc.account_id} value={String(acc.account_id)}>
                          {acc.account_number} · {formatEnumLabel(acc.account_type)} ·{" "}
                          {formatMoney(acc.available_balance, acc.currency_code)}
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
                    <input
                      id="paymentAmountInr"
                      name="amount_in_inr"
                      type="number"
                      inputMode="decimal"
                      className="form-control"
                      placeholder="0.00"
                      min={0.01}
                      step={0.01}
                      required
                    />
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
                    <textarea
                      id="paymentRemarks"
                      name="remarks"
                      className="form-control"
                      rows={2}
                      maxLength={255}
                      placeholder="Note for your records"
                    />
                  </div>
                </div>
                {paymentSubmitMessage ? (
                  <div className="alert alert-danger mt-3 mb-0 py-2" role="alert">
                    {paymentSubmitMessage}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeMakePaymentModal}
                  disabled={isSubmittingPayment}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    isSubmittingPayment || accounts.length === 0 || !paymentFromAccountId || paymentBeneficiaries.length === 0
                  }
                >
                  {isSubmittingPayment ? "Processing…" : "Pay now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {makePaymentModalOpen ? (
        <div
          className="modal-backdrop fade show"
          role="presentation"
          onClick={() => {
            if (!isSubmittingPayment) {
              closeMakePaymentModal();
            }
          }}
        />
      ) : null}

      <div
        className={`modal fade${applyLoanModalOpen ? " show d-block" : ""}`}
        id="applyLoanModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={applyLoanModalOpen}
        aria-labelledby="applyLoanModalLabel"
        style={applyLoanModalOpen ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="applyLoanModalLabel">
                Apply for loan
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeApplyLoanModal}
                disabled={isSubmittingLoan}
              />
            </div>
            <form key={applyLoanModalOpen ? "apply-loan-open" : "apply-loan-closed"} onSubmit={handleApplyLoanSubmit}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {loanTypesLoadError ? (
                  <div className="alert alert-warning py-2" role="alert">
                    {loanTypesLoadError}
                  </div>
                ) : null}
                <div className="alert alert-info py-2 mb-3" role="alert">
                  Loan account number is auto-generated when you submit the application.
                </div>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanTypeId">
                      Loan type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="loanTypeId"
                      name="loan_type_id"
                      className="form-select"
                      value={applyLoanSelectedTypeId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setApplyLoanSelectedTypeId(nextId);
                        const lt = loanTypes.find((x) => String(x.loan_type_id) === nextId);
                        if (lt) {
                          setApplyLoanTenureStr(String(lt.min_tenure));
                        }
                      }}
                      required
                      disabled={isSubmittingLoan || loadingLoanTypes || loanTypes.length === 0}
                    >
                      <option value="" disabled>
                        {loadingLoanTypes
                          ? "Loading loan types…"
                          : loanTypes.length === 0
                            ? "No loan types available"
                            : "Select loan type"}
                      </option>
                      {loanTypes.map((lt) => (
                        <option key={lt.loan_type_id} value={String(lt.loan_type_id)}>
                          {lt.loan_type} — ROI {lt.roi}% · {lt.min_tenure}–{lt.max_tenure} mo.
                        </option>
                      ))}
                    </select>
                    {selectedApplyLoanTypeMeta ? (
                      <div className="form-text">
                        Reference rate (ROI): {selectedApplyLoanTypeMeta.roi}% p.a. Allowed tenure:{" "}
                        {selectedApplyLoanTypeMeta.min_tenure}–{selectedApplyLoanTypeMeta.max_tenure} months.
                      </div>
                    ) : null}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanLinkedAccountId">
                      Linked account
                    </label>
                    <select
                      id="loanLinkedAccountId"
                      name="linked_account_id"
                      className="form-select"
                      defaultValue=""
                      disabled={isSubmittingLoan || accounts.length === 0}
                    >
                      <option value="">None</option>
                      {accounts.map((acc) => (
                        <option key={acc.account_id} value={acc.account_id}>
                          {acc.account_number} · {formatEnumLabel(acc.account_type)}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">Optional savings/current account to link.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanPrincipalAmount">
                      Principal amount <span className="text-danger">*</span>
                    </label>
                    <input
                      id="loanPrincipalAmount"
                      name="principal_amount"
                      type="number"
                      inputMode="decimal"
                      className="form-control"
                      placeholder="0.00"
                      min={0.01}
                      step={0.01}
                      required
                      disabled={isSubmittingLoan}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanDisbursedAmount">
                      Disbursed amount
                    </label>
                    <input
                      id="loanDisbursedAmount"
                      type="text"
                      className="form-control"
                      value="0.00"
                      readOnly
                      disabled
                      aria-readonly="true"
                    />
                    <div className="form-text">Set to zero at application; updated after disbursement.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanInterestRate">
                      Interest rate (annual %)
                    </label>
                    <input
                      id="loanInterestRate"
                      type="text"
                      className="form-control"
                      value={selectedApplyLoanTypeMeta ? `${selectedApplyLoanTypeMeta.roi}%` : "Select loan type first"}
                      readOnly
                      disabled
                      aria-readonly="true"
                    />
                    <div className="form-text">Rate is auto-selected from loan type and cannot be edited.</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanTenureMonths">
                      Tenure (months) <span className="text-danger">*</span>
                    </label>
                    <input
                      id="loanTenureMonths"
                      name="tenure_months"
                      type="number"
                      inputMode="numeric"
                      className="form-control"
                      placeholder={
                        selectedApplyLoanTypeMeta
                          ? `${selectedApplyLoanTypeMeta.min_tenure}–${selectedApplyLoanTypeMeta.max_tenure}`
                          : "Select loan type first"
                      }
                      value={applyLoanTenureStr}
                      onChange={(e) => setApplyLoanTenureStr(e.target.value)}
                      min={selectedApplyLoanTypeMeta?.min_tenure ?? 1}
                      max={selectedApplyLoanTypeMeta?.max_tenure ?? 600}
                      step={1}
                      required
                      disabled={isSubmittingLoan || !applyLoanSelectedTypeId}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanStartDate">
                      Start date
                    </label>
                    <input
                      id="loanStartDate"
                      name="start_date"
                      type="date"
                      className="form-control"
                      value={applyLoanStartDate}
                      onChange={(e) => setApplyLoanStartDate(e.target.value)}
                      disabled={isSubmittingLoan}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="loanEndDate">
                      End date
                    </label>
                    <input
                      id="loanEndDate"
                      type="date"
                      className="form-control bg-body-secondary"
                      value={applyLoanComputedEndDate}
                      readOnly
                      tabIndex={-1}
                      aria-readonly="true"
                      autoComplete="off"
                    />
                    <div className="form-text">
                      {applyLoanComputedEndDate
                        ? `Auto-calculated from start date + tenure (${formatDate(applyLoanComputedEndDate)}).`
                        : "Set start date and tenure to calculate end date."}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="form-label mb-1">Loan status</p>
                    <p className="form-control-plaintext mb-0 fw-semibold" id="loanStatusReadonly">
                      APPLIED
                    </p>
                    <div className="form-text">New applications are recorded as APPLIED.</div>
                  </div>
                </div>
                {applyLoanSubmitMessage ? (
                  <div className="alert alert-danger mt-3 mb-0 py-2" role="alert">
                    {applyLoanSubmitMessage}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeApplyLoanModal}
                  disabled={isSubmittingLoan}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmittingLoan || loadingLoanTypes || loanTypes.length === 0}
                >
                  {isSubmittingLoan ? "Submitting…" : "Submit application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {applyLoanModalOpen ? (
        <div
          className="modal-backdrop fade show"
          role="presentation"
          onClick={() => {
            if (!isSubmittingLoan) {
              closeApplyLoanModal();
            }
          }}
        />
      ) : null}

    <div
        className={`modal fade${documentViewModalOpen ? " show d-block" : ""}`}
        id="makePaymentModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={documentViewModalOpen}
        aria-labelledby="submittedDocumentsViewModalLabel"
        style={documentViewModalOpen ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="submittedDocumentsViewModalLabel ">
                View Submitted Documents for Loan
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeDocumentViewModalOpen}
                disabled={isSubmittingDocument}
              />
            </div>
            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  <div className="col-12">
            {isLoading ? (
              <p className="text-muted mb-0">Loading accounts…</p>
            ) : documentList.length === 0 ? (
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
                    {documentList.map((document) => (
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
      </div>
    </div>

    <div
        className={`modal fade${statementViewModalOpen ? " show d-block" : ""}`}
        id="makePaymentModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={statementViewModalOpen}
        aria-labelledby="submittedDocumentsViewModalLabel"
        style={statementViewModalOpen ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="submittedDocumentsViewModalLabel ">
                Account Statements
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeStatementViewModalOpen}
              />
            </div>
            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  <div className="col-12">
            {isLoading ? (
              <p className="text-muted mb-0">Loading accounts…</p>
            ) : statementList.length === 0 ? (
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
                    {statementList.map((statement) => (
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
      </div>
    </div>

    <div
        className={`modal fade${submitDocumentModalOpen ? " show d-block" : ""}`}
        id="makePaymentModal"
        tabIndex={-1}
        role="dialog"
        aria-modal={submitDocumentModalOpen}
        aria-labelledby="makePaymentModalLabel"
        style={submitDocumentModalOpen ? undefined : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="makePaymentModalLabel">
                Submit Document for Loan
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeSubmitDocumentModalOpen}
                disabled={isSubmittingDocument}
              />
            </div>
            <form onSubmit={handleSubmitDocumentAction}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" htmlFor="paymentFromAccount">
                      Select Document Type<span className="text-danger">*</span>
                    </label>
                    <select
                      id="document_type"
                      name="document_type"
                      className="form-select"
                      required
                    >
                      <option value="adhhar">Adhar</option>
                      <option value="pan">Pan</option>
                      <option value="rent_agrreement">Rent Aggrement</option>
                      <option value="photo">Photo</option>
                      <option value="salary_slip">Salary Slip</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="paymentBeneficiary">
                      Upload Document <span className="text-danger">*</span>
                    </label>
                    <input type="file" name="document_file" id="document_file"/>
                    <div className="form-text">Upload file with size less than 1mb</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeSubmitDocumentModalOpen}
                  disabled={isSubmittingDocument}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    isSubmittingDocument
                  }
                >
                  {isSubmittingDocument ? "Processing…" : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {submitDocumentModalOpen ? (
        <div
          className="modal-backdrop fade show"
          role="presentation"
          onClick={() => {
            if (!isSubmittingDocument) {
              closeSubmitDocumentModalOpen();
            }
          }}
        />
      ) : null}

    </main>
  );
}
