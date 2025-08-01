import { useState } from "react";
import "../../styles/AdminDashboard.css";

const sidebarItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users", label: "Users" },
    { key: "settings", label: "Settings" },
    { key: "reports", label: "Reports" },
];

const renderContent = (active) => {
    switch (active) {
        case "dashboard":
            return <div>📊 Welcome to the Dashboard!</div>;
        case "users":
            return <div>👥 Manage your Users here.</div>;
        case "settings":
            return <div>⚙️ Tweak your Settings.</div>;
        case "reports":
            return <div>📈 View your Reports.</div>;
        default:
            return <div>🔍 Select an item from the sidebar.</div>;
    }
};

function AdminDashboard() {
    const [activeItem, setActiveItem] = useState("dashboard");

    return (
        <div className='admin-dashboard'>
            {/* Sidebar */}
            <div className='sidebar'>
                <h2 className='sidebar-title'>
                    {localStorage.getItem("name")}
                </h2>
                {sidebarItems.map((item) => (
                    <button
                        key={item.key}
                        className={`sidebar-item ${
                            activeItem === item.key ? "active" : ""
                        }`}
                        onClick={() => setActiveItem(item.key)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className='main-content'>
                <h1 className='content-title'>{activeItem}</h1>
                <div className='content-box'>{renderContent(activeItem)}</div>
            </div>
        </div>
    );
}

export default AdminDashboard;
