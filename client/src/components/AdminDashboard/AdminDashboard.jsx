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
import DownloadIcon from "@mui/icons-material/Download";

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
    const [editUserPopup, setEditUserPopup] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [editUser, setEditUser] = useState({});
    const [fieldsToModifyPopup, setFieldToModifyPopup] = useState(false);
    const [fieldsToModify, setFieldsToModify] = useState({});
    const [resetPasswordPopup, setResetPasswordPopup] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [deleteConfirmationPopup, setDeleteConfirmationPopup] =
        useState(false);
    const [resettingPassword, setResettingPassword] = useState(false);
    useEffect(() => {
        if (activeItem === "users") {
            fetchUsers();
            fetchClubs();
            fetchZones();
        }

        if (activeItem === "reports") {
            fetchReports();
            fetchZones();
        }
    }, [activeItem]);

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
    const downloadAllFiles = async () => {
        try {
            const response = await axios.get(
                `${URL}/api/admin/files/downloadAllFiles`,
                {
                    responseType: "blob", // Important for handling binary data like ZIP files
                }
            );

            // Create a blob URL for the downloaded file
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary link element to trigger the download
            const link = document.createElement("a");
            link.href = url;

            // Get the filename from the Content-Disposition header if available
            const contentDisposition = response.headers["content-disposition"];
            let filename = "All Reports.zip"; // Default filename

            if (contentDisposition) {
                const filenameMatch =
                    contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute("download", filename);
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading files:", error);
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
            setDeleteConfirmationPopup(false);
            await axios.delete(
                `${URL}/api/admin/files/deleteByFileId/${deletingFileId}`
            );
            await fetchReports();
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
            setDeletingFileId(null);
        }
    };

    const handleEdit = (user) => {
        setEditUserPopup(true);
        setEditUser(user);
        setCurrentUser(user);
    };

    const handleEditUser = () => {
        const fieldsToModify = {
            name: false,
            email: false,
            phone: false,
            zone: false,
            club: false,
            isAdmin: false,
        };
        if (currentUser.name !== editUser.name) fieldsToModify.name = true;
        if (currentUser.phone !== editUser.phone) fieldsToModify.phone = true;
        if (currentUser.email !== editUser.email) fieldsToModify.email = true;
        if (currentUser.zone !== editUser.zone) fieldsToModify.zone = true;
        if (currentUser.club !== editUser.club) fieldsToModify.club = true;
        if (currentUser.isAdmin !== editUser.isAdmin)
            fieldsToModify.isAdmin = true;
        setFieldsToModify(fieldsToModify);
        setFieldToModifyPopup(true);
    };

    const formatFileSize = (size) => {
        const mbSize = size / 1024 / 1024;
        return mbSize.toFixed(2) + " MB";
    };

    const reportContents = () => {
        return (
            <div>
                <Dialog
                    open={deleteConfirmationPopup}
                    fullWidth
                    maxWidth='sm'
                    BackdropProps={{
                        style: {
                            backgroundColor: "rgba(0,0,0,0)",
                        },
                    }}
                >
                    <DialogContent>
                        <p>Are you sure you want to delete this file?</p>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={handleDeleteFile}>Yes</button>
                        <button
                            onClick={() => setDeleteConfirmationPopup(false)}
                        >
                            No
                        </button>
                    </DialogActions>
                </Dialog>

                <div className='user-content-top-bar'>
                    <div className='user-content'>
                        <p>Filter users by: </p>
                        <select
                            value={selectedSubNav}
                            onChange={(e) => {
                                setSelectedSubNav(e.target.value);
                                setSelectedClub("");
                                setSelectedZone("");
                            }}
                            className='user-filter-select'
                        >
                            <option value='zones'>Zones</option>
                        </select>
                        {selectedSubNav === "zones" && (
                            <select
                                value={selectedZone}
                                onChange={(e) =>
                                    setSelectedZone(e.target.value)
                                }
                                className='user-filter-select-zone'
                            >
                                <option></option>
                                {allZones.map((zone) => (
                                    <option key={zone._id} value={zone.zone}>
                                        {zone.zone}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className='sub-nav-buttons'>
                        <button
                            className='icon-button'
                            title='Download All Files'
                            onClick={downloadAllFiles}
                        >
                            <DownloadIcon />
                        </button>
                        <button
                            className='icon-button'
                            title='Refresh'
                            onClick={() => {
                                fetchZones();
                                fetchReports();
                            }}
                        >
                            <RefreshIcon />
                        </button>
                    </div>
                </div>
                <p className='reports-content--title'>
                    {reports.length > 0
                        ? "Reports are sorted by most recent uploads"
                        : "No reports found"}
                </p>
                {reports.map((report, index) => {
                    if (selectedZone && report.userZone !== selectedZone) {
                        return;
                    }
                    if (!report.isActive) {
                        return;
                    }

                    return (
                        <div key={index} className='reports-container'>
                            <div className='report-details'>
                                <p>
                                    File Name: <i>{report.originalName}</i>
                                </p>
                                <p>
                                    Uploaded at:
                                    <i>
                                        {" " +
                                            convertUTCtoIST(
                                                report.uploadDate
                                            ).toString()}
                                    </i>
                                </p>
                                <p className='report-user'>
                                    Report File Size:
                                    <i>
                                        {" " + formatFileSize(report.fileSize)}
                                    </i>
                                </p>
                                <p className='report-user'>
                                    Reporter Name: <i>{report.userName}</i>
                                </p>
                                <p className='report-user'>
                                    Reporter Zone: <i>{report.userZone}</i>
                                </p>
                            </div>
                            <div className='report-action'>
                                <button
                                    className='report-download--button'
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            "#0056b3")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            "#007BFF")
                                    }
                                    onClick={() =>
                                        downloadFile(
                                            report.originalName,
                                            report.id
                                        )
                                    }
                                    disabled={downloading}
                                >
                                    {downloading &&
                                    downloadingFileId === report.id ? (
                                        <CircularProgress
                                            size={20}
                                            color='white'
                                        />
                                    ) : (
                                        <DownloadIcon />
                                    )}
                                </button>
                                <button
                                    // onClick={() => handleDeleteFile(report.id)}
                                    onClick={() => {
                                        console.log("Goingin");
                                        setDeleteConfirmationPopup(true);
                                        setDeletingFileId(report.id);
                                    }}
                                    className='report-delete--button'
                                >
                                    {deleting &&
                                    deletingFileId === report.id ? (
                                        <CircularProgress
                                            size={20}
                                            color='white'
                                        />
                                    ) : (
                                        <DeleteIcon />
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleInputChange = (field) => (e) => {
        setDetails((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
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

    const sendMail = async (email, password) => {
        try {
            setSendingMail(true);
            const receiver = email;
            const response = await axios.post(
                `${URL}/api/admin/user/sendMail/${receiver}`,
                {
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
            setNewPassword("");
            setCurrentUser({});
            setEditUser({});
            setResettingPassword(false);
        }
    };

    function toCapitalize(str) {
        if (!str) return ""; // handle empty or null strings
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleModifyInDatabase = async () => {
        try {
            await axios.patch(
                `${URL}/api/admin/user/modify/${currentUser?._id}`,
                {
                    editUser,
                }
            );
            setFieldToModifyPopup(false);
            setEditUser({});
            setEditUserPopup(false);
            setCurrentUser({});
            setFieldsToModify({});
            alert(
                "User updated successfully, Refresh the Users to see modifications"
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleResetPassword = async () => {
        try {
            const userId = currentUser?._id;
            console.log(userId);
            const adminId = localStorage.getItem("userId");
            console.log(adminId);
            console.log(adminPassword);
            console.log(newPassword);
            if (!adminId) {
                alert(
                    "Admin Details are missing try logging out and logging in back"
                );
                return;
            }
            if (!userId) {
                alert("User Details are missing");
                return;
            }
            await axios.patch(
                `${URL}/api/admin/user/resetPassword/${adminId}/${userId}`,
                {
                    adminPassword,
                    newPassword,
                }
            );

            alert(
                "User password reset successfully, Refresh the Users to see modifications"
            );
            setResettingPassword(true);
            setPushMailPopup(true);
            setFieldToModifyPopup(false);
            setEditUser({});
            setEditUserPopup(false);
            setFieldsToModify({});
            setResetPasswordPopup(false);
            setAdminPassword("");
        } catch (error) {
            if (error.status === 400) {
                alert("New password cannot be the same exisiting password");
                return;
            }
            if (error.status === 401) {
                alert("Your password is incorrect");
                return;
            }
            if (error.status === 403) {
                alert("You are not authorized to perform this action");
                return;
            }
            if (error.status === 404) {
                alert("Either Admin details or user details are not found");
                // return;
            }
            console.log(error);
        }
    };

    const usersContent = () => {
        return (
            <div className='users-content'>
                <div className='user-content-top-bar'>
                    {/* Subnav / Action buttons */}
                    <div className='user-content'>
                        <p>Filter users by: </p>
                        <select
                            value={selectedSubNav}
                            onChange={(e) => {
                                setSelectedSubNav(e.target.value);
                                setSelectedClub("");
                                setSelectedZone("");
                            }}
                            className='user-filter-select'
                        >
                            <option value='zones'>Zones</option>
                            <option value='clubs'>Clubs</option>
                        </select>
                        {selectedSubNav === "zones" && (
                            <select
                                value={selectedZone}
                                onChange={(e) =>
                                    setSelectedZone(e.target.value)
                                }
                                className='user-filter-select-zone'
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
                                className='user-filter-select-club'
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
                            onClick={() => {
                                fetchUsers();
                                fetchClubs();
                                fetchZones();
                            }}
                        >
                            <RefreshIcon />
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
                        {!sendingMail && !resettingPassword && (
                            <>
                                {/* <input /> */}
                                <button
                                    onClick={() => {
                                        sendMail(
                                            details.email,
                                            details.password
                                            // details.appPassword
                                        );
                                    }}
                                >
                                    Push Mail
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentUser({});
                                        setPushMailPopup(false);
                                    }}
                                >
                                    No
                                </button>
                            </>
                        )}
                        {!sendingMail && resettingPassword && (
                            <>
                                {/* <input /> */}
                                <button
                                    onClick={() => {
                                        console.log(currentUser, newPassword);
                                        sendMail(
                                            currentUser.email,
                                            newPassword
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
                    open={editUserPopup}
                    fullWidth
                    maxWidth='sm'
                    BackdropProps={{
                        style: { backgroundColor: "rgba(0,0,0,0)" },
                    }}
                >
                    <DialogTitle>Edit User Details</DialogTitle>
                    <DialogContent>
                        <div>
                            <div>
                                <label className='input-label'>Name</label>
                                <input
                                    value={editUser?.name}
                                    onChange={(e) => {
                                        setEditUser({
                                            ...editUser,
                                            name: e.target.value,
                                        });
                                    }}
                                    className='input-field-edit'
                                />
                            </div>
                            <div>
                                <label className='input-label'>Phone</label>
                                <input
                                    value={editUser?.phone}
                                    onChange={(e) => {
                                        setEditUser({
                                            ...editUser,
                                            phone: parseInt(e.target.value),
                                        });
                                    }}
                                    className='input-field-edit'
                                />
                            </div>
                            <div>
                                <label className='input-label'>Club</label>
                                <input
                                    value={editUser?.club}
                                    onChange={(e) => {
                                        setEditUser({
                                            ...editUser,
                                            club: e.target.value,
                                        });
                                    }}
                                    className='input-field-edit'
                                />
                            </div>
                            <div>
                                <label className='input-label'>Email</label>
                                <input
                                    value={editUser?.email}
                                    onChange={(e) => {
                                        setEditUser({
                                            ...editUser,
                                            email: e.target.value,
                                        });
                                    }}
                                    className='input-field-edit'
                                />
                            </div>
                            <div>
                                <label className='input-label'>Zone</label>
                                <input
                                    value={editUser?.zone}
                                    onChange={(e) => {
                                        setEditUser({
                                            ...editUser,
                                            zone: e.target.value,
                                        });
                                    }}
                                    className='input-field-edit'
                                />
                            </div>
                            <div className='admin-checkbox'>
                                <input
                                    type='checkbox'
                                    checked={editUser?.isAdmin}
                                    onChange={() => {
                                        setEditUser({
                                            ...editUser,
                                            isAdmin: !editUser?.isAdmin,
                                        });
                                    }}
                                />
                                <label className='input-label'>Admin</label>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button
                            onClick={() => {
                                setResetPasswordPopup(true);
                            }}
                        >
                            Reset password for this user
                        </button>
                        <button onClick={handleEditUser}>
                            Check Modifications
                        </button>
                        <button
                            onClick={() => {
                                setEditUserPopup(false);
                                setEditUser({});
                                setCurrentUser({});
                            }}
                        >
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={resetPasswordPopup}
                    fullWidth
                    maxWidth='sm'
                    BackdropProps={{
                        style: { backgroundColor: "rgba(0,0,0,0)" },
                    }}
                >
                    <DialogTitle>Reset Users password</DialogTitle>
                    <DialogContent>
                        <label className='input-label'>Your Password</label>
                        <input
                            label='Your Password'
                            type='password'
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className='input-field'
                        />
                        <label className='input-label'>New Password</label>
                        <input
                            label='New Password'
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='input-field'
                        />
                    </DialogContent>
                    <DialogActions>
                        <button onClick={handleResetPassword}>
                            Reset password
                        </button>
                        <button
                            onClick={() => {
                                setResetPasswordPopup(false);
                            }}
                        >
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={fieldsToModifyPopup}
                    fullWidth
                    maxWidth='sm'
                    onClose={() => {
                        setFieldToModifyPopup(false);
                    }}
                    BackdropProps={{
                        style: { backgroundColor: "rgba(0,0,0,0)" },
                    }}
                >
                    <DialogTitle>Modified Data</DialogTitle>
                    <DialogContent>
                        <div>
                            {Object.keys(fieldsToModify).map((field) => {
                                if (fieldsToModify[field] === false) {
                                    return null;
                                }
                                return (
                                    <div>
                                        <label className='input-label'>
                                            {toCapitalize(field)}
                                        </label>
                                        <input
                                            type='text'
                                            value={editUser[field]}
                                            onChange={(e) =>
                                                setCurrentUser({
                                                    ...currentUser,
                                                    [field]: e.target.value,
                                                })
                                            }
                                            className='input-field-edit'
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={handleModifyInDatabase}>
                            Change in Database
                        </button>
                        <button
                            onClick={() => {
                                setFieldToModifyPopup(false);
                            }}
                        >
                            Cancel
                        </button>
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
                                className='input-field-select'
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
                                className='input-field-select'
                                onChange={(e) => {
                                    setDetails({
                                        ...details,
                                        zone: e.target.value,
                                    });
                                }}
                                placeholder='Zone'
                            >
                                <option value=''>Select Zone</option>
                                {allZones.map((zone) => (
                                    <option value={zone.zone} key={zone._id}>
                                        {zone.zone}
                                    </option>
                                ))}
                            </select>
                            <select
                                className='input-field-select'
                                onChange={(e) => {
                                    setDetails({
                                        ...details,
                                        club: e.target.value,
                                    });
                                }}
                                placeholder='Club'
                            >
                                <option value=''>Select Club</option>
                                {allClubs.map((club) => (
                                    <option value={club.club} key={club._id}>
                                        {club.club}
                                    </option>
                                ))}
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
                                <th>Edit</th>
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
                                        <>
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
                                                <td>
                                                    <EditIcon
                                                        color='black'
                                                        style={{
                                                            margin: "0px 10px",
                                                        }}
                                                        className='edit-button'
                                                        onClick={() => {
                                                            handleEdit(user);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        </>
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
