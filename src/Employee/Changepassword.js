import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Changepassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email"); // or whatever key you store email under
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire("All fields are required!", "", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Passwords do not match!", "", "error");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE}/api/UpdatePasswords/Change`, {
        email,
        oldPassword,
        newPassword
      });

      if (response.data.success) {
        Swal.fire("Password Updated!", response.data.message, "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Swal.fire("Error", response.data.message || "Failed to update password", "error");
      }
    } catch (error) {
      Swal.fire("Incorrect Password", "Please check your old password!", "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <h3 className="text-center mb-4 text-muted"><i className="bi bi-lock-fill me-2 text-success"></i>Change Password</h3>
        <form onSubmit={handlePasswordUpdate}>
          {/* Old Password */}
          <div className="mb-3">
            <label className="form-label">Old Password</label>
            <div className="input-group">
              <input
                type={showOldPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                <i className={`bi ${showOldPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Changepassword;