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
  }, [value, role]);

  const filteredUsers = useMemo(() => {
    if (role === "all") return adminuser;
    return adminuser.filter((c) => c?.accountType === role);
  }, [role, adminuser]);

  const ImgApi = () => `https://picsum.photos/400/300?random=${Date.now()}`;

  return (
    <div
      className="w-full min-h-screen p-6"
      style={{ background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .um-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .um-search {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .um-search:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .um-select {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #0f172a;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 10px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .um-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

        .um-th {
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: #94a3b8; padding: 12px 20px;
          background: #f8fafc; border-bottom: 1px solid #e2e8f0;
        }

        .um-tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }
        .um-tr:hover { background: #f8fafc; }
        .um-tr:last-child { border-bottom: none; }
        .um-td { padding: 14px 20px; font-size: 13px; color: #334155; }

        .badge-active {
          display: inline-flex; align-items: center; gap: 5px;
          background: #ecfdf5; color: #10b981; border: 1px solid #a7f3d0;
          font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px;
        }

        .role-badge {
          display: inline-flex; font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 99px;
          background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe;
          text-transform: capitalize;
        }

        .btn-edit {
          font-size: 12px; font-weight: 600;
          padding: 5px 14px; border-radius: 7px;
          border: 1px solid #e2e8f0;
          background: #f8fafc; color: #64748b;
          transition: all 0.15s ease; cursor: pointer;
        }
        .btn-edit:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }

        .pg-btn {
          padding: 6px 12px; border-radius: 7px; font-size: 13px;
          border: 1px solid #e2e8f0; background: #fff; color: #64748b;
          transition: all 0.15s ease; cursor: pointer;
        }
        .pg-btn:hover:not(:disabled) { background: #f1f5f9; }
        .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pg-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; font-weight: 600; }
      `}</style>

      {/* Page header */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#94a3b8" }}>Admin</p>
        <h1 className="text-xl font-bold" style={{ color: "#0f172a", letterSpacing: "-0.01em" }}>User Management</h1>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="um-search w-80 px-4 py-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#94a3b8" }} />
          <input
            type="text"
            name="search"
            placeholder="Search users..."
            onChange={(e) => setvalue(e.target.value)}
            value={value}
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: "#0f172a" }}
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="um-select"
        >
          <option value="all">All Roles</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="um-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="um-th text-left">User</th>
                <th className="um-th text-center">Role</th>
                <th className="um-th text-center">Email</th>
                <th className="um-th text-center">Status</th>
                <th className="um-th text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="um-td text-center" style={{ padding: "40px", color: "#94a3b8" }}>
                    <Result loading={true} text="Loading Wait..." />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="um-td text-center" style={{ padding: "40px", color: "#94a3b8" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((inst) => (
                  <tr key={inst._id} className="um-tr">
                    <td className="um-td">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.image?.url || ImgApi()}
                          className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                          style={{ border: "1.5px solid #e2e8f0" }}
                        />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                            {inst.firstName} {inst.lastName}
                          </p>
                          <p className="text-xs" style={{ color: "#94a3b8" }}>{inst.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="um-td text-center">
                      <span className="role-badge">{inst.accountType || "—"}</span>
                    </td>

                    <td className="um-td text-center" style={{ color: "#64748b" }}>
                      {inst.email}
                    </td>

                    <td className="um-td text-center">
                      <span className="badge-active">
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                        {inst.status || "Active"}
                      </span>
                    </td>

                    <td className="um-td text-center">
                      <button className="btn-edit">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="h-16 flex items-center justify-center gap-1.5">
        {!hasPrevPage ? (
          <button disabled className="pg-btn">← Prev</button>
        ) : (
          <button className="pg-btn" onClick={() => goToPage(currentPage - 1)}>← Prev</button>
        )}

        {getPages().map((c, idx) =>
          c === "..." ? (
            <span key={idx} className="px-2 text-sm" style={{ color: "#94a3b8" }}>...</span>
          ) : (
            <button
              key={c}
              onClick={() => goToPage(c)}
              className={`pg-btn ${c === currentPage ? "active" : ""}`}
            >
              {c}
            </button>
          ),
        )}

        {hasNextPage && (
          <button onClick={() => goToPage(currentPage + 1)} className="pg-btn">
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default Admin_usermangemt;
