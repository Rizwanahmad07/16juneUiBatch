import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [degree, setDegree] = useState("");
  const [skill, setSkill] = useState("");
  const [showJobs, setShowJobs] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [, setSelectedJobId] = useState(null);
  const [appliedResume, setAppliedResume] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  const staticJobs = [
  { id: 1, companyname: "TechNova Solutions", skill: "Angular", experience: "2", vacancy: "4", degree: "B.Tech" },
  { id: 2, companyname: "FinEdge Technologies", skill: "Python", experience: "3", vacancy: "6", degree: "M.Tech" },
  { id: 3, companyname: "SoftGears", skill: "React.js", experience: "1", vacancy: "3", degree: "BSC" },
  { id: 4, companyname: "DataMatrix Corp", skill: "Data Science", experience: "2", vacancy: "5", degree: "BCA" },
  { id: 5, companyname: "CyberCore", skill: "Java", experience: "4", vacancy: "2", degree: "MCA" },
  { id: 6, companyname: "CloudNest", skill: "AWS", experience: "3", vacancy: "7", degree: "B.Tech" },
  { id: 7, companyname: "NetSmart Systems", skill: "Node.js", experience: "2", vacancy: "4", degree: "M.Tech" },
  { id: 8, companyname: "BrightTech", skill: "SQL", experience: "1", vacancy: "3", degree: "BSC" },
  { id: 9, companyname: "Turing Minds", skill: "Machine Learning", experience: "2", vacancy: "2", degree: "BCA" },
  { id: 10, companyname: "VisionWare", skill: "JavaScript", experience: "3", vacancy: "6", degree: "MCA" },
];

const staticResume = [
  { id: 1, jobseekername: "Rizwan Ahmad", passyear: "2023", experience: "2 Year", skill: "React.js", degree: "B.Tech" },
  { id: 2, jobseekername: "Vivek Solanki", passyear: "2024", experience: "3 Year", skill: "Python", degree: "M.Tech" },
  { id: 3, jobseekername: "Piyush Sharma", passyear: "2022", experience: "4 Year", skill: "Node.js", degree: "BCA" },
  { id: 4, jobseekername: "Anjali Mehta", passyear: "2021", experience: "3 Year", skill: "AWS", degree: "MCA" },
  { id: 5, jobseekername: "Rohan Singh", passyear: "2020", experience: "5 Year", skill: "Angular", degree: "B.Tech" },
];


  const filteredJobs = staticJobs.filter(
    job =>
      (!degree || job.degree === degree) &&
      (!skill || job.skill.toLowerCase().includes(skill.toLowerCase()))
  );

  const filteredResume = staticResume.filter(
    job =>
      (!degree || job.degree === degree) &&
      (!skill || job.skill.toLowerCase().includes(skill.toLowerCase()))
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-3">
        <i className="bi bi-speedometer2 me-2 text-info fs-1"></i> Welcome to MRA Infotech
      </h2>
      <p className="lead">Monitor your job portal activity and manage operations below.</p>

      <div className="card bg-light mb-3">
        <div className="card-header text-center fw-bold" style={{ backgroundColor: "#b8daff" }}>
          Find Job / Company Here Within a Second !!
        </div>
        <div className="card-body py-3">
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-md-4">
              <label className="form-label fw-bold">Select Degree:</label>
              <select
                className="form-select"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              >
                <option value="">-- Select Degree --</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="BSC">BSC</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Select Skill:</label>
              <select
                className="form-select"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              >
                <option value="">-- Select Skill --</option>
                <option value="React">React.js</option>
                <option value="Node.js">Node.js</option>
                <option value="JavaScript">JavaScript</option>
                <option value="ASP.NET">ASP.NET</option>
                <option value="SQL">SQL</option>
              </select>
            </div>

            <div className="col-md-4 d-flex gap-2 mt-4">
              <button
                className="btn btn-primary"
                onClick={() => { setShowJobs(true); setShowResume(false); setSelectedResume(null); }}
              >
                Find Job
              </button>
              <button
                className="btn btn-success"
                onClick={() => { setShowResume(true); setShowJobs(false); }}
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {showJobs && (
        <div className="card mb-4">
          <div className="card-header fw-bold bg-info text-white">Matching Jobs</div>
          <div className="card-body">
            {filteredJobs.length > 0 ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>Job Title</th>
                    <th>Experience</th>
                    <th>Vacancy</th>
                    <th>Degree</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.companyname}</td>
                      <td>{job.skill}</td>
                      <td>{job.experience}</td>
                      <td>{job.vacancy}</td>
                      <td>{job.degree}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setShowLoginPopup(true);
                          }}
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No jobs found for the selected degree and skill.</p>
            )}
          </div>
        </div>
      )}

      {showResume && (
        <div className="card mb-4">
          <div className="card-header fw-bold bg-info text-white">JobSeeker Search</div>
          <div className="card-body">
            {filteredResume.length > 0 ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>JobSeeker Name</th>
                    <th>Pass Year</th>
                    <th>Experience</th>
                    <th>Skill</th>
                    <th>Degree</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResume.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.jobseekername}</td>
                      <td>{job.passyear}</td>
                      <td>{job.experience}</td>
                      <td>{job.skill}</td>
                      <td>{job.degree}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setAppliedResume([...appliedResume, job.id]);
                            setSelectedResume(job);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No JobSeeker found for the selected degree and skill.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal: Resume Detail */}
      {selectedResume && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">JobSeeker Full Detail</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedResume(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6"><strong>Name:</strong> {selectedResume.jobseekername}</div>
                  <div className="col-md-6"><strong>Passing Year:</strong> {selectedResume.passyear}</div>
                  <div className="col-md-6"><strong>Experience:</strong> {selectedResume.experience}</div>
                  <div className="col-md-6"><strong>Skill:</strong> {selectedResume.skill}</div>
                  <div className="col-md-6"><strong>Degree:</strong> {selectedResume.degree}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Login Prompt */}
      {showLoginPopup && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="btn-close" onClick={() => { setShowLoginPopup(false); setSelectedJobId(null); }}></button>
              </div>
              <div className="modal-body">
                <p>You must login to apply for this job.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowLoginPopup(false); setSelectedJobId(null); }}>Cancel</button>
                <button className="btn btn-primary" onClick={() => { setShowLoginPopup(false); setSelectedJobId(null); navigate("/login"); }}>Go to Login</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
