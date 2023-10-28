import TaskModel from "../Models/TaskModel.js";
import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

export const getYourTasks = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const tasks = await TaskModel.find({ userId });

    if (tasks?.length) {
      return res.status(200).json({ success: true, tasks });
    }

    return res.status(404).json({ success: false, message: "No Tasks" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const addTaskTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const { token } = req.body;

    if (!title)
      return res
        .status(404)
        .json({ success: false, message: "Title is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const user = await UserModel.findById(userId);

    if (user) {
      const task = new TaskModel({
        title,
        userId: user._id,
      });
      await task.save();

      const tasks = await TaskModel.find({ userId });

      return res
        .status(201)
        .json({ success: true, message: "New Todo Added!", tasks });
    }

    return res.status(404).json({ success: false, message: "No User Found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId, token } = req.body;
    const { title, description, dueDate, priority, status } =
      req.body.taskDetails;

    if (!taskId)
      return res
        .status(404)
        .json({ success: false, message: "Task Id is required!" });

    if (!title)
      return res
        .status(404)
        .json({ success: false, message: "Title is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, userId: userId },
      { title, description, dueDate, priority, status },
      { new: true }
    );

    if (task) {
      if (status == "Completed") {
        const user = await UserModel.findById(userId);
        user?.completedTasks?.push(task);
        await user.save();
        const filteredTasks = await TaskModel.findByIdAndDelete(taskId);
        // await filteredTasks.save();
        if (filteredTasks) {
          const tasks = await TaskModel.find({ userId });
          return res
            .status(200)
            .json({ success: true, tasks, message: "Task Updated!" });
        }
      }
      const tasks = await TaskModel.find({ userId });
      return res
        .status(200)
        .json({ success: true, tasks, message: "Task Updated!" });
    }

    return res
      .status(404)
      .json({ success: false, message: "Can't update the task!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getEditTask = async (req, res) => {
  try {
    const { token, taskId } = req.body;

    if (!taskId)
      return res
        .status(404)
        .json({ success: false, message: "Task Id is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const task = await TaskModel.findOne({ _id: taskId, userId });
    // console.log(task);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Can't get your task!" });
    }
    return res
      .status(200)
      .json({ success: true, task: task, message: "Your task title!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId, token } = req.body;

    if (!taskId)
      return res
        .status(404)
        .json({ success: false, message: "Task Id is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const deletedTask = await TaskModel.findOneAndDelete({
      _id: taskId,
      userId,
    });

    if (deletedTask) {
      const user = await UserModel.findById(userId);

      if (user) {
        user?.deletedTasks?.push(deletedTask);
        await user.save();
        const tasks = await TaskModel.find({ userId });
        return res
          .status(200)
          .json({ success: true, tasks, message: "Task Deleted!" });
      }

      return res
        .status(404)
        .json({ success: false, message: "No user found!" });
    }

    return res
      .status(404)
      .json({ success: false, message: "something went wrong! can't delete." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const completedTasks = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const user = await UserModel.findById(userId);

    if (user && user?.completedTasks) {
      return res
        .status(200)
        .json({ success: true, tasks: user?.completedTasks });
    }

    return res.status(404).json({ success: false, message: "No user found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deletedTasks = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const user = await UserModel.findById(userId);

    if (user && user?.deletedTasks) {
      return res.status(200).json({ success: true, tasks: user?.deletedTasks });
    }

    return res.status(404).json({ success: false, message: "No user found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCompletedTask = async (req, res) => {
  try {
    const { taskId, token } = req.body;

    if (!taskId)
      return res
        .status(404)
        .json({ success: false, message: "Task Id is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const user = await UserModel.findById(userId);

    if (user) {
      const filteredTasks = user?.completedTasks?.filter(
        (item) => item._id != taskId
      );

      user.completedTasks = filteredTasks;
      await user.save();

      const updatedUser = await UserModel.findById(userId);

      return res.status(200).json({
        success: true,
        tasks: updatedUser.completedTasks,
        message: "Task Deleted!",
      });
    }

    return res.status(404).json({ success: false, message: "No user found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const permanentDeleteTask = async (req, res) => {
  try {
    const { taskId, token } = req.body;

    if (!taskId)
      return res
        .status(404)
        .json({ success: false, message: "Task Id is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const user = await UserModel.findById(userId);

    if (user) {
      const filteredTasks = user?.deletedTasks?.filter(
        (item) => item._id != taskId
      );

      user.deletedTasks = filteredTasks;
      await user.save();

      const updatedUser = await UserModel.findById(userId);

      return res.status(200).json({
        success: true,
        tasks: updatedUser.deletedTasks,
        message: "Task Deleted Permanentely!",
      });
    }

    return res.status(404).json({ success: false, message: "No user found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// export const revokeCompletedTask = async (req, res) => {
//   try {
//     const { token, taskId } = req.body;

//     if (!taskId)
//       return res
//         .status(404)
//         .json({ success: false, message: "Task Id is required!" });

//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decodedData)
//       return res
//         .status(404)
//         .json({ success: false, message: "Token not valid!" });

//     const userId = decodedData.userId;

//     const user = await UserModel.findById(userId);

//     if (user && user?.completedTasks) {
//       for (let i = 0; i < user?.completedTasks?.length; i++) {
//         if (user?.completedTasks[i]._id.equals(taskId)) {
//           const task = new TaskModel({
//             title: user.completedTasks[i].title,
//             description: user.completedTasks[i].description,
//             dueDate: user.completedTasks[i].dueDate,
//             priority: user.completedTasks[i].priority,
//             status: user.completedTasks[i].status,
//             labels: user.completedTasks[i].labels,
//             userId: user.completedTasks[i].userId,
//           });
//           await task.save();
//         }
//       }

//       return res.status(200).json({ success: true, message: "Task Revoked!" });
//     }

//     return res.status(404).json({ success: false, message: "No User Found!" });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };
