import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  completedTasks: {
    type: [Object],
  },
  deletedTasks: {
    type: [Object],
  },
});

export default mongoose.model("User", userSchema);
