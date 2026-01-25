/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/core/Homepage/footer";
import getCatalogData from "../services/pageComponentdata";
import { Course, GetCategorires } from "../services/auth";
import Course_Card from "../components/core/catalog/Course_Card";
import CourseSlider from "../components/core/catalog/CourseSlider";

const Catalog = () => {
  const { catalogName } = useParams();

  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryID, setCategoryId] = useState("");

  // Fetch all categories & match slug
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await GetCategorires();
      const matchedCategory = res?.find(
        (ct) =>
          ct.name.split(" ").join("-").toLowerCase() ===
          catalogName.toLowerCase(),
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
        const res = await getCatalogData({ categoryId: categoryID });
        setCatalogPageData(res);
      } catch (error) {
        console.log("Catalog API error:", error);
      }
    };

    fetchCatalogData();
  }, [categoryID]);
  console.log("The Data in catalog", catalogPageData?.mostSellingCourses);
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
          <button className="pb-3 text-yellow-400 border-b-2 border-yellow-400 font-medium">
            Most Popular
          </button>
          <button className="pb-3 text-[#AFB2BF] hover:text-white transition">
            New
          </button>
        </div>

        {/*  FIXED SLIDER CONTAINER */}
        <div className="relative  overflow-hidden">
          <CourseSlider Courses={catalogPageData?.selectedCategory?.course} />
        </div>
      </section>

      {/* ================= TOP COURSES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1F2430]">
        <h2 className="text-2xl font-semibold mb-8">
          Top courses in{" "}
          <span className="text-yellow-400 capitalize">
            {catalogPageData?.selectedCategory?.name}
          </span>
        </h2>

        <div className="relative overflow-hidden">
          <CourseSlider Courses={catalogPageData?.mostSellingCourses} />
        </div>
      </section>

      {/* ================= FREQUENTLY BOUGHT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1F2430]">
        <h2 className="text-2xl font-semibold mb-10">
          Frequently bought together
        </h2>

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
      </section>

      <Footer />
    </div>
  );
};

export default Catalog;
