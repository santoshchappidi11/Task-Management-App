import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;
    if (!name || !email || !password || !number)
      return res
        .status(404)
        .json({ success: false, message: "All fields are required!" });

    const isEmailExist = await UserModel.find({ email: email });
    if (isEmailExist.length) {
      return res.status(404).json({
        success: false,
        message: "This email already exists, try different email!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      number,
      password: hashedPassword,
    });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Registration successfull!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(404)
        .json({ success: false, message: "All fields are required!" });

    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    if (user.isBlocked) {
      return res.status(404).json({
        success: false,
        message: "You have been blocked!",
      });
    }

    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (isPasswordRight) {
      const userObject = {
        userId: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
      };

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "Login successfull",
        user: userObject,
        token: token,
      });
    }
    return res
      .status(404)
      .json({ success: false, message: "Password is wrong" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Not a valid json token!" });

    const userId = decodedData?.userId;

    const user = await UserModel.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    const userObj = {
      userId: user?._id,
      name: user?.name,
      email: user?.email,
      number: user?.number,
    };

    return res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const { name, password } = req.body;
    const { token } = req.body;

    if (name || password) {
      if (!token)
        return res
          .status(404)
          .json({ success: false, message: "Token is required!" });

      const decodedData = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedData)
        return res
          .status(404)
          .json({ success: false, message: "Not a valid token!" });

      const userId = decodedData?.userId;

      const user = await UserModel.findById(userId);

      if (user) {
        if (name?.length) {
          user.name = name;
        }
        if (password?.length) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }
        await user.save();

        const userObject = {
          userId: user?._id,
          name: user?.name,
          email: user?.email,
          number: user?.number,
        };
        return res.status(200).json({
          success: true,
          message: "Profile updated successfully!",
          user: userObject,
        });
      }

      return res
        .status(404)
        .json({ success: false, message: "No user found to update!" });
    }

    return res.status(404).json({
      success: false,
      message: "please change atleast one field to update your profile!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
