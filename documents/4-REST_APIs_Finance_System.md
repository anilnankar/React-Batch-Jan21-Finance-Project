# REST API Specification
## Finance System

**Version:** 1.0  
**Base URL:** `/api/v1`  
**Content-Type:** `application/json`  
**Auth:** `Authorization: Bearer <token>`

---

## 1. API Conventions

### 1.1 Standard Success Envelope
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

### 1.2 Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Requested resource does not exist.",
    "details": [],
    "correlationId": "c17a03e5-7a1e-4b47-aad0-0a727298a4ee"
  }
}
```

### 1.3 Common HTTP Status Codes
- `200 OK` - Read/Update success
- `201 Created` - Resource created
- `204 No Content` - Delete success
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate or state conflict
- `422 Unprocessable Entity` - Business rule violation
- `500 Internal Server Error` - Unexpected failure

---

## 2. Customer APIs

### 2.1 Create Customer
- **Endpoint:** `/customers`
- **Method:** `POST`
- **Request Body:**
```json
{
  "customerType": "INDIVIDUAL",
  "fullName": "Anita Verma",
  "dateOfBirthOrIncorp": "1993-05-10",
  "mobileNumber": "9876543210",
  "email": "anita@example.com",
  "panNumber": "ABCDE1234F"
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "customerId": "CUST10001",
    "status": "PENDING_KYC",
    "kycStatus": "PENDING"
  },
  "message": "Customer created."
}
```
- **Error Handling:**
  - `400` invalid input format
  - `409` PAN/mobile already exists
  - `422` KYC policy pre-check failed

### 2.2 Get Customer by ID
- **Endpoint:** `/customers/{customerId}`
- **Method:** `GET`
- **Request Body:** None
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "customerId": "CUST10001",
    "fullName": "Anita Verma",
    "status": "ACTIVE",
    "kycStatus": "VERIFIED",
    "riskCategory": "LOW"
  }
}
```
- **Error Handling:**
  - `404` customer not found
  - `403` caller not allowed to view this customer

### 2.3 Update Customer
- **Endpoint:** `/customers/{customerId}`
- **Method:** `PUT`
- **Request Body:**
```json
{
  "email": "anita.new@example.com",
  "mobileNumber": "9000011111"
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "customerId": "CUST10001",
    "updated": true
  },
  "message": "Customer updated."
}
```
- **Error Handling:**
  - `400` invalid fields
  - `404` customer not found
  - `409` duplicate mobile/email conflict

### 2.4 Delete/Deactivate Customer
- **Endpoint:** `/customers/{customerId}`
- **Method:** `DELETE`
- **Request Body:** None
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "customerId": "CUST10001",
    "status": "CLOSED"
  },
  "message": "Customer deactivated."
}
```
- **Error Handling:**
  - `404` customer not found
  - `422` active accounts/loans prevent closure

---

## 3. Account APIs

### 3.1 Create Account
- **Endpoint:** `/accounts`
- **Method:** `POST`
- **Request Body:**
```json
{
  "customerId": "CUST10001",
  "accountType": "SAVINGS",
  "currencyCode": "INR"
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "accountId": "ACC20001",
    "accountNumber": "100012345678",
    "status": "ACTIVE"
  },
  "message": "Account created."
}
```
- **Error Handling:**
  - `404` customer not found
  - `422` customer KYC not verified
  - `409` duplicate account creation conflict

### 3.2 Get Account Details
- **Endpoint:** `/accounts/{accountId}`
- **Method:** `GET`
- **Request Body:** None
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "accountId": "ACC20001",
    "accountType": "SAVINGS",
    "status": "ACTIVE",
    "currencyCode": "INR",
    "availableBalance": 12000.50,
    "ledgerBalance": 12000.50
  }
}
```
- **Error Handling:**
  - `404` account not found
  - `403` access denied

