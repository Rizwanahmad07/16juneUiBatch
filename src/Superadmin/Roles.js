import axios from "axios";
import { useEffect, useState } from "react";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5269/api/Roles");
      console.log("Roles API response:", res.data);
      setRoles(res.data.data || res.data || []);
    } catch (err) {
      console.error("Role Fetch Error:", err);
      alert("Failed to fetch roles. Please check if the server is running.");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (newRoleName.trim() === "") {
      alert("Role name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const payload = { name: newRoleName.trim() };
      console.log("Adding role payload:", payload);
      
      const response = await axios.post("http://localhost:5269/api/Roles", payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Add Role Response:", response);

      if (response.status === 200 || response.status === 201 || response.data.status === "201") {
        try {
          await fetchRoles();
          setNewRoleName("");
          setShowAddModal(false);
          alert("Role added successfully!");
        } catch (fetchError) {
          console.error("Error fetching updated roles:", fetchError);
          setNewRoleName("");
          setShowAddModal(false);
          alert("Role added, but failed to refresh data. Please reload the page.");
        }
      } else {
        alert("Add role failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding role:", error);
      
      if (error.response) {
        const errorMsg = error.response.data?.message || error.response.data || "Unknown server error";
        alert(`Add role failed: ${errorMsg} (Status: ${error.response.status})`);
      } else if (error.request) {
        alert("Error: No response from server. Please check if the server is running.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async () => {
    if (editRoleName.trim() === "") {
      alert("Role name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      // Remove ID from payload to avoid 400 error
      const payload = { name: editRoleName.trim() };
      console.log("Updating role payload:", payload);
      console.log("Role ID being updated:", currentRole.id);
      
      const response = await axios.put(`http://localhost:5269/api/Roles/${currentRole.id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Update Role Response:", response);

      if (response.status === 200 || response.status === 204) {
        try {
          await fetchRoles();
          setCurrentRole(null);
          setEditRoleName("");
          setShowEditModal(false);
          alert("Role updated successfully!");
        } catch (fetchError) {
          console.error("Error fetching updated roles:", fetchError);
          setCurrentRole(null);
          setEditRoleName("");
          setShowEditModal(false);
          alert("Role updated, but failed to refresh data. Please reload the page.");
        }
      } else {
        alert("Update failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating role:", error);
      
      if (error.response) {
        console.error("Full error response:", error.response.data);
        console.error("Error status:", error.response.status);
        
        // Try PATCH if PUT fails with 400
        if (error.response.status === 400) {
          console.log("PUT failed, trying PATCH method...");
          try {
            const patchPayload = { name: editRoleName.trim() };
            const patchResponse = await axios.patch(`http://localhost:5269/api/Roles/${currentRole.id}`, patchPayload, {
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (patchResponse.status === 200 || patchResponse.status === 204) {
              await fetchRoles();
              setCurrentRole(null);
              setEditRoleName("");
              setShowEditModal(false);
              alert("Role updated successfully!");
              setLoading(false);
              return;
            }
          } catch (patchError) {
            console.error("PATCH also failed:", patchError);
          }
        }
        
        const errorMsg = error.response.data?.message || 
                        error.response.data?.error || 
                        JSON.stringify(error.response.data) || 
                        "Unknown server error";
        alert(`Update failed: ${errorMsg} (Status: ${error.response.status})`);
      } else if (error.request) {
        alert("Error: No response from server. Please check if the server is running.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteRole) return;

    setLoading(true);

    try {
      console.log("Deleting role with ID:", deleteRole.id);
      const response = await axios.delete(`http://localhost:5269/api/Roles/${deleteRole.id}`);

      console.log("Delete Response:", response);

      if (response.status === 200 || response.status === 204) {
        try {
          await fetchRoles();
          setDeleteRole(null);
          setShowDeleteModal(false);
          alert("Role deleted successfully!");
        } catch (fetchError) {
          console.error("Error fetching updated roles:", fetchError);
          setDeleteRole(null);
          setShowDeleteModal(false);
          alert("Role deleted, but failed to refresh data. Please reload the page.");
        }
      } else {
        alert("Delete failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      
      if (error.response) {
        const errorMsg = error.response.data?.message || error.response.data || "Unknown server error";
        alert(`Delete failed: ${errorMsg} (Status: ${error.response.status})`);
      } else if (error.request) {
        alert("Error: No response from server. Please check if the server is running.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (role) => {
    setCurrentRole(role);
    setEditRoleName(role.name || "");
    setShowEditModal(true);
  };

  const openDeleteModal = (role) => {
    setDeleteRole(role);
    setShowDeleteModal(true);
  };

  const handleDownload = () => {
    if (roles.length === 0) {
      alert("No roles to export.");
      return;
    }

    const headers = ["ID", "Role Name"];
    const rows = roles.map(role => [
      role.id || "",
      role.name || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "roles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRoles = (roles || []).filter(role =>
    (role.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredRoles.length / pageSize);

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-muted">
          <i className="bi bi-person-fill-add me-2 text-success"></i>Manage Roles
        </h2>

        <button 
          className="btn btn-primary mb-3" 
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          Add Role
        </button>

        <div className="row g-2 mb-3 align-items-center">
          <div className="col-md-4">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search roles..." 
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
              <th>Role Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.map(role => (
              <tr key={role.id || Math.random()}>
                <td>{role.id || "N/A"}</td>
                <td>{role.name || "N/A"}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-warning me-2" 
                    onClick={() => openEditModal(role)}
                    disabled={loading}
                    title="Edit Role"
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => openDeleteModal(role)}
                    disabled={loading}
                    title="Delete Role"
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginatedRoles.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">
                  {searchTerm ? "No roles found matching your search." : "No Roles Found."}
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

        {/* Add Role Modal */}
        {showAddModal && (
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Role</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowAddModal(false)}
                    disabled={loading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter Role Name" 
                      value={newRoleName} 
                      onChange={(e) => setNewRoleName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleAddRole}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding...
                      </>
                    ) : (
                      "Add Role"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && currentRole && (
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Role</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowEditModal(false)}
                    disabled={loading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter Role Name" 
                      value={editRoleName} 
                      onChange={(e) => setEditRoleName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowEditModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-warning" 
                    onClick={handleEditRole}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Role"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deleteRole && (
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loading}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this role?</p>
                  <div className="alert alert-warning">
                    <strong>Role Details:</strong><br/>
                    <strong>ID:</strong> {deleteRole.id || "N/A"}<br/>
                    <strong>Name:</strong> {deleteRole.name || "N/A"}
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
                    onClick={handleDeleteRole}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete Role"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backdrop */}
        {(showAddModal || showEditModal || showDeleteModal) && (
          <div 
            className="modal-backdrop fade show" 
            onClick={() => {
              if (!loading) {
                setShowAddModal(false);
                setShowEditModal(false);
                setShowDeleteModal(false);
              }
            }}
          ></div>
        )}
      </div>
    </>
  );
}

export default Roles;