import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getProfile
} from "../services/api";

/*
|--------------------------------------------------------------------------
| CREATE CONTEXT
|--------------------------------------------------------------------------
*/

const AuthContext = createContext();

/*
|--------------------------------------------------------------------------
| PROVIDER COMPONENT
|--------------------------------------------------------------------------
*/

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD USER ON APP START 
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Auth init failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGIN FUNCTION
  |--------------------------------------------------------------------------
  */

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      const token = res.data.access_token;

      localStorage.setItem("token", token);

      // fetch user profile after login
      const userRes = await getProfile();
      setUser(userRes.data);

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        message:
          err.response?.data?.error || "Login failed. Please try again."
      };
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REGISTER FUNCTION
  |--------------------------------------------------------------------------
  */

  const register = async (data) => {
    try {
      await registerUser(data);

      // auto login after register
      return await login({
        email: data.email,
        password: data.password
      });
    } catch (err) {
      console.error("Register failed:", err);
      return {
        success: false,
        message:
          err.response?.data?.error || "Registration failed"
      };
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT FUNCTION
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);

    // redirect
    window.location.href = "/login";
  };

  /*
  |--------------------------------------------------------------------------
  | CONTEXT VALUE
  |--------------------------------------------------------------------------
  */

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| CUSTOM HOOK
|--------------------------------------------------------------------------
*/

export const useAuth = () => {
  return useContext(AuthContext);
};