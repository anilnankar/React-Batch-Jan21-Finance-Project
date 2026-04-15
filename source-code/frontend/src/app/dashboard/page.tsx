 "use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AccountsCard } from "./components/AccountsCard";
import { AddPayeeModal } from "./components/AddPayeeModal";
import { ApplyLoanModal } from "./components/ApplyLoanModal";
import { CustomerInfoCard } from "./components/CustomerInfoCard";
import { DashboardHeader } from "./components/DashboardHeader";
import { DocumentViewModal } from "./components/DocumentViewModal";
import { LoansCard } from "./components/LoansCard";
import { MakePaymentModal } from "./components/MakePaymentModal";
import { StatementViewModal } from "./components/StatementViewModal";
import { SubmitDocumentModal } from "./components/SubmitDocumentModal";
import { SummaryCards } from "./components/SummaryCards";
import type { AccountRow, BeneficiaryRow, CustomerRow, LoanDocumentRow, LoanRow, LoanTypeRow, StatementRow } from "./types";
import { addMonthsToIsoDate } from "./utils";

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
  const [submitDocumentLoanId, setSubmitDocumentLoanId] = useState<number | null>(null);
  const [submitDocumentMessage, setSubmitDocumentMessage] = useState("");
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [documentViewModalOpen, setDocumentViewModalOpen] = useState(false);
  const [documentList, setDocumentList] = useState<LoanDocumentRow[]>([]);
  const [documentViewLoanId, setDocumentViewLoanId] = useState<number | null>(null);

  const [statementViewModalOpen, setStatementViewModalOpen] = useState(false);
  const [statementList, setStatementList] = useState<StatementRow[]>([]);
  
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
  }, [documentViewModalOpen, documentViewLoanId]);

  
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
  }, [statementViewModalOpen, router]);

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
    setSubmitDocumentMessage("");
    setSubmitDocumentLoanId(null);
  };
 
  const closeDocumentViewModalOpen = () => {
    setDocumentViewModalOpen(false);
    setDocumentList([]);
    setDocumentViewLoanId(null);
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
      transaction_type: "Credit",
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

  
  const openSubmitDocumentLoanModal = (loan_id: number) => {
    setSubmitDocumentModalOpen(true);
    setSubmitDocumentLoanId(loan_id);
  };

  const openDocumentLoanViewModal = (loan_id: number) => {
    setDocumentViewModalOpen(true);
    setDocumentViewLoanId(loan_id);
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
      <DashboardHeader
        isLoading={isLoading}
        customer={customer}
        onOpenAddPayee={() => {
          setPayeeSubmitMessage("");
          setAddPayeeModalOpen(true);
        }}
        onOpenPayment={openMakePaymentModal}
        onOpenStatements={openStatementLoanViewModal}
        onOpenApplyLoan={openApplyLoanModal}
      />

      <SummaryCards isLoading={isLoading} accountsCount={accounts.length} customerLoans={customerLoans} customer={customer} />

      {loadError ? (
        <div className="alert alert-warning" role="alert">
          {loadError}
        </div>
      ) : null}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <AccountsCard isLoading={isLoading} accounts={accounts} />
        </div>
        <div className="col-12 col-lg-5">
          <LoansCard
            isLoading={isLoading}
            customerLoans={customerLoans}
            onOpenSubmitDocument={openSubmitDocumentLoanModal}
            onOpenViewDocument={openDocumentLoanViewModal}
          />
        </div>
      </div>

      <CustomerInfoCard isLoading={isLoading} customer={customer} />

      <AddPayeeModal
        open={addPayeeModalOpen}
        accounts={accounts}
        message={payeeSubmitMessage}
        isSubmitting={isSubmittingPayee}
        onClose={closeAddPayeeModal}
        onSubmit={handleAddPayeeSubmit}
      />

      <MakePaymentModal
        open={makePaymentModalOpen}
        accounts={accounts}
        paymentFromAccountId={paymentFromAccountId}
        paymentBeneficiaries={paymentBeneficiaries}
        loadingPaymentBeneficiaries={loadingPaymentBeneficiaries}
        message={paymentSubmitMessage}
        isSubmitting={isSubmittingPayment}
        onClose={closeMakePaymentModal}
        onSubmit={handleMakePaymentSubmit}
        onPaymentFromAccountChange={setPaymentFromAccountId}
      />

      <ApplyLoanModal
        open={applyLoanModalOpen}
        loanTypesLoadError={loanTypesLoadError}
        loadingLoanTypes={loadingLoanTypes}
        loanTypes={loanTypes}
        selectedTypeId={applyLoanSelectedTypeId}
        selectedTypeMeta={selectedApplyLoanTypeMeta}
        applyLoanTenureStr={applyLoanTenureStr}
        applyLoanStartDate={applyLoanStartDate}
        applyLoanComputedEndDate={applyLoanComputedEndDate}
        message={applyLoanSubmitMessage}
        isSubmitting={isSubmittingLoan}
        accounts={accounts}
        onClose={closeApplyLoanModal}
        onSubmit={handleApplyLoanSubmit}
        onTypeChange={(nextId) => {
          setApplyLoanSelectedTypeId(nextId);
          const lt = loanTypes.find((x) => String(x.loan_type_id) === nextId);
          if (lt) {
            setApplyLoanTenureStr(String(lt.min_tenure));
          }
        }}
        onTenureChange={setApplyLoanTenureStr}
        onStartDateChange={setApplyLoanStartDate}
      />

      <DocumentViewModal
        open={documentViewModalOpen}
        isLoading={isLoading}
        isSubmittingDocument={isSubmittingDocument}
        documents={documentList}
        onClose={closeDocumentViewModalOpen}
      />

      <StatementViewModal open={statementViewModalOpen} isLoading={isLoading} statements={statementList} onClose={closeStatementViewModalOpen} />

      <SubmitDocumentModal
        open={submitDocumentModalOpen}
        isSubmitting={isSubmittingDocument}
        message={submitDocumentMessage}
        onClose={closeSubmitDocumentModalOpen}
        onSubmit={handleSubmitDocumentAction}
      />
    </main>
  );
}
