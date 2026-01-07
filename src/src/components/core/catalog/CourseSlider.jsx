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
          freeMode={true}
          pagination={{ clickable: true }}
          spaceBetween={20}
          loop={Courses.length > 1}
          slidesPerView={1}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1024: {slidesPerView:3}
          }}
        >
          {Courses.map((course) => (
            <SwiperSlide key={course._id}>
              <Course_Card course={course} heihgt="h-[260px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;
