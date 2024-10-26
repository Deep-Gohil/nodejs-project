const {Router} = require("express");
const { GetAllUsers, Login, Signup, GetUser, DeleteUser, VerifyUser, deleteMany } = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/all",GetAllUsers);
userRouter.get("/:id",GetUser);
userRouter.post("/signup",Signup);
userRouter.post("/login",Login);
userRouter.delete("/:id",DeleteUser);
userRouter.delete("/deleteMany/:id",deleteMany)
userRouter.get("/verify/:token/:otp", VerifyUser);

module.exports = userRouter;