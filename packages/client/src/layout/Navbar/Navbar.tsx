import { Outlet } from "react-router";

function Navbar() {
    return (
        <>
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Smart Class</h1>
                </div>
            </header>
            <main className="mx-auto p-15">
                <Outlet />
            </main>
        </>
    );
}

export default Navbar;
