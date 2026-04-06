import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get("/modules");
        console.log("Modules response:", res.data);
        setModules(res.data);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
        setError(error.response?.data?.error || error.message || "Failed to load modules");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading sustainability curriculum..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12 flex items-center justify-center">
        <div className="bg-red-50 border border-red-100 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Modules</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No modules available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900">
            Sustainability Curriculum
          </h1>
          <p className="mt-4 text-gray-600 max-w-3xl leading-relaxed">
            EcoLearn offers a structured environmental education pathway designed
            to build awareness, scientific understanding, and practical
            sustainability skills. Each module includes interactive quizzes and
            contributes toward eco-points and badge progression.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {modules.map((module, index) => {

            const difficultyColor = {
              Beginner: "bg-blue-100 text-blue-700",
              Intermediate: "bg-amber-100 text-amber-700",
              Advanced: "bg-red-100 text-red-700"
            };

            return (
              <div
                key={module.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-md p-8 transform transition duration-300 hover:scale-[1.02] hover:shadow-xl"
              >

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {module.title}
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Module {index + 1}
                  </span>
                </div>

                {/* Difficulty + Points */}
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      difficultyColor[module.difficulty] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {module.difficulty}
                  </span>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    +{module.points} Eco Points
                  </span>
                </div>

                {/* Description (From Backend) */}
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  {module.description}
                </p>

                {/* Learning Objectives (Structured Reinforcement) */}
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                    Learning Focus
                  </p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    <li>Conceptual environmental understanding</li>
                    <li>Scientific cause–impact relationships</li>
                    <li>Real-world sustainability practices</li>
                    <li>Interactive quiz-based reinforcement</li>
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex justify-end">
                  <Link
                    to={`/modules/${module.id}`}
                    className="px-5 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                  >
                    Start Module
                  </Link>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}