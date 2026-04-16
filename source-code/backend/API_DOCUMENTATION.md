# Finance Project Backend API Documentation

Base URL: `http://localhost:5000/api/v1`

## Common Response Format

- Success:
  - `success: true`
  - optional `message`
  - `data` with object or array
- Error:
  - `success: false`
  - `message`
  - optional `errors` (validation failures)

## Validation Rules (General)

- Validation failures return `400` with `message: "Validation failed"`.
- Most ids are positive integers.
- Currency currently supported in transactions is only `INR`.
- Date format (where applicable): `YYYY-MM-DD`.

## Endpoints

### 1) Login

- **Method**: `POST`
- **Path**: `/login`
- **Body**:

```json
{
  "email": "john@example.com",
  "password": "your-password"
}
```

- **Success**: `200 OK`

---

### 2) Create Customer

- **Method**: `POST`
- **Path**: `/customers`
- **Alias Path**: `/customer` (also mounted)
- **Body**:

```json
{
  "customer_type": "INDIVIDUAL",
  "account_type": "SAVINGS",
  "full_name": "John Doe",
  "date_of_birth_or_incorp": "1994-02-14",
  "mobile_number": "9876543210",
  "email": "john@example.com",
  "password": "Pass@123",
  "pan_number": "ABCDE1234F"
}
```

- **Enums**:
  - `customer_type`: `INDIVIDUAL`, `BUSINESS`
  - `account_type`: `SAVINGS`, `CURRENT`, `LOAN_LINKED`
- **Success**: `201 Created`

---

### 3) Get Customer By Id

- **Method**: `GET`
- **Path**: `/customers/:customerId`
- **Alias Path**: `/customer/:customerId`
- **Success**: `200 OK`

---

### 4) Get Accounts By Customer Id

- **Method**: `GET`
- **Path**: `/accounts/customer/:customerId`
- **Success**: `200 OK`

---

### 5) Create Beneficiary

- **Method**: `POST`
- **Path**: `/beneficiaries`
- **Body**:

```json
{
  "account_id": 1,
  "beneficiary_name": "Jane Doe",
  "beneficiary_account_number": "ACC1727765432100",
  "ifsc_code": "HDFC0ABC123",
  "bank_name": "HDFC Bank",
  "nickname": "Jane",
  "status": "ACTIVE"
}
```

- **Enums**:
  - `status`: `ACTIVE`, `INACTIVE`, `PENDING`
- **Success**: `201 Created`

---

### 6) List Beneficiaries By Account Id

- **Method**: `GET`
- **Path**: `/beneficiaries/account/:accountId`
- **Success**: `200 OK`

---

### 7) Create Transaction

- **Method**: `POST`
- **Path**: `/transactions`
- **Body**:

```json
{
  "customer_id": 1,
  "from_account_id": 10,
  "beneficiary_id": 5,
  "amount": 1000.5,
  "currency_code": "INR",
  "transaction_type": "Debit",
  "status": "COMPLETED",
  "payment_channel": "NETBANKING",
  "remarks": "Rent transfer"
}
```

- **Enums**:
  - `currency_code`: `INR`
  - `transaction_type`: `Credit`, `Debit`
  - `status`: `PENDING`, `COMPLETED`, `FAILED`
  - `payment_channel`: `NETBANKING`, `MOBILE`, `BRANCH`
- **Success**: `201 Created`

---

### 8) Get Transactions By Customer Id

- **Method**: `GET`
- **Path**: `/transactions/:customerId`
- **Success**: `200 OK`

---

### 9) List Loan Types

- **Method**: `GET`
- **Path**: `/loan-types`
- **Success**: `200 OK`

---

### 10) Create Loan

- **Method**: `POST`
- **Path**: `/loans`
- **Body**:

```json
{
  "loan_type_id": 1,
  "customer_id": 1,
  "linked_account_id": 10,
  "principal_amount": 250000,
  "tenure_months": 36,
  "start_date": "2026-01-01",
  "end_date": "2028-12-31",
  "loan_status": "APPLIED"
}
```

- **Enums**:
  - `loan_status`: `APPLIED`, `APPROVED`, `DISBURSED`, `ACTIVE`, `CLOSED`, `NPA`, `WRITTEN_OFF`
- **Success**: `201 Created`

---

### 11) Get Loans By Customer Id

- **Method**: `GET`
- **Path**: `/loans/customer/:customerId`
- **Success**: `200 OK`

---

### 12) Create Loan Document

- **Method**: `POST`
- **Path**: `/loan-documents`
- **Body**:

```json
{
  "loan_id": 1,
  "document_type": "PAN",
  "document_file": "https://example.com/docs/pan.pdf",
  "status": "Pending"
}
```

- **Success**: `201 Created`

---

### 13) Get Loan Documents By Loan Id

- **Method**: `GET`
- **Path**: `/loan-documents/:loanId`
- **Success**: `200 OK`

## Notes

- API is mounted under `/api/v1`.
- There is currently no JWT/Bearer auth middleware on these routes.
- `POST /loan-documents` does not have zod validation yet, so enforce required fields from client side.
