import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-2">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Login</h1>
              <form className="d-grid gap-3">
                <div>
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input id="email" type="email" className="form-control" placeholder="name@example.com" />
                </div>
                <div>
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input id="password" type="password" className="form-control" placeholder="Enter password" />
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign in
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

