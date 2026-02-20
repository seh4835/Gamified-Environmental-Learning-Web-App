import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"; // optional: replace with your logo path

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const baseLinkClasses =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-green-600 text-white";
  const inactiveClasses =
    "text-gray-700 hover:text-green-700 hover:bg-green-50";

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              {/* Logo (optional) */}
              <img
                src={logo}
                alt="EcoLearn Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-semibold text-green-700">
                EcoLearn
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
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

            {/* AR Scan Link */}
            <a
              href="/ar/scan.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseLinkClasses} ${inactiveClasses}`}
            >
              AR Scan
            </a>

            {user && user.role !== "student" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Right: Auth Buttons / User Menu */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-green-700"
                >
                  Dashboard
                </Link>

                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs text-gray-500">
                    {user.institution || "Student"}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
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