const CatalogSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      {/* Spinning Circle */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#2C333F] border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
      
      {/* Loading Text */}
      <p className="text-[#AFB2BF] mt-4 text-sm animate-pulse">
        Loading courses...
      </p>
    </div>
  );
};

export default CatalogSpinner;