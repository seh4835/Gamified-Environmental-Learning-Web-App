import { Routes, Route } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| GLOBAL COMPONENTS
|--------------------------------------------------------------------------
*/
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

/*
|--------------------------------------------------------------------------
| PAGES
|--------------------------------------------------------------------------
*/
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import Modules from "./pages/modules/Modules";
import ModuleDetail from "./pages/modules/ModuleDetail";
import Challenges from "./pages/Challenges";
import Submissions from "./pages/admin/Submissions";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/user/Profile";
import Admin from "./pages/admin/Admin";

/*
|--------------------------------------------------------------------------
| ROUTE PROTECTION
|--------------------------------------------------------------------------
*/
import ProtectedRoute from "./routes/ProtectedRoute";

/*
|--------------------------------------------------------------------------
| MAIN APP COMPONENT
|--------------------------------------------------------------------------
*/

function App() {
  return (
    <>
      {/* 🌿 Global Layout */}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-white">

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">

          <Routes>

            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔐 Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/modules"
              element={
                <ProtectedRoute>
                  <Modules />
                </ProtectedRoute>
              }
            />

            <Route
              path="/modules/:id"
              element={
                <ProtectedRoute>
                  <ModuleDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />

            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <Submissions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 🛠 Admin Route (Role-Based Protection) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* ❌ Fallback Route */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-[60vh] text-gray-500">
                  Page not found
                </div>
              }
            />

          </Routes>

        </main>

        {/* Footer */}
        <Footer />

      </div>
    </>
  );
}

export default App;