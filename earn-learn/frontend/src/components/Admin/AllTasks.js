import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "./CreateTaskModal";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = () => {
      const saved = localStorage.getItem("adminTasks");
      setTasks(saved ? JSON.parse(saved) : []);
    };
    
    loadTasks();
    window.addEventListener('storage', loadTasks);
    const interval = setInterval(loadTasks, 2000);

    return () => {
      window.removeEventListener('storage', loadTasks);
      clearInterval(interval);
    };
  }, []);

  function handleEdit(task) {
    setEditingTask(task);
    setShowModal(true);
  }

  function handleUpdateTask(e, referenceFiles = []) {
    e.preventDefault();
    const form = e.target;
    const taskData = {
      id: editingTask.id,
      title: form.title.value,
      description: form.description.value,
      requirements: form.requirements.value,
      difficulty: form.difficulty.value,
      maxPoints: form.maxPoints.value,
      date: editingTask.date, // Keep original date
      referenceFiles: referenceFiles
    };

    const updatedTasks = tasks.map(t => t.id === editingTask.id ? taskData : t);
    localStorage.setItem("adminTasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setShowModal(false);
    setEditingTask(null);
    form.reset();
  }

  function handleDelete(taskId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      localStorage.setItem("adminTasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    }
  }

  return (
    <div className="admin-root" style={{padding: "2rem", minHeight: "100vh"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2em"}}>
        <h1 style={{margin:0,color:"#22243a"}}>All Tasks</h1>
        <button 
          onClick={() => navigate('/admin')}
          style={{
            background:"#8654e0",
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

      {tasks.length === 0 ? (
        <div className="task-list-empty">No tasks created yet</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "2em",
          marginBottom: "3em",
          gridAutoRows: "1fr"
        }}>
          {tasks.map((task)=>(
            <div key={task.id} style={{
              background:"#fff",
              borderRadius:"12px",
              padding:"1.5em",
              boxShadow:"0 2px 10px rgba(0,0,0,0.08)",
              border:"1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              minHeight: "300px"
            }}>
              <div style={{flex: 1}}>
                <div style={{fontWeight:"600",fontSize:"1.2em",color:"#8654e0",marginBottom:"0.5em"}}>
                  {task.title}
                </div>
                <div style={{color:"#555",fontSize:"1em",marginBottom:"0.5em",lineHeight:"1.5"}}>
                  {task.description}
                </div>
                {task.requirements && (
                  <div style={{
                    background:"#f7f4fd",
                    padding:"0.8em",
                    borderRadius:"8px",
                    marginTop:"0.5em",
                    border:"1px solid #ede1ff"
                  }}>
                    <strong style={{color:"#8654e0",fontSize:"0.95em"}}>Requirements:</strong>
                    <div style={{color:"#555",marginTop:"0.3em",fontSize:"0.9em",lineHeight:"1.5"}}>
                      {task.requirements}
                    </div>
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
                <div style={{display:"flex",gap:"0.5em"}}>
                  <button 
                    onClick={() => handleEdit(task)}
                    style={{
                      flex: 1,
                      background:"#8654e0",
                      color:"#fff",
                      border:"none",
                      borderRadius:"6px",
                      padding:"0.6em 1em",
                      fontWeight:600,
                      cursor:"pointer",
                      fontSize:"0.95em"
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    style={{
                      flex: 1,
                      background:"#fff",
                      color:"#e63946",
                      border:"1px solid #e63946",
                      borderRadius:"6px",
                      padding:"0.6em 1em",
                      fontWeight:600,
                      cursor:"pointer",
                      fontSize:"0.95em"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      <CreateTaskModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        onCreate={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
}
