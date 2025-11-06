import express from "express"
import bookController from "../controller/bookController.js"
import verifyJWT from "../middleware/auth.middleware.js"

const router = express.Router()

router.use(verifyJWT)
router.route("/books")
.post("/", bookController.createBook)
.get("/", bookController.getBooks)
.delete("/:id", bookController.deleteBook)
.get("/user", bookController.getRecommended)

export default router