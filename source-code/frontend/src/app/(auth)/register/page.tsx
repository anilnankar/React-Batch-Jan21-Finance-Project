"use client";

import { useState, type FormEvent, type InvalidEvent } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [validated, setValidated] = useState(false);
  const [emailError, setEmailError] = useState("Enter valid email id");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleEmailInvalid = (event: InvalidEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (input.validity.valueMissing) {
      setEmailError("Email ID is mandatory");
      input.setCustomValidity("Email ID is mandatory");
      return;
    }

    setEmailError("Enter valid email id");
    input.setCustomValidity("Enter valid email id");
  };

  const handleEmailInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.setCustomValidity("");

    if (input.value.trim().length === 0) {
      setEmailError("Email ID is mandatory");
      return;
    }

    if (!input.checkValidity()) {
      setEmailError("Enter valid email id");
      return;
    }

    setEmailError("Enter valid email id");
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-2">
            <div className="card-body p-4 p-md-5">
              <h1 className="h3 mb-4 text-center">New Customer Registration</h1>

              <form className={`row g-3 ${validated ? "was-validated" : ""}`} noValidate onSubmit={handleSubmit}>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="customerType">
                    Customer Type <span className="text-danger">*</span>
                  </label>
                  <select id="customerType" className="form-select" defaultValue="" required>
                    <option value="" disabled>
                      Select customer type
                    </option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                  <div className="invalid-feedback">Customer type is required.</div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="fullName">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    maxLength={150}
                    minLength={3}
                    required
                  />
                  <div className="invalid-feedback">Full name is required (minimum 3 characters).</div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="dobOrIncorp">
                    Date of Birth / Incorporation
                  </label>
                  <input id="dobOrIncorp" type="date" className="form-control" />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="mobileNumber">
                    Mobile No <span className="text-danger">*</span>
                  </label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    className="form-control"
                    placeholder="10-15 digit mobile number"
                    pattern="^[0-9]{10,15}$"
                    maxLength={15}
                    required
                  />
                  <div className="invalid-feedback">Enter a valid mobile number (10 to 15 digits).</div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Email ID <span className="text-danger">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    maxLength={150}
                    required
                    onInvalid={handleEmailInvalid}
                    onInput={handleEmailInput}
                  />
                  <div className="invalid-feedback">{emailError}</div>
                  <div className="valid-feedback">Email ID is valid.</div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="panNumber">
                    PAN Number
                  </label>
                  <input
                    id="panNumber"
                    type="text"
                    className="form-control text-uppercase"
                    placeholder="ABCDE1234F"
                    pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                    maxLength={10}
                    onInput={(event) => {
                      const input = event.currentTarget;
                      input.value = input.value.toUpperCase();
                    }}
                    required
                  />
                </div>

                <div className="col-12">
                  <small className="text-muted">
                    Customer code, KYC status, risk category, and account status are managed by the system.
                  </small>
                </div>


                <div className="col-12 d-grid d-md-flex gap-2 justify-content-md-end">
                  <Link href="/login" className="btn btn-outline-secondary">
                    Back to Login
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Register Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

