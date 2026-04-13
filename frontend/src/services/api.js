import axios from "axios";

/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE CONFIGURATION
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: "https://gamified-environmental-learning-web-app.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR (Attach JWT Token)
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR (Global Error Handling)
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Unauthorized → logout user
      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // Optional: handle server errors
      if (status === 500) {
        console.error("Server error:", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| AUTH APIs
|--------------------------------------------------------------------------
*/

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

/*
|--------------------------------------------------------------------------
| USER APIs
|--------------------------------------------------------------------------
*/

export const getProfile = () => api.get("/users/me");

export const updateProfile = (data) => api.put("/users/update", data);

/*
|--------------------------------------------------------------------------
| MODULE APIs
|--------------------------------------------------------------------------
*/

export const getModules = () => api.get("/modules");

export const getModuleDetail = (id) => api.get(`/modules/${id}`);

/*
|--------------------------------------------------------------------------
| QUIZ APIs
|--------------------------------------------------------------------------
*/

export const submitQuiz = (data) => api.post("/quizzes/submit", data);

/*
|--------------------------------------------------------------------------
| CHALLENGE APIs
|--------------------------------------------------------------------------
*/

export const getChallenges = () => api.get("/challenges");

export const submitChallenge = (formData) =>
  api.post("/challenges/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const getUserSubmissions = () =>
  api.get("/challenges/submissions");

/*
|--------------------------------------------------------------------------
| LEADERBOARD API
|--------------------------------------------------------------------------
*/

export const getLeaderboard = () => api.get("/leaderboard");

/*
|--------------------------------------------------------------------------
| ADMIN APIs
|--------------------------------------------------------------------------
*/

export const getAllSubmissions = () =>
  api.get("/admin/submissions");

export const approveSubmission = (id, points) =>
  api.post(`/admin/approve/${id}`, { points });

export const rejectSubmission = (id) =>
  api.post(`/admin/reject/${id}`);

/*
|--------------------------------------------------------------------------
| EXPORT DEFAULT INSTANCE (for custom calls)
|--------------------------------------------------------------------------
*/

export default api;