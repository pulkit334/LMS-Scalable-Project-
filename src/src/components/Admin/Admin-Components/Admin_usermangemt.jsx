/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInsight } from "../../../Slices/Admin/ownerSlice";
import Result from "../../../utils/Spinnre";

const Admin_usermangemt = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { UserData, loading } = useSelector((state) => state.admin);

  const adminuser = UserData ?? [];

  useEffect(() => {
    if (!adminuser.length) {
      dispatch(fetchUserInsight());
    }
  }, [dispatch, adminuser.length]);

  const [role, setRole] = useState("all");
const filteredUsers = useMemo(() => {
  if (role === "all") return adminuser;
  return adminuser.filter((c) => c?.accountType === role);
}, [role]);

  const ImgApi = () => `https://picsum.photos/400/300?random=${Date.now()}`;

  return (
    <div className="flex flex-col w-full gap-5 ">
      <div className=" w-full  gap-5">
        <div className="flex justify-end relative top-5 mx-10">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-28 h-8 px-2 rounded-md border font-semibold  border-gray-300 text-white bg-[#0f172a] text-sm text-gray-800  cursor-pointer focus:outline-none ring-2 ring-indigo-500 text-center"
          >
            <option value="all">All</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      <div className="min-h-screen  w-full text-white p-6 bg-[#070b16]">
        <div className="w-full overflow-x-auto ring-indigo-500 ring-1  rounded-xl border border-white/10 bg-[#0f172a]">
          <table className="w-full focus:outline-none  table-auto border-collapse">
            <thead className="border-b border-white/10">
              <tr className="text-gray-300 text-sm">
                <th className="text-left px-6 py-4">User</th>
                <th className="text-center px-6 py-4">Courses</th>
                <th className="text-center px-6 py-4">Email</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    <Result loading={true} text="Loading Wait..." />
                  </td>
                </tr>
              ) : filteredUsers .length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No instructors found
                  </td>
                </tr>
              ) : (
                filteredUsers .map((inst) => (
                  <tr key={inst._id} className="border-b border-white/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.image?.url || ImgApi()}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p>
                            {inst.firstName} {inst.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{inst.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="text-center">{inst.accountType || 0}</td>
                    <td className="text-center">{inst.email}</td>
                    <td className="text-center text-green-400">
                      {inst.status || "Error"}
                    </td>
                    <td className="text-center">
                      <button className="px-3 py-1 bg-white/10 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin_usermangemt;
