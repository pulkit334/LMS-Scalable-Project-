import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses }) => {
  return (
    <>
      {Courses?.length > 0 ? (
        <Swiper
          modules={[FreeMode, Pagination, Autoplay]}
          freeMode
          pagination={{ clickable: true }}
          spaceBetween={24}
          loop={Courses.length > 3}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {Courses.map((course) => (
            <SwiperSlide key={course._id}>
              <Course_Card course={course} heihgt="h-[220px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-[#AFB2BF]">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;
