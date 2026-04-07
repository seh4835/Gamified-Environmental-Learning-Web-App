import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch modules
        const modulesRes = await api.get("/modules");
        setModules(modulesRes.data || []);

        // Try to fetch dashboard stats (optional)
        try {
          const statsRes = await api.get("/users/dashboard");
          setStats(statsRes.data);
        } catch (err) {
          console.log("Dashboard stats unavailable, showing basic data");
          // Set default stats if endpoint fails
          setStats({
            eco_points: user?.eco_points || 0,
            quizzes_completed: 0,
            challenges_completed: 0,
            badges: []
          });
        }
      } catch (err) {
        console.error("Failed to load modules:", err);
        // Fall back to using user data
        setStats({
          eco_points: user?.eco_points || 0,
          quizzes_completed: 0,
          challenges_completed: 0,
          badges: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <Loader fullScreen text="Loading your eco dashboard..." />;
  }

  const ecoPoints = stats?.eco_points || user?.eco_points || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Greeting */}
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your sustainability progress overview.
          </p>
        </div>

        {/* Eco Points Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-100">Total Eco Points</h2>
              <p className="text-5xl font-bold mt-2">{ecoPoints}</p>
              <p className="mt-2 text-green-100 text-sm">🌍 Keep learning to unlock achievements</p>
            </div>
            <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-4xl animate-pulse">🌱</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500 font-medium">Institution</h3>
            <p className="text-lg font-bold text-gray-800 mt-2">{user?.institution || "Not specified"}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500 font-medium">Quizzes Done</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{stats?.quizzes_completed || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500 font-medium">Challenges Done</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{stats?.challenges_completed || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500 font-medium">Badges Earned</h3>
            <p className="text-2xl font-bold text-amber-500 mt-2">{stats?.badges?.length || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/modules" className="p-6 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-400 transition text-center hover:shadow-md">
              <p className="text-3xl mb-2">📚</p>
              <h3 className="font-semibold text-gray-800">Learn Modules</h3>
              <p className="text-sm text-gray-600 mt-1">View all modules</p>
            </Link>

            <Link to="/challenges" className="p-6 rounded-xl bg-green-50 border border-green-200 hover:border-green-400 transition text-center hover:shadow-md">
              <p className="text-3xl mb-2">⚡</p>
              <h3 className="font-semibold text-gray-800">Do Challenges</h3>
              <p className="text-sm text-gray-600 mt-1">Complete challenges</p>
            </Link>

            <Link to="/leaderboard" className="p-6 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-400 transition text-center hover:shadow-md">
              <p className="text-3xl mb-2">🏆</p>
              <h3 className="font-semibold text-gray-800">Leaderboard</h3>
              <p className="text-sm text-gray-600 mt-1">Check rankings</p>
            </Link>
          </div>
        </div>

        {/* Modules List */}
        {modules && modules.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">📚 Available Modules ({modules.length})</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <Link key={module.id} to={`/modules/${module.id}`} className="p-6 rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-lg transition bg-white">
                  <h3 className="font-semibold text-gray-800 text-lg">{module.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{module.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{module.difficulty}</span>
                    <span className="text-sm font-semibold text-green-600">+{module.points} pts</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}