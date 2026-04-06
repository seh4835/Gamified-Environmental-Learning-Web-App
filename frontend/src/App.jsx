import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| GLOBAL COMPONENTS
|--------------------------------------------------------------------------
*/
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/*
|--------------------------------------------------------------------------
| PAGES
|--------------------------------------------------------------------------
*/
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import ModuleDetail from "./pages/ModuleDetail";
import Challenges from "./pages/Challenges";
import Submissions from "./pages/Submissions";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

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
    <Router>

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
    </Router>
  );
}

export default App;