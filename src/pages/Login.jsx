import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save authentication information
      localStorage.setItem("priyaToken", data.token);
      localStorage.setItem("priyaUser", JSON.stringify(data.user));
      localStorage.setItem("priyaLoggedIn", "true");

      alert(`Welcome back, ${data.user.name}!`);

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        const from = location.state?.from?.pathname;
        if (from && from !== "/login" && from !== "/register") {
          navigate(from, { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
      alert(
        "Cannot connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <p>PRIYA DESIGNS</p>
          <h1>Welcome Back</h1>
          <span>Login to continue shopping.</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;