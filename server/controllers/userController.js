const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const sendMail = require("../services/sendMail");
const otps = new Map();

const Signup = async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({ msg: "User Already Registered" });
    } else {
      let hash = await bcrypt.hash(password, 10);
      req.body.password = hash;
      user = await User.create({ ...req.body, isVerified: false });

      let data = {
        email: user.email,
        id: user.id,
        role: user.role,
        username: user.username,
      };

      let token = jwt.sign(data, "Private-Key");
      let otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
      otps.set(email, otp);

      let html = `<div> 
         <h1>Hello ${user.username}</h1>
         <p>Click the link below to verify your account:</p>
         <a href="http://localhost:8090/user/verify/${token}/${otp}">Verify Account</a>
      </div>`;
      await sendMail(email, "Verify your account", html);

      return res.status(201).json({
        msg: "Sign Up Successful. Please check your email to verify your account.",
        token: token,
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const Login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ msg: "Please verify your email before logging in." });
  }

  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(404).json({ msg: "Password mismatch" });
  }

  let data = {
    email: user.email,
    id: user.id,
    role: user.role,
    username: user.username,
    isVerified: user.isVerified,
  };

  let token = jwt.sign(data, "Private-Key");
  return res.status(200).json({ msg: "Login successful", token: token, isVerified: user.isVerified });
};

const GetAllUsers = async (req, res) => {
  let data = await User.find();
  res.status(200).json(data);
};

const GetUser = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.status(200).json(user);
};

const DeleteUser = async (req, res) => {
  let { id } = req.params;
  try {
    let user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully", user });
  } catch (error) {
    return res.status(500).json({ msg: "Error deleting user", error });
  }
};

const deleteMany = async (req, res) => {
  let { ids } = req.body;
  try {
    await User.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ msg: "Users deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error deleting users", error });
  }
};

const VerifyUser = async (req, res) => {
  let { token, otp } = req.params;
  try {
    let decode = jwt.verify(token, "Private-Key");
    let oldOtp = otps.get(decode.email);

    if (oldOtp == otp) {
      await User.findByIdAndUpdate(decode.id, { isVerified: true });
      otps.delete(decode.email); // Clear OTP after verification

      // Redirect to client index.html
      return res.redirect("/index.html");
    } else {
      return res.status(403).json({ msg: "Invalid OTP" });
    }
  } catch (err) {
    return res.status(403).json({ msg: "Invalid Token", error: err.message });
  }
};



module.exports = { Signup, Login, GetAllUsers, GetUser, DeleteUser, VerifyUser, deleteMany };
