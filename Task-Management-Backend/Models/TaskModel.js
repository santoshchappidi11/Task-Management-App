import mongoose from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  priority: {
    type: String,
  },
  status: {
    type: String,
  },
  labels: {
    type: String,
  },
});

export default mongoose.model("Task", taskSchema);