### 3.3 Update Account Status
- **Endpoint:** `/accounts/{accountId}/status`
- **Method:** `PUT`
- **Request Body:**
```json
{
  "status": "DEBIT_BLOCK",
  "reasonCode": "KYC_EXPIRED"
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "accountId": "ACC20001",
    "oldStatus": "ACTIVE",
    "newStatus": "DEBIT_BLOCK"
  },
  "message": "Account status updated."
}
```
- **Error Handling:**
  - `400` invalid status transition
  - `404` account not found
  - `403` insufficient privilege

### 3.4 Close Account
- **Endpoint:** `/accounts/{accountId}`
- **Method:** `DELETE`
- **Request Body:** None
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "accountId": "ACC20001",
    "status": "CLOSED"
  },
  "message": "Account closed."
}
```
- **Error Handling:**
  - `422` non-zero balance
  - `422` linked active loan exists
  - `404` account not found

---

## 4. Transaction APIs

### 4.1 Deposit
- **Endpoint:** `/transactions/deposit`
- **Method:** `POST`
- **Request Body:**
```json
{
  "toAccountId": "ACC20001",
  "amount": 5000.00,
  "currencyCode": "INR",
  "idempotencyKey": "idem-dep-1001",
  "remarks": "Cash deposit"
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN30001",
    "status": "POSTED",
    "newAvailableBalance": 17000.50
  },
  "message": "Deposit successful."
}
```
- **Error Handling:**
  - `400` invalid amount
  - `404` account not found
  - `409` duplicate idempotency key

### 4.2 Withdraw
- **Endpoint:** `/transactions/withdraw`
- **Method:** `POST`
- **Request Body:**
```json
{
  "fromAccountId": "ACC20001",
  "amount": 1000.00,
  "currencyCode": "INR",
  "idempotencyKey": "idem-wd-1001",
  "remarks": "ATM withdrawal"
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN30002",
    "status": "POSTED",
    "newAvailableBalance": 16000.50
  },
  "message": "Withdrawal successful."
}
```
- **Error Handling:**
  - `422` insufficient balance
  - `422` account debit blocked/frozen
  - `409` duplicate idempotency key

### 4.3 Transfer
- **Endpoint:** `/transactions/transfer`
- **Method:** `POST`
- **Request Body:**
```json
{
  "fromAccountId": "ACC20001",
  "toAccountId": "ACC20002",
  "amount": 2500.00,
  "currencyCode": "INR",
  "idempotencyKey": "idem-tr-1001",
  "remarks": "Fund transfer"
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN30003",
    "status": "POSTED"
  },
  "message": "Transfer successful."
}
```
- **Error Handling:**
  - `400` source and destination cannot be same
  - `404` source/destination account not found
  - `422` compliance rule blocked transaction

### 4.4 Get Transaction by ID
- **Endpoint:** `/transactions/{transactionId}`
- **Method:** `GET`
- **Request Body:** None
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN30003",
    "transactionType": "TRANSFER",
    "amount": 2500.00,
    "status": "POSTED",
    "transactionTime": "2026-03-20T11:15:00Z"
  }
}
```
- **Error Handling:**
  - `404` transaction not found
  - `403` user not authorized

### 4.5 Reverse Transaction
- **Endpoint:** `/transactions/{transactionId}/reverse`
- **Method:** `POST`
- **Request Body:**
```json
{
  "reasonCode": "WRONG_BENEFICIARY",
  "remarks": "Customer requested reversal"
}
```
- **Response (202):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN30003",
    "status": "PENDING"
  },
  "message": "Reversal initiated."
}
```
- **Error Handling:**
  - `422` reversal window expired
  - `422` transaction not eligible for reversal
  - `403` maker-checker rule violation

---

## 5. Loan APIs

### 5.1 Create Loan Application
- **Endpoint:** `/loans`
- **Method:** `POST`
- **Request Body:**
```json
{
  "customerId": "CUST10001",
  "productCode": "PL_STD",
  "principalAmount": 300000.00,
  "tenureMonths": 24,
  "interestRateAnnual": 13.5
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN40001",
    "loanStatus": "APPLIED"
  },
  "message": "Loan application submitted."
}
```
- **Error Handling:**
  - `400` invalid tenor/rate values
  - `404` customer not found
  - `422` underwriting criteria not met

### 5.2 Get Loan Details
- **Endpoint:** `/loans/{loanId}`
- **Method:** `GET`
- **Request Body:** None
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN40001",
    "customerId": "CUST10001",
    "principalAmount": 300000.00,
    "tenureMonths": 24,
    "interestRateAnnual": 13.5,
    "loanStatus": "ACTIVE"
  }
}
```
- **Error Handling:**
  - `404` loan not found
  - `403` access denied

