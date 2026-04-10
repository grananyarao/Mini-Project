import React, { useState, useEffect } from "react";

export default function CreateTaskModal({ visible, onClose, onCreate, editingTask }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [difficulty, setDifficulty] = useState(editingTask?.difficulty || "Easy");
  const [maxPoints, setMaxPoints] = useState(
    editingTask?.maxPoints?.toString() || ""
  );

  const defaultPoints = { Easy: "10", Medium: "40", Hard: "80" };

  useEffect(() => {
    if (editingTask && editingTask.referenceFiles) {
      setUploadedFiles(editingTask.referenceFiles.map(name => ({ name })));
    } else {
      setUploadedFiles([]);
    }
    setDifficulty(editingTask?.difficulty || "Easy");
    setMaxPoints(editingTask?.maxPoints?.toString() || "");
    // eslint-disable-next-line
  }, [editingTask, visible]);

  if (!visible) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleDifficultyChange = (e) => {
    const newDiff = e.target.value;
    setDifficulty(newDiff);
    // Only reset to placeholder if not editing or is at old default
    if (!maxPoints || maxPoints === defaultPoints[difficulty]) {
      setMaxPoints(""); // shows placeholder
    }
  };

  const handlePointsFocus = () => {
    // No auto set, keep as is so user can always override
  };

  const handlePointsChange = (e) => {
    setMaxPoints(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use default if value is blank
    const points = maxPoints === "" ? Number(defaultPoints[difficulty]) : Number(maxPoints);
    onCreate(e, uploadedFiles, difficulty, points);
    setUploadedFiles([]);
    setDifficulty("Easy");
    setMaxPoints("");
  };

  return (
    <div className="modal-overlay">
      <div className="create-task-modal" style={{
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        <h2 style={{ fontSize: "1.7em", color: "#8654e0", marginBottom: "0.2em" }}>
          {editingTask ? "Edit Task" : "Create New Task"}
        </h2>
        <p style={{ color: "#888", fontSize: "0.95em", marginBottom: "1.5em" }}>
          Fill in the task details below
        </p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group" style={{ marginBottom: "1.2em" }}>
            <label style={{ display: "block", fontWeight: 600, color: "#8654e0", marginBottom: "0.5em" }}>
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              defaultValue={editingTask?.title || ""}
              required
              style={{
                width: "100%",
                padding: "0.7em",
                borderRadius: "8px",
                border: "1.2px solid #d3caf0",
                fontSize: "0.98em"
              }}
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: "1.2em" }}>
            <label style={{ display: "block", fontWeight: 600, color: "#8654e0", marginBottom: "0.5em" }}>
              Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description"
              defaultValue={editingTask?.description || ""}
              required
              rows={3}
              style={{
                width: "100%",
                padding: "0.7em",
                borderRadius: "8px",
                border: "1.2px solid #d3caf0",
                fontSize: "0.98em",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Requirements */}
          <div className="form-group" style={{ marginBottom: "1.2em" }}>
            <label style={{ display: "block", fontWeight: 600, color: "#8654e0", marginBottom: "0.5em" }}>
              Requirements
            </label>
            <textarea
              name="requirements"
              placeholder="Detailed requirements and expectations"
              defaultValue={editingTask?.requirements || ""}
              rows={3}
              style={{
                width: "100%",
                padding: "0.7em",
                borderRadius: "8px",
                border: "1.2px solid #d3caf0",
                fontSize: "0.98em",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Reference Files Upload */}
          <div className="form-group" style={{ marginBottom: "1.2em" }}>
            <label style={{ display: "block", fontWeight: 600, color: "#8654e0", marginBottom: "0.5em" }}>
              Reference Files (Optional)
            </label>
            <div style={{
              border: "2px dashed #d3caf0",
              borderRadius: "8px",
              padding: "1.5em",
              textAlign: "center",
              cursor: "pointer",
              background: "#f9f7fd",
              transition: "background 0.2s"
            }}
              onClick={() => document.getElementById('reference-file-upload').click()}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f0ff"}
              onMouseLeave={e => e.currentTarget.style.background = "#f9f7fd"}
            >
              <div style={{ fontSize: "1.8em", marginBottom: "0.3em" }}>📎</div>
              <div style={{ color: "#666", fontSize: "0.95em" }}>
                Click to upload reference files for students
              </div>
              <div style={{ color: "#999", fontSize: "0.85em", marginTop: "0.3em" }}>
                PDF, DOCX, images, or any helpful materials
              </div>
              <input
                id="reference-file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: "1em" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.5em", color: "#8654e0" }}>
                  Uploaded Files:
                </div>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f0ecff",
                    padding: "0.6em 0.9em",
                    borderRadius: "6px",
                    marginBottom: "0.5em",
                    border: "1px solid #e0d6ff"
                  }}>
                    <span style={{ color: "#8654e0", fontSize: "0.95em" }}>
                      📄 {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e63946",
                        cursor: "pointer",
                        fontSize: "1.2em",
                        padding: "0 0.3em"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty and Max Points */}
          <div style={{ display: "flex", gap: "1em", marginBottom: "1.5em" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: 600, color: "#8654e0", marginBottom: "0.5em" }}>
                Difficulty
              </label>
              <select
                name="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
                style={{
                  width: "100%",
                  padding: "0.7em",
                  borderRadius: "8px",
                  border: "1.2px solid #d3caf0",
                  fontSize: "0.98em",
                  background: "#fff"
                }}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: "block", fontWeight: 600, color: "#8654e0", marginBottom: "0.5em" }}>
                Max Points
              </label>
              <input
                type="number"
                name="maxPoints"
                value={maxPoints}
                onFocus={handlePointsFocus}
                onChange={handlePointsChange}
                placeholder={defaultPoints[difficulty]}
                min="1"
                required
                style={{
                  width: "100%",
                  padding: "0.7em",
                  borderRadius: "8px",
                  border: "1.2px solid #d3caf0",
                  fontSize: "0.98em"
                }}
                className="points-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1em" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#ede8f9",
                color: "#8654e0",
                border: "none",
                borderRadius: "8px",
                padding: "0.75em 2em",
                fontSize: "1.03em",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "#8654e0",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.75em 2.5em",
                fontSize: "1.03em",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {editingTask ? "Update" : "Create"}
            </button>
          </div>
        </form>
        {/* Faded placeholder CSS */}
        <style>
          {`
            .points-input::placeholder {
              color: #888 !important;
              opacity: 0.5 !important;
            }
          `}
        </style>
      </div>
    </div>
  );
}
