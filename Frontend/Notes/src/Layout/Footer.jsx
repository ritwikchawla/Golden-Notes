import React from "react";
import { Linkedin, Mail, Phone, Instagram, Twitter } from "react-feather";
import { Github } from "react-bootstrap-icons";

function Footer() {
  return (
    <footer
      className="bg-white text-dark py-4 mt-auto"
      style={{
        borderTop: "2px solid #FFD700",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">
              © {new Date().getFullYear()} GoldenNotes. Made by
              <span className="text-warning fw-bold"> rc101</span>
            </p>
          </div>

          <div className="col-md-6">
            <div className="d-flex justify-content-center justify-content-md-end">
              <a
                href="https://github.com/ritwikchawla"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark mx-2 hover-gold"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/ritwikchawla/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark mx-2 hover-gold"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:chawla.ritwik@gmail.com"
                className="text-dark mx-2 hover-gold"
              >
                <Mail size={20} />
              </a>
              <a href="tel:+919993109026" className="text-dark mx-2 hover-gold">
                <Phone size={20} />
              </a>
              <a
                href="https://instagram.com/rc101"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark mx-2 hover-gold"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com/rc101"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark mx-2 hover-gold"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS */}
      <style jsx>{`
        .hover-gold:hover {
          color: #ffd700 !important;
          transform: scale(1.1);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
