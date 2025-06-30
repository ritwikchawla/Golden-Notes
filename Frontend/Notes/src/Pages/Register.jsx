import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, Phone, Loader } from "react-feather";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData
      );

      console.log("Registration successful:", res.data);
      navigate("/login", { state: { registrationSuccess: true } });
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      setApiError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
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
                <User size={28} className="text-warning me-2" />
                Join <span className="text-warning">Golden</span>Notes
              </h2>
            </div>

            <div className="card-body px-4 py-4">
              {/* API Error Message */}
              {apiError && (
                <div className="alert alert-danger mb-4">{apiError}</div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name Input */}
                <div className="mb-3">
                  <label htmlFor="fullname" className="form-label">
                    <User size={18} className="me-2 text-secondary" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`form-control py-2 ${
                      errors.fullname && "is-invalid"
                    }`}
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                  {errors.fullname && (
                    <div className="invalid-feedback">{errors.fullname}</div>
                  )}
                </div>

                {/* Email Input */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <Mail size={18} className="me-2 text-secondary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control py-2 ${
                      errors.email && "is-invalid"
                    }`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Phone Input */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    <Phone size={18} className="me-2 text-secondary" />
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    className="form-control py-2"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <Lock size={18} className="me-2 text-secondary" />
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control py-2 ${
                        errors.password && "is-invalid"
                      }`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="mb-4">
                  <label htmlFor="confirm_password" className="form-label">
                    <Lock size={18} className="me-2 text-secondary" />
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control py-2 ${
                      errors.confirm_password && "is-invalid"
                    }`}
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                  {errors.confirm_password && (
                    <div className="invalid-feedback">
                      {errors.confirm_password}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-warning w-100 py-2 text-white fw-bold mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="me-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>

                {/* Divider */}
                <div className="d-flex align-items-center mb-3">
                  <div
                    style={{ borderTop: "1px solid #dee2e6", flexGrow: 1 }}
                  ></div>
                  <span className="px-3 text-muted">
                    ALREADY HAVE AN ACCOUNT?
                  </span>
                  <div
                    style={{ borderTop: "1px solid #dee2e6", flexGrow: 1 }}
                  ></div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-warning fw-bold text-decoration-none"
                  >
                    Login to your account
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

export default Register;
