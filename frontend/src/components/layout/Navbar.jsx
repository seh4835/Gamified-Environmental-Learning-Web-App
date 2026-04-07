import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const baseLinkClasses =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap";
  const activeClasses = "bg-green-600 text-white";
  const inactiveClasses =
    "text-gray-700 hover:text-green-700 hover:bg-green-50";

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 py-0">
        {/* Desktop/Tablet Layout */}
        <div className="flex h-16 items-center justify-between gap-8">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2" title="Home">
              <span className="text-xl font-bold text-green-700">
                🌿 EcoLearn
              </span>
            </Link>
          </div>

          {/* Center: Main Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/modules"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Learn
            </NavLink>

            <NavLink
              to="/challenges"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Act
            </NavLink>

            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Leaderboard
            </NavLink>

            <a
              href="/ar/scan.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseLinkClasses} ${inactiveClasses}`}
            >
              AR Scan
            </a>
          </div>

          {/* Right: User Menu / Auth */}
          <div className="flex items-center gap-4 ml-auto">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive ? "text-green-600" : "text-gray-700 hover:text-green-700"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`
                  }
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive ? "text-green-600" : "text-gray-700 hover:text-green-700"
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive ? "text-green-600" : "text-gray-700 hover:text-green-700"
                    }`
                  }
                >
                  Profile
                </NavLink>

                {user && user.role !== "student" && (
                  <>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `text-sm font-medium ${
                          isActive ? "text-green-600" : "text-gray-700 hover:text-green-700"
                        }`
                      }
                    >
                      Admin
                    </NavLink>
                    <NavLink
                      to="/admin/submissions"
                      className={({ isActive }) =>
                        `text-sm font-medium ${
                          isActive ? "text-green-600" : "text-gray-700 hover:text-green-700"
                        }`
                      }
                    >
                      Submissions
                    </NavLink>
                  </>
                )}

                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs text-gray-500 truncate">
                    {user.institution || "Student"}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition border border-red-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}