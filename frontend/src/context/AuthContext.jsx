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
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // If user data is cached in localStorage, use it immediately
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse saved user:", e);
        }
      }

      // Otherwise fetch fresh profile from server
      try {
        const res = await getProfile();
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Auth init failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

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
    localStorage.removeItem("user");
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
      {children}
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