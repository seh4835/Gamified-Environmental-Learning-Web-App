import { useEffect, useState } from "react";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get("/admin/submissions");
        setSubmissions(res.data);
      } catch (err) {
        console.error("Admin fetch failed:", err);

        // fallback demo data
        setSubmissions([
          {
            id: 1,
            user: "Seher Sanghani",
            module: "Climate Change",
            task: "Planted a tree",
            status: "Pending",
            points: 50,
            created_at: "2026-03-28"
          },
          {
            id: 2,
            user: "Rahul Mehta",
            module: "Waste Management",
            task: "Segregated waste",
            status: "Pending",
            points: 40,
            created_at: "2026-03-29"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleApprove = async (id, points) => {
    try {
      await api.post(`/admin/approve/${id}`, { points });

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "Approved" } : s
        )
      );
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/reject/${id}`);

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "Rejected" } : s
        )
      );
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading admin panel..." />;
  }

  const statusStyles = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700"
  };

  const filtered = submissions.filter((s) =>
    filter === "All" ? true : s.status === filter
  );

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "3rem 1.5rem", color: "#e2e8f0" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900">
            🛠 Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Review and manage eco-challenge submissions
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-green-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {filtered.map((submission) => (
            <div
              key={submission.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:scale-[1.02]"
            >

              {/* Top */}
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                  {submission.module}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    statusStyles[submission.status]
                  }`}
                >
                  {submission.status}
                </span>
              </div>

              {/* Info */}
              <p className="text-sm text-gray-700 mb-2">
                <strong>User:</strong> {submission.user}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Task:</strong> {submission.task}
              </p>

              <p className="text-xs text-gray-500 mb-4">
                Submitted on {submission.created_at}
              </p>

              {/* Actions */}
              {submission.status === "Pending" && (
                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() =>
                      handleApprove(submission.id, submission.points)
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Approve (+{submission.points})
                  </button>

                  <button
                    onClick={() => handleReject(submission.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Reject
                  </button>

                </div>
              )}

              {/* Approved Badge */}
              {submission.status === "Approved" && (
                <div className="mt-4 text-green-600 text-sm font-medium">
                  ✅ Points Awarded
                </div>
              )}

              {/* Rejected Badge */}
              {submission.status === "Rejected" && (
                <div className="mt-4 text-red-500 text-sm font-medium">
                  ❌ Submission Rejected
                </div>
              )}

              {/* View Proof */}
              <button className="mt-4 text-sm text-green-600 hover:underline">
                View Proof
              </button>

            </div>
          ))}

        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center mt-16 text-gray-500">
            No submissions available.
          </div>
        )}

      </div>
    </div>
  );
}