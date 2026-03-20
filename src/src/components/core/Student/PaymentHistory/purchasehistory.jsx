import React, { useEffect, useMemo, useState } from "react";
import { GetPaymentHistory } from "../../../../services/payment"; //
import Result from "../../../../utils/Spinnre";

const badgeStyle = (status) => {
  if (status === "success")
    return "bg-green-500/10 text-green-400 border border-green-500/30";
  if (status === "pending")
    return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
  if (status === "failed")
    return "bg-red-500/10 text-red-400 border border-red-500/30";
  return "bg-white/10 text-white border border-white/20";
};
// const money = (n) => `₹${Number(n || 0)}`;

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
if(history.length==0)
    <Result loading={true} text="Loading"/>
    setErr("");

    try {
      const res = await GetPaymentHistory();

      const list = Array.isArray(res) ? res : res?.data || [];
      setHistory(list);
    } catch (e) {
      setErr(e?.message || "Failed to fetch purchase history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const rows = useMemo(() => {
    let list = [...(history || [])];

    if (filter !== "all") list = list.filter((x) => x?.status === filter);

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((x) => {
        const courseName = x?.course?.courseName || x?.course?.title || "";
        return (
          String(courseName).toLowerCase().includes(s) ||
          String(x?.paymentid || "").toLowerCase().includes(s) ||
          String(x?.orderid || "").toLowerCase().includes(s)
        );
      });
    }

  list.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
    return list;
  }, [history, search, filter]);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Purchase History</h1>
            <p className="text-sm text-white/60">
              All your course payments are listed here.
            </p>
          </div>

          <button
            onClick={fetchHistory}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition"
          >
            Refresh
          </button>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course name / paymentId / orderId..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-white/20"
            />
          </div>

          <div className="w-full sm:w-[220px]">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-blue-400/5 text-red-400 px-4 py-2 text-sm outline-none focus:border-white/20"
            >
              <option className="text-black" value="all">All Status</option>
              <option className="text-black" value="success">Success</option>
              <option className="text-black" value="pending">Pending</option>
              <option className="text-black" value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/70">Loading payments...</p>
          </div>
        )}

        {!loading && err && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <p className="font-semibold text-red-200">Error</p>
            <p className="text-sm text-red-100/80 mt-1">{err}</p>
          </div>
        )}

        {!loading && !err && rows.length === 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-lg font-semibold">No purchase history</p>
            <p className="mt-1 text-sm text-white/60">
              After buying a course, it will appear here.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !err && rows.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment ID</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((p) => {
                    const courseName =
                      p?.course?.courseName || p?.course?.title || "—";

                    return (
                      <tr
                        key={p?._id}
                        className="border-t border-white/10 hover:bg-white/6 transition"
                      >
                        <td className="px-4 py-3 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                              {p?.course?.thumbnail ? (
                                <img
                                  src={p.course.thumbnail}
                                  alt={courseName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] text-white/50">
                                  No Img
                                </div>
                              )}
                            </div>
                            <span className="line-clamp-1">{courseName}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3">{p?.price}</td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle(
                              p?.status
                            )}`}
                          >
                            {(p?.status || "pending").toUpperCase()}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-white/70 break-all">
                            {p?.paymentid || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-white/70 break-all">
                            {p?.orderid || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-white/70">
                          {p?.createdAt
                            ? new Date(p.createdAt).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

       
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-white/60">
              <span>Total: {rows.length}</span>
              <span>Showing latest transactions first</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
