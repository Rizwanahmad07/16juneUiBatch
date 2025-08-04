// GoogleCallback.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const GoogleCallback = ({ setIsLoggedIn, setUserName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get("name")?.trim();
        const email = queryParams.get("email")?.trim();

        if (name && email) {
          setUserName(name);
          setIsLoggedIn(true);

          Swal.fire({
            icon: "success",
            title: `Welcome, ${name}!`, // ✅ fixed with backticks
            text: "Google login successful!",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/logingf");
        } else {
          throw new Error("Missing Google login data.");
        }
      } catch (error) {
        console.error("Google login error:", error);

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Google login failed. Please try again.",
        });

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    handleGoogleLogin();
  }, [location, navigate, setIsLoggedIn, setUserName]);

  return loading ? (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Processing Google login...
    </div>
  ) : null;
};

export default GoogleCallback;
