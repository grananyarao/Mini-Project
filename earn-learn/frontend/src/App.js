import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import HomePage from "./components/Home/HomePage";
import StudentDashboard from "./components/Student/StudentDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AllTasks from "./components/Admin/AllTasks";
import AllEvaluatedTasks from "./components/Admin/AllEvaluatedTasks";
import AllAvailableTasks from "./components/Student/AllAvailableTasks";
import AllMySubmissions from "./components/Student/AllMySubmissions";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
        
        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            user && user.role === "Student" 
              ? <StudentDashboard user={user} /> 
              : <HomePage user={user} setUser={setUser} />
          } 
        />
        
        <Route 
          path="/student/all-tasks" 
          element={
            user && user.role === "Student" 
              ? <AllAvailableTasks user={user} /> 
              : <HomePage user={user} setUser={setUser} />
          } 
        />
        
        <Route 
          path="/student/my-submissions" 
          element={
            user && user.role === "Student" 
              ? <AllMySubmissions /> 
              : <HomePage user={user} setUser={setUser} />
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            user && user.role === "Admin" 
              ? <AdminDashboard user={user} /> 
              : <HomePage user={user} setUser={setUser} />
          } 
        />
        
        <Route 
          path="/admin/all-tasks" 
          element={
            user && user.role === "Admin" 
              ? <AllTasks /> 
              : <HomePage user={user} setUser={setUser} />
          } 
        />
        
        <Route 
          path="/admin/all-evaluated-tasks" 
          element={
            user && user.role === "Admin" 
              ? <AllEvaluatedTasks /> 
              : <HomePage user={user} setUser={setUser} />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
