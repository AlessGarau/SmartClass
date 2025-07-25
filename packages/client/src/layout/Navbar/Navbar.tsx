import { Outlet } from "react-router";

function Navbar() {
    return (
        <>
            <header className="bg-background border-b border-grayBorder border-b-2 border-solid">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Smart Class</h1>
                </div>
            </header>
            <main className="bg-background mx-auto p-15 h-screen">
                <Outlet />
            </main>
        </>
    );
}

export default Navbar;
