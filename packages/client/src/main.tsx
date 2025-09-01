import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import { AuthProvider } from "./contexts/auth/AuthContextProvider.tsx";
import "./index.css";
import Layout from "./layout/Layout.tsx";
import DashboardTestPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import PlanningPage from "./pages/PlanningPage.tsx";
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
                        path: "/analytics",
                        element: (
                            <div className="p-6">
                                <h1 className="text-2xl font-bold">
                                    Analytics
                                </h1>
                                <p>Page d'analytics en construction...</p>
                            </div>
                        ),
                    },
                    {
                        path: "/alertes",
                        element: (
                            <div className="p-6">
                                <h1 className="text-2xl font-bold">Alertes</h1>
                                <p>Page d'alertes en construction...</p>
                            </div>
                        ),
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
