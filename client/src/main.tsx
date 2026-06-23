import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./providers/AuthProvider";
import Router from "./Router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>,
);
