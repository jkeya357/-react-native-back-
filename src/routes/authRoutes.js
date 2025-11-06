import express from "express"
import authController from "../controller/authController.js"

const router = express.Router()

router.route("/auth")
.post("/register", authController.registerUser)
.post("/login", authController.login)

export default router