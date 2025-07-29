function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fdf6f0", // soft creamy background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark">
            <span role="img" aria-label="wave">👋</span> Welcome to <span className="text-primary">MRA Infotech</span>
          </h1>
          <p className="fs-5 text-secondary">
            Your career starts here — discover jobs or hire talent easily.
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {/* Job Seeker Section */}
          <div className="col-md-5">
            <div className="glass-card text-center p-4">
              <i className="bi bi-person-badge fs-1 text-primary mb-3"></i>
              <h4 className="fw-semibold">I'm a Job Seeker</h4>
              <p className="text-muted mb-0">
                Explore job listings and apply to your dream career.
              </p>
            </div>
          </div>

          {/* Company Section */}
          <div className="col-md-5">
            <div className="glass-card text-center p-4">
              <i className="bi bi-building fs-1 text-success mb-3"></i>
              <h4 className="fw-semibold">I'm a Company</h4>
              <p className="text-muted mb-0">
                Post openings and hire the right talent fast.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-5 text-center">
          <h3 className="fw-bold text-dark mb-4">Why Choose MRA?</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <i className="bi bi-search fs-2 text-info mb-2"></i>
                <h5 className="fw-semibold">Smart Job Search</h5>
                <p className="text-muted">Easily search by role, location or skill.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <i className="bi bi-speedometer2 fs-2 text-danger mb-2"></i>
                <h5 className="fw-semibold">Quick Hiring</h5>
                <p className="text-muted">Get responses in days, not weeks.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <i className="bi bi-people fs-2 text-warning mb-2"></i>
                <h5 className="fw-semibold">Verified Employers</h5>
                <p className="text-muted">Work only with trusted companies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Glassmorphism Card Styling */}
      <style>{`
        .glass-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          border: 1px solid #e8e8e8;
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}

export default Home;