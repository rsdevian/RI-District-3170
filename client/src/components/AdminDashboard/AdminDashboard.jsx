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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { URL } from "../../constants/url";

const sidebarItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users", label: "Users" },
    { key: "settings", label: "Settings" },
    { key: "reports", label: "Reports" },
];

function AdminDashboard() {
    const user = localStorage?.getItem("name");
    const [activeItem, setActiveItem] = useState("dashboard");
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
    const [selectedSubNav, setSelectedSubNav] = useState("zones");
    const [allZones, setAllZones] = useState([]);
    const [allClubs, setAllClubs] = useState([]);
    const [selectedZone, setSelectedZone] = useState("");
    const [selectedClub, setSelectedClub] = useState("");
    const [reports, setReports] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [downloadingFileId, setDownloadingFileId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deletingFileId, setDeletingFileId] = useState(null);

    useEffect(() => {
        if (activeItem === "users") {
            fetchUsers();
        }

        if (activeItem === "reports") {
            fetchReports();
        }
    }, [activeItem]);

    useEffect(() => {
        if (selectedSubNav === "zones") {
            fetchZones();
        }
        if (selectedSubNav === "clubs") {
            fetchClubs();
        }
    }, [selectedSubNav]);

    const fetchZones = async () => {
        try {
            const response = await axios.get(`${URL}/api/zones`);
            setAllZones(response.data.zones);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`${URL}/api/clubs`);
            setAllClubs(response.data.clubs);
        } catch (error) {
            console.log(error);
        }
    };

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

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/api/admin/files/getAll`);
            setReports(response.data.files);
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

    function convertUTCtoIST(dateInput) {
        const istDate = new Date(dateInput);
        // Format as YYYY-MM-DD HH:mm:ss
        const pad = (n) => n.toString().padStart(2, "0");
        return `${istDate.getFullYear()}-${pad(istDate.getMonth() + 1)}-${pad(
            istDate.getDate()
        )} ${pad(istDate.getHours())}:${pad(istDate.getMinutes())}:${pad(
            istDate.getSeconds()
        )}`;
    }

    const downloadFile = async (fileName, fileId) => {
        try {
            setDownloading(true);
            setDownloadingFileId(fileId);
            const response = await axios.get(
                `${URL}/api/admin/files/downloadFile/${fileId}`,
                { responseType: "blob" } // Important: tells axios to treat response as binary
            );

            // Create a URL for the blob object
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            // Attempt to get filename from Content-Disposition header
            let filename = fileName; // default fallback
            const disposition = response.headers["content-disposition"];
            if (disposition) {
                const filenameMatch = disposition.match(/filename="(.+)"/);
                if (filenameMatch.length === 2) filename = filenameMatch[1];
            }
            a.download = filename;
            document.body.appendChild(a); // Append to DOM for Firefox compatibility
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Clean up
        } catch (error) {
            console.error(error);
        } finally {
            setDownloading(false);
            setDownloadingFileId(null);
        }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            setDeleting(true);
            setDeletingFileId(fileId);
            await axios.delete(
                `${URL}/api/admin/files/deleteByFileId/${fileId}`
            );
            await fetchReports();
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
            setDeletingFileId(null);
        }
    };

    const reportContents = () => {
        return (
            <div>
                <p
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.2em",
                        marginBottom: "15px",
                    }}
                >
                    Here are some reports
                </p>
                {reports.map((report, index) => (
                    <div
                        key={index}
                        style={{
                            border: "1px solid #333", // darker border for clarity
                            borderRadius: "6px", // rounded corners
                            padding: "15px",
                            marginBottom: "15px", // space between reports
                            backgroundColor: "#f0f0f0", // subtle light background
                            color: "#000",
                            boxShadow: "1px 1px 3px rgba(0,0,0,0.1)", // subtle shadow
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                alignItems: "flex-start",
                            }}
                        >
                            <p style={{ margin: 0, fontWeight: "600" }}>
                                {report.originalName}
                            </p>
                            <p style={{ margin: 0, fontWeight: "600" }}>
                                {convertUTCtoIST(report.uploadDate).toString()}
                            </p>
                            <p style={{ margin: 0, color: "#555" }}>
                                {report.userName}
                            </p>
                            <p style={{ margin: 0, color: "#555" }}>
                                {report.userZone}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "6px",
                                alignItems: "center",
                            }}
                        >
                            <button
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#007BFF",
                                    color: downloading ? "#f3f3f3" : "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "0.9em",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        "#0056b3")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        "#007BFF")
                                }
                                onClick={() =>
                                    downloadFile(report.originalName, report.id)
                                }
                                disabled={downloading}
                            >
                                {downloading &&
                                downloadingFileId === report.id ? (
                                    <CircularProgress size={20} color='white' />
                                ) : (
                                    "Download"
                                )}
                            </button>
                            <button
                                onClick={() => handleDeleteFile(report.id)}
                                style={{ padding: "5px 15px" }}
                            >
                                {deleting && deletingFileId === report.id ? (
                                    <CircularProgress size={20} color='white' />
                                ) : (
                                    <DeleteIcon />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
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

    const sendMail = async (name, email, password) => {
        try {
            setSendingMail(true);
            const receiver = email;
            const response = await axios.post(
                `${URL}/api/admin/user/sendMail/${receiver}`,
                {
                    name,
                    email,
                    password,
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
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                    }}
                >
                    <select
                        value={selectedSubNav}
                        onChange={(e) => {
                            setSelectedSubNav(e.target.value);
                            setSelectedClub("");
                            setSelectedZone("");
                        }}
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            backgroundColor: "black",
                        }}
                    >
                        <option value='zones'>Zones</option>
                        <option value='clubs'>Clubs</option>
                    </select>
                    {selectedSubNav === "zones" && (
                        <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                backgroundColor: "black",
                                margin: "0px 20px",
                            }}
                        >
                            <option></option>
                            {allZones.map((zone) => (
                                <option key={zone._id} value={zone.zone}>
                                    {zone.zone}
                                </option>
                            ))}
                        </select>
                    )}
                    {selectedSubNav === "clubs" && (
                        <select
                            value={selectedClub}
                            onChange={(e) => {
                                setSelectedClub(e.target.value);
                            }}
                            style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                backgroundColor: "black",
                                margin: "0px 20px",
                            }}
                        >
                            <option></option>
                            {allClubs?.map((club) => (
                                <option key={club._id} value={club.club}>
                                    {club.club}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
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
                        <p>
                            <i>
                                Note: By click "Push Mail" button, an email will
                                be sent to the newly created user from admin's
                                google account which contains the users logging
                                in email and password
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
                                            details.password
                                            // details.appPassword
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
                                <th>Phone</th>
                                <th>Club</th>
                                {/* <th>Admin</th> */}
                                <th>Email</th>
                                {/* <th>Position</th> */}
                                <th>Zone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => {
                                    if (
                                        selectedZone &&
                                        user.zone !== selectedZone
                                    ) {
                                        return null;
                                    }
                                    if (
                                        selectedClub &&
                                        user.club !== selectedClub
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <tr key={user._id}>
                                            <td>
                                                {user.name}
                                                {user._id ===
                                                localStorage.getItem(
                                                    "userId"
                                                ) ? (
                                                    <span>{" (You)"}</span>
                                                ) : null}
                                            </td>
                                            {/* <td>
                                            {user.isAdmin ? (
                                                <span className='badge admin'>
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className='badge'>
                                                    No
                                                </span>
                                            )}
                                        </td> */}
                                            <td>{user.phone}</td>
                                            <td>{user.club}</td>
                                            <td>{user.email}</td>
                                            {/* <td>{user.position}</td> */}
                                            <td>{user.zone}</td>
                                        </tr>
                                    );
                                })
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
