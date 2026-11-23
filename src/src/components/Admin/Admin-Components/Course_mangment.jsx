/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchcategoriesTrend,
  fetchCourseInsight,
} from "../../../Slices/Admin/ownerSlice";
import Result from "../../../utils/Spinnre";
import CourseTrendLineChart from "../../../utils/LIneChart";
import {
  DeleteAdminCourse,
  ToggleAdminCourseStatus,
  CreateAdminCategory,
} from "../../../services/Admin/adminapi's";
import toast from "react-hot-toast";
import {
  Search,
  X,
  Trash2,
  Eye,
  EyeOff,
  Download,
  FolderPlus,
} from "lucide-react";

const Course_mangment = () => {
  const dispatch = useDispatch();

  const { CourseData, loading, error, TopCategories } = useSelector(
    (state) => state.admin
  );
  const CourseTableData = CourseData?.data?.CourseData || [];
  const paginationdata = CourseData?.data?.pagination;
  const totalPage = paginationdata?.pages || 1;
  const hasNextPage = paginationdata?.hasNextPage || false;
  const hasPrevPage = paginationdata?.hasPrevpage || false;
  const currentPage = paginationdata?.page || 1;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    dispatch(fetchCourseInsight({ page: 1, limit: 8 }));
    dispatch(fetchcategoriesTrend());
  }, [dispatch]);

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return CourseTableData.filter((c) => {
      const matchesStatus =
        statusFilter === "ALL" || c?.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        c?.courseName?.toLowerCase().includes(q) ||
        c?.category?.name?.toLowerCase().includes(q)
      );
    });
  }, [CourseTableData, searchTerm, statusFilter]);

  const getPages = () => {
    const pages = [];
    const chunkSize = 8;
    const currentChunk = Math.floor((currentPage - 1) / chunkSize);
    const startPage = currentChunk * chunkSize + 1;
    const endPage = Math.min(startPage + chunkSize - 1, totalPage);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPage) {
      pages.push("...");
      pages.push(totalPage);
    }
    return pages;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPage || page === currentPage) return;
    dispatch(fetchCourseInsight({ page, limit: 8 }));
  };

  const handleToggleStatus = async (course) => {
    const nextStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setBusyId(course._id);
    try {
      const res = await ToggleAdminCourseStatus(course._id, nextStatus);
      if (res?.success) {
        toast.success(`Course moved to ${nextStatus}`);
        dispatch(fetchCourseInsight({ page: currentPage, limit: 8 }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await DeleteAdminCourse(deleteTarget._id);
      if (res?.success) {
        toast.success(res.message || "Course deleted");
        setDeleteTarget(null);
        dispatch(fetchCourseInsight({ page: currentPage, limit: 8 }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim() || !catDesc.trim()) {
      toast.error("Name and description are required");
      return;
    }
    setCreatingCat(true);
    try {
      const res = await CreateAdminCategory({
        name: catName.trim(),
        description: catDesc.trim(),
      });
      if (res?.success) {
        toast.success("Category created");
        setCatName("");
        setCatDesc("");
        setCatModalOpen(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category");
    } finally {
      setCreatingCat(false);
    }
  };

  const handleExportCSV = () => {
    const header = ["Course Name", "Category", "Students", "Status"];
    const rows = filteredCourses.map((c) => [
      `"${String(c.courseName || "").replace(/"/g, '""')}"`,
      `"${String(c.category?.name || "Uncategorized")}"`,
      c.enrollments ?? 0,
      c.status || "DRAFT",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-courses-page-${currentPage}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Catalog Moderation
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-0.5">
            Course Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCatModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            New Category
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#11151f] hover:bg-white/[0.06] border border-white/[0.08] text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter courses on this page..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#11151f] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-[#11151f] border border-white/[0.08] p-1 w-fit">
          {["ALL", "PUBLISHED", "DRAFT"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                statusFilter === st
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st === "ALL" ? "All" : st === "PUBLISHED" ? "Published" : "Draft"}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="rounded-xl bg-[#11151f] border border-white/[0.08] overflow-hidden">
        {loading && (
          <div className="p-10 text-center text-slate-400">
            <Result loading={true} text="Loading courses..." />
          </div>
        )}

        {error && (
          <div className="p-6 text-sm text-rose-400">Failed to load courses</div>
        )}

        {!loading && filteredCourses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0d1017]">
                  <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                    Course
                  </th>
                  <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                    Category
                  </th>
                  <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                    Students
                  </th>
                  <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                    Status
                  </th>
                  <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.05]">
                {filteredCourses.map((course) => {
                  const isPub = course?.status === "PUBLISHED";
                  return (
                    <tr
                      key={course._id}
                      className="hover:bg-white/[0.025] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#090b10] border border-white/[0.08] shrink-0">
                            {course?.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.courseName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-semibold text-xs text-slate-400">
                                {course?.courseName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-slate-100 text-sm line-clamp-1">
                            {course?.courseName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex text-xs px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-300 font-medium">
                          {course?.category?.name || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center font-mono tabular-nums text-slate-200 text-sm">
                        {course.enrollments ?? 0}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isPub
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/25"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPub ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          {course?.status || "DRAFT"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={busyId === course._id}
                            onClick={() => handleToggleStatus(course)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 transition cursor-pointer disabled:opacity-50"
                          >
                            {isPub ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                Publish
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setDeleteTarget(course)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-500">
            No matching courses found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-1.5">
        <button
          disabled={!hasPrevPage}
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#11151f] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        {getPages().map((c, idx) =>
          c === "..." ? (
            <span key={idx} className="px-2 text-xs text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={c}
              onClick={() => goToPage(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                c === currentPage
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-[#11151f] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              {c}
            </button>
          )
        )}

        <button
          disabled={!hasNextPage}
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#11151f] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* TREND CHART */}
      <div className="rounded-xl bg-[#11151f] border border-white/[0.08] p-5">
        <CourseTrendLineChart data={TopCategories?.TopCoursesData} />
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#11151f] border border-white/10 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white">
              Remove Course?
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              This will permanently delete{" "}
              <span className="text-slate-200 font-medium">
                {deleteTarget.courseName}
              </span>{" "}
              along with its sections and lectures.
            </p>
            <div className="flex justify-end gap-2.5 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-semibold text-white cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#11151f] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">
                Create Course Category
              </h2>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g., Cloud & DevOps"
                  className="w-full rounded-lg bg-[#090b10] border border-white/10 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Category overview..."
                  className="w-full rounded-lg bg-[#090b10] border border-white/10 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCat}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white cursor-pointer"
                >
                  {creatingCat ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course_mangment;
