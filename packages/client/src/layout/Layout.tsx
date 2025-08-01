import { Outlet } from "react-router";
import Navbar from "./Navbar/Navbar";

function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Outlet />
        </div>
    );
}

export default Layout;
