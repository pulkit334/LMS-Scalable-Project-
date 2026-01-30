/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInsight } from "../../../Slices/Admin/ownerSlice";
import Result from "../../../utils/Spinnre";
import { Search } from "lucide-react";

const Admin_usermangemt = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { UserData, loading } = useSelector((state) => state.admin);
  const [value, setvalue] = useState("");
  const adminuser = UserData?.AllData ?? [];

  //  Pagination Logic States //
  console.log(
    "the userData is insdie the admin user iwll be ",
    UserData?.pagination,
  );
  const hasPrevPage = UserData?.pagination?.hasPrevPage || false;
  const hasNextPage = UserData?.pagination?.hasNextPage || false;
  const currentPage = UserData?.pagination?.page || 1;
  const totalPage = UserData?.pagination?.pages || 1;

  // Current Pages
  const getPages = () => {
    const Pages = [];
    const chunkSize = 10;
    const currentChunk = Math.floor((currentPage - 1) / chunkSize);
    const StartPage = currentChunk * chunkSize + 1;
    const Endpage = Math.min((StartPage + currentChunk - 1, totalPage));

    for (let i = StartPage; i <= totalPage; i++) {
      Pages.push(i);
    }
    if (Endpage < totalPage) {
      Pages.push("...");
      Pages.push(totalPage);
    }
    return Pages;
  };

const goToPage = (page) => {
  if (page < 1 || page > totalPage) return;

  if (value.trim().length >= 2) {
    dispatch(fetchUserInsight({ page, limit: 5, search: value.trim() }));
  } else {
    dispatch(fetchUserInsight({ page, limit: 5 }));
  }
};

  const [role, setRole] = useState("all");
useEffect(() => {
  const trimmed = value.trim();

  
  if (trimmed.length === 0) {
    dispatch(fetchUserInsight({ page: 1, limit: 5 }));
    return;
  }

  // Prevent  spam serach 
  if (trimmed.length < 2) return;

  dispatch(fetchUserInsight({ page: 1, limit: 5, search: trimmed }));
}, [value,role]);



  const filteredUsers = useMemo(() => {
    if (role === "all") return adminuser;
    return adminuser.filter((c) => c?.accountType === role);
  }, [role,adminuser  ]);

  const ImgApi = () => `https://picsum.photos/400/300?random=${Date.now()}`;

  return (
    <div className="flex flex-col w-full gap-5 ">
      <div className=" w-full  flex justify-between gap-5">
        <div className="w-80 px-4 py-3  relative flex items-center top-4 left-2  gap-2 rounded-xl bg-[#0f172a] focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            name="search"
            placeholder="Search courses..."
            onChange={(e) => setvalue(e.target.value)}
            value = {value}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>

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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No instructors found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((inst) => (
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
        {/* Pagination */}
        <div className="h-16 m-2  flex items-center justify-center gap-1 text-gray-400">
          {!hasPrevPage ? (
            <button
              disabled
              className="px-3 py-1 hover:bg-gray-700 rounded"
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev Page
            </button>
          ) : (
            <button
              className="px-3 py-1 hover:bg-gray-700 rounded"
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev Page
            </button>
          )}

          {getPages().map((c, idx) =>
            c === "..." ? (
              <span key={idx} className="px-3">
                ...
              </span>
            ) : (
              <button
                key={c}
                onClick={() => goToPage(c)}
                className={`px-4 py-2  rounded-md ${
                  c === currentPage
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                {c}
              </button>
            ),
          )}

          {hasNextPage && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 hover:bg-gray-700 rounded"
            >
              Next Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin_usermangemt;
