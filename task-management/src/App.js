import { Route, Routes } from "react-router-dom";
import "./App.css";
import TaskNavbar from "./Components/Navbar/Navbar.js";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import AddTask from "./Components/Task/AddTask";
import CompletedTasks from "./Components/Task/CompletedTasks";
import DeletedTasks from "./Components/Task/DeletedTasks";
import EditTask from "./Components/Task/EditTask";

function App() {
  return (
    <div className="App">
      <TaskNavbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/add-task" element={<AddTask />} />
        <Route exact path="/edit-task" element={<EditTask />} />
        <Route exact path="/completed-tasks" element={<CompletedTasks />} />
        <Route exact path="/deleted-tasks" element={<DeletedTasks />} />
      </Routes>
    </div>
  );
}

export default App;
