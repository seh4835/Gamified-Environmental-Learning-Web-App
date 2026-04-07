import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    institution: ""
  });

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        name: authUser.name,
        institution: authUser.institution
      });
    }
  }, [authUser]);

  const handleUpdate = async () => {
    try {
      await api.put("/users/update", formData);
      setUser({ ...user, ...formData });
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading || !user) {
    return <Loader fullScreen text="Loading profile..." />;
  }

  // 🎯 Progress calculation (example)
  const progress = Math.min((user.eco_points / 1000) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900">
            👤 My Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your personal details and track your sustainability journey.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 transition hover:shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Left */}
            <div className="flex items-center gap-6">

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
                {user.name.charAt(0)}
              </div>

              {/* Info */}
              <div>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border p-2 rounded-md mb-2 w-full"
                    />
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) =>
                        setFormData({ ...formData, institution: e.target.value })
                      }
                      className="border p-2 rounded-md w-full"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      {user.institution}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="text-right">
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {user.role}
              </span>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Edit Profile
              </button>
            )}
          </div>

        </div>

        {/* Eco Points + Progress */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* Points Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500 mb-2">
              Eco Points
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {user.eco_points}
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-sm text-gray-500 mb-2">
              Sustainability Progress
            </h3>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {Math.round(progress)}% towards Eco Champion
            </p>
          </div>

        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            🏅 Achievements & Badges
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {[
              { name: "Eco Starter", earned: true },
              { name: "Green Learner", earned: true },
              { name: "Sustainability Pro", earned: false },
              { name: "Eco Champion", earned: false }
            ].map((badge, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl text-center border ${
                  badge.earned
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-400 border-gray-200"
                }`}
              >
                <p className="text-sm font-medium">{badge.name}</p>
                <p className="text-xs mt-1">
                  {badge.earned ? "Unlocked" : "Locked"}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}