/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Search, X, BookOpen, Sparkles } from "lucide-react";
import Footer from "../components/core/Homepage/footer";
import getCatalogData from "../services/pageComponentdata";
import { GetCategorires } from "../services/auth";
import Course_Card from "../components/core/catalog/Course_Card";
import CourseSlider from "../components/core/catalog/CourseSlider";
import CatalogSpinner from "../utils/catalogSpinner";

const Catalog = () => {
  const { catalogName } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryID, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCat, setSelectedFilterCat] = useState("ALL");

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await GetCategorires();
        const catList = Array.isArray(res) ? res : [];
        setCategories(catList);

        if (catalogName) {
          const matchedCategory = catList.find(
            (ct) =>
              ct.name.split(" ").join("-").toLowerCase() ===
                catalogName.toLowerCase() ||
              ct.name.toLowerCase() === catalogName.toLowerCase()
          );
          setCategoryId(matchedCategory?._id || "");
          if (!matchedCategory) setLoading(false);
        } else {
          setCategoryId("");
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, [catalogName]);

  // Fetch specific category catalog data when catalogName route is active
  useEffect(() => {
    if (!catalogName || !categoryID) return;
    const fetchCatalogData = async () => {
      try {
        setLoading(true);
        const res = await getCatalogData({ categoryId: categoryID });
        setCatalogPageData(res);
      } catch (error) {
        console.log("Catalog API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogData();
  }, [catalogName, categoryID]);

  // Flatten all courses across all categories (deduped by _id) for All Courses & search
  const allCourses = useMemo(() => {
    const seen = new Map();
    categories.forEach((cat) => {
      (cat.course || []).forEach((c) => {
        if (c?._id && !seen.has(c._id)) {
          seen.set(c._id, {
            ...c,
            categoryName: cat.name,
            categoryId: cat._id,
          });
        }
      });
    });
    return Array.from(seen.values());
  }, [categories]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter all courses on /catalog OR when user is actively searching on a category page
  const filteredAllCourses = useMemo(() => {
    return allCourses.filter((c) => {
      const matchesCat =
        selectedFilterCat === "ALL" || c.categoryId === selectedFilterCat;
      if (!matchesCat) return false;
      if (!normalizedQuery) return true;
      return (
        c.courseName?.toLowerCase().includes(normalizedQuery) ||
        c.courseDescription?.toLowerCase().includes(normalizedQuery) ||
        c.categoryName?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [allCourses, selectedFilterCat, normalizedQuery]);

  const getNewCourses = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return (
      catalogPageData?.selectedCategory?.course?.filter((course) => {
        const createdAt = new Date(course.createdAt);
        return createdAt >= oneMonthAgo;
      }) || []
    );
  };

  const starterCourses = useMemo(() => {
    const base =
      activeTab === "popular"
        ? catalogPageData?.selectedCategory?.course || []
        : getNewCourses();
    if (!normalizedQuery) return base;
    return base.filter(
      (c) =>
        c.courseName?.toLowerCase().includes(normalizedQuery) ||
        c.courseDescription?.toLowerCase().includes(normalizedQuery)
    );
  }, [activeTab, catalogPageData, normalizedQuery]);

  return (
    <div className="bg-[#020617] text-[#F1F2FF] min-h-screen flex flex-col">
      {/* ================= HERO & SEARCH BAR ================= */}
      <section className="bg-gradient-to-b from-[#0f172a] to-[#020617] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-xs text-slate-400 tracking-wide">
            <Link to="/" className="hover:text-amber-300 transition">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/catalog" className="hover:text-amber-300 transition">
              Catalog
            </Link>
            {catalogName && (
              <>
                {" / "}
                <span className="text-amber-400 capitalize">{catalogName}</span>
              </>
            )}
          </p>

          <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {catalogName
                  ? catalogPageData?.selectedCategory?.name || catalogName
                  : "Explore All Courses"}
              </h1>
              <p className="text-slate-400 mt-2.5 max-w-2xl leading-relaxed text-sm sm:text-base">
                {catalogName
                  ? catalogPageData?.selectedCategory?.description ||
                    "Curated courses with AI-generated study notes and practice quizzes."
                  : "Browse our full library of expert-led courses with interactive AI study notes, conceptual quizzes, and live sessions."}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by title or topic..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0b1220] border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/15 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Navigation Pills */}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedFilterCat("ALL");
                if (catalogName) navigate("/catalog");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                !catalogName && selectedFilterCat === "ALL"
                  ? "bg-amber-400 text-slate-950 border-amber-400"
                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              All Courses ({allCourses.length})
            </button>

            {categories.map((cat) => {
              const isSelected = catalogName
                ? catalogName.toLowerCase() === cat.name.toLowerCase() ||
                  catalogName.toLowerCase() ===
                    cat.name.split(" ").join("-").toLowerCase()
                : selectedFilterCat === cat._id;

              return (
                <button
                  key={cat._id}
                  onClick={() => {
                    if (catalogName) {
                      navigate(`/catalog/${cat.name}`);
                    } else {
                      setSelectedFilterCat(cat._id);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 border-amber-400"
                      : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {cat.name} ({cat.course?.length || 0})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ALL COURSES DIRECTORY VIEW (/catalog) ================= */}
      {!catalogName ? (
        <section className="max-w-7xl mx-auto w-full px-6 py-14 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-semibold text-white">
                {normalizedQuery
                  ? `Search Results (${filteredAllCourses.length})`
                  : selectedFilterCat === "ALL"
                    ? `All Available Courses (${filteredAllCourses.length})`
                    : `${categories.find((c) => c._id === selectedFilterCat)?.name || "Courses"} (${filteredAllCourses.length})`}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <CatalogSpinner />
            </div>
          ) : filteredAllCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllCourses.map((course, index) => (
                <Course_Card
                  key={course._id || index}
                  course={course}
                  heihgt="h-[200px]"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#0f172a]/50 py-16 px-6 text-center">
              <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">No matching courses found</p>
              <p className="text-slate-500 text-sm mt-1">
                Try clearing your search or choosing another category above.
              </p>
              {(searchQuery || selectedFilterCat !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilterCat("ALL");
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 text-xs font-semibold hover:bg-amber-300 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ================= CATEGORY COURSES VIEW (/catalog/:catalogName) ================= */}
          <section className="max-w-7xl mx-auto w-full px-6 py-14">
            <h2 className="text-2xl font-semibold mb-6">
              {normalizedQuery
                ? `Matching "${searchQuery}" in ${catalogPageData?.selectedCategory?.name || catalogName}`
                : "Courses to get you started"}
            </h2>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-[#2C333F] mb-8">
              <button
                onClick={() => setActiveTab("popular")}
                className={`pb-3 font-medium transition border-b-2 cursor-pointer ${
                  activeTab === "popular"
                    ? "text-yellow-400 border-yellow-400"
                    : "text-[#AFB2BF] border-transparent hover:text-white"
                }`}
              >
                Most Popular
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`pb-3 font-medium transition border-b-2 cursor-pointer ${
                  activeTab === "new"
                    ? "text-yellow-400 border-yellow-400"
                    : "text-[#AFB2BF] border-transparent hover:text-white"
                }`}
              >
                New
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <CatalogSpinner />
              </div>
            ) : starterCourses.length > 0 ? (
              <div className="relative overflow-hidden">
                <CourseSlider Courses={starterCourses} />
              </div>
            ) : (
              <p className="text-center text-[#AFB2BF] py-10">
                {normalizedQuery
                  ? "No courses matched your search in this category."
                  : activeTab === "new"
                    ? "No new courses added in the last month"
                    : "No courses found"}
              </p>
            )}
          </section>

          {/* ================= TOP COURSES ================= */}
          <section className="max-w-7xl mx-auto w-full px-6 py-14 border-t border-[#1F2430]">
            <h2 className="text-2xl font-semibold mb-8">
              Top courses in{" "}
              <span className="text-yellow-400 capitalize">
                {catalogPageData?.selectedCategory?.name}
              </span>
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <CatalogSpinner />
              </div>
            ) : catalogPageData?.mostSellingCourses?.length > 0 ? (
              <div className="relative overflow-hidden">
                <CourseSlider Courses={catalogPageData?.mostSellingCourses} />
              </div>
            ) : (
              <p className="text-center text-[#AFB2BF] py-10">No courses found</p>
            )}
          </section>

          {/* ================= FREQUENTLY BOUGHT ================= */}
          <section className="max-w-7xl mx-auto w-full px-6 py-14 border-t border-[#1F2430]">
            <h2 className="text-2xl font-semibold mb-10">
              Frequently bought together
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <CatalogSpinner />
              </div>
            ) : catalogPageData?.mostSellingCourses?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {catalogPageData?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, index) => (
                    <Course_Card
                      key={course._id || index}
                      course={course}
                      heihgt="h-[220px]"
                    />
                  ))}
              </div>
            ) : (
              <p className="text-center text-[#AFB2BF] py-10">No courses found</p>
            )}
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Catalog;
