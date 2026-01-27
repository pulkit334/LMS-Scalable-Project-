/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorInsight } from "../../../Slices/Admin/ownerSlice";
import axios from "axios";
import { current } from "@reduxjs/toolkit";
import Result from "../../../utils/Spinnre"
const Instructormangment = () => {
  const dispatch = useDispatch();

  const { InstructorData, loading } = useSelector((state) => state.admin);

  const pagination = InstructorData?.data?.pagination || {};

  const totalPages = pagination.totalPages || 1;
  const page = pagination.page || 1;
  const hasNextPage = pagination.hasNextPage || false;
  const hasPrevPage = pagination.hasPrevPage || false;

  console.log("the Total Page", totalPages, page, hasNextPage, hasPrevPage);
  const ImgApi = () => `https://picsum.photos/400/300?random=${Date.now()}`;
  const [currentPage, setCurrentPage] = useState(1);

  const getPages = () => {
    const pages = [];
    const ChunkSize = 10;
    const currentChunk = Math.floor((currentPage - 1) / ChunkSize);
    const startPage = currentChunk * ChunkSize + 1;
    const endPage = Math.min(startPage + ChunkSize - 1, totalPages);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  useEffect(() => {
    dispatch(fetchInstructorInsight({ page: currentPage, limit: 5 }));
  }, [currentPage]);
  const instructors = InstructorData?.data?.instructors || [];

  return (
    <div
      className="min-h-screen w-full text-white p-6
bg-[#070b16]
bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.12),transparent_60%)]"
    >
      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-[#0f172a]">
        <table className="w-full table-auto border-collapse">
          <thead className="border-b border-white/10">
            <tr className="text-gray-300 text-sm">
              <th className="text-left px-6 py-4 font-semibold">Instructor</th>
              <th className="text-center px-6 py-4 font-semibold">Courses</th>
              <th className="text-center px-6 py-4 font-semibold">Rating</th>
              <th className="text-center px-6 py-4 font-semibold">Status</th>
              <th className="text-center px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-6 text-center text-gray-400" colSpan="5">
               <Result loading={true} text="Loading"/>
                </td>
              </tr>
            ) : instructors.length === 0 ? (
              <tr>
                <td className="px-6 py-6 text-center text-gray-400" colSpan="5">
                  No instructors found
                </td>
              </tr>
            ) : (
              instructors.map((inst) => (
                <tr
                  key={inst._id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  {/* Instructor */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={inst.image?.url ? inst.image.url : ImgApi()}
                        alt={`${inst.firstName} ${inst.lastName}`}
                        className="h-10 w-10 rounded-full object-cover bg-gray-700"
                      />
                      <div>
                        <p className="font-medium">
                          {inst.firstName} {inst.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{inst.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Courses */}
                  <td className="px-6 py-4 text-center">
                    {inst.CourseCount || 0}
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-400">★</span>{" "}
                    <span className="text-gray-200">
                      {(inst.AvgRating || 0).toFixed(1)}
                    </span>
                  </td>

                  {/* Status */}
                  <td
                    className={`px-6 py-4 text-center font-medium ${
                      inst.status === "Inactive"
                        ? "text-gray-400"
                        : "text-green-400"
                    }`}
                  >
                    {inst.status || "Actives"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button className="px-4 py-1 rounded-md bg-white/10 hover:bg-white/20 transition">
                        Edit
                      </button>
                      <button className="px-4 py-1 rounded-md bg-white/10 hover:bg-white/20 transition">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/*  Pagination */}
      <div className="h-16 m-2 flex items-center justify-center gap-1 text-gray-400">
        { (
          !hasPrevPage ?  <button disabled
            className="px-3 py-1 hover:bg-gray-700 rounded"
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev Page
          </button> :   <button
            className="px-3 py-1 hover:bg-gray-700 rounded"
            onClick={() => setCurrentPage((p) => p - 1)}
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
              onClick={() => setCurrentPage(c)}
              className={`px-4 py-2 rounded-md ${
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
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 hover:bg-gray-700 rounded"
          >
            Next Page
          </button>
        )}
      </div>

      {/*  Graph  */}
      <div className="mt-6 h-64 rounded-xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-gray-400">
        Graph Space
      </div>

      {/*  Chart  */}
      <div className="mt-6 h-64 rounded-xl bg-[#0f172a] border border-white/10 flex items-center justify-center text-gray-400">
        Chart Space
      </div>
    </div>
  );
};

export default Instructormangment;
