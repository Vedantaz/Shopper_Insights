import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { RatingsProvider } from "./auth/RatingsContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RatingsProvider>
          <App />
        </RatingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
