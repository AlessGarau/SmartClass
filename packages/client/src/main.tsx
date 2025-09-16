import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import { AuthProvider } from "./contexts/auth/AuthContextProvider.tsx";
import "./index.css";
import Layout from "./layout/Layout.tsx";
import ClassesPage from "./pages/ClassesPage.tsx";
import DashboardTestPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import PlanningPage from "./pages/PlanningPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import RoomsDetailsPage from "./pages/RoomsDetailsPage.tsx";
import RoomsPage from "./pages/RoomsPage.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: "/",
                        element: <DashboardTestPage />,
                    },
                    {
                        path: "/dashboard",
                        element: <DashboardTestPage />,
                    },
                    {
                        path: "/planning",
                        element: <PlanningPage />,
                    },
                    {
                        path: "/salles",
                        element: <RoomsPage />,
                    },
                    {
                        path: "/salles/:id",
                        element: <RoomsDetailsPage />,
                    },
                    {
                        path: "/teacher",
                        element: <ReportsPage />,
                    },
                    {
                        path: "/class",
                        element: <ClassesPage />,
                    },
                    {
                        path: "/alertes",
                        element: <ReportsPage />,
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
            <Toaster position="top-right" />
        </AuthProvider>
    </QueryClientProvider>
);
