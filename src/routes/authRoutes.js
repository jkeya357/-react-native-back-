import express from "express"
import authController from "../controller/authController.js"

const router = express.Router()

router.post("/auth/register", authController.registerUser)
router.post("/auth/login", authController.login)
router.get("/auth/users", authController.getUsers)

export default router