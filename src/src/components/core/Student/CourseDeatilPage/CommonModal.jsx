const WhatYouWillLearn = ({ text }) => {
  const points = text?.split("\n") || [];

  return (
    <div className="bg-[#020617] p-5 rounded-lg border border-gray-800">
      <h2 className="text-lg font-semibold mb-3">
        What you'll learn
      </h2>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
        {points.map((item, i) => (
          <li key={i} className="flex gap-2">
            ✔ <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatYouWillLearn;
  