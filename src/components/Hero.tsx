import React from "react";
import { ArrowRight, Play, BookOpen, Clock, BarChart, Sparkles, Award } from "lucide-react";

interface HeroProps {
  accentColor?: string;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ accentColor = "#4f46e5", onExploreClick }) => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              backgroundColor: "rgba(79, 70, 229, 0.08)",
              border: "1px solid rgba(79, 70, 229, 0.15)",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: accentColor,
              marginBottom: "24px",
            }}
          >
            <Sparkles size={14} />
            <span>Next-Generation Practical Learning</span>
          </div>

          <h1 className="hero-headline">
            Learn Skills.<br />
            <span style={{ color: accentColor }}>Build Your Path.</span>
          </h1>
          <p className="hero-subtext">
            Practical courses designed to help you learn faster, build real skills, and move confidently toward your goals.
          </p>

          <div className="hero-actions">
            <button
              onClick={onExploreClick}
              className="btn btn-primary btn-large"
              style={{ backgroundColor: accentColor }}
            >
              Explore Courses
              <ArrowRight size={18} />
            </button>
            <a href="#demo" className="btn btn-secondary btn-large">
              <Play size={18} fill="currentColor" />
              Watch Demo
            </a>
          </div>
        </div>

        {/* Custom pure CSS/HTML Dashboard Mockup */}
        <div className="hero-frame-wrapper">
          <div
            style={{
              backgroundColor: "#0f172a",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #1e293b",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              color: "#cbd5e1",
              fontSize: "0.85rem",
              fontFamily: "var(--font-sans)",
            }}
          >
            {/* Header bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid #1e293b",
                backgroundColor: "#0b0f19",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }}></span>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }}></span>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }}></span>
                <span style={{ marginLeft: "12px", fontWeight: 600, color: "#f8fafc", letterSpacing: "-0.01em" }}>Skillpath OS v1.2</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "auto" }}>
                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>My Dashboard</span>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.75rem" }}>
                  JD
                </div>
              </div>
            </div>

            {/* Layout Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                minHeight: "360px",
              }}
            >
              {/* Sidebar */}
              <div
                style={{
                  borderRight: "1px solid #1e293b",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  backgroundColor: "#0b0f19",
                }}
              >
                <div style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Menu
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#f8fafc", fontWeight: 600 }}>
                    <BookOpen size={16} style={{ color: accentColor }} />
                    <span>My Courses</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "6px", color: "#94a3b8" }}>
                    <BarChart size={16} />
                    <span>Analytics</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "6px", color: "#94a3b8" }}>
                    <Clock size={16} />
                    <span>Schedule</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "6px", color: "#94a3b8" }}>
                    <Award size={16} />
                    <span>Certificates</span>
                  </div>
                </div>
              </div>

              {/* Main Content Pane */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#1e293b", border: "1px solid #334155" }}>
                    <div style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 500 }}>Hours Spent</div>
                    <div style={{ color: "#f8fafc", fontSize: "1.5rem", fontWeight: 700, marginTop: "4px" }}>24.8 hrs</div>
                  </div>
                  <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#1e293b", border: "1px solid #334155" }}>
                    <div style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 500 }}>Active Courses</div>
                    <div style={{ color: "#f8fafc", fontSize: "1.5rem", fontWeight: 700, marginTop: "4px" }}>3 Courses</div>
                  </div>
                  <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#1e293b", border: "1px solid #334155" }}>
                    <div style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 500 }}>Certificates</div>
                    <div style={{ color: "#f8fafc", fontSize: "1.5rem", fontWeight: 700, marginTop: "4px" }}>1 Earned</div>
                  </div>
                </div>

                {/* Course in progress card */}
                <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "#1e293b", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: accentColor, textTransform: "uppercase" }}>Current Course</span>
                      <h4 style={{ color: "#f8fafc", fontSize: "1.1rem", fontWeight: 600, marginTop: "4px" }}>How To YouTube</h4>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginLeft: "auto" }}>Module 3 of 8</div>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>
                      <span>Course Progress</span>
                      <span style={{ marginLeft: "auto", color: "#f8fafc" }}>38% Completed</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", backgroundColor: "#0f172a", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: "38%", height: "100%", backgroundColor: accentColor, borderRadius: "4px" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
