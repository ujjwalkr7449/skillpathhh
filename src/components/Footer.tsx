import React from "react";
import { Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-wrapper">
          {/* Logo */}
          <a href="#" className="logo">
            <div className="logo-icon">
              <Sparkles size={14} color="#fff" />
            </div>
            <span>Skillpath</span>
          </a>

          {/* Links */}
          <div className="footer-links">
            <a href="#courses">Courses</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
          </div>

          {/* Copyright */}
          <div className="copyright-text">
            &copy; 2026 Skillpath. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