### 5.3 Approve/Update Loan Status
- **Endpoint:** `/loans/{loanId}/status`
- **Method:** `PUT`
- **Request Body:**
```json
{
  "loanStatus": "APPROVED",
  "approvedBy": "credit.manager1"
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN40001",
    "oldStatus": "APPLIED",
    "newStatus": "APPROVED"
  },
  "message": "Loan status updated."
}
```
- **Error Handling:**
  - `400` invalid status transition
  - `403` insufficient approval privilege
  - `404` loan not found

### 5.4 Disburse Loan
- **Endpoint:** `/loans/{loanId}/disburse`
- **Method:** `POST`
- **Request Body:**
```json
{
  "amount": 300000.00,
  "toAccountId": "ACC20001",
  "idempotencyKey": "idem-disb-1001"
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN40001",
    "loanStatus": "DISBURSED",
    "disbursedAt": "2026-03-20T12:00:00Z"
  },
  "message": "Loan disbursed."
}
```
- **Error Handling:**
  - `422` loan not approved
  - `422` disbursement exceeds sanctioned amount
  - `409` duplicate idempotency key

### 5.5 Record Loan Repayment
- **Endpoint:** `/loans/{loanId}/repayments`
- **Method:** `POST`
- **Request Body:**
```json
{
  "amount": 15000.00,
  "paymentAccountId": "ACC20001",
  "idempotencyKey": "idem-repay-1001"
}
```
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN40001",
    "repaymentId": "REPAY50001",
    "allocation": {
      "charges": 500.00,
      "interest": 4000.00,
      "principal": 10500.00
    },
    "loanStatus": "ACTIVE"
  },
  "message": "Repayment recorded."
}
```
- **Error Handling:**
  - `422` payment amount invalid
  - `422` linked account debit blocked
  - `404` loan/account not found

### 5.6 Get EMI Schedule
- **Endpoint:** `/loans/{loanId}/emi-schedule`
- **Method:** `GET`
- **Request Body:** None
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "LOAN40001",
    "items": [
      {
        "installmentNo": 1,
        "dueDate": "2026-04-10",
        "principalDue": 10000.00,
        "interestDue": 3375.00,
        "totalDue": 13375.00,
        "paymentStatus": "DUE"
      }
    ]
  }
}
```
- **Error Handling:**
  - `404` loan not found
  - `403` unauthorized access

---

## 6. Global Error Handling Rules

- All errors return the standard error envelope with `correlationId`.
- Validation errors include field-level details:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed.",
    "details": [
      { "field": "amount", "issue": "must_be_greater_than_zero" }
    ],
    "correlationId": "a7c37a88-1a43-463a-aec8-a8fae7093e3c"
  }
}
```
- Business rule violations should use stable domain codes (example: `INSUFFICIENT_FUNDS`, `KYC_NOT_VERIFIED`, `LOAN_NOT_APPROVED`).
- Internal errors must avoid exposing stack traces; log full diagnostics in server logs and audit logs.

---

## 7. Security and Reliability Recommendations

- Enforce OAuth2/JWT and RBAC on all endpoints.
- Use idempotency keys for all monetary write operations.
- Apply rate limiting for login, transfer, and disbursement APIs.
- Record all write operations in immutable audit logs.
- Include request signature/checksum for critical partner integrations.

