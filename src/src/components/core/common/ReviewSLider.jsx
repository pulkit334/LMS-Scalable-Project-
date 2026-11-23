import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeReviews } from "../../../Slices/RatingSlice";
import Result from "../../../utils/Spinnre";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import { useParams } from "react-router-dom";

const ReviewSlider = () => {
  const dispatch = useDispatch();
  const { loading, reviews = [] } = useSelector(
    (state) => state.ratingSlice || {},
  );
const [lgreview, setlgreview] = useState(false);
  useEffect(() => {
    if (reviews.length === 0) {
      dispatch(fetchHomeReviews());
    }
  }, [dispatch, reviews.length]);

  if (loading) {
    return <Result loading={loading} text="Loading reviews..." />; 
  }

  if (reviews.length === 0)
    return (
      <div className="flex p-30 items-center justify-center">
        <h1 className="text-3xl text-sky-400 ">
          No Course Review Found Be First To Engage With Us
        </h1>
      </div>
    );
return (
    <div className="w-full max-w-6xl mx-auto py-16">
      <Swiper
        className="swiper-wrapper"
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={20}
        loop={true}
        freeMode={true}
        freeModeMomentum={false}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: "auto",
            spaceBetween: 16,
          },
          640: {
            slidesPerView: "auto",
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: "auto",
            spaceBetween: 24,
          },
        }}
        speed={6000}
        pagination={{ clickable: true }}
        style={{
          "--swiper-pagination-color": "#fffefd",
          "--swiper-pagination-bullet-inactive-color": "#999999",
        }}
      >
        {reviews.map((item) => {
          const { user, rating, review, Course } = item;

          const initials =
            user?.firstName?.[0]?.toUpperCase() +
            user?.lastName?.[0]?.toUpperCase();

          return (
            <SwiperSlide key={item._id} className="!w-auto flex justify-center">
              {/* CARD */}
              <div
                className="
  w-[320px] h-55
  bg-linear-to-b from-[#161D29] to-[#020617]
  rounded-xl p-5
  flex flex-col justify-between
  shadow-lg
"
              >
                {/* USER */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold">
                    {Course?.thumbnail ? (
                      <img
                        src={Course.thumbnail}
                        alt="course"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold">{initials}</span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {Course?.courseName}
                    </p>
                  </div>
                </div>

                {/* REVIEW */}
                <div className="mt-3">
                  <p className="text-sm text-gray-300 line-clamp-3">{review}</p>

                  {!lgreview && review.length > 120 && (
                    <button
                      onClick={() => setlgreview(true)}
                      className="mt-1 text-xs text-blue-400 hover:underline"
                    >
                      Read more
                    </button>
                  )}
                  {lgreview && (
                    <p
                      className={`text-sm  text-gray-300 ${
                        !lgreview && "line-clamp-1"
                      }`}
                    >
                      {review}
                    </p>
                  )}
                </div>

                {/* RATING */}
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">{rating}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar
                        key={i}
                        className={
                          i <= rating ? "text-yellow-400" : "text-gray-500"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
