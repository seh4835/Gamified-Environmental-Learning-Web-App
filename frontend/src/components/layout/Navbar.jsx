import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  // ✅ SUPPORT BOTH teacher + admin
  const isAdmin =
    user?.role === "teacher" || user?.role === "admin";

  const baseLinkClasses =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap";

  const activeClasses = "bg-green-600 text-white";

  const inactiveClasses =
    "text-gray-700 hover:text-green-700 hover:bg-green-50";

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6">
        <div className="flex h-16 items-center justify-between gap-8">

          {/* 🌿 Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-700">
              🌿 EcoLearn
            </span>
          </Link>

          {/* 🌐 CENTER NAVIGATION */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Home */}
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

            {/* 🎓 STUDENT ONLY */}
            {!isAdmin && (
              <>
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
              </>
            )}

            {/* 🌍 SHARED */}
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

            {/* 🧪 AR Feature */}
            <a
              href="/ar/scan.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseLinkClasses} ${inactiveClasses}`}
            >
              AR Scan
            </a>
          </div>

          {/* 👤 RIGHT SIDE */}
          <div className="flex items-center gap-4 ml-auto">

            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-700"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">

                {/* 🎓 STUDENT ONLY */}
                {!isAdmin && (
                  <NavLink
                    to="/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-green-700"
                  >
                    Dashboard
                  </NavLink>
                )}

                {/* 👤 PROFILE */}
                <NavLink
                  to="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-green-700"
                >
                  Profile
                </NavLink>

                {/* 🛠 ADMIN / TEACHER */}
                {isAdmin && (
                  <>
                    <NavLink
                      to="/admin"
                      className="text-sm font-medium text-gray-700 hover:text-green-700"
                    >
                      Admin
                    </NavLink>

                    <NavLink
                      to="/submissions"
                      className="text-sm font-medium text-gray-700 hover:text-green-700"
                    >
                      Submissions
                    </NavLink>
                  </>
                )}

                {/* 👤 USER INFO */}
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs text-gray-500">
                    {user.institution || "User"}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </span>
                </div>

                {/* 🚪 LOGOUT */}
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition"
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