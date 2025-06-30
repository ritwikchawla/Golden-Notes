import axios from "axios";
import React, { useState } from "react";
import {
  Search,
  Person,
  Sun,
  Moon,
  Book,
  List,
  ChevronDown,
  Gear,
  BoxArrowRight,
} from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/logout/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("Error", error);
    }
    localStorage.removeItem("token");
    navigate("/login");
    setShowProfileDropdown(false);
    setShowMobileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search?.value;
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowMobileMenu(false);
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-white shadow-sm px-3 px-md-5 py-3"
        style={{ borderBottom: "2px solid #FFD700" }}
      >
        <div className="container-fluid">
          {/* Logo and Brand Name */}
          <div className="d-flex align-items-center">
            <Book className="text-warning me-2" size={28} />
            <Link className="navbar-brand fw-bold text-dark" to="/">
              <span className="text-warning">Golden</span>Notes
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle navigation"
          >
            <List className="text-dark" size={24} />
          </button>

          {/* Desktop Menu Items */}
          <div className="d-none d-lg-flex align-items-center">
            {/* Navigation Links */}
            <div className="mx-3">
              <Link className="text-dark text-decoration-none me-3" to="/notes">
                My Notes
              </Link>
              <Link
                className="text-dark text-decoration-none me-3"
                to="/favorites"
              >
                Favorites
              </Link>
              <Link className="text-dark text-decoration-none" to="/shared">
                Shared
              </Link>
            </div>

            {/* Centered Search Form - Desktop */}
            <div className="mx-4" style={{ width: "300px" }}>
              <form
                className="d-flex w-100"
                role="search"
                onSubmit={handleSearch}
              >
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Search className="text-secondary" />
                  </span>
                  <input
                    name="search"
                    className="form-control border-start-0 py-2"
                    type="search"
                    placeholder="Search notes..."
                    aria-label="Search"
                    style={{ boxShadow: "none" }}
                  />
                </div>
              </form>
            </div>

            {/* Theme Toggle and Auth - Desktop */}
            <div className="d-flex align-items-center position-relative">
              {token ? (
                <>
                  {/* User Profile Dropdown */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-warning d-flex align-items-center"
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                      aria-expanded={showProfileDropdown}
                      aria-label="User menu"
                    >
                      <Person size={18} className="me-1" />
                      <ChevronDown size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`dropdown-menu dropdown-menu-end ${
                        showProfileDropdown ? "show" : ""
                      }`}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: "0.5rem",
                        border: "1px solid #FFD700",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Link
                        className="dropdown-item d-flex align-items-center"
                        to="/profile"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Person size={16} className="me-2 text-warning" />
                        My Profile
                      </Link>
                      <Link
                        className="dropdown-item d-flex align-items-center"
                        to="/settings"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Gear size={16} className="me-2 text-warning" />
                        Settings
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item d-flex align-items-center text-danger"
                        onClick={handleLogout}
                      >
                        <BoxArrowRight size={16} className="me-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-link text-dark me-2"
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Toggle theme"
                  >
                    {darkMode ? (
                      <Sun size={20} className="text-warning" />
                    ) : (
                      <Moon size={20} />
                    )}
                  </button>

                  <Link
                    className="btn btn-warning text-white d-flex align-items-center"
                    to="/login"
                    style={{ minWidth: "80px" }}
                  >
                    <Person className="me-2" size={16} />
                    <span className="d-none d-sm-inline">Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Collapsible */}
      {showMobileMenu && (
        <div className="bg-white p-3 shadow-sm d-lg-none">
          {/* Mobile Navigation Links */}
          <div className="mb-3 d-flex flex-column">
            <Link
              className="text-dark text-decoration-none py-2"
              to="/notes"
              onClick={() => setShowMobileMenu(false)}
            >
              My Notes
            </Link>
            <Link
              className="text-dark text-decoration-none py-2"
              to="/favorites"
              onClick={() => setShowMobileMenu(false)}
            >
              Favorites
            </Link>
            <Link
              className="text-dark text-decoration-none py-2"
              to="/shared"
              onClick={() => setShowMobileMenu(false)}
            >
              Shared
            </Link>
          </div>

          {/* Mobile Search Form */}
          <form className="mb-3" role="search" onSubmit={handleSearch}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search className="text-secondary" />
              </span>
              <input
                name="search"
                className="form-control border-start-0 py-2"
                type="search"
                placeholder="Search notes..."
                aria-label="Search"
                style={{ boxShadow: "none" }}
              />
            </div>
          </form>

          {/* Mobile Menu Items */}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-link text-dark"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun size={20} className="me-2 text-warning" />
              ) : (
                <Moon size={20} className="me-2" />
              )}
            </button>

            {token ? (
              <button
                className="btn btn-warning text-white d-flex align-items-center"
                onClick={handleLogout}
              >
                <BoxArrowRight size={16} className="me-2" />
                Logout
              </button>
            ) : (
              <Link
                className="btn btn-warning text-white d-flex align-items-center"
                to="/login"
                onClick={() => setShowMobileMenu(false)}
              >
                <Person size={16} className="me-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
