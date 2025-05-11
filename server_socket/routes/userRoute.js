import express from "express"
import { userAuth } from "../middleware/userAuthMiddle.js";
import { getUserData } from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.get("/get-user-details", userAuth, getUserData)

export default userRouter