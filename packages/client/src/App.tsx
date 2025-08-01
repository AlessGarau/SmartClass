import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/auth/AuthContextProvider";
import Navbar from "./layout/Navbar/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/salles"
                                element={
                                    <ProtectedRoute>
                                        <div className="p-6">
                                            <h1 className="text-2xl font-bold">
                                                Salles
                                            </h1>
                                            <p>
                                                Page des salles en
                                                construction...
                                            </p>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analytics"
                                element={
                                    <ProtectedRoute>
                                        <div className="p-6">
                                            <h1 className="text-2xl font-bold">
                                                Analytics
                                            </h1>
                                            <p>
                                                Page d'analytics en
                                                construction...
                                            </p>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/planning"
                                element={
                                    <ProtectedRoute>
                                        <div className="p-6">
                                            <h1 className="text-2xl font-bold">
                                                Planning
                                            </h1>
                                            <p>
                                                Page de planning en
                                                construction...
                                            </p>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/alertes"
                                element={
                                    <ProtectedRoute>
                                        <div className="p-6">
                                            <h1 className="text-2xl font-bold">
                                                Alertes
                                            </h1>
                                            <p>
                                                Page d'alertes en
                                                construction...
                                            </p>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/"
                                element={<Navigate to="/dashboard" replace />}
                            />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}
