import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllMySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="student-root" style={{ padding: "2rem", minHeight: "100vh" }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2em"}}>
        <h1 style={{margin:0,color:"#22243a"}}>All My Submissions</h1>
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

      {submissions.length === 0 ? (
        <div className="my-sub-card">No submissions yet</div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "2em",
          marginBottom: "3em",
          gridAutoRows: "1fr"
        }}>
          {submissions.map((sub) => (
            <div key={sub.id} style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5em",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              minHeight: "250px",
              position: "relative"
            }}>
              {/* Status Badge */}
              <div style={{
                position: "absolute",
                top: "1em",
                right: "1em"
              }}>
                <span style={{
                  background: sub.status === "Pending" ? "#fff8e5" : "#eafcef",
                  color: sub.status === "Pending" ? "#e9b013" : "#1fa57c",
                  padding:"0.4em 0.9em",
                  borderRadius:"6px",
                  fontWeight:600,
                  fontSize:"0.85em"
                }}>
                  {sub.status}
                </span>
              </div>

              <div style={{flex: 1, paddingRight: "5em"}}>
                <div style={{fontWeight:"600",fontSize:"1.15em",color:"#2267b0",marginBottom:"0.5em"}}>
                  {sub.taskTitle}
                </div>
                <div style={{color:"#666",fontSize:"0.95em",marginBottom:"1em",lineHeight:"1.5"}}>
                  {sub.submissionNote.substring(0, 200)}
                  {sub.submissionNote.length > 200 ? "..." : ""}
                </div>

                {/* Evaluated Info */}
                {sub.status === "Evaluated" && (
                  <div style={{
                    background:"#f7f4fd",
                    padding:"1em",
                    borderRadius:"8px",
                    marginTop:"1em",
                    border:"1px solid #ede1ff"
                  }}>
                    <div style={{fontWeight:600,color:"#8654e0",marginBottom:"0.5em",fontSize:"1em"}}>
                      Points Awarded: {sub.points}
                    </div>
                    {sub.feedback && (
                      <div style={{fontSize:"0.92em",color:"#555",lineHeight:"1.5"}}>
                        <strong>Feedback:</strong> {sub.feedback}
                      </div>
                    )}
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
                {sub.status === "Evaluated" && sub.evaluatedAt && (
                  <div style={{fontSize:"0.85em",color:"#888",marginTop:"0.3em"}}>
                    Evaluated: {sub.evaluatedAt}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
