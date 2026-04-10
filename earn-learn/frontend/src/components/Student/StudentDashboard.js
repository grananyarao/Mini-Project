import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskViewModal from "./TaskViewModal";

export default function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [adminTasks, setAdminTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Load only admin-posted tasks for students (never include student-created tasks)
  useEffect(() => {
    const loadAdminTasks = () => {
      const saved = localStorage.getItem("adminTasks");
      if (!saved) {
        setAdminTasks([]);
        return;
      }
      // Show only tasks where the poster/adminName's role is "Admin"
      // Your localStorage may not store 'role' with each task; in that case, only admins can post tasks
      // If you DO store creator roles, filter by role; otherwise, filter by adminName matching any admin username
      const tasks = JSON.parse(saved);
      const filtered = tasks.filter(t => t.adminName && t.adminName.toLowerCase() !== user.name.toLowerCase());
      // You may want to add logic to ensure the adminName maps to actual admin users or keep a role field
      // If all tasks in adminTasks are only posted by admins, use: setAdminTasks(tasks);
      setAdminTasks(filtered);
    };
    loadAdminTasks();
    window.addEventListener('storage', loadAdminTasks);
    const interval = setInterval(loadAdminTasks, 2000);
    return () => {
      window.removeEventListener('storage', loadAdminTasks);
      clearInterval(interval);
    };
  }, [user.name]);

  // Load only this logged-in student's submissions
  useEffect(() => {
    const loadSubmissions = () => {
      const saved = localStorage.getItem("studentSubmissions");
      const allSubs = saved ? JSON.parse(saved) : [];
      // Filter to this student's submissions only
      const mySubs = allSubs.filter(sub => sub.studentName === user?.name);
      setSubmissions(mySubs);
    };
    loadSubmissions();
    window.addEventListener('storage', loadSubmissions);
    const interval = setInterval(loadSubmissions, 2000);
    return () => {
      window.removeEventListener('storage', loadSubmissions);
      clearInterval(interval);
    };
  }, [user?.name]);

  const filteredAdminTasks = filter === "All"
    ? adminTasks
    : adminTasks.filter(t => t.difficulty.toLowerCase() === filter.toLowerCase());

  const tasksToDisplay = filteredAdminTasks.slice(0, 3);
  const submissionsToDisplay = submissions.slice(0, 3);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleSubmission = (submissionData) => {
    const newSubmission = {
      ...submissionData,
      id: Date.now(),
      status: "Pending",
      studentName: user?.name || "Student",
      points: 0
    };
    const updatedSubmissions = [newSubmission, ...submissions];
    localStorage.setItem("studentSubmissions", JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);
    alert("Work submitted successfully!");
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const totalPoints = submissions
    .filter(s => s.status === "Evaluated" && s.points)
    .reduce((sum, sub) => sum + parseInt(sub.points || 0), 0);

  const totalSubmissions = submissions.length;

  // Courses config
  const courses = [
    {
      name: "Data Structures and Algorithms",
      points: 200,
      icon: (
        <img
          src="https://img.icons8.com/fluency/48/flow-chart.png"
          alt="DSA"
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: "#fffbe8"
          }}
        />
      )
    },
    {
      name: "Python Programming",
      points: 150,
      icon: <img src="https://img.icons8.com/color/48/000000/python--v1.png" alt="Python" style={{width:40,height:40}}/>
    },
    {
      name: "DBMS",
      points: 250,
      icon: <img src="https://img.icons8.com/color/48/000000/database.png" alt="DBMS" style={{width:40,height:40}}/>
    },
    {
      name: "Computer Networks",
      points: 300,
      icon: <img src="https://img.icons8.com/color/48/000000/internet--v1.png" alt="Networks" style={{width:40,height:40}}/>
    },
    {
      name: "Ui/Ux",
      points: 100,
      icon: <img src="https://img.icons8.com/color/48/000000/paint-palette.png" alt="Ui/Ux" style={{width:40,height:40}}/>
    }
  ];

  return (
    <div className="student-root responsive-root" style={{ padding: "2rem", minHeight: "100vh" }}>
      {/* Stats Cards */}
      <div className="stat-cards-flex">
        <div className="stat-card">
          <div>Total Points</div>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>{totalPoints}</div>
        </div>
        <div className="stat-card">
          <div>Submissions</div>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>{totalSubmissions}</div>
        </div>
        <div className="stat-card">
          <div>Pending Evaluation</div>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>
            {submissions.filter(s => s.status === "Pending").length}
          </div>
        </div>
        <div className="stat-card">
          <div>Enrolled Courses</div>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>0</div>
        </div>
      </div>

      <div className="student-dashboard-row responsive-row">
        {/* Available Tasks Section */}
        <div className="student-panel">
          <h2 style={{ marginBottom: "1em" }}>Available Tasks</h2>
          <div className="tasks-filter-bar">
            <select
              className="filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ flex: "0 0 auto" }}
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            {filteredAdminTasks.length > 3 && (
              <button
                className="view-more-btn"
                onClick={() => navigate('/student/all-tasks')}
                style={{ marginLeft: "auto" }}
              >
                View More
              </button>
            )}
          </div>
          {tasksToDisplay.length === 0 ? (
            <div className="task-list-empty">
              {filter === "All" ? "No tasks available yet" : `No ${filter} tasks available`}
            </div>
          ) : (
            <div className="task-list-col">
              {tasksToDisplay.map((task) => (
                <div key={task.id} className="task-card">
                  <div style={{ marginBottom: "0.5em" }}>
                    <div style={{ fontWeight: "600", fontSize: "1.15em", color: "#2267b0" }}>
                      {task.title}
                    </div>
                    <div style={{ color: "#555", margin: "0.4em 0" }}>
                      {task.description}
                    </div>
                    {task.requirements && (
                      <div style={{ fontSize: "0.95em", color: "#777", marginTop: "0.3em" }}>
                        <strong>Requirements:</strong> {task.requirements}
                      </div>
                    )}
                    <div className="task-meta-group">
                      <span style={{
                        background: task.difficulty === 'Easy' ? '#eafcef' :
                          task.difficulty === 'Medium' ? '#fff8e5' : '#ffe5e7',
                        color: task.difficulty === 'Easy' ? '#1fa57c' :
                          task.difficulty === 'Medium' ? '#e9b013' : '#e63946',
                        padding: "0.3em 0.7em",
                        borderRadius: "5px",
                        fontWeight: 600
                      }}>
                        {task.difficulty}
                      </span>
                      <span>Max Points: <strong>{task.maxPoints}</strong></span>
                      <span style={{ color: "#b3acd8" }}>Posted: {task.date}</span>
                      <button
                        onClick={() => handleViewTask(task)}
                        style={{
                          background: "#232937",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.5em 1.2em",
                          marginLeft: "auto",
                          cursor: "pointer"
                        }}>
                        View Task
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Submissions Section */}
        <div className="student-panel">
          <div className="submissions-header-bar">
            <h2 style={{ marginBottom: 0 }}>My Submissions</h2>
            {submissions.length > 3 && (
              <button
                className="view-more-btn"
                onClick={() => navigate('/student/my-submissions')}
              >
                View More
              </button>
            )}
          </div>
          {submissions.length === 0 ? (
            <div className="my-sub-card">No submissions yet</div>
          ) : (
            <div className="submission-list-col">
              {submissionsToDisplay.map((sub) => (
                <div key={sub.id} className="submission-card">
                  <div className="submission-card-row">
                    <div style={{ flex: 1 }}>
                      <div className="submission-title">
                        {sub.taskTitle}
                      </div>
                      <div className="submission-note">
                        {sub.submissionNote.substring(0, 100)}...
                      </div>
                      {sub.status === "Evaluated" && (
                        <div className="submission-feedback-bar">
                          <div className="submission-feedback-points">
                            Points Awarded: {sub.points}
                          </div>
                          {sub.feedback && (
                            <div className="submission-feedback">
                              <strong>Feedback:</strong> {sub.feedback}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="submission-meta">
                        Submitted: {sub.submittedAt}
                      </div>
                    </div>
                    <span className={sub.status === "Pending" ? "submission-status-pending" : "submission-status-evaluated"}>
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COURSES SECTION - fully responsive */}
      <div style={{ marginTop: "3.5em", width: "100%" }}>
        <h2 style={{ fontWeight: 700, color: "#22243a", marginBottom: "1.15em" }}>Courses</h2>
        <div className="courses-responsive-grid">
          {courses.map((course, idx) => (
            <div key={course.name} className="courses-card">
              <div style={{ fontSize: "2.1em", marginBottom: "0.6em" }}>{course.icon}</div>
              <div style={{
                fontWeight: 700,
                color: "#2267b0",
                fontSize: "1.13em",
                marginBottom: "0.25em",
                textAlign: "center"
              }}>
                {course.name}
              </div>
              <div style={{
                color: "#ea8c13",
                fontWeight: 600,
                marginTop: "0.18em",
                marginBottom: "1.1em",
                fontSize: "1.03em",
                textAlign: "center"
              }}>
                {course.points} points needed to unlock
              </div>
              <button
                style={{
                  background: totalPoints >= course.points ? "#2267b0" : "#bcbcc9",
                  color: "#fff",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.65em 2em",
                  fontSize: "1.02em",
                  cursor: totalPoints >= course.points ? "pointer" : "default",
                  opacity: totalPoints >= course.points ? 1 : 0.7,
                  boxShadow: totalPoints >= course.points ? "0 1px 4px #2267b040" : "none",
                  transition: "background 0.2s"
                }}
                disabled={totalPoints < course.points}
                onClick={() => {
                  if (course.name === "Data Structures and Algorithms" && totalPoints >= course.points) {
                    window.open("https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/", "_blank");
                  } else if (course.name === "Python Programming" && totalPoints >= course.points) {
                    window.open("https://www.learnpython.org/", "_blank");
                  } else if (course.name === "DBMS" && totalPoints >= course.points) {
                    window.open("https://nptel.ac.in/courses/106105175", "_blank");
                  } else if (course.name === "Computer Networks" && totalPoints >= course.points) {
                    window.open("https://nptel.ac.in/courses/106105183", "_blank");
                  } else if (course.name === "Ui/Ux" && totalPoints >= course.points) {
                    window.open("https://learnuiux.in/", "_blank");
                  }
                }}
              >
                {totalPoints >= course.points ? "Enroll Now" : "Locked"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL (unchanged) */}
      <TaskViewModal
        visible={showTaskModal}
        task={selectedTask}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmission}
      />

      {/* Inline Responsive CSS for all layout */}
      <style>
        {`
        .responsive-root {
          min-width: 0;
          box-sizing: border-box;
        }
        .stat-cards-flex {
          display: flex;
          gap: 2em;
          flex-wrap: wrap;
        }
        .student-dashboard-row.responsive-row {
          display: flex;
          gap: 2em;
          flex-wrap: wrap;
        }
        .student-panel {
          flex: 1 1 350px;
          min-width: 320px;
          margin-bottom: 2em;
        }
        .tasks-filter-bar,
        .submissions-header-bar {
          display: flex;
          gap: 1em;
          align-items: center;
          margin-bottom: 1.5em;
          flex-wrap: wrap;
        }
        .task-list-col, .submission-list-col {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
        .task-meta-group {
          display: flex;
          align-items: center;
          gap: 0.8em;
          flex-wrap: wrap;
        }
        .submission-card-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .submission-title {
          font-weight: 600;
          font-size: 1.1em;
          color: #2267b0;
          margin-bottom: 0.3em;
        }
        .submission-note {
          color: #666;
          font-size: 0.95em;
          margin-bottom: 0.4em;
        }
        .submission-feedback-bar {
          background:#f7f4fd;
          padding:0.6em;
          border-radius:6px;
          margin-top:0.5em;
          border:1px solid #ede1ff;
        }
        .submission-feedback-points {
          font-weight:600;
          color:#8654e0;
          margin-bottom:0.3em;
        }
        .submission-feedback {
          font-size: 0.92em;
          color: #555;
        }
        .submission-meta {
          font-size: 0.9em;
          color: #888;
          margin-top: 0.5em;
        }
        .submission-status-pending {
          background: #fff8e5;
          color: #e9b013;
          padding: 0.4em 0.9em;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9em;
        }
        .submission-status-evaluated {
          background: #eafcef;
          color: #1fa57c;
          padding: 0.4em 0.9em;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9em;
        }
        .courses-responsive-grid {
          display: grid;
          width: 100%;
          gap: 2em;
          grid-template-columns: repeat(3, 1fr);
        }
        .courses-card {
          background: #fff;
          border-radius: 11px;
          box-shadow: 0 1px 8px #e6e5ea;
          padding: 1.7em 1.5em 1.6em 1.5em;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 180px;
          max-width: 340px;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 1100px) {
          .courses-responsive-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 730px) {
          .stat-cards-flex,
          .student-dashboard-row.responsive-row {
            flex-direction: column;
            gap: 1.3em;
          }
          .courses-responsive-grid {
            grid-template-columns: 1fr;
            gap: 1.4em;
          }
        }
        @media (max-width: 600px) {
          .student-root {
            padding: 0.7em;
          }
        }
        `}
      </style>
    </div>
  );
}
