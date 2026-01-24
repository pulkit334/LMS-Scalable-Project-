/* eslint-disable no-unused-vars */
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminInsights = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-red-500">Hello</h1>
    </div>
  );
};

export default AdminInsights;
