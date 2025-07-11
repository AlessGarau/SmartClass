import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardTestPage from "./pages/DashboardPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import { AuthProvider } from "./contexts/auth/AuthContextProvider.tsx";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

import ReactDOM from "react-dom/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardTestPage /></ProtectedRoute>,
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
);
