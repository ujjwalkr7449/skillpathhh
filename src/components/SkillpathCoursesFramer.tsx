import * as React from "react";
import { addPropertyControls, ControlType } from "framer";
// Note: If using this component inside Framer, Lucide icons can be imported from "lucide-react" or replaced with Framer graphic layers.
// We import them here for consistent functionality.
import { Search, RotateCcw, AlertCircle, ArrowUpRight, HelpCircle, ShieldCheck } from "lucide-react";

// 1. Interfaces for the Framer properties
interface SkillpathCoursesProps {
  sectionTitle: string;
  accentColor: string;
  width?: number;
  height?: number;
}

interface Course {
  courseName: string;
  courseCode: string;
  description: string;
  mainCategory: string;
  shortCourse: string;
  courseType: string;
  pricePaise: number;
  priceUsdCents: number;
  mangoId: string;
  refundable: boolean;
}

export default function SkillpathCoursesFramer(props: SkillpathCoursesProps) {
  const { sectionTitle, accentColor } = props;

  const [courses, setCourses] = React.useState<Course[] | null>(null);
  const [countryCode, setCountryCode] = React.useState<string>("US");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<string>("recommended");

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const maxAttempts = 3;
    let success = false;
    let coursesResult: Course[] | null = null;
    let lastError: any = null;

    try {
      // Fetch Country API in isolation
      let resolvedCountry = "US";
      try {
        const countryResponse = await fetch(
          "https://syncsphere-hiv6.onrender.com/assignment/country-code",
          { signal }
        );
        if (countryResponse.ok) {
          const countryData = await countryResponse.json();
          if (countryData && countryData.country_code) {
            resolvedCountry = countryData.country_code;
          }
        }
      } catch (err) {
        console.warn("Country API failed. Using default US currency.", err);
      }

      if (signal?.aborted) return;
      setCountryCode(resolvedCountry);

      // Fetch Courses API with up to 3 automatic retries
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const courseResponse = await fetch(
            "https://syncsphere-hiv6.onrender.com/assignment/course-data",
            { signal }
          );

          if (!courseResponse.ok) {
            throw new Error(`Failed to fetch course data: ${courseResponse.status}`);
          }

          const courseData = await courseResponse.json();
          if (Array.isArray(courseData)) {
            coursesResult = courseData;
            success = true;
            break; // Exit retry loop on success
          } else {
            throw new Error("Invalid course data structure");
          }
        } catch (err: any) {
          if (err.name === "AbortError") {
            return; // Exit immediately if request was aborted
          }
          lastError = err;
          console.warn(`Courses API attempt ${attempt} failed:`, err);
          
          if (attempt < maxAttempts) {
            await sleep(500); // Wait 500ms before retrying
          }
        }
      }

      if (signal?.aborted) return;

      if (success && coursesResult) {
        setCourses(coursesResult);
        setError(null);
      } else {
        throw lastError || new Error("Failed to load courses after retries");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error(err);
        setError("Something went wrong while loading the courses. Please try again.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  // Format currency based on country code
  const formatPrice = (course: Course) => {
    if (countryCode === "IN") {
      const priceInRupees = course.pricePaise / 100;
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(priceInRupees);
    } else {
      const priceInUsd = course.priceUsdCents / 100;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(priceInUsd);
    }
  };

  // Get sortable numerical price
  const getSortablePrice = (course: Course) => {
    return countryCode === "IN" ? course.pricePaise : course.priceUsdCents;
  };

  // Extracted Categories
  const categories = courses
    ? ["All", ...Array.from(new Set(courses.map((c) => c.mainCategory)))]
    : ["All"];

  // Filter & Sort computation
  const processedCourses = React.useMemo(() => {
    if (!courses) return [];
    let result = [...courses];

    // Search query filtering
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.courseName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.mainCategory.toLowerCase().includes(query)
      );
    }

    // Category pill filtering
    if (selectedCategory !== "All") {
      result = result.filter((c) => c.mainCategory === selectedCategory);
    }

    // Price sorting
    if (sortBy === "priceLowToHigh") {
      result.sort((a, b) => getSortablePrice(a) - getSortablePrice(b));
    } else if (sortBy === "priceHighToLow") {
      result.sort((a, b) => getSortablePrice(b) - getSortablePrice(a));
    }

    return result;
  }, [courses, searchQuery, selectedCategory, sortBy, countryCode]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      <section className="courses-framer-component" style={{ "--framer-accent": accentColor } as React.CSSProperties}>
        <div className="framer-comp-container">
          {/* Header */}
          <div className="framer-comp-header">
            <h2>{sectionTitle}</h2>
            <p>Practical systems designed to help you construct your path forward.</p>
          </div>

          {/* Loading */}
          {loading && (
            <div>
              <div className="framer-comp-toolbar shimmer-anim">
                <div style={{ height: "46px", width: "100%", borderRadius: "12px", backgroundColor: "#f1f5f9" }}></div>
              </div>
              <div className="framer-comp-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="framer-comp-skeleton shimmer-anim">
                    <div className="framer-skeleton-badge-row">
                      <div className="framer-skeleton-el" style={{ width: "60px", height: "16px" }}></div>
                      <div className="framer-skeleton-el" style={{ width: "80px", height: "16px" }}></div>
                    </div>
                    <div className="framer-skeleton-el" style={{ width: "70%", height: "24px", margin: "16px 0 10px 0" }}></div>
                    <div className="framer-skeleton-el" style={{ width: "100%", height: "14px", marginBottom: "8px" }}></div>
                    <div className="framer-skeleton-el" style={{ width: "85%", height: "14px", marginBottom: "20px" }}></div>
                    <div className="framer-skeleton-footer">
                      <div className="framer-skeleton-el" style={{ width: "80px", height: "28px" }}></div>
                      <div className="framer-skeleton-el" style={{ width: "36px", height: "36px", borderRadius: "8px" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="framer-comp-status-card">
              <div className="status-icon-error">
                <AlertCircle size={28} />
              </div>
              <h3>Unable to load courses</h3>
              <p>{error}</p>
              <button onClick={() => fetchData()} className="framer-comp-btn">
                <RotateCcw size={16} />
                Try Again
              </button>
            </div>
          )}

          {/* Success */}
          {!loading && !error && courses && (
            <>
              {/* Search & Sort Panel */}
              <div className="framer-comp-toolbar">
                <div className="framer-comp-search-box">
                  <Search size={18} className="search-icon-svg" />
                  <input
                    type="text"
                    placeholder="Search by course name, category, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                </select>
              </div>

              {/* Category Pills */}
              <div className="framer-comp-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "pill-active" : ""}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid / Empty Result */}
              {processedCourses.length === 0 ? (
                <div className="framer-comp-status-card">
                  <div className="status-icon-empty">
                    <HelpCircle size={28} />
                  </div>
                  <h3>No courses available</h3>
                  <p>Check back soon for new learning opportunities.</p>
                  {(searchQuery || selectedCategory !== "All") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSortBy("recommended");
                      }}
                      className="framer-comp-btn-secondary"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="framer-comp-grid">
                  {processedCourses.map((course) => (
                    <div key={course.mangoId} className="framer-comp-card">
                      <div className="framer-card-content">
                        <div className="framer-badge-row">
                          <span className="category-span">{course.mainCategory}</span>
                          {course.refundable && (
                            <span className="refundable-span">
                              <ShieldCheck size={12} style={{ marginRight: "3px" }} />
                              Refundable
                            </span>
                          )}
                        </div>
                        <h3>{course.courseName}</h3>
                        <p title={course.description}>{course.description}</p>
                      </div>
                      <div className="framer-card-footer">
                        <div className="price-block">
                          <span className="price-lbl">Lifetime Access</span>
                          <span className="price-val">{formatPrice(course)}</span>
                        </div>
                        <a href={`#enroll-${course.courseCode}`} className="enroll-arrow">
                          <ArrowUpRight size={18} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

// 2. Default props for Framer
SkillpathCoursesFramer.defaultProps = {
  sectionTitle: "Explore Our Courses",
  accentColor: "#4f46e5",
};

// 3. Property controls registration for Framer canvas
addPropertyControls(SkillpathCoursesFramer, {
  sectionTitle: {
    type: ControlType.String,
    title: "Section Title",
    defaultValue: "Explore Our Courses",
    placeholder: "E.g. Learn New Skills",
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent Color",
    defaultValue: "#4f46e5",
  },
});

// Self-contained CSS styles injected directly into the document
const inlineStyles = `
.courses-framer-component {
  background-color: #f8fafc;
  padding: 80px 24px;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #0f172a;
}
.framer-comp-container {
  max-width: 1200px;
  margin: 0 auto;
}
.framer-comp-header {
  text-align: center;
  margin-bottom: 48px;
}
.framer-comp-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  color: #0f172a;
}
.framer-comp-header p {
  color: #475569;
  font-size: 1.1rem;
}
.framer-comp-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.framer-comp-search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
}
.search-icon-svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}
.framer-comp-search-box input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  outline: none;
  font-size: 0.95rem;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}
.framer-comp-search-box input:focus {
  border-color: var(--framer-accent);
}
.framer-comp-toolbar select {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  outline: none;
  font-size: 0.95rem;
  cursor: pointer;
  min-width: 160px;
}
.framer-comp-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.framer-comp-pills button {
  padding: 6px 14px;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.framer-comp-pills button:hover {
  background-color: #f1f5f9;
}
.framer-comp-pills button.pill-active {
  background-color: var(--framer-accent);
  color: #ffffff;
  border-color: var(--framer-accent);
}
.framer-comp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
}
@media (max-width: 1024px) {
  .framer-comp-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}
@media (max-width: 768px) {
  .framer-comp-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
.framer-comp-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.framer-comp-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}
.framer-card-content {
  margin-bottom: 24px;
}
.framer-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.category-span {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--framer-accent);
}
.refundable-span {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  background-color: #ecfdf5;
  color: #10b981;
  border: 1px solid #a7f3d0;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.framer-card-content h3 {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
}
.framer-card-content p {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.framer-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}
.price-block {
  display: flex;
  flex-direction: column;
}
.price-lbl {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
}
.price-val {
  font-size: 1.6rem;
  font-weight: 800;
  margin-top: 4px;
}
.enroll-arrow {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}
.framer-comp-card:hover .enroll-arrow {
  background-color: var(--framer-accent);
  color: #ffffff;
}

/* Skeletons */
.framer-comp-skeleton {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
}
.framer-skeleton-badge-row {
  display: flex;
  justify-content: space-between;
}
.framer-skeleton-el {
  background-color: #f1f5f9;
  border-radius: 6px;
}
.framer-skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}
.shimmer-anim {
  overflow: hidden;
  position: relative;
}
.shimmer-anim::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0) 100%);
  animation: framerShimmer 1.5s infinite;
}
@keyframes framerShimmer {
  100% { transform: translateX(100%); }
}

/* Error/Empty Card styling */
.framer-comp-status-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 64px 32px;
  text-align: center;
  max-width: 580px;
  margin: 0 auto;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
}
.status-icon-error {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  margin: 0 auto 20px auto;
}
.status-icon-empty {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  margin: 0 auto 20px auto;
}
.framer-comp-status-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.framer-comp-status-card p {
  color: #475569;
  margin-bottom: 24px;
}
.framer-comp-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  background-color: var(--framer-accent);
  color: #ffffff;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.framer-comp-btn:hover {
  filter: brightness(1.1);
}
.framer-comp-btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 12px;
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.framer-comp-btn-secondary:hover {
  background-color: #f1f5f9;
}
`;
