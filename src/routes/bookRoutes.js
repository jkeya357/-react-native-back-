import express from "express"
import bookController from "../controller/bookController.js"
import verifyJWT from "../middleware/auth.middleware.js"

const router = express.Router()

router.use(verifyJWT)
router.post("/", bookController.createBook)
router.get("/", bookController.getBooks)
router.delete("/:id", bookController.deleteBook)
router.get("/user", bookController.getRecommended)

export default router