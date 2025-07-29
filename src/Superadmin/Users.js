import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    const [newFullName, setNewFullName] = useState("");
    const [newMobile, setNewMobile] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5269/api/Users");
        setUsers(res.data.data || []);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setNewFullName("");
        setNewMobile("");
        setNewEmail("");
        setNewPassword("");
        setIsEdit(false);
        setEditingUserId(null);
    };

    const handleAddOrUpdateUser = async () => {
        if (!newFullName || !newMobile || !newEmail || !newPassword) {
            alert("Please fill all fields.");
            return;
        }

        const payload = {
            fullName: newFullName,
            mobile: newMobile,
            email: newEmail,
            password: newPassword,
        };

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5269/api/Users/${editingUserId}`, {
                    id: editingUserId,
                    ...payload,
                });
            } else {
                await axios.post("http://localhost:5269/api/Users/signup", payload);
            }
            fetchUsers();
            setShowModal(false);
            resetForm();
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEditClick = (user) => {
        setNewFullName(user.fullName);
        setNewMobile(user.mobile);
        setNewEmail(user.email);
        setNewPassword(user.password);
        setEditingUserId(user.id);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5269/api/Users/${id}`);
                fetchUsers();
                Swal.fire("Deleted!", "User has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "Failed to delete user.", "error");
            }
        }
    };

    const filteredUsers = users.filter((u) =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const handleDownload = () => {
        const headers = ["ID", "Full Name", "Mobile", "Email", "Password"];
        const rows = users.map((user) => [
            user.id,
            user.fullName,
            user.mobile,
            user.email,
            user.password,
        ]);
        const csvContent =
            [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-muted">
                <i className="bi bi-person-plus me-2 text-success"></i>Add Users
            </h2>
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setShowModal(true);
                    resetForm();
                }}
            >
                Add User
            </button>

            <div className="row g-2 mb-3 align-items-center">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <button className="btn btn-success" onClick={handleDownload}>
                        <i className="bi bi-download"></i> Export
                    </button>
                </div>
                <div className="col-md-4 text-end">
                    <label className="form-label me-2 mb-0">Items per page:</label>
                    <select
                        className="form-select d-inline-block w-auto"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.fullName}</td>
                            <td>{user.mobile}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEditClick(user)}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteClick(user.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {paginatedUsers.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No Users Found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li
                            key={page}
                            className={`page-item ${currentPage === page ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal */}
            {showModal && (
                <>
                    <div
                        className="modal fade show"
                        style={{ display: "block" }}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {isEdit ? "Edit User" : "Add User"}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        className="form-control mb-2"
                                        value={newFullName}
                                        onChange={(e) => setNewFullName(e.target.value)}
                                        placeholder="Enter Full Name"
                                    />
                                    <label className="form-label">Mobile</label>
                                    <input
                                        className="form-control mb-2"
                                        value={newMobile}
                                        onChange={(e) => setNewMobile(e.target.value)}
                                        placeholder="Enter Mobile No"
                                    />
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-control mb-2"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter Email"
                                    />
                                    <label className="form-label">Password</label>
                                    <input
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter Password"
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleAddOrUpdateUser}
                                    >
                                        {isEdit ? "Update" : "Add"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}

export default Users;
