 "use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    setSubmitMessage("");

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitMessage(result?.message || "Login failed");
        return;
      }

      const customerId = result?.data?.customer_id;
      if (customerId != null) {
        sessionStorage.setItem("customerId", String(customerId));
      }

      setSubmitMessage(result?.message || "Login successful");
      router.push("/dashboard");
    } catch {
      setSubmitMessage("Unable to connect to backend API");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-2">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Login</h1>
              <form className="d-grid gap-3" onSubmit={handleSubmit}>
                <div>
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    required
                  />
                </div>
                {submitMessage ? (
                  <div className="alert alert-info py-2 mb-0" role="alert">
                    {submitMessage}
                  </div>
                ) : null}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
              <p className="text-center mt-3 mb-0">
                New customer? <Link href="/register">Create account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

