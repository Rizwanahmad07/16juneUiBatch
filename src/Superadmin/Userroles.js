import axios from "axios";
import { useEffect, useState } from "react";

function Userroles() {
  const [userroles, setUserRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [loading, setLoading] = useState(false);

  const fetchUserRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5269/api/UserRoles");
      console.log("UserRoles API response:", res.data);
      setUserRoles(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching user roles:", err);
      alert("Failed to fetch user roles. Please check if the server is running.");
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setUserId("");
    setRoleId("");
    setEditId(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setUserId(String(item.userId || ""));
    setRoleId(String(item.roleId || ""));
    setEditId(item.id);
    setShowModal(true);
  };

  const handleOpenDeleteModal = (item) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    if (userId.trim() === "" || roleId.trim() === "") {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      userId: parseInt(userId),
      roleId: parseInt(roleId)
    };

    // Validate that the values are valid numbers
    if (isNaN(payload.userId) || isNaN(payload.roleId)) {
      alert("Please enter valid numeric values for User ID and Role ID.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (modalMode === "add") {
        console.log("Adding user role:", payload);
        response = await axios.post("http://localhost:5269/api/UserRoles", payload, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } else {
        console.log("Updating user role:", { id: editId, ...payload });
        response = await axios.put(`http://localhost:5269/api/UserRoles/${editId}`, {
          id: editId,
          ...payload
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }

      console.log("Save response:", response);

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchUserRoles();
        setShowModal(false);
        setUserId("");
        setRoleId("");
        setEditId(null);
        alert(modalMode === "add" ? "User role assigned successfully!" : "User role updated successfully!");
      } else {
        alert("Operation failed: " + (response.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error saving user role:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data || "Unknown server error";
        alert(`Operation failed: ${errorMsg} (Status: ${err.response.status})`);
      } else if (err.request) {
        alert("Error: No response from server. Please check if the server is running.");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    setLoading(true);
    try {
      console.log("Deleting user role with ID:", deleteItem.id);
      const response = await axios.delete(`http://localhost:5269/api/UserRoles/${deleteItem.id}`);
      
      console.log("Delete response:", response);

      if (response.status === 200 || response.status === 204) {
        await fetchUserRoles();
        setShowDeleteModal(false);
        setDeleteItem(null);
        alert("User role deleted successfully!");
      } else {
        alert("Delete failed: " + (response.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting user-role:", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data || "Unknown server error";
        alert(`Delete failed: ${errorMsg} (Status: ${err.response.status})`);
      } else if (err.request) {
        alert("Error: No response from server. Please check if the server is running.");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (userroles.length === 0) {
      alert("No user roles to export.");
      return;
    }

    const headers = ["ID", "User ID", "Role ID"];
    const rows = userroles.map(u => [
      u.id || "",
      u.userId || "",
      u.roleId || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "userroles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = userroles.filter(r =>
    String(r.roleId || "").includes(searchTerm.trim()) ||
    String(r.userId || "").includes(searchTerm.trim()) ||
    String(r.id || "").includes(searchTerm.trim())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="container mt-4">
      <h2 className="text-muted">
        <i className="bi bi-person-lines-fill me-2 text-success"></i>
        User Roles Management
      </h2>

      <button 
        className="btn btn-primary mb-3" 
        onClick={handleOpenAddModal}
        disabled={loading}
      >
        <i className="bi bi-plus-circle me-2"></i>Add User Role
      </button>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by ID, User ID, or Role ID..."
            value={searchTerm} 
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>
        <div className="col-md-4">
          <button 
            className="btn btn-success" 
            onClick={handleDownload}
            title="Download CSV"
          >
            <i className="bi bi-download"></i> Export
          </button>
        </div>
        <div className="col-md-4 text-md-end">
          <label className="form-label me-2 mb-0">Items per page:</label>
          <select 
            className="form-select d-inline-block w-auto" 
            value={pageSize}
            onChange={e => {
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
            <th>User ID</th>
            <th>Role ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? paginated.map(r => (
            <tr key={r.id || Math.random()}>
              <td>{r.id || "N/A"}</td>
              <td>{r.userId || "N/A"}</td>
              <td>{r.roleId || "N/A"}</td>
              <td>
                <button 
                  className="btn btn-sm btn-warning me-2" 
                  onClick={() => handleOpenEditModal(r)}
                  disabled={loading}
                  title="Edit User Role"
                >
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleOpenDeleteModal(r)}
                  disabled={loading}
                  title="Delete User Role"
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center">
                {searchTerm ? "No user roles found matching your search." : "No User Roles Found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={`bi ${modalMode === "add" ? "bi-plus-circle" : "bi-pencil"} me-2`}></i>
                    {modalMode === "add" ? "Add" : "Edit"} User Role
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)} 
                    disabled={loading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">User ID <span className="text-danger">*</span></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Enter User ID"
                      value={userId}
                      onChange={e => setUserId(e.target.value)} 
                      disabled={loading}
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role ID <span className="text-danger">*</span></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Enter Role ID"
                      value={roleId}
                      onChange={e => setRoleId(e.target.value)} 
                      disabled={loading}
                      min="1"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)} 
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSave} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {modalMode === "add" ? "Assigning..." : "Updating..."}
                      </>
                    ) : (
                      modalMode === "add" ? "Assign Role" : "Update Role"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => !loading && setShowModal(false)}
          ></div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteItem && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
                    Confirm Delete
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loading}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this user role assignment?</p>
                  <div className="alert alert-warning">
                    <strong>User Role Details:</strong><br/>
                    <strong>ID:</strong> {deleteItem.id || "N/A"}<br/>
                    <strong>User ID:</strong> {deleteItem.userId || "N/A"}<br/>
                    <strong>Role ID:</strong> {deleteItem.roleId || "N/A"}
                  </div>
                  <p className="text-danger">
                    <i className="bi bi-exclamation-triangle"></i> This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete User Role"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => !loading && setShowDeleteModal(false)}
          ></div>
        </>
      )}
    </div>
  );
}

export default Userroles;