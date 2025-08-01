import { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import { Link, useLocation } from "react-router";
import logoSvg from "../../assets/image 7.jpg";

function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Salles", path: "/salles" },
        { name: "Analytics", path: "/analytics" },
        { name: "Planning", path: "/planning" },
        { name: "Alertes", path: "/alertes" },
    ];

    const isActive = (path: string) => location.pathname === path;

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="w-full bg-white shadow-xs border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <img
                            src={logoSvg}
                            alt="SmartClass Logo"
                            className="h-8 w-8"
                        />
                        <span className="text-xl font-semibold text-gray-900">
                            SmartClass
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    isActive(item.path)
                                        ? "text-teal-600 bg-teal-50"
                                        : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center">
                            <span className="text-sm font-medium text-gray-700">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Admin
                            </span>
                        </div>

                        <button
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                        isMobileMenuOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16M4 18h16"
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                                        isActive(item.path)
                                            ? "text-teal-600 bg-teal-50"
                                            : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="px-3 py-2 border-t border-gray-200 mt-3 pt-3 sm:hidden">
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Admin
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;