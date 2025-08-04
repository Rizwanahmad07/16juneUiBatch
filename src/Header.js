import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUser, FaSignInAlt, FaTrash, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("user") || "");

  const [signupName, setSignupName] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();

  {/* const handleSignup = async (e) => {
    e.preventDefault();
    const payload = {
      fullName: signupName,
      mobile: signupMobile,
      email: signupEmail,
      password: signupPassword
    };

    try {
      const res = await axios.post("http://localhost:5269/api/Users/signup", payload);

      if (res.data.status === "201") {
        Swal.fire({
          icon: 'success',
          title: `Welcome, ${signupName}!`,
          text: 'Signup successful!',
          confirmButtonColor: '#3085d6',
        });

        setShowSignup(false);
        setSignupName("");
        setSignupMobile("");
        setSignupEmail("");
        setSignupPassword("");
      } else {
        alert("Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed: " + (err.response?.data || err.message));
    }
  }; */ }

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = {
      email: signupEmail,
      password: signupPassword
    };

    try {
      const res = await axios.post("http://localhost:5269/api/Users/login", payload);
      const { token, user, role, status } = res.data;

      if (status === "200") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", user.fullName);
        localStorage.setItem("role", role.name);
        localStorage.setItem("employeeId",user.id);

        setUserName(user.fullName);
        setIsLoggedIn(true);

        Swal.fire({
          icon: 'success',
          title: `Welcome, ${user.fullName}!`,
          text: 'Login successful!',
          confirmButtonColor: '#3085d6',
          timer: 1500,
          showConfirmButton: false
        });

        setShowLogin(false);
        setSignupEmail("");
        setSignupPassword("");

        if (role.name === "Admin") {
          navigate("/admin/employeereport");
        } else if (role.name === "Employee") {
          navigate("/employee/welcome");
        } else if (role.name === "Company") {
          navigate("/company/postnewjob");
        } else {
          navigate("/");
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid credentials or user not found.'
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: err.response?.data || 'Something went wrong. Please try again.'
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setUserName("");
        navigate("/");

        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg, #343a40, #212529)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">MRA Infotech</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/feedback">FeedBack</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contactus">Contact Us</Link></li>
            </ul>
            <div className="d-flex align-items-center gap-2">
              {!isLoggedIn ? (
                <>
                  {/* <button className="btn btn-outline-light me-2" onClick={() => setShowSignup(true)}>
                    <FaUser className="me-1" /> Sign Up
                  </button> */}
                  <button className="btn btn-success" onClick={() => setShowLogin(true)}>
                    <FaSignInAlt className="me-1" /> Login
                  </button>
                </>
              ) : (
                <>
                  <span className="text-white fw-semibold me-2">✨ {userName}</span>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    <FaTrash className="me-1" /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowLogin(false)}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content shadow rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogin(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="User Id" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                  <div className="d-flex justify-content-center gap-2">
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => { window.location.href = "http://localhost:5269/api/GAuth/login-google";}}><FaGoogle /></button>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { window.location.href = "http://localhost:5269/api/Auth/login-facebook"; }}><FaFacebookF /></button>
                    <button className="btn btn-outline-info btn-sm"><FaTwitter /></button>
                  </div>
                  <p className="text-center mt-3 mb-0">
                    No account? <button className="btn btn-link p-0" onClick={() => { setShowLogin(false); setShowSignup(true); }}>Sign Up</button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {/* {showSignup && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowSignup(false)}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content shadow rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Sign Up</h5>
                <button type="button" className="btn-close" onClick={() => setShowSignup(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSignup}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" placeholder="Enter Your Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input type="text" className="form-control" placeholder="Enter Your Mobile No." value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="Enter Your Emali" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" placeholder="Enter Your Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3">Create Account</button>
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-outline-danger btn-sm"><FaGoogle /></button>
                    <button className="btn btn-outline-primary btn-sm"><FaFacebookF /></button>
                    <button className="btn btn-outline-info btn-sm"><FaTwitter /></button>
                  </div>
                  <p className="text-center mt-3 mb-0">
                    Already have an account? <button className="btn btn-link p-0" onClick={() => { setShowSignup(false); setShowLogin(true); }}>Sign in</button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}

export default Header;