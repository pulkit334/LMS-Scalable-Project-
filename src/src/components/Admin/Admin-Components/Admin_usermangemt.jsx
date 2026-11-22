/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserInsight,
  fetchUserState,
} from "../../../Slices/Admin/ownerSlice";
import Result from "../../../utils/Spinnre";
import toast from "react-hot-toast";
import {
  Search,
  X,
  Download,
  ShieldBan,
  ShieldCheck,
  Eye,
} from "lucide-react";

const Admin_usermangemt = () => {
  const dispatch = useDispatch();

  const { UserData, loading, actionLoadingId } = useSelector(
    (state) => state.admin
  );
  const [value, setvalue] = useState("");
  const [role, setRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const adminuser = UserData?.AllData ?? [];
  const hasPrevPage = UserData?.pagination?.hasPrevPage || false;
  const hasNextPage = UserData?.pagination?.hasNextPage || false;
  const currentPage = UserData?.pagination?.page || 1;
  const totalPage = UserData?.pagination?.pages || 1;

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
    if (page < 1 || page > totalPage) return;
    if (value.trim().length >= 2) {
      dispatch(fetchUserInsight({ page, limit: 8, search: value.trim() }));
    } else {
      dispatch(fetchUserInsight({ page, limit: 8 }));
    }
  };

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      dispatch(fetchUserInsight({ page: 1, limit: 8 }));
      return;
    }
    if (trimmed.length < 2) return;
    dispatch(fetchUserInsight({ page: 1, limit: 8, search: trimmed }));
  }, [value, dispatch]);

  const filteredUsers = useMemo(() => {
    return adminuser.filter((u) => {
      const roleMatch =
        role === "all" ||
        u?.accountType?.toLowerCase() === role.toLowerCase();
      const userStatus = (u?.status || "Active").toLowerCase();
      const statusMatch =
        statusFilter === "all" || userStatus === statusFilter.toLowerCase();
      return roleMatch && statusMatch;
    });
  }, [role, statusFilter, adminuser]);

  const handleToggleUserStatus = async (user) => {
    const nextStatus = user?.status === "Blocked" ? "Active" : "Blocked";
    try {
      await dispatch(
        fetchUserState({ id: user._id, status: nextStatus })
      ).unwrap();
      toast.success(`User marked as ${nextStatus}`);
      dispatch(
        fetchUserInsight({
          page: currentPage,
          limit: 8,
          ...(value.trim().length >= 2 ? { search: value.trim() } : {}),
        })
      );
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handleExportUsers = () => {
    const header = ["Name", "Email", "Role", "Status"];
    const rows = filteredUsers.map((u) => [
      `"${u.firstName || ""} ${u.lastName || ""}"`,
      `"${u.email || ""}"`,
      u.accountType || "",
      u.status || "Active",
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-users-page-${currentPage}.csv`;
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
            Directory
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-0.5">
            User Management
          </h1>
        </div>

        <button
          onClick={handleExportUsers}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#11151f] hover:bg-white/[0.06] border border-white/[0.08] text-slate-200 text-xs font-medium transition cursor-pointer w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            name="search"
            placeholder="Search by name or email..."
            onChange={(e) => setvalue(e.target.value)}
            value={value}
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#11151f] border border-white/[0.08] text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          {value && (
            <button
              onClick={() => setvalue("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg bg-[#11151f] border border-white/[0.08] px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg bg-[#11151f] border border-white/[0.08] px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl bg-[#11151f] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0d1017]">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                  User
                </th>
                <th className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-5 py-3.5">
                  Role
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
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center text-slate-400">
                    <Result loading={true} text="Loading users..." />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isBlocked = u.status === "Blocked";
                  const avatar =
                    u.image?.url ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
                      u.firstName || "U"
                    )}`;
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-white/[0.025] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={u.firstName}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15 shrink-0"
                          />
                          <div>
                            <p className="font-medium text-sm text-slate-100">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex text-[11px] font-medium capitalize px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-300">
                          {u.accountType || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isBlocked
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/25"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBlocked ? "bg-rose-400" : "bg-emerald-400"
                            }`}
                          />
                          {u.status || "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          {u.accountType?.toLowerCase() !== "admin" && (
                            <button
                              disabled={actionLoadingId === u._id}
                              onClick={() => handleToggleUserStatus(u)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer disabled:opacity-50 ${
                                isBlocked
                                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25 text-emerald-400"
                                  : "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25 text-rose-400"
                              }`}
                            >
                              {isBlocked ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <ShieldBan className="w-3.5 h-3.5" />
                                  Block
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#11151f] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">User Profile</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.08]">
              <img
                src={
                  selectedUser.image?.url ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
                    selectedUser.firstName || "U"
                  )}`
                }
                alt={selectedUser.firstName}
                className="w-14 h-14 rounded-full object-cover ring-1 ring-white/15"
              />
              <div>
                <p className="font-semibold text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Role</span>
                <span className="text-slate-100 font-medium capitalize">
                  {selectedUser.accountType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-slate-100 font-medium">
                  {selectedUser.status || "Active"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deletion Requested</span>
                <span className="text-slate-100 font-medium">
                  {selectedUser.isdeleted ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID</span>
                <span className="font-mono text-slate-300">{selectedUser._id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_usermangemt;
