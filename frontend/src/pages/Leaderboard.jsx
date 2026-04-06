import { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";
import api from "../services/api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard");
        setUsers(res.data);
      } catch (err) {
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading leaderboard..." />;
  }

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            🌍 Eco Leaderboard
          </h1>
          <p className="text-gray-600 mt-2">
            Top eco warriors making a difference
          </p>
        </div>

        {/* 🥇 Top 3 Podium */}
        <div className="grid grid-cols-3 gap-6 mb-12 text-center">

          {top3.map((user, index) => {
            const styles = [
              "bg-yellow-100 text-yellow-700",
              "bg-gray-200 text-gray-700",
              "bg-orange-100 text-orange-700"
            ];

            const heights = ["h-40", "h-32", "h-28"];

            return (
              <div
                key={user.id}
                className={`rounded-xl shadow-md flex flex-col justify-end p-4 ${styles[index]} ${heights[index]} transform transition hover:scale-105`}
              >
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-sm mt-1">{user.eco_points} pts</p>
                <p className="text-xs mt-2">
                  #{index + 1}
                </p>
              </div>
            );
          })}

        </div>

        {/* 🏅 Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Rankings
          </h2>

          <div className="space-y-4">

            {users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-green-50 transition"
              >
                <div className="flex items-center gap-4">

                  {/* Rank */}
                  <div className="w-8 text-center font-bold text-gray-700">
                    #{index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold">
                    {user.name.charAt(0)}
                  </div>

                  {/* Name */}
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Eco Learner
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-green-600 font-semibold">
                  {user.eco_points} pts
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}