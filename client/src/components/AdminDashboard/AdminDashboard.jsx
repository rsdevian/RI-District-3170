import { useState, useEffect } from "react";
import "../../styles/AdminDashboard.css";
import axios from "axios";
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    DialogContentText,
    TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { CircularProgress } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { URL } from "../../constants/url";

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
    const [details, setDetails] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        club: "",
        zone: "",
        isAdmin: false,
        appPassword: "",
    });
    const [addNewUserPopup, setAddNewUserPopup] = useState(false);
    const [addUserLoading, setAddUserLoading] = useState(false);
    const [pushMailPopup, setPushMailPopup] = useState(false);
    const [sendingMail, setSendingMail] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState("");
    const [sendNewMail, setSendMail] = useState(false);
    const [visibility, setVisibility] = useState(false);
    useEffect(() => {
        if (activeItem === "users") {
            fetchUsers();
        }
    }, [activeItem]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/api/admin/users/getAll`);
            const users = response.data.users;
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

    const handleInputChange = (field) => (e) => {
        setDetails((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
        // Clear message on input change
    };

    const handleAddUser = async () => {
        try {
            setAddUserLoading(true);
            const password = generateRandomCharVar(8);
            const userDetails = {
                ...details,
                password,
            };
            setDetails((prev) => ({ ...prev, password }));
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !userDetails.email ||
                !userDetails.name ||
                !userDetails.phone ||
                !userDetails.position ||
                !userDetails.club ||
                !userDetails.zone
            ) {
                alert("Please fill in all fields");
                setAddUserLoading(false);
                return;
            }

            if (
                !userDetails.email.trim() ||
                !userDetails.password.trim() ||
                !emailRegex.test(userDetails.email) ||
                userDetails.name.length < 8 ||
                !userDetails.name.trim() ||
                !userDetails.position ||
                !userDetails.club ||
                !userDetails.zone
            ) {
                alert("Please fill in all fields");
                setAddUserLoading(false);
                return;
            }

            if (!emailRegex.test(userDetails.email)) {
                alert("Please enter a valid email address");
                setAddUserLoading(false);
                return;
            }
            console.log(userDetails);
            await axios.post(`${URL}/api/admin/user/addUser`, userDetails);

            setOpenDialog(true);
            setSendMail(true);
            setDialogContent("User added successfully");
        } catch (error) {
            alert(
                error?.response?.data?.error?.message ||
                    error?.response?.data?.message
            );
            console.log(error);
        } finally {
            setAddUserLoading(false);
        }
    };

    function generateRandomCharVar(length = 8) {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }

    const sendMail = async (name, email, password, appPassword) => {
        try {
            setSendingMail(true);
            const sender = localStorage.getItem("email");
            const receiver = email;
            const response = await axios.post(
                `${URL}/api/admin/user/sendMail/${sender}/${receiver}`,
                {
                    name,
                    email,
                    password,
                    appPassword,
                }
            );
            setSendMail(false);
            setOpenDialog(true);
            setDialogContent(response?.data?.message);
            setDetails({
                name: "",
                email: "",
                phone: "",
                position: "",
                club: "",
                zone: "",
                isAdmin: false,
                appPassword: "",
            });
        } catch (error) {
            console.log(error);
        } finally {
            setSendingMail(false);
            setPushMailPopup(false);
        }
    };

    const usersContent = () => {
        return (
            <div className='users-content'>
                {/* Subnav / Action buttons */}
                <div className='sub-nav-buttons'>
                    <button
                        className='icon-button'
                        title='Refresh'
                        onClick={fetchUsers}
                    >
                        <RefreshIcon />
                    </button>
                    <button className='icon-button' title='Edit'>
                        <EditIcon />
                    </button>
                    <button
                        className='icon-button'
                        title='Add User'
                        onClick={() => {
                            setAddNewUserPopup(true);
                        }}
                    >
                        <PersonAddAltIcon />
                    </button>
                </div>

                {openDialog && (
                    <Dialog
                        open={openDialog}
                        className='logout-dialog'
                        maxWidth={false}
                        onClose={() => setOpenDialog(false)}
                    >
                        <DialogTitle>Information</DialogTitle>
                        <DialogContent className='layout-dialog-content'>
                            <div>
                                <p>
                                    <b>{dialogContent}</b>
                                </p>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            {sendNewMail && (
                                <button
                                    className=''
                                    onClick={() => {
                                        setPushMailPopup(true);
                                        setOpenDialog(false);
                                    }}
                                >
                                    Send Mail
                                </button>
                            )}
                            <button
                                className='logout-cancel-btn'
                                onClick={() => {
                                    if (!sendNewMail) {
                                        setAddNewUserPopup(false);
                                    }
                                    setOpenDialog(false);
                                }}
                            >
                                Ok
                            </button>
                        </DialogActions>
                    </Dialog>
                )}

                <Dialog
                    open={pushMailPopup}
                    onClose={() => setPushMailPopup(false)}
                    maxWidth='sm'
                    fullWidth
                    BackdropProps={{
                        style: {
                            backgroundColor: "rgba(0,0,0,0)",
                        },
                    }}
                >
                    <DialogTitle>Send Mail to User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the App Password generated in the App
                            Passwords section of your google account
                        </DialogContentText>

                        <div className='text-container'>
                            <TextField
                                type={visibility ? "text" : "password"}
                                label='App Password'
                                variant='outlined'
                                value={details.appPassword}
                                onChange={(e) =>
                                    setDetails((prev) => ({
                                        ...prev,
                                        appPassword: e.target.value,
                                    }))
                                }
                                placeholder='Enter your App Password'
                                className='text-field'
                            />
                            {!visibility && (
                                <VisibilityIcon
                                    className='admin-visibility-on'
                                    onClick={() => {
                                        setVisibility(true);
                                    }}
                                />
                            )}
                            {visibility && (
                                <VisibilityOffIcon
                                    className='admin-visibility-on'
                                    onClick={() => {
                                        setVisibility(false);
                                    }}
                                />
                            )}
                        </div>
                        <p>
                            <i>
                                Note: By click "Push Mail" button, an email will
                                be sent to the newly created user from your
                                google account (from which credentials you have
                                logged in), which contains the users logging in
                                email and password
                            </i>
                        </p>
                    </DialogContent>
                    <DialogActions>
                        {!sendingMail && (
                            <>
                                {/* <input /> */}
                                <button
                                    onClick={() => {
                                        sendMail(
                                            details.name,
                                            details.email,
                                            details.password,
                                            details.appPassword
                                        );
                                    }}
                                >
                                    Push Mail
                                </button>
                                <button>No</button>
                            </>
                        )}
                        {sendingMail && (
                            <button>
                                <CircularProgress size={20} />
                            </button>
                        )}
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={addNewUserPopup}
                    onClose={() => setAddNewUserPopup(false)}
                    maxWidth='sm'
                    fullWidth
                    BackdropProps={{
                        style: { backgroundColor: "rgba(0,0,0,0)" },
                    }}
                >
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent className='add-user--content'>
                        <div className='add-user--content-container'>
                            <input
                                value={details.email}
                                type='email'
                                placeholder='Email'
                                onChange={handleInputChange("email")}
                                disabled={loading}
                                autoComplete='email'
                                className='input-field'
                            />
                            <input
                                value={details.name}
                                type='text'
                                placeholder='Name'
                                onChange={handleInputChange("name")}
                                disabled={loading}
                                autoComplete='Name'
                                className='input-field'
                            />
                            <input
                                value={details.phone}
                                type='text'
                                placeholder='Phone'
                                onChange={handleInputChange("phone")}
                                disabled={loading}
                                autoComplete='Phone'
                                className='input-field'
                            />
                            <select
                                className='input-field'
                                style={{ width: "97%" }}
                                onChange={(e) => {
                                    setDetails({
                                        ...details,
                                        position: e.target.value,
                                    });
                                }}
                                placeholder='Position'
                            >
                                <option value=''>Select Position</option>
                                <option>Secretary</option>
                            </select>
                            <select
                                className='input-field'
                                style={{ width: "97%" }}
                                onChange={(e) => {
                                    setDetails({
                                        ...details,
                                        zone: e.target.value,
                                    });
                                }}
                                placeholder='Zone'
                            >
                                <option value=''>Select Zone</option>
                                <option>Zone 1</option>
                            </select>
                            <select
                                className='input-field'
                                style={{ width: "97%" }}
                                onChange={(e) => {
                                    setDetails({
                                        ...details,
                                        club: e.target.value,
                                    });
                                }}
                                placeholder='Club'
                            >
                                <option value=''>Select Club</option>
                                <option>Club 1</option>
                            </select>
                            <div>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={details.isAdmin}
                                            onChange={() => {
                                                setDetails({
                                                    ...details,
                                                    isAdmin: !details.isAdmin,
                                                });
                                            }}
                                        />
                                    }
                                    label='Admin (Check if the new user is an admin)'
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button
                            onClick={handleAddUser}
                            disabled={addUserLoading}
                        >
                            {addUserLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                "Add User"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setAddNewUserPopup(false);
                            }}
                        >
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>

                {/* User Table */}
                <div className='table-container'>
                    <table className='user-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Admin</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Position</th>
                                <th>Club</th>
                                <th>Zone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>
                                            {user.isAdmin ? (
                                                <span className='badge admin'>
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className='badge'>
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.position}</td>
                                        <td>{user.club}</td>
                                        <td>{user.zone}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='3' className='no-users'>
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
                <>
                    <h1 className='content-title'>{activeItem}</h1>
                    <div className='content-box'>
                        {loading && (
                            <CircularProgress
                                size={40}
                                className='circular-progress-dashboard'
                            />
                        )}
                        {!loading && renderContent(activeItem)}
                    </div>
                </>
            </div>
        </div>
    );
}

export default AdminDashboard;
