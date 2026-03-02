import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/users/dashboard");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading your eco dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-20 text-gray-500">
        Unable to load dashboard data.
      </div>
    );
  }

  const { eco_points, badges, stats, next_badge } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Greeting */}
        <div className="animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Here’s your sustainability progress overview.
          </p>
        </div>

        {/* Eco Points Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transform transition hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Total Eco Points
              </h2>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {eco_points}
              </p>
            </div>

            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold animate-pulse">
              🌱
            </div>
          </div>

          {next_badge && (
            <div className="mt-6">
              <ProgressBar
                value={eco_points}
                max={next_badge.required_points}
                label={`Progress to ${next_badge.name}`}
                helperText={`Earn ${
                  next_badge.required_points - eco_points
                } more points to unlock`}
                color="green"
              />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500">Quizzes Completed</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats?.quizzes_completed || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500">Challenges Completed</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {stats?.challenges_completed || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500">Badges Earned</h3>
            <p className="text-2xl font-bold text-amber-500 mt-2">
              {badges?.length || 0}
            </p>
          </div>

        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Your Achievements
          </h2>

          {badges && badges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <Badge key={badge.id} badge={badge} earned />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Complete quizzes and eco challenges to earn badges.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
            