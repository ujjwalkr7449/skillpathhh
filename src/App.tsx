import { useState, useRef } from "react";
import { Hero } from "./components/Hero";
import { Courses } from "./components/Courses";
import { Footer } from "./components/Footer";
import framerComponentCode from "./components/SkillpathCoursesFramer.tsx?raw";
import {
  Sparkles,
  Copy,
  Check,
  Code,
  FileCode,
  TrendingUp,
  Globe,
  DollarSign,
  Layers,
} from "lucide-react";

export default function App() {
  const [sectionTitle, setSectionTitle] = useState("Explore Our Courses");
  const [accentColor, setAccentColor] = useState("#4f46e5");
  const [copied, setCopied] = useState(false);

  const coursesRef = useRef<HTMLDivElement>(null);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(framerComponentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Simulator Control Panel Banner */}
      <div className="simulator-panel">
        <div className="simulator-info">
          <span className="simulator-badge">Simulator</span>
          <p style={{ margin: 0, color: "#f8fafc", fontSize: "0.85rem", fontWeight: 500 }}>
            Configure properties to see how they render dynamically inside Framer.
          </p>
        </div>

        <div className="simulator-controls">
          {/* Section Title Property */}
          <div className="control-item">
            <label htmlFor="sim-title">Section Title:</label>
            <input
              id="sim-title"
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="control-input"
              style={{ width: "180px" }}
            />
          </div>

          {/* Accent Color Property */}
          <div className="control-item">
            <label>Accent Color:</label>
            <div className="color-dots-wrapper">
              {[
                { name: "Indigo", value: "#4f46e5" },
                { name: "Emerald", value: "#059669" },
                { name: "Teal", value: "#0d9488" },
                { name: "Violet", value: "#7c3aed" },
                { name: "Orange", value: "#ea580c" },
              ].map((c) => (
                <span
                  key={c.value}
                  title={c.name}
                  onClick={() => setAccentColor(c.value)}
                  className="color-dot"
                  style={{
                    backgroundColor: c.value,
                    border: accentColor === c.value ? "2px solid #ffffff" : "1px solid #475569",
                    transform: accentColor === c.value ? "scale(1.2)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                style={{
                  width: "24px",
                  height: "24px",
                  padding: 0,
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
                title="Custom Color"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="header-nav">
        <div className="container nav-wrapper">
          <a href="#" className="logo" style={{ color: "#0f172a" }}>
            <div className="logo-icon" style={{ backgroundColor: accentColor }}>
              <Sparkles size={14} color="#fff" />
            </div>
            <span>Skillpath</span>
          </a>

          <nav className="nav-links">
            <a href="#courses" onClick={(e) => { e.preventDefault(); scrollToCourses(); }}>Courses</a>
            <a href="#interview-prep">Interview FAQ</a>
            <a href="#code-integration">Framer Code</a>
          </nav>

          <div>
            <button
              onClick={scrollToCourses}
              className="btn btn-secondary"
              style={{ fontWeight: 600 }}
            >
              Explore Courses
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <Hero accentColor={accentColor} onExploreClick={scrollToCourses} />

      {/* Courses Section (Wraps component with ref) */}
      <div ref={coursesRef}>
        <Courses sectionTitle={sectionTitle} accentColor={accentColor} />
      </div>

      {/* Technical FAQ (Recruiter Preparation) */}
      <section
        id="interview-prep"
        style={{
          padding: "96px 0",
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="container" style={{ maxWidth: "900px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Recruiter Preparation
            </span>
            <h2 style={{ marginTop: "8px" }}>Technical Interview Guide</h2>
            <p style={{ marginTop: "12px", color: "var(--text-secondary)" }}>
              Here are the architectural answers you can confidently explain when presenting this code to interviewers.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* FAQ 1 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "rgba(79, 70, 229, 0.08)",
                    color: accentColor,
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <Globe size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
                    How are the Course and Country APIs handled?
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    The two API endpoints (Course Data and Country Code) are invoked inside a single <code>useEffect</code> hook, but their fetch requests are fully isolated in separate try-catch blocks. If the Country API fails due to rate limits or network issues, the Course API is unaffected. The application catches the country error silently, defaults to USD pricing formatting, and ensures the core functionality remains intact.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "rgba(79, 70, 229, 0.08)",
                    color: accentColor,
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
                    Why is the price divided by 100, and how is it formatted?
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    To prevent floating-point precision errors (like <code>0.1 + 0.2 = 0.30000000000000004</code>), financial platforms represent currency values as integers in their smallest denomination (paise for INR, cents for USD). We divide by 100 to get the decimal values and format using the native browser <code>Intl.NumberFormat</code> API. We format INR dynamically as whole currency (₹1,999) using the <code>en-IN</code> locale, and USD as ($39.99) using the <code>en-US</code> locale.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "rgba(79, 70, 229, 0.08)",
                    color: accentColor,
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <Layers size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
                    Why did we use a custom React component instead of Framer Fetch?
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    Framer's built-in Fetch feature is great for simple lists, but lacks support for:
                    <ol style={{ margin: "8px 0 0 20px", paddingLeft: 0 }}>
                      <li>Isolated error resilience (handling country code failure independently).</li>
                      <li>Custom formatting logic based on locale criteria.</li>
                      <li>Clean skeleton screen loaders and custom interactive features like searching, sorting, and category pill filtering.</li>
                    </ol>
                    By writing a custom React Code Component, we gain absolute programmatic control over the loading, success, empty, and retry states.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "rgba(79, 70, 229, 0.08)",
                    color: accentColor,
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
                    How is mobile responsiveness and API reliability guaranteed?
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    Responsiveness is achieved via clean CSS grids using <code>grid-template-columns: repeat(3, 1fr)</code>, mapping to media queries at 1024px (2 columns) and 768px (1 column). Since the API dynamically changes length (between 5 and 10 courses), no fixed dimensions are assumed. For reliability, we use <code>AbortController</code> in our fetch hook. This prevents race conditions and memory leaks by aborting outstanding requests if the component unmounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Integration Pane */}
      <section id="code-integration" className="code-preview-section">
        <div className="container">
          <div className="code-header-row">
            <div>
              <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Code size={28} style={{ color: accentColor }} />
                Copy to Framer Canvas
              </h2>
              <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                Use this self-contained React component directly inside Framer.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="copy-btn"
              style={{ backgroundColor: copied ? "#10b981" : "transparent", borderColor: copied ? "#10b981" : "#475569" }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Framer Code"}
            </button>
          </div>

          <div className="code-container">
            <div className="code-toolbar">
              <div className="code-title">
                <FileCode size={14} />
                <span>SkillpathCoursesFramer.tsx</span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }}></span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#eab308" }}></span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }}></span>
              </div>
            </div>
            <pre className="code-pre">
              <code>{framerComponentCode}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
