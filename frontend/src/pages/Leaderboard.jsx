import { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";
import api from "../services/api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("You must be logged in to view the leaderboard");
          setLoading(false);
          return;
        }

        const res = await api.get("/leaderboard");
        console.log("Leaderboard response:", res.data);
        
        // Handle both array and object responses
        const data = Array.isArray(res.data) ? res.data : res.data.leaderboard || [];
        console.log("Processed data:", data);
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Leaderboard error:", err.response?.data || err.message);
        setError(err.response?.data?.error || err.message || "Failed to load leaderboard");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading leaderboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">No Users Yet</h2>
          <p className="text-yellow-600">Be the first to earn eco points and appear on the leaderboard!</p>
        </div>
      </div>
    );
  }

  // Function to get badge based on points
  const getBadge = (points) => {
    if (points >= 500) {
      return { icon: "🌍", label: "Sustainability Champion", color: "text-red-600" };
    } else if (points >= 250) {
      return { icon: "🏆", label: "Eco Warrior", color: "text-yellow-600" };
    } else {
      return { icon: "🌱", label: "Green Beginner", color: "text-green-600" };
    }
  };

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
              "bg-yellow-100 text-yellow-700 border-2 border-yellow-300",
              "bg-gray-200 text-gray-700 border-2 border-gray-300",
              "bg-orange-100 text-orange-700 border-2 border-orange-300"
            ];

            const heights = ["h-48", "h-40", "h-36"];
            const badges = [
              { icon: "🥇", label: "1st Place" },
              { icon: "🥈", label: "2nd Place" },
              { icon: "🥉", label: "3rd Place" }
            ];
            const badge = getBadge(user.eco_points);

            return (
              <div
                key={user.id}
                className={`rounded-xl shadow-lg flex flex-col justify-between p-6 ${styles[index]} ${heights[index]} transform transition hover:scale-105`}
              >
                <div className="text-4xl mb-2">{badges[index].icon}</div>
                <div>
                  <h2 className="font-bold text-lg">{user.name}</h2>
                  <p className="text-sm font-semibold mt-2">{user.eco_points} pts</p>
                  <div className={`text-2xl mt-3 ${badge.color}`}>{badge.icon}</div>
                  <p className="text-xs mt-1 font-medium">{badge.label}</p>
                </div>
              </div>
            );
          })}

        </div>

        {/* 🏅 Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            🏆 Full Rankings
          </h2>

          <div className="space-y-3">

            {users.map((user, index) => {
              const badge = getBadge(user.eco_points);
              const medals = ["🥇", "🥈", "🥉"];
              const showMedal = index < 3;

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between bg-gradient-to-r from-green-50 to-white p-5 rounded-xl hover:shadow-md transition border border-green-100"
                >
                  <div className="flex items-center gap-4 flex-1">

                    {/* Rank */}
                    <div className="w-8 text-center font-bold text-lg text-gray-700">
                      {showMedal ? medals[index] : `#${index + 1}`}
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name and Badge */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-base">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xl ${badge.color}`}>{badge.icon}</span>
                        <p className="text-xs text-gray-600 font-medium">
                          {badge.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {user.eco_points}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
}