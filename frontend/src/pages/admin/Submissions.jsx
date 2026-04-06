import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import api from "../services/api";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get("/challenges/submissions");
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);

        // fallback demo data (so UI never breaks)
        setSubmissions([
          {
            id: 1,
            module: "Climate Change",
            task: "Planted a tree",
            status: "Approved",
            points: 50,
            created_at: "2026-03-28"
          },
          {
            id: 2,
            module: "Waste Management",
            task: "Segregated waste",
            status: "Pending",
            points: 0,
            created_at: "2026-03-29"
          },
          {
            id: 3,
            module: "Water Conservation",
            task: "Saved water",
            status: "Rejected",
            points: 0,
            created_at: "2026-03-27"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading your submissions..." />;
  }

  // Status Styling
  const statusStyles = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700"
  };

  // 🔍 Filter Logic
  const filtered = submissions.filter((s) =>
    filter === "All" ? true : s.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900">
             My Submissions
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Track your eco-challenge submissions, approvals, and earned eco-points.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {["All", "Approved", "Pending", "Rejected"].map((tab) => (
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

        {/* Submissions Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {filtered.map((submission) => (
            <div
              key={submission.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 transition transform hover:scale-[1.02] hover:shadow-xl"
            >

              {/* Top */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-semibold text-gray-800 text-lg">
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

              {/* Task */}
              <p className="text-sm text-gray-700 mb-4">
                {submission.task}
              </p>

              {/* Date */}
              <p className="text-xs text-gray-500 mb-4">
                Submitted on {submission.created_at}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center">

                {/* Points */}
                <span className="text-green-600 font-semibold text-sm">
                  {submission.points > 0
                    ? `+${submission.points} Eco Points`
                    : "No points yet"}
                </span>

                {/* View Button */}
                <button className="text-sm text-green-600 hover:underline">
                  View Proof
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center mt-16 text-gray-500">
            No submissions found for this category.
          </div>
        )}

      </div>
    </div>
  );
}