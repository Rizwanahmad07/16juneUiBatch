import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:5269/api/Roles");
    setRoles(res.data.data || res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddOrEditRole = async () => {
    if (newRole.trim() === "") return alert("Role name cannot be empty.");

    const payload = isEdit
      ? { id: editRoleId, name: newRole }
      : { name: newRole };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5269/api/Roles/${editRoleId}`, payload);
      } else {
        await axios.post("http://localhost:5269/api/Roles", payload);
      }

      fetchRoles();
      setNewRole("");
      setIsEdit(false);
      setEditRoleId(null);
      setShowAddModal(false);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
      console.error("Error response:", err.response);
    }
  };

  const handleEditClick = (role) => {
    setNewRole(role.name);
    setIsEdit(true);
    setEditRoleId(role.id);
    setShowAddModal(true);
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
        await axios.delete(`http://localhost:5269/api/Roles/${id}`);
        fetchRoles();
        Swal.fire("Deleted!", "Role has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete role.", "error");
      }
    }
  };

  const filteredRoles = roles.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredRoles.length / pageSize);

  return (
    <div className="container mt-4">
      <h2 className="text-muted">
        <i className="bi bi-person-fill-add me-2 text-success"></i>Add Roles
      </h2>
      <button className="btn btn-primary mb-3" onClick={() => {
        setShowAddModal(true);
        setIsEdit(false);
        setNewRole("");
      }}>Add Role</button>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Search..." value={searchTerm} onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-success" onClick={() => {
            const csv = roles.map(c => c.name).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "roles.csv";
            link.click();
          }}><i className="bi bi-download"></i> Export</button>
        </div>
        <div className="col-md-4 text-md-end">
          <label className="form-label me-2 mb-0">Items per page:</label>
          <select className="form-select d-inline-block w-auto" value={pageSize} onChange={e => {
            setPageSize(parseInt(e.target.value));
            setCurrentPage(1);
          }}>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRoles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(role)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(role.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedRoles.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No Roles Found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal for Add/Edit */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEdit ? "Edit Role" : "Add Role"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control" placeholder="Role Name" value={newRole} onChange={e => setNewRole(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddOrEditRole}>
                  {isEdit ? "Save Changes" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showAddModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Roles;