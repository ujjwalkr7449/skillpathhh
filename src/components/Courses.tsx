import React, { useState, useEffect } from "react";
import { Search, RotateCcw, AlertCircle, ArrowUpRight, HelpCircle, ShieldCheck } from "lucide-react";

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

interface CoursesProps {
  sectionTitle?: string;
  accentColor?: string;
}

export const Courses: React.FC<CoursesProps> = ({
  sectionTitle = "Explore Our Courses",
  accentColor = "#4f46e5",
}) => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [countryCode, setCountryCode] = useState<string>("US"); // Fallback is US
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and Sort states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Fetch course and country data with automatic retries and abort support
  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const maxAttempts = 3;
    let success = false;
    let coursesResult: Course[] | null = null;
    let lastError: any = null;

    try {
      // 1. Fetch country code in isolation so failure doesn't crash the courses list
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
        // Silently fail country API, use USD fallback
      }
      
      // Check if aborted before setting state
      if (signal?.aborted) return;
      setCountryCode(resolvedCountry);

      // 2. Fetch course data with up to 3 automatic retries
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
            throw new Error("Invalid data format received from Courses API");
          }
        } catch (err: any) {
          if (err.name === "AbortError") {
            return; // Exit immediately if request was aborted
          }
          lastError = err;
          console.warn(`Courses API attempt ${attempt} failed:`, err);
          
          if (attempt < maxAttempts) {
            // Wait 500ms before retrying
            await sleep(500);
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
        console.error("Data fetching error after all retries:", err);
        setError("Something went wrong while loading the courses. Please try again.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
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

  // Get numerical price value for sorting
  const getSortablePrice = (course: Course) => {
    return countryCode === "IN" ? course.pricePaise : course.priceUsdCents;
  };

  // Extract unique categories for filter pills
  const categories = courses
    ? ["All", ...Array.from(new Set(courses.map((c) => c.mainCategory)))]
    : ["All"];

  // Filter and Sort implementation
  const processedCourses = (() => {
    if (!courses) return [];

    let result = [...courses];

    // Filter by search query (name, category, description)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.courseName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.mainCategory.toLowerCase().includes(query)
      );
    }

    // Filter by category pill
    if (selectedCategory !== "All") {
      result = result.filter((c) => c.mainCategory === selectedCategory);
    }

    // Sort courses
    if (sortBy === "priceLowToHigh") {
      result.sort((a, b) => getSortablePrice(a) - getSortablePrice(b));
    } else if (sortBy === "priceHighToLow") {
      result.sort((a, b) => getSortablePrice(b) - getSortablePrice(a));
    }

    return result;
  })();

  return (
    <section className="courses-section" id="courses" style={{ "--accent-color": accentColor } as React.CSSProperties}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h2>{sectionTitle}</h2>
          <p className="section-subtitle">
            Unlock your potential with our curriculum structured for modern builders.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div>
            <div className="toolbar-container">
              <div className="search-wrapper shimmer">
                <div style={{ height: "46px", borderRadius: "12px", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)" }}></div>
              </div>
              <div style={{ width: "160px", height: "46px", borderRadius: "12px", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)" }} className="shimmer"></div>
            </div>
            <div className="course-grid">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="skeleton-card shimmer">
                  <div className="card-badge-row">
                    <div className="skeleton-badge"></div>
                    <div className="skeleton-badge"></div>
                  </div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-desc">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                  <div className="skeleton-footer">
                    <div className="skeleton-price"></div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="error-container">
            <div className="error-icon-box">
              <AlertCircle size={28} />
            </div>
            <h3 className="error-title">Unable to load courses</h3>
            <p className="error-message">{error}</p>
            <button onClick={() => fetchData()} className="btn btn-primary" style={{ backgroundColor: accentColor }}>
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Success States */}
        {!loading && !error && courses && (
          <>
            {/* Toolbar for Search and Sort */}
            <div className="toolbar-container">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by course name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filters-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select-input"
                >
                  <option value="recommended">Recommended</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
                  style={selectedCategory === cat ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Course Grid / Empty State */}
            {processedCourses.length === 0 ? (
              <div className="empty-container">
                <div className="empty-icon-box">
                  <HelpCircle size={28} />
                </div>
                <h3 className="error-title">No courses available</h3>
                <p className="error-message">
                  Check back soon for new learning opportunities, or try resetting your filters.
                </p>
                {searchQuery || selectedCategory !== "All" ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSortBy("recommended");
                    }}
                    className="btn btn-secondary"
                  >
                    Reset Filters
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="course-grid">
                {processedCourses.map((course) => (
                  <div key={course.mangoId} className="course-card">
                    <div className="card-top">
                      <div className="card-badge-row">
                        <span className="category-tag" style={{ color: accentColor }}>
                          {course.mainCategory}
                        </span>
                        {course.refundable && (
                          <span className="refundable-badge">
                            <ShieldCheck size={13} />
                            Refundable
                          </span>
                        )}
                      </div>
                      <h3 className="card-title">{course.courseName}</h3>
                      <p className="card-description" title={course.description}>
                        {course.description}
                      </p>
                    </div>

                    <div className="card-bottom">
                      <div className="price-container">
                        <span className="price-label">Lifetime Access</span>
                        <span className="price-value">{formatPrice(course)}</span>
                      </div>
                      <a
                        href={`#enroll-${course.courseCode}`}
                        className="card-cta"
                        aria-label={`Enroll in ${course.courseName}`}
                      >
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
  );
};
