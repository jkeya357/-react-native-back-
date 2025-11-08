import express from "express"
import bookController from "../controller/bookController.js"
import verifyJWT from "../middleware/auth.middleware.js"

const router = express.Router()

router.use(verifyJWT)
router.post("/books", bookController.createBook)
router.get("/books", bookController.getBooks)
router.delete("/books/:id", bookController.deleteBook)
router.get("/books/userId", bookController.getRecommended)

export default router