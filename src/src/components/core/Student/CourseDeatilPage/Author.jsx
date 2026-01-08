const Author = ({ instructor }) => {
  if (!instructor) return null;

  return (
    <div className="bg-[#020617] p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Instructor</h3>
      <p>{instructor.firstName} {instructor.lastName}</p>
      <p className="text-sm text-gray-400">{instructor.email}</p>
    </div>
  );
};

export default Author;
