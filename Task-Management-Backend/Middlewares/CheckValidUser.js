import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

export const checkIsValidUser = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedData?.userId;

    const user = await UserModel.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "No user found!" });

    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
