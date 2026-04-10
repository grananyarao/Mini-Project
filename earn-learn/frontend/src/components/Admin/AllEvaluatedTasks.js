import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllEvaluatedTasks() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubmissions = () => {
      const saved = localStorage.getItem("studentSubmissions");
      const allSubmissions = saved ? JSON.parse(saved) : [];
      setSubmissions(allSubmissions.filter(s => s.status === "Evaluated"));
    };
    
    loadSubmissions();
    window.addEventListener('storage', loadSubmissions);
    const interval = setInterval(loadSubmissions, 2000);

    return () => {
      window.removeEventListener('storage', loadSubmissions);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="admin-root" style={{padding: "2rem", minHeight: "100vh"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2em"}}>
        <h1 style={{margin:0,color:"#22243a"}}>All Evaluated Tasks</h1>
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

      {submissions.length === 0 ? (
        <div className="evaluated-empty">No evaluated submissions yet</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "2em",
          marginBottom: "3em",
          gridAutoRows: "1fr"
        }}>
          {submissions.map((sub)=>(
            <div key={sub.id} style={{
              background:"#fff",
              borderRadius:"12px",
              padding:"1.5em",
              boxShadow:"0 2px 10px rgba(0,0,0,0.08)",
              border:"1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              minHeight: "300px",
              position: "relative"
            }}>
              {/* Status Badge */}
              <div style={{
                position: "absolute",
                top: "1em",
                right: "1em"
              }}>
                <span style={{
                  background:"#eafcef",
                  color:"#1fa57c",
                  padding:"0.4em 0.9em",
                  borderRadius:"6px",
                  fontWeight:600,
                  fontSize:"0.85em"
                }}>
                  Evaluated
                </span>
              </div>

              <div style={{flex: 1, paddingRight: "5em"}}>
                <div style={{fontWeight:"600",fontSize:"1.2em",color:"#2267b0",marginBottom:"0.5em"}}>
                  {sub.taskTitle}
                </div>
                <div style={{color:"#555",marginBottom:"0.5em",fontSize:"0.95em"}}>
                  <strong>Student:</strong> {sub.studentName}
                </div>
                <div style={{color:"#555",marginBottom:"0.5em",fontSize:"0.95em"}}>
                  <strong>Points Awarded:</strong> {sub.points}/{sub.taskMaxPoints || 10}
                </div>
                
                {sub.submissionNote && (
                  <div style={{
                    background:"#f9f7fd",
                    padding:"0.8em",
                    borderRadius:"8px",
                    marginTop:"0.8em",
                    border:"1px solid #ede1ff"
                  }}>
                    <strong style={{color:"#8654e0",fontSize:"0.9em"}}>Submission Note:</strong>
                    <div style={{color:"#555",fontSize:"0.9em",marginTop:"0.3em",lineHeight:"1.5"}}>
                      {sub.submissionNote.substring(0, 150)}
                      {sub.submissionNote.length > 150 ? "..." : ""}
                    </div>
                  </div>
                )}
                
                {sub.feedback && (
                  <div style={{
                    background:"#f7f4fd",
                    padding:"0.8em",
                    borderRadius:"8px",
                    marginTop:"0.8em",
                    border:"1px solid #ede1ff"
                  }}>
                    <strong style={{color:"#8654e0",fontSize:"0.9em"}}>Feedback:</strong>
                    <div style={{color:"#555",fontSize:"0.9em",marginTop:"0.3em",lineHeight:"1.5"}}>
                      {sub.feedback}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                marginTop:"1em",
                paddingTop:"1em",
                borderTop:"1px solid #e5e7eb"
              }}>
                <div style={{fontSize:"0.85em",color:"#888"}}>
                  Submitted: {sub.submittedAt}
                </div>
                <div style={{fontSize:"0.85em",color:"#888",marginTop:"0.3em"}}>
                  Evaluated: {sub.evaluatedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
