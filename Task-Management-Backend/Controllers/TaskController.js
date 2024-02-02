import TaskModel from "../Models/TaskModel.js";
import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

export const getYourTasks = async (req, res) => {
  try {
    const { token, priority, sort = "date" } = req.body;
    const { currentKey } = req.body.filterByDate;

    let filter = "";

    if (currentKey === "Old") {
      filter = "1";
    } else if (currentKey === "New") {
      filter = "-1";
    } else {
      filter = "";
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const query = {};
    if (priority) {
      query.priority = priority;
      // { $regex: priority, $options: "i" };
    }

    const sortField = sort.replace(/^-/, "");
    const sortOption = { [sortField]: `${filter}` };

    console.log(sortOption, "sort option");

    const tasks = await TaskModel.find({ userId, ...query }).sort(sortOption);

    // console.log(tasks, "tasks");
    if (tasks && tasks?.length > 0) {
      return res.status(200).json({ success: true, tasks });
    }

    return res.status(404).json({ success: false, message: "No Tasks" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const addTaskTitle = async (req, res) => {
  try {
    const { title, token, status, priority } = req.body;

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
        status,
        priority,
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
      for (let i = 0; i < user?.completedTasks?.length; i++) {
        if (user?.completedTasks[i]._id == taskId) {
          user?.deletedTasks?.push(user?.completedTasks[i]);
          await user.save();
        }
      }

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

export const revokeCompletedTask = async (req, res) => {
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

    const user = await UserModel.findById(userId);

    if (user && user?.completedTasks) {
      for (let i = 0; i < user?.completedTasks?.length; i++) {
        if (user?.completedTasks[i]._id == taskId) {
          // console.log(user?.completedTasks[i], "revoke this!");
          const task = new TaskModel({
            title: user.completedTasks[i].title,
            description: user.completedTasks[i].description,
            dueDate: user.completedTasks[i].dueDate,
            priority: user.completedTasks[i].priority,
            status: user.completedTasks[i].status,
            userId: user.completedTasks[i].userId,
          });
          await task.save();
        }
      }

      const filteredTasks = user?.completedTasks?.filter(
        (item) => item._id != taskId
      );

      user.completedTasks = filteredTasks;
      await user.save();

      const updatedTasks = await UserModel.findById(userId);

      return res.status(200).json({
        success: true,
        tasks: updatedTasks.completedTasks,
        message: "Task Revoked!",
      });
    }

    return res.status(404).json({ success: false, message: "No User Found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const revokeDeletedTask = async (req, res) => {
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

    const user = await UserModel.findById(userId);

    if (user && user?.deletedTasks) {
      for (let i = 0; i < user?.deletedTasks?.length; i++) {
        if (user?.deletedTasks[i]._id == taskId) {
          const task = new TaskModel({
            title: user.deletedTasks[i].title,
            description: user.deletedTasks[i].description,
            dueDate: user.deletedTasks[i].dueDate,
            priority: user.deletedTasks[i].priority,
            status: user.deletedTasks[i].status,
            userId: user.deletedTasks[i].userId,
          });
          await task.save();
        }
      }

      const filteredTasks = user?.deletedTasks?.filter(
        (item) => item._id != taskId
      );

      user.deletedTasks = filteredTasks;
      await user.save();

      const updatedTasks = await UserModel.findById(userId);

      return res.status(200).json({
        success: true,
        tasks: updatedTasks.deletedTasks,
        message: "Task Revoked!",
      });
    }

    return res.status(404).json({ success: false, message: "No User Found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAllTasks = async (req, res) => {
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
      user.deletedTasks = [];
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "All Tasks Deleted Permanentely!" });
    }

    return res.status(404).json({ success: false, message: "User not found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const revokeAllCompletedTasks = async (req, res) => {
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
      for (let i = 0; i < user?.completedTasks?.length; i++) {
        const task = new TaskModel({
          title: user.completedTasks[i].title,
          description: user.completedTasks[i].description,
          dueDate: user.completedTasks[i].dueDate,
          priority: user.completedTasks[i].priority,
          status: user.completedTasks[i].status,
          userId: user.completedTasks[i].userId,
        });
        await task.save();
      }

      user.completedTasks = [];
      await user.save();

      const updatedTasks = await UserModel.findById(userId);

      return res.status(200).json({
        success: true,
        tasks: updatedTasks.completedTasks,
        message: "All Tasks Revoked!",
      });
    }

    return res.status(404).json({ success: false, message: "No User Found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const revokeAllDeletedTasks = async (req, res) => {
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
      for (let i = 0; i < user?.deletedTasks?.length; i++) {
        const task = new TaskModel({
          title: user.deletedTasks[i].title,
          description: user.deletedTasks[i].description,
          dueDate: user.deletedTasks[i].dueDate,
          priority: user.deletedTasks[i].priority,
          status: user.deletedTasks[i].status,
          userId: user.deletedTasks[i].userId,
        });
        await task.save();
      }

      user.deletedTasks = [];
      await user.save();

      const updatedTasks = await UserModel.findById(userId);

      return res.status(200).json({
        success: true,
        tasks: updatedTasks.deletedTasks,
        message: "All Tasks Revoked!",
      });
    }

    return res.status(404).json({ success: false, message: "No User Found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
