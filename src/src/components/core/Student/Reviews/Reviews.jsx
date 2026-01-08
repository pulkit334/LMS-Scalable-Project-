// eslint-disable-next-line react-refresh/only-export-components
const Reviews = ({ reviews }) => {
  console.log("The revises in the review components is ",reviews)
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Reviews from other learners
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {reviews?.data?.map((r, i) => (
          <div key={i} className="bg-[#020617] p-4 rounded">
            <p className="font-semibold">{r.user?.firstName}</p>
            <p className="text-sm text-gray-300 mt-2">
              {r.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews