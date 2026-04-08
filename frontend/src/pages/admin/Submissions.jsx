import { useEffect, useState } from "react";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Submissions() {
  const { user } = useAuth();

  const isAdmin =
    user?.role === "teacher" || user?.role === "admin";

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get("/challenges/submissions");
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADMIN ACTION: APPROVE / REJECT
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/challenges/submissions/${id}`, {
        status,
      });

      // update UI instantly
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status,
                points: status === "Approved" ? 50 : 0,
              }
            : s
        )
      );
    } catch (err) {
      console.error("Error updating submission:", err);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading submissions..." />;
  }

  const statusStyles = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  const filtered = submissions.filter((s) =>
    filter === "All" ? true : s.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? "Manage Submissions" : "My Submissions"}
          </h1>
          <p className="mt-3 text-gray-600">
            {isAdmin
              ? "Approve or reject student eco-challenge submissions."
              : "Track your eco-challenge submissions and rewards."}
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 mb-8">
          {["All", "Approved", "Pending", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-green-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((submission) => (
            <div
              key={submission.id}
              className="bg-white border rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold text-lg">
                  {submission.module}
                </h2>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    statusStyles[submission.status]
                  }`}
                >
                  {submission.status}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                {submission.task}
              </p>

              <p className="text-xs text-gray-500 mb-4">
                Submitted on {submission.created_at}
              </p>

              <div className="flex justify-between items-center">

                <span className="text-green-600 font-semibold text-sm">
                  {submission.points > 0
                    ? `+${submission.points} Eco Points`
                    : "No points yet"}
                </span>

                <button className="text-sm text-green-600 hover:underline">
                  View Proof
                </button>
              </div>

              {/* 🔥 ADMIN ACTIONS */}
              {isAdmin && submission.status === "Pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      updateStatus(submission.id, "Approved")
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(submission.id, "Rejected")
                    }
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No submissions found.
          </p>
        )}
      </div>
    </div>
  );
}