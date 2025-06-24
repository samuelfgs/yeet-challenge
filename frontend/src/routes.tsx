import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { UserPage } from "./pages/UserPage";
import type { ReactNode } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

const withErrorBoundary = (children: ReactNode) => (
  <ErrorBoundary>{children}</ErrorBoundary>
);

export const routers = createBrowserRouter([
  {
    path: "/",
    element: withErrorBoundary(<DashboardPage />),
  },
  {
    path: "/user/:id",
    element: withErrorBoundary(<UserPage />),
  },
]);