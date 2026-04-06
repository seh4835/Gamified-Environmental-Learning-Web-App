import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| GLOBAL STYLES
|--------------------------------------------------------------------------
*/
import "./index.css";

/*
|--------------------------------------------------------------------------
| ROOT APP
|--------------------------------------------------------------------------
*/
import App from "./App";

/*
|--------------------------------------------------------------------------
| AUTH CONTEXT (GLOBAL STATE)
|--------------------------------------------------------------------------
*/
import { AuthProvider } from "./context/AuthContext";

/*
|--------------------------------------------------------------------------
| RENDER APPLICATION
|--------------------------------------------------------------------------
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);