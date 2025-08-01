import { useState, useEffect } from "react";
import "../../styles/AdminDashboard.css";
import axios from "axios";

import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { CircularProgress } from "@mui/material";

const sidebarItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users", label: "Users" },
    { key: "settings", label: "Settings" },
    { key: "reports", label: "Reports" },
];

function AdminDashboard() {
    const user = localStorage?.getItem("name");
    const [activeItem, setActiveItem] = useState("users");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (activeItem === "users") {
            fetchUsers();
        }
    }, [activeItem]);

    console.lof(users);
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/users`);
            const users = response.data;
            setUsers(users);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = (active) => {
        switch (active) {
            case "dashboard":
                return <div>📊 Welcome to the Dashboard!</div>;
            case "users":
                return <>{usersContent()}</>;
            case "settings":
                return <div>⚙️ Tweak your Settings.</div>;
            case "reports":
                return <>{reportContents()}</>;
            default:
                return <div>🔍 Select an item from the sidebar.</div>;
        }
    };

    const reportContents = () => {
        return (
            <div>
                <p>Here are some reports</p>
            </div>
        );
    };

    const usersContent = () => {
        return (
            <div>
                <div className='sub-nav-buttons'>
                    <RefreshIcon className='sub-nav-button' />
                    <EditIcon className='sub-nav-button' />
                    <PersonAddAltIcon className='sub-nav-button' />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    };

    return (
        <div className='admin-dashboard'>
            {/* Sidebar */}
            <div className='sidebar'>
                <h2 className='sidebar-title'>{user}</h2>
                <h4 className='sidebar-subtitle'>Manage your Team</h4>
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
                {loading && (
                    <CircularProgress size={20} className='circular-progress' />
                )}
                <h1 className='content-title'>{activeItem}</h1>
                <div className='content-box'>{renderContent(activeItem)}</div>
            </div>
        </div>
    );
}

export default AdminDashboard;
