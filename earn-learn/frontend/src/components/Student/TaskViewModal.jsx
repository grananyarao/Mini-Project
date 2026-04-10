import React, { useState } from "react";

export default function TaskViewModal({ visible, task, onClose, onSubmit }) {
  const [submissionNote, setSubmissionNote] = useState("");
  const [link, setLink] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  if (!visible || !task) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Prevent submit if no files
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one file before submitting your work.");
      return;
    }
    
    const submissionData = {
      taskId: task.id,
      taskTitle: task.title,
      submissionNote,
      link,
      files: uploadedFiles,
      submittedAt: new Date().toLocaleString('en-GB')
    };
    onSubmit(submissionData);
    // Reset form
    setSubmissionNote("");
    setLink("");
    setUploadedFiles([]);
  };

  return (
    <div className="modal-overlay">
      <div className="task-view-modal">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        {/* Task Details Section */}
        <div className="task-details-section">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:"1em"}}>
            <h2 style={{margin:0,color:"#22243a",fontSize:"1.8em"}}>{task.title}</h2>
            <span style={{
              background: task.difficulty === 'Easy' ? '#eafcef' : 
                         task.difficulty === 'Medium' ? '#fff8e5' : '#ffe5e7',
              color: task.difficulty === 'Easy' ? '#1fa57c' : 
                    task.difficulty === 'Medium' ? '#e9b013' : '#e63946',
              padding:"0.4em 0.9em",
              borderRadius:"6px",
              fontWeight: 600,
              fontSize:"0.95em"
            }}>
              {task.difficulty}
            </span>
          </div>
          
          <p style={{color:"#555",fontSize:"1.05em",lineHeight:"1.6",margin:"0.8em 0"}}>
            {task.description}
          </p>

          {task.requirements && (
            <div style={{marginTop:"1.2em"}}>
              <h3 style={{fontSize:"1.15em",color:"#22243a",marginBottom:"0.5em"}}>Requirements</h3>
              <div style={{
                background:"#f7f4fd",
                padding:"1em",
                borderRadius:"8px",
                color:"#555",
                fontSize:"0.98em",
                lineHeight:"1.6",
                border:"1px solid #ede1ff"
              }}>
                {task.requirements}
              </div>
            </div>
          )}

          {/* Reference Files Section */}
          {task.referenceFiles && task.referenceFiles.length > 0 && (
            <div style={{marginTop:"1.2em"}}>
              <h3 style={{fontSize:"1.15em",color:"#22243a",marginBottom:"0.5em"}}>
                📎 Reference Files
              </h3>
              <div style={{
                background:"#f7f4fd",
                padding:"1em",
                borderRadius:"8px",
                border:"1px solid #ede1ff"
              }}>
                {task.referenceFiles.map((fileName, idx) => (
                  <div key={idx} style={{
                    display:"flex",
                    alignItems:"center",
                    padding:"0.5em 0",
                    color:"#8654e0",
                    fontSize:"0.98em"
                  }}>
                    <span style={{marginRight:"0.5em"}}>📄</span>
                    <span>{fileName}</span>
                  </div>
                ))}
              </div>
              <div style={{
                fontSize:"0.85em",
                color:"#888",
                marginTop:"0.5em",
                fontStyle:"italic"
              }}>
                Download these files for reference while completing this task
              </div>
            </div>
          )}

          {/* Task Info */}
          <div style={{display:"flex",gap:"2em",marginTop:"1.3em",fontSize:"0.95em",color:"#666"}}>
            <div><strong style={{color:"#8654e0"}}>Max Points:</strong> {task.maxPoints}</div>
            <div><strong style={{color:"#8654e0"}}>Posted:</strong> {task.date}</div>
          </div>
        </div>

        {/* Submission Form Section */}
        <div className="submission-form-section">
          <h3 style={{fontSize:"1.3em",color:"#22243a",marginBottom:"0.3em"}}>Submit Your Work</h3>
          <p style={{color:"#777",fontSize:"0.95em",marginBottom:"1.2em"}}>
            Upload files, provide a link, or add notes about your submission
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{fontWeight:600,color:"#22243a",marginBottom:"0.5em",display:"block"}}>
                Submission Note <span style={{color:"#e63946"}}>*</span>
              </label>
              <textarea
                placeholder="Describe your work and any important details for the evaluator..."
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
                required
                rows={4}
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

            <div className="form-group" style={{marginTop:"1.2em"}}>
              <label style={{fontWeight:600,color:"#22243a",marginBottom:"0.5em",display:"block"}}>
                Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/yourrepo or any relevant link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={{
                  width:"100%",
                  padding:"0.7em",
                  borderRadius:"8px",
                  border:"1.2px solid #d3caf0",
                  fontSize:"0.98em"
                }}
              />
            </div>

            <div className="form-group" style={{marginTop:"1.2em"}}>
              <label style={{fontWeight:600,color:"#22243a",marginBottom:"0.5em",display:"block"}}>
                Upload Files <span style={{color:"#e63946"}}>*</span>
              </label>
              <div style={{
                border:"2px dashed #d3caf0",
                borderRadius:"8px",
                padding:"2em",
                textAlign:"center",
                cursor:"pointer",
                background:"#f9f7fd"
              }}
              onClick={() => document.getElementById('file-upload').click()}>
                <div style={{fontSize:"2em",marginBottom:"0.3em"}}>📤</div>
                <div style={{color:"#666",fontSize:"0.95em"}}>Click to upload JPEG or PDF files</div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".jpg,.jpeg,.pdf"
                  multiple
                  onChange={handleFileUpload}
                  style={{display:"none"}}
                  required // <-- Makes upload field mandatory for the browser
                />
              </div>

              {/* Show validation if no files uploaded */}
              {uploadedFiles.length === 0 && (
                <div style={{color:"#e63946",fontSize:"0.95em",marginTop:"0.4em"}}>
                  * Please upload at least one file to submit your work
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div style={{marginTop:"1em"}}>
                  <div style={{fontWeight:600,marginBottom:"0.5em",color:"#22243a"}}>Uploaded Files:</div>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} style={{
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"space-between",
                      background:"#eafcef",
                      padding:"0.6em 0.9em",
                      borderRadius:"6px",
                      marginBottom:"0.5em"
                    }}>
                      <span style={{color:"#1fa57c"}}>✓ {file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        style={{
                          background:"none",
                          border:"none",
                          color:"#e63946",
                          cursor:"pointer",
                          fontSize:"1.2em"
                        }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{display:"flex",justifyContent:"flex-end",marginTop:"1.5em"}}>
              <button
                type="submit"
                style={{
                  background:"#2366d1",
                  color:"#fff",
                  border:"none",
                  borderRadius:"8px",
                  padding:"0.85em 3em",
                  fontSize:"1.05em",
                  fontWeight:600,
                  cursor:"pointer",
                  width:"100%"
                }}>
                Submit Your Work
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
