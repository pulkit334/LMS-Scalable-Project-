import React from "react";
import { useParams } from "react-router-dom";

const Catalog = () => {
  const { catalogName } = useParams();

  return (
    <div className="text-black text-xl">
      <span className="font-bold">{catalogName}</span>
    </div>
  );
};

export default Catalog;
