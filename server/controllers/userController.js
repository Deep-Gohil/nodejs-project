const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const sendMail = require("../service/sendMail");
const User = require("../models/userSchema");
const sendMail = require("../services/sendMail");
const otps = new Map();

// Signup Function
const Signup = async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({ msg: "User Already Registered" });
    } else {
      let hash = await bcrypt.hash(password, 10);
      req.body.password = hash;
      user = await User.create(req.body);

      let data = {
        email: user.email,
        id: user.id,
        role: user.role,
        username: user.username,
      };

      let token = jwt.sign(data, "Private-Key");
      let otp = Math.round(Math.random() * 10000); // Fixed random function
      otps.set(email, otp);

      let html = `<div> 
         <h1>Hello ${user.username}</h1>
         <a href="http://localhost:8090/user/verify/${token}/${otp}"> Verify</a>
      </div>`;
      await sendMail(email, "verify", html);

      return res.status(201).json({
        msg: "Sign Up Successful",
        token: token,
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

// Login Function
const Login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
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
  };

  let token = jwt.sign(data, "Private-Key");
  return res.status(200).json({ msg: "Login successful", token: token });
};

// Get All Users
const GetAllUsers = async (req, res) => {
  let data = await User.find();
  res.status(200).json(data);
};

// Get User by ID
const GetUser = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.status(200).json({msg:"User Deleted Successfully"});
};

// Delete User
const DeleteUser = async (req, res) => {
  let { id } = req.params;
  try {
    let user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully", user });
  } catch (error) {
    return res.status(404).json({ msg: "Error deleting user", error });
  }
};

// Verify User Function
const VerifyUser = async (req, res) => {
  let { token, otp } = req.params;
  try {
    let decode = jwt.verify(token, "Private-Key");
    let oldOtp = otps.get(decode.email);
    if (oldOtp == otp) {
      return res.status(200).json({ msg: "User verified successfully" });
    } else {
      return res.status(403).json({ msg: "Invalid OTP" });
    }
  } catch (err) {
    return res.status(403).json({ msg: "Invalid Token", error: err.message });
  }
};

module.exports = {Signup,Login,GetAllUsers,GetUser,DeleteUser,VerifyUser,};
