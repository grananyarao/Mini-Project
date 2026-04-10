import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "./CreateTaskModal";
import EvaluateSubmissionModal from "./EvaluateSubmissionModal";

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("adminTasks");
    if (!saved) return [];
    return JSON.parse(saved).filter(task => task.adminName === user.name);
  });

  const [submissions, setSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("adminTasks");
    const allTasks = saved ? JSON.parse(saved) : [];
    const otherTasks = allTasks.filter(t => t.adminName !== user.name);
    const updatedAll = [...tasks, ...otherTasks];
    localStorage.setItem("adminTasks", JSON.stringify(updatedAll));
  }, [tasks, user.name]);

  useEffect(() => {
    const loadSubmissions = () => {
      const savedSubs = localStorage.getItem("studentSubmissions");
      if (!savedSubs) {
        setSubmissions([]);
        return;
      }
      const allSubs = JSON.parse(savedSubs);
      const adminTaskTitles = tasks.map(t => t.title);
      const filteredSubs = allSubs.filter(sub => adminTaskTitles.includes(sub.taskTitle));
      setSubmissions(filteredSubs);
    };

    loadSubmissions();
    window.addEventListener('storage', loadSubmissions);
    const interval = setInterval(loadSubmissions, 2000);

    return () => {
      window.removeEventListener('storage', loadSubmissions);
      clearInterval(interval);
    };
  }, [tasks]);

  const totalTasks = tasks.length;
  const totalSubmissions = submissions.length;
  const pendingEvaluation = submissions.filter(s => s.status === "Pending").length;
  const evaluatedSubmissions = submissions.filter(s => s.status === "Evaluated");

  function handleCreateTask(e, referenceFiles = []) {
    e.preventDefault();
    const form = e.target;
    const taskData = {
      id: editingTask ? editingTask.id : Date.now(),
      adminName: user.name,
      title: form.title.value,
      description: form.description.value,
      requirements: form.requirements.value,
      difficulty: form.difficulty.value,
      maxPoints: form.maxPoints.value,
      date: new Date().toLocaleDateString('en-GB'),
      referenceFiles: referenceFiles
    };
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? taskData : t));
      setEditingTask(null);
    } else {
      setTasks([taskData, ...tasks]);
    }
    setShowModal(false);
    form.reset();
  }

  function handleEdit(task) {
    setEditingTask(task);
    setShowModal(true);
  }

  function handleDelete(taskId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  }

  function handleEvaluate(submission) {
    const task = tasks.find(t => t.title === submission.taskTitle);
    const submissionWithTaskInfo = {
      ...submission,
      taskMaxPoints: task?.maxPoints || 10
    };
    setSelectedSubmission(submissionWithTaskInfo);
    setShowEvaluateModal(true);
  }

  function handleSubmitEvaluation(evaluationData) {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === evaluationData.submissionId
        ? {
            ...sub,
            status: "Evaluated",
            points: evaluationData.points,
            feedback: evaluationData.feedback,
            evaluatedAt: evaluationData.evaluatedAt
          }
        : sub
    );
    // Update submissions globally in localStorage
    const savedSubs = localStorage.getItem("studentSubmissions");
    const allSubs = savedSubs ? JSON.parse(savedSubs) : [];
    const updatedAllSubs = allSubs.map(sub => {
      if (sub.id === evaluationData.submissionId) return {
        ...sub,
        status: "Evaluated",
        points: evaluationData.points,
        feedback: evaluationData.feedback,
        evaluatedAt: evaluationData.evaluatedAt
      };
      return sub;
    });
    localStorage.setItem("studentSubmissions", JSON.stringify(updatedAllSubs));
    setSubmissions(updatedSubmissions);

    alert("Evaluation submitted successfully!");
    setShowEvaluateModal(false);
    setSelectedSubmission(null);
  }

  return (
    <div className="admin-root">
      {/* Stat Cards */}
      <div className="admin-card-row">
        <div className="admin-stat-card">
          <span className="admin-icon">📄</span>
          <div className="admin-stat-title">Total Tasks</div>
          <div className="admin-stat-value">{totalTasks}</div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-icon">📋</span>
          <div className="admin-stat-title">Total Submissions</div>
          <div className="admin-stat-value">{totalSubmissions}</div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-icon">✔️</span>
          <div className="admin-stat-title">Pending Evaluation</div>
          <div className="admin-stat-value">{pendingEvaluation}</div>
        </div>
      </div>

      {/* Create Task Button */}
      <div style={{ marginLeft: "2em", marginBottom: "2em" }}>
        <button className="btn-admin-purple" onClick={() => {
          setEditingTask(null);
          setShowModal(true);
        }}>
          <span style={{ fontSize: "1.2em" }}>+</span> Create Task
        </button>
      </div>

      {/* Tasks and Pending Submissions Section */}
      <div className="admin-tasks-row">
        <div className="admin-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2em" }}>
            <h2 style={{ marginBottom: "0" }}>Tasks</h2>
            {tasks.length > 3 && (
              <button className="view-more-btn" onClick={() => navigate('/admin/all-tasks')}>
                View More
              </button>
            )}
          </div>
          {tasks.length === 0 ? (
            <div className="task-list-empty">No tasks created yet</div>
          ) : (
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              {tasks.slice(0, 3).map((task) => (
                <li key={task.id} className="admin-task-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", color: "#8654e0", marginBottom: "0.3em" }}>{task.title}</div>
                      <div style={{ color: "#555", fontSize: "0.98em" }}>{task.description}</div>
                      <div style={{ fontSize: "0.92em", color: "#b3acd8", marginTop: "0.35em" }}>
                        {task.difficulty} • {task.maxPoints} points • {task.date}
                        {task.referenceFiles && task.referenceFiles.length > 0 && (
                          <span style={{ marginLeft: "0.5em" }}>• 📎 {task.referenceFiles.length} file{task.referenceFiles.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5em", marginLeft: "1em" }}>
                      <button className="task-edit-btn" onClick={() => handleEdit(task)}>Edit</button>
                      <button className="task-delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending Submissions Panel */}
        <div className="admin-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2em" }}>
            <h2 style={{ marginBottom: "0" }}>Pending Submissions</h2>
          </div>
          {pendingEvaluation === 0 ? (
            <div className="submissions-empty">No pending submissions</div>
          ) : (
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              {submissions.filter(s => s.status === "Pending").slice(0, 3).map((sub) => (
                <li key={sub.id} className="admin-submission-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", color: "#8654e0" }}>{sub.studentName}</div>
                      <div style={{ color: "#555" }}>Submitted: <strong>{sub.taskTitle}</strong></div>
                      <div style={{ fontSize: "0.96em", color: "#b3acd8", marginTop: "0.2em" }}>{sub.submittedAt}</div>
                    </div>
                    <button
                      className="evaluate-btn"
                      onClick={() => handleEvaluate(sub)}
                    >
                      Evaluate
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Evaluated Tasks Section with View More */}
      <div style={{ marginLeft: "2em", marginTop: "2.5em" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1em", maxWidth: "900px" }}>
          <h2 style={{ margin: 0, color: "#22243a" }}>Evaluated Tasks</h2>
          {evaluatedSubmissions.length > 3 && (
            <button className="view-more-btn" onClick={() => navigate('/admin/all-evaluated-tasks')}>
              View More
            </button>
          )}
        </div>
        {evaluatedSubmissions.length === 0 ? (
          <div className="evaluated-empty">No evaluated submissions yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1em", maxWidth: "900px" }}>
            {evaluatedSubmissions.slice(0, 3).map((sub) => {
              // Lookup the maxPoints for this task
              const task = tasks.find(t => t.title === sub.taskTitle);
              const maxPoints = task && task.maxPoints ? task.maxPoints : (sub.taskMaxPoints || 10);
              return (
                <div key={sub.id} className="evaluated-task-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1em", marginBottom: "0.5em" }}>
                        <div style={{ fontWeight: "600", fontSize: "1.1em", color: "#2267b0" }}>
                          {sub.taskTitle}
                        </div>
                        <span style={{
                          background: "#eafcef",
                          color: "#1fa57c",
                          padding: "0.3em 0.8em",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "0.9em"
                        }}>
                          Evaluated
                        </span>
                      </div>
                      <div style={{ color: "#555", marginBottom: "0.3em" }}>
                        <strong>Student:</strong> {sub.studentName}
                      </div>
                      <div style={{ color: "#555", marginBottom: "0.3em" }}>
                        <strong>Points Awarded:</strong> {sub.points}/{maxPoints}
                      </div>
                      {sub.feedback && (
                        <div style={{
                          background: "#f7f4fd",
                          padding: "0.8em",
                          borderRadius: "8px",
                          marginTop: "0.5em",
                          border: "1px solid #ede1ff"
                        }}>
                          <strong style={{ color: "#8654e0", fontSize: "0.95em" }}>Feedback:</strong>
                          <div style={{ color: "#555", fontSize: "0.95em", marginTop: "0.3em" }}>
                            {sub.feedback}
                          </div>
                        </div>
                      )}
                      <div style={{ fontSize: "0.9em", color: "#888", marginTop: "0.5em" }}>
                        Submitted: {sub.submittedAt} • Evaluated: {sub.evaluatedAt}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateTaskModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        onCreate={handleCreateTask}
        editingTask={editingTask}
      />

      <EvaluateSubmissionModal
        visible={showEvaluateModal}
        submission={selectedSubmission}
        onClose={() => {
          setShowEvaluateModal(false);
          setSelectedSubmission(null);
        }}
        onEvaluate={handleSubmitEvaluation}
      />
    </div>
  );
}
