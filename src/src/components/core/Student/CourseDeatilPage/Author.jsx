const Author = ({ instructor }) => {
  if (!instructor) return null;

  // console.log("The Instructor Data is", instructor);

  return (
    <div className="flex items-center gap-4 bg-[#020617] p-4 rounded-lg">
      
      {/* MyImage */}
      <div className="w-13 h-13 rounded-full overflow-hidden border border-gray-700">
        <img
          src={instructor?.image?.url}
          alt={`${instructor.firstName} ${instructor.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Author Info */}
      <div>
        <h3 className="text-lg font-extrabold">Author</h3>
        <p className="font-semibold">
          {instructor.firstName} {instructor.lastName}
        </p>
        <p className="text-sm text-gray-400">{instructor.email}</p>
      </div>

    </div>
  );
};

export default Author;
