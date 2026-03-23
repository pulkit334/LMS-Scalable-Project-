/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/core/Homepage/footer";
import getCatalogData from "../services/pageComponentdata";
import { Course, GetCategorires } from "../services/auth";
import Course_Card from "../components/core/catalog/Course_Card";
import CourseSlider from "../components/core/catalog/CourseSlider";
import CatalogSpinner from "../utils/catalogSpinner";

const Catalog = () => {
  const { catalogName } = useParams();

  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryID, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("popular"); // 👈 tab state

  // Fetch all categories & match slug
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await GetCategorires();
      const matchedCategory = res?.find(
        (ct) =>
          ct.name.split(" ").join("-").toLowerCase() ===
          catalogName.toLowerCase()
      );
      setCategoryId(matchedCategory?._id);
    };
    fetchCategories();
  }, [catalogName]);

  // Fetch catalog data
  useEffect(() => {
    if (!categoryID) return;
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
  }, [categoryID]);

  // 👇 Filter: courses created within last 1 month
  const getNewCourses = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return catalogPageData?.selectedCategory?.course?.filter((course) => {
      const createdAt = new Date(course.createdAt);
      return createdAt >= oneMonthAgo;
    }) || [];
  };

  const starterCourses =
    activeTab === "popular"
      ? catalogPageData?.selectedCategory?.course || []
      : getNewCourses();

  return (
    <div className="bg-[#000814] text-[#F1F2FF] min-h-screen">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-[#161D29] to-[#000814] border-b border-[#2C333F]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-sm text-[#AFB2BF] tracking-wide">
            Home / Catalog /{" "}
            <span className="text-yellow-400 capitalize">{catalogName}</span>
          </p>
          <h1 className="text-4xl font-bold mt-4">
            {catalogPageData?.selectedCategory?.name}
          </h1>
          <p className="text-[#AFB2BF] mt-3 max-w-3xl leading-relaxed">
            {catalogPageData?.selectedCategory?.description}
          </p>
        </div>
      </section>

      {/* ================= STARTER COURSES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold mb-6">
          Courses to get you started
        </h2>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#2C333F] mb-8">
          <button
            onClick={() => setActiveTab("popular")}
            className={`pb-3 font-medium transition border-b-2 ${
              activeTab === "popular"
                ? "text-yellow-400 border-yellow-400"
                : "text-[#AFB2BF] border-transparent hover:text-white"
            }`}
          >
            Most Popular
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`pb-3 font-medium transition border-b-2 ${
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
            {activeTab === "new"
              ? "No new courses added in the last month"
              : "No courses found"}
          </p>
        )}
      </section>

      {/* ================= TOP COURSES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1F2430]">
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
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1F2430]">
        <h2 className="text-2xl font-semibold mb-10">
          Frequently bought together
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <CatalogSpinner />
          </div>
        ) : catalogPageData?.mostSellingCourses?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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

      <Footer />
    </div>
  );
};

export default Catalog;