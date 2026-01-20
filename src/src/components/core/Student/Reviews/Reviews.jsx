/* eslint-disable no-unused-vars */
import ReactStar from "react-rating-stars-component";

const Reviews = ({ reviews }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Reviews from other learners
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.data?.map((r, i) => (
          <div
            key={i}
            className="bg-[#020617] p-6 rounded-xl border border-gray-800"
          >
            {/* HEADER */}
           <div className="flex gap-6 overflow-x-auto pb-2">

              <img
                src={
                  r.user?.image?.url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${r.user?.firstName}`
                }
                alt={r.user?.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold leading-tight">
                  {r.user?.firstName} {r.user?.lastName}
                </p>

                <ReactStar
                  count={5}
                  value={r.rating}
                  size={16}
                  edit={false}
                  activeColor="#ffd700"
                />
              </div>
            </div>

            {/* REVIEW TEXT */}
            <p className="text-sm text-gray-300 leading-relaxed">
              {r.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
