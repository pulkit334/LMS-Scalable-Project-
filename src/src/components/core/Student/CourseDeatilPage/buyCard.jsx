const BuyCard = ({ course }) => {
  return (
    <div className="sticky top-20 w-[380px] bg-[#020617] rounded-lg shadow-2xl overflow-hidden">

      {/* IMAGE */}
      <img
        src={course.thumbnail}
        alt=""
        className="w-full h-[220px] object-cover"
      />

      <div className="px-6 pt-5 pb-6">

        {/* PRICE */}
        <h2 className="text-[28px] font-bold mb-3">
          ₹ {course.price}
        </h2>

        {/* BUTTONS */}
        <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-[10px] rounded font-semibold mb-2">
          Add to Cart
        </button>

        <button className="w-full bg-[#111827] border border-gray-700 py-[10px] rounded font-semibold">
          Buy now
        </button>

        <p className="text-[11px] text-center mt-2 text-gray-400">
          30-Day Money-Back Guarantee
        </p>

        {/* INCLUDES */}
        <div className="mt-5">
          <h4 className="text-sm font-semibold mb-2">
            This course includes:
          </h4>

          <ul className="text-sm text-gray-300 space-y-[6px] leading-tight">
            <li className="flex gap-2">✔ 8 hours on-demand video</li>
            <li className="flex gap-2">✔ Full lifetime access</li>
            <li className="flex gap-2">✔ Access on mobile and TV</li>
            <li className="flex gap-2">✔ Certificate of completion</li>
          </ul>
        </div>

        <p className="text-center text-sm text-yellow-400 mt-4 cursor-pointer">
          Share
        </p>
      </div>
    </div>
  );
};

export default BuyCard;
