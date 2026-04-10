import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskViewModal from "./TaskViewModal";

export default function AllAvailableTasks({ user }) {
  const [filter, setFilter] = useState("All");
  const [adminTasks, setAdminTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdminTasks = () => {
      const saved = localStorage.getItem("adminTasks");
      setAdminTasks(saved ? JSON.parse(saved) : []);
    };
    
    loadAdminTasks();
    window.addEventListener('storage', loadAdminTasks);
    const interval = setInterval(loadAdminTasks, 2000);

    return () => {
      window.removeEventListener('storage', loadAdminTasks);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const loadSubmissions = () => {
      const saved = localStorage.getItem("studentSubmissions");
      setSubmissions(saved ? JSON.parse(saved) : []);
    };
    
    loadSubmissions();
    window.addEventListener('storage', loadSubmissions);
    const interval = setInterval(loadSubmissions, 2000);

    return () => {
      window.removeEventListener('storage', loadSubmissions);
      clearInterval(interval);
    };
  }, []);

  const filteredAdminTasks = filter === "All"
    ? adminTasks
    : adminTasks.filter(t => t.difficulty.toLowerCase() === filter.toLowerCase());

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

  return (
    <div className="student-root" style={{ padding: "2rem", minHeight: "100vh" }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2em"}}>
        <h1 style={{margin:0,color:"#22243a"}}>All Available Tasks</h1>
        <button 
          onClick={() => navigate('/student')}
          style={{
            background:"#2366d1",
            color:"#fff",
            border:"none",
            borderRadius:"8px",
            padding:"0.7em 1.5em",
            fontWeight:600,
            cursor:"pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={{ marginBottom: "2em" }}>
        <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {filteredAdminTasks.length === 0 ? (
        <div className="task-list-empty">
          {filter === "All" ? "No tasks available yet" : `No ${filter} tasks available`}
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "2em",
          marginBottom: "3em",
          gridAutoRows: "1fr"
        }}>
          {filteredAdminTasks.map((task) => (
            <div key={task.id} style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5em",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              minHeight: "300px"
            }}>
              <div style={{flex: 1}}>
                <div style={{fontWeight:"600",fontSize:"1.15em",color:"#2267b0",marginBottom:"0.5em"}}>
                  {task.title}
                </div>
                <div style={{color:"#555",margin:"0.4em 0",fontSize:"0.95em",lineHeight:"1.5"}}>
                  {task.description}
                </div>
                {task.requirements && (
                  <div style={{
                    fontSize:"0.9em",
                    color:"#777",
                    marginTop:"0.8em",
                    padding:"0.8em",
                    background:"#f9fafb",
                    borderRadius:"6px",
                    borderLeft:"3px solid #2267b0"
                  }}>
                    <strong>Requirements:</strong> {task.requirements}
                  </div>
                )}
              </div>

              <div style={{marginTop:"1em",paddingTop:"1em",borderTop:"1px solid #e5e7eb"}}>
                <div style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"0.8em",
                  flexWrap:"wrap",
                  marginBottom:"1em"
                }}>
                  <span style={{
                    background: task.difficulty === 'Easy' ? '#eafcef' : 
                               task.difficulty === 'Medium' ? '#fff8e5' : '#ffe5e7',
                    color: task.difficulty === 'Easy' ? '#1fa57c' : 
                           task.difficulty === 'Medium' ? '#e9b013' : '#e63946',
                    padding:"0.3em 0.7em",
                    borderRadius:"5px",
                    fontWeight: 600,
                    fontSize:"0.85em"
                  }}>
                    {task.difficulty}
                  </span>
                  <span style={{fontSize:"0.9em",color:"#888"}}>
                    Max Points: <strong>{task.maxPoints}</strong>
                  </span>
                  {task.referenceFiles && task.referenceFiles.length > 0 && (
                    <span style={{fontSize:"0.9em",color:"#888"}}>
                      📎 {task.referenceFiles.length} file{task.referenceFiles.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div style={{fontSize:"0.85em",color:"#b3acd8",marginBottom:"1em"}}>
                  Posted: {task.date}
                </div>
                <button 
                  onClick={() => handleViewTask(task)}
                  style={{
                    background: "#232937", 
                    color: "#fff", 
                    border: "none",
                    borderRadius: "6px", 
                    padding: "0.7em 1.2em", 
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: 600,
                    fontSize:"0.95em"
                  }}>
                  View Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskViewModal
        visible={showTaskModal}
        task={selectedTask}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmission}
      />
    </div>
  );
}
