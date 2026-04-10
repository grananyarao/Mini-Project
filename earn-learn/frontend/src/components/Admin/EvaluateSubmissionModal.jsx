import React, { useState } from "react";

export default function EvaluateSubmissionModal({ visible, submission, onClose, onEvaluate }) {
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFiles, setShowFiles] = useState(false);

  if (!visible || !submission) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const evaluationData = {
      submissionId: submission.id,
      points: parseInt(points),
      feedback,
      evaluatedAt: new Date().toLocaleString('en-GB')
    };
    onEvaluate(evaluationData);
  };

  // Helper: Extract files from either submission.files or submission.attachments
  const submissionFiles =
    Array.isArray(submission.files) && submission.files.length > 0
      ? submission.files
      : Array.isArray(submission.attachments)
        ? submission.attachments
        : [];
  
  return (
    <div className="modal-overlay">
      <div className="evaluate-modal">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        <h2 style={{fontSize:"1.6em",color:"#22243a",marginBottom:"0.3em"}}>
          Evaluate Submission
        </h2>
        <p style={{color:"#777",fontSize:"0.98em",marginBottom:"1.5em"}}>
          Award points and provide feedback for the student
        </p>

        {/* Submission Details */}
        <div style={{
          background:"#f7f4fd",
          padding:"1.2em",
          borderRadius:"10px",
          marginBottom:"1.5em",
          border:"1px solid #ede1ff"
        }}>
          <div style={{marginBottom:"0.5em"}}>
            <strong style={{color:"#22243a"}}>Task:</strong> {submission.taskTitle}
          </div>
          <div style={{marginBottom:"0.5em"}}>
            <strong style={{color:"#22243a"}}>Student:</strong> {submission.studentName}
          </div>
          <div style={{color:"#8654e0",fontWeight:600,marginBottom:"0.5em"}}>
            Max Points: {submission.taskMaxPoints || 10}
          </div>
          <div style={{marginBottom:"0.5em"}}>
            <strong style={{color:"#22243a"}}>Submission Note:</strong> {submission.submissionNote}
          </div>
          {submission.link && (
            <div style={{marginBottom:"0.5em"}}>
              <strong style={{color:"#22243a"}}>Link:</strong> <a href={submission.link} target="_blank" rel="noopener noreferrer">{submission.link}</a>
            </div>
          )}
          <div>
            <strong style={{color:"#22243a"}}>Uploaded Files:</strong>
            <button
              type="button"
              style={{
                marginLeft: "1em",
                padding: "0.25em 0.9em",
                background: "#f2eeff",
                border: "1px solid #b8a4ee",
                borderRadius: "6px",
                color: "#8654e0",
                fontWeight: 600,
                fontSize: "0.99em",
                cursor: "pointer"
              }}
              onClick={() => setShowFiles((prev) => !prev)}
            >
              {showFiles ? "Hide Files" : "View Files"}
            </button>

            {showFiles && (
              <ul style={{margin:"0.7em 0 0 0", padding:0, listStyle:"none"}}>
                {submissionFiles.length > 0 ? (
                  submissionFiles.map((file, idx) => (
                    <li key={idx} style={{
                      background:"#ede1ff",
                      margin:"0 0 0.5em 0",
                      borderRadius:"5px",
                      padding:".4em .8em",
                      color:"#2267b0"
                    }}>
                      {typeof file === "string" ? (
                        // If file is a string, treat as filename or path
                        <a
                          href={`/uploads/${file}`}
                          download={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{color: "#2267b0", textDecoration:"underline"}}
                        >
                          {file}
                        </a>
                      ) : (
                        // If file is a File object, show file name only
                        <span>{file.name}</span>
                      )}
                    </li>
                  ))
                ) : (
                  <span style={{color:"#888"}}>No files uploaded.</span>
                )}
              </ul>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Points Input */}
          <div className="form-group" style={{marginBottom:"1.2em"}}>
            <label style={{
              display:"block",
              fontWeight:600,
              color:"#22243a",
              marginBottom:"0.5em"
            }}>
              Points Awarded (out of {submission.taskMaxPoints || 10})
            </label>
            <input
              type="number"
              min="0"
              max={submission.taskMaxPoints || 10}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
              style={{
                width:"100%",
                padding:"0.7em",
                borderRadius:"8px",
                border:"1.2px solid #d3caf0",
                fontSize:"0.98em"
              }}
            />
            <div style={{fontSize:"0.9em",color:"#888",marginTop:"0.3em"}}>
              Enter a value between 0 and {submission.taskMaxPoints || 10}
            </div>
          </div>
          {/* Feedback Textarea */}
          <div className="form-group" style={{marginBottom:"1.5em"}}>
            <label style={{
              display:"block",
              fontWeight:600,
              color:"#22243a",
              marginBottom:"0.5em"
            }}>
              Feedback
            </label>
            <textarea
              placeholder="Provide constructive feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              style={{
                width:"100%",
                padding:"0.7em",
                borderRadius:"8px",
                border:"1.2px solid #d3caf0",
                fontSize:"0.98em",
                resize:"vertical",
                fontFamily:"inherit"
              }}
            />
          </div>
          {/* Action Buttons */}
          <div style={{display:"flex",justifyContent:"flex-end",gap:"1em"}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background:"#ede8f9",
                color:"#8654e0",
                border:"none",
                borderRadius:"8px",
                padding:"0.75em 2em",
                fontSize:"1.03em",
                fontWeight:600,
                cursor:"pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background:"#8654e0",
                color:"#fff",
                border:"none",
                borderRadius:"8px",
                padding:"0.75em 2.5em",
                fontSize:"1.03em",
                fontWeight:600,
                cursor:"pointer"
              }}
            >
              Submit Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
