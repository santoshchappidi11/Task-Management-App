import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import {
  updateUserDetails,
  Login,
  Register,
  getCurrentUser,
} from "./Controllers/UserControllers.js";
import { checkIsValidUser } from "./Middlewares/CheckValidUser.js";
import {
  addTaskTitle,
  completedTasks,
  deleteAllTasks,
  deleteCompletedTask,
  deleteTask,
  deletedTasks,
  getEditTask,
  getYourTasks,
  permanentDeleteTask,
  revokeCompletedTask,
  revokeDeletedTask,
  updateTask,
} from "./Controllers/TaskController.js";

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
app.use(morgan("dev"));

// ---------------------------------->
app.post("/register", Register);
app.post("/login", Login);
app.post("/get-current-user", getCurrentUser);
app.post("/update-user-details", updateUserDetails);

app.post("/get-your-tasks", checkIsValidUser, getYourTasks);
app.post("/add-task-title", checkIsValidUser, addTaskTitle);
app.post("/update-task", checkIsValidUser, updateTask);
app.post("/get-edit-task", checkIsValidUser, getEditTask);
app.post("/delete-task", checkIsValidUser, deleteTask);
app.post("/completed-tasks", checkIsValidUser, completedTasks);
app.post("/deleted-tasks", checkIsValidUser, deletedTasks);
app.post("/delete-completed-task", checkIsValidUser, deleteCompletedTask);
app.post("/permanent-delete-task", checkIsValidUser, permanentDeleteTask);
app.post("/revoke-completed-task", checkIsValidUser, revokeCompletedTask);
app.post("/revoke-deleted-task", checkIsValidUser, revokeDeletedTask);
app.post("/delete-all-tasks", checkIsValidUser, deleteAllTasks);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to DB"))
  .catch((error) =>
    console.log(error, "something went wrong! can't connect to DB")
  );

app.listen(8000, () => {
  console.log("Listening on port 8000...");
});
