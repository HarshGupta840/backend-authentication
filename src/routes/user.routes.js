import { Router } from "express";
import { loginUser, logoutUser, registerUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser)
router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/changepassword").post(verifyJWT, changeCurrentPassword)
router.route("/getuser").post(verifyJWT, getCurrentUser)
router.route("/update").post(verifyJWT, updateAccountDetails)
router.route("/updatecoverimage").post(verifyJWT, updateUserCoverImage)
router.route("/updateavatar").post(verifyJWT, updateUserAvatar)

export default router