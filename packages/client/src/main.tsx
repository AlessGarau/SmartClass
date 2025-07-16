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
import Navbar from './layout/Navbar/Navbar.tsx';
import PlanningPage from './pages/PlanningPage.tsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Navbar />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardTestPage />,
          },
          {
            path: "/planning",
            element: <PlanningPage />,
          },
        ],
      },
    ],
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
