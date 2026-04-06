import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTE COMPONENT
|--------------------------------------------------------------------------
| - Blocks unauthenticated users
| - Supports role-based access (optional)
| - Prevents UI flicker during auth loading
|--------------------------------------------------------------------------
*/

export default function ProtectedRoute({
  children,
  requiredRole = null // optional: "admin"
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  /*
  |--------------------------------------------------------------------------
  | SHOW LOADER WHILE AUTH STATE IS INITIALIZING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <Loader fullScreen text="Authenticating..." />;
  }

  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN → REDIRECT TO LOGIN
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ROLE-BASED ACCESS CONTROL (ADMIN, ETC.)
  |--------------------------------------------------------------------------
  */

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 text-sm">
            You do not have permission to access this page.
          </p>

          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | AUTHORIZED → RENDER PAGE
  |--------------------------------------------------------------------------
  */

  return children;
}