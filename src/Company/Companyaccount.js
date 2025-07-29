import React, { useState, useEffect } from "react";
import axios from "axios";

function Companyaccount() {
    const [company, setCompany] = useState(null);
    const [formData, setFormData] = useState({
        companyname: "",
        address: "",
        city: "",
        pincode: "",
        mobile: "",
        email: "",
        contactperson: "",
        detail: "",
    });
    const [showModal, setShowModal] = useState(false);
    const employeeId = localStorage.getItem("employeeId"); // Ensure this is stored at login

    const fetchCompanyData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/Companyjpcs/by-employee/${employeeId}`);

            setCompany(res.data);
        } catch (err) {
            setCompany(null); // No company data yet
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, );

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (company) {
                // Update
                await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/Companyjpcs/${employeeId}`, {
                    ...formData,
                    employeeId,
                });

            } else {
                // Add
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/Companyjpcs`, {
                    ...formData,
                    employeeId,
                });

            }
            setShowModal(false);
            fetchCompanyData();
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    const handleExport = () => {
        const header = "ID,Company Name,Address,City,Pincode,Mobile,Email,Contact Person,Detail\n";
        const data = company
            ? `${company.id},${company.companyName},${company.address},${company.city},${company.pincode},${company.mobile},${company.email},${company.contactperson},${company.detail}`
            : "";
        const blob = new Blob([header + data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "company_details.csv";
        link.click();
    };

    return (
        <div className="container mt-4 p-4 rounded shadow" style={{ background: "linear-gradient(to right, #90bae7ff, #2a9ae9ff)", }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3><i className="bi bi-building text-success me-2"></i>Company Account</h3>
                <button className="btn btn-success" onClick={handleExport}>
                    <i className="bi bi-download me-1"></i> Export
                </button>
            </div>

            <div className="card p-4 shadow-lg rounded-4 border-0">
                {company ? (
                    <div className="row">
                        <div className="col-md-6"><strong>ID:</strong> {company.id}</div>
                        <div className="col-md-6"><strong>Company Name:</strong> {company.companyName}</div>
                        <div className="col-md-6"><strong>Address:</strong> {company.address}</div>
                        <div className="col-md-6"><strong>City:</strong> {company.city}</div>
                        <div className="col-md-6"><strong>Pincode:</strong> {company.pincode}</div>
                        <div className="col-md-6"><strong>Mobile No.:</strong> {company.mobile}</div>
                        <div className="col-md-6"><strong>Email:</strong> {company.email}</div>
                        <div className="col-md-6"><strong>Contact Person:</strong> {company.contactPerson}</div>
                        <div className="col-12 mt-2"><strong>Detail:</strong> {company.detail}</div>
                    </div>
                ) : (
                    <p>No company details found. Please add details.</p>
                )}
                <button
                    className="btn btn-primary mt-4"
                    onClick={() => {
                        if (company) {
                            setFormData({
                                companyname: company.companyName || "",
                                address: company.address || "",
                                city: company.city || "",
                                pincode: company.pincode || "",
                                mobile: company.mobile || "",
                                email: company.email || "",
                                contactperson: company.contactPerson || "",
                                detail: company.detail || "",
                            });

                        } else {
                            setFormData({
                                companyname: "",
                                address: "",
                                city: "",
                                pincode: "",
                                mobile: "",
                                email: "",
                                contactperson: "",
                                detail: "",
                            });
                        }
                        setShowModal(true);
                    }}
                >
                    {company ? "Update Details" : "Add Company Details"}
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{company ? "Update Company Details" : "Add Company Details"}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form className="row g-3">
                                        {[
                                            { label: "Company Name", name: "companyname" },
                                            { label: "Address", name: "address" },
                                            { label: "City", name: "city" },
                                            { label: "Pincode", name: "pincode" },
                                            { label: "Mobile", name: "mobile" },
                                            { label: "Email", name: "email" },
                                            { label: "Contact Person", name: "contactperson" },
                                        ].map(({ label, name }) => (
                                            <div className="col-12" key={name}>
                                                <label className="form-label">{label}</label>
                                                <input
                                                    type="text"
                                                    name={name}
                                                    className="form-control"
                                                    value={formData[name]}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        ))}
                                        <div className="col-12">
                                            <label className="form-label">Detail</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                name="detail"
                                                value={formData.detail}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleSave}>
                                        {company ? "Update" : "Add"}
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

export default Companyaccount;