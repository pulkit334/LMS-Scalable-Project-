/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/core/Homepage/footer";
import getCatalogData from "../services/pageComponentdata";
import { GetCategorires } from "../services/auth";
import Course_Card from "../components/core/catalog/Course_Card";
import CourseSlider from "../components/core/catalog/CourseSlider";
const Catalog = () => {
  const { catalogName } = useParams();

  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryID, setCategoryId] = useState("");
  console.log("the data is ", catalogPageData);
  // Fetch all categories & match slug
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await GetCategorires();
      console.log("The Macthed categories Data is", res);
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
        const res = await getCatalogData({
          categoryId: categoryID,
        });

        setCatalogPageData(res);
      } catch (error) {
        console.log("Catalog API error:", error);
      }
    };

    fetchCatalogData();
  }, [categoryID]);

  return (
    <div className="text-black text-xl">
      <div>
        <p>
          {"Home / Catalog /"} <span>{catalogName}</span>
        </p>
        <p>{catalogPageData?.selectedCategory?.name}</p>
        <p>{catalogPageData?.selectedCategory?.description}</p>
      </div>
      {/* second part */}
      <div>
        {/* /section 1 */}

        <div>
          {/* //pending stylin part set flag active part  */}
          <div>Courses To Get You Started</div>
          <div className="flex gap-x-4">
            <p>Most Popular</p>
            <p>New </p>
          </div>
          <div>
            <CourseSlider Courses={catalogPageData?.selectedCategory?.course} />
          </div>
        </div>
        {/* section2 */}
        <div>
          <p>Top Courses in {catalogPageData?.selectedCategory?.name}</p>
          <div>
            <CourseSlider
              Courses={catalogPageData?.differentCategories?.course}
            />
          </div>
        </div>
        {/* sectionn 3 */}
        <div>
          <div>Frequntly Brought Together</div>
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {catalogPageData?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, index) => (
                  <Course_Card
                    key={course._id || index}
                    course={course}
                    index={index}
                    heihgt={"h-[400px]"}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;
