import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "react-feather";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    // console.log({ email, password, rememberMe });
    try {
      const res = await axios.post(`${apiUrl}/api/login/`, {
        email: email,
        password: password,
      });
      console.log(res);
      localStorage.setItem("token", res.data.refresh);

      navigate("/");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            {/* Card Header with Gold Accent */}
            <div
              className="card-header bg-white border-0 pt-4"
              style={{ borderBottom: "2px solid #FFD700" }}
            >
              <h2 className="text-center mb-0">
                <Lock size={28} className="text-warning me-2" />
                Login to <span className="text-warning">Golden</span>Notes
              </h2>
            </div>

            {/* Card Body */}
            <div className="card-body px-4 py-4">
              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    <Mail size={18} className="me-2 text-secondary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control py-2"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <Lock size={18} className="me-2 text-secondary" />
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control py-2"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-warning text-decoration-none"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-warning w-100 py-2 text-white fw-bold mb-3"
                >
                  LOGIN
                </button>

                {/* Divider */}
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{ borderTop: "1px solid #dee2e6", flexGrow: 1 }}
                  ></div>
                  <span className="px-3 text-muted">OR</span>
                  <div
                    style={{ borderTop: "1px solid #dee2e6", flexGrow: 1 }}
                  ></div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <Link
                    to="/register"
                    className="text-warning fw-bold text-decoration-none"
                  >
                    Register now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
