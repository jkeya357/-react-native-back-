import Book from "../models/Book.js"
import User from "../models/User.js"
import cloudinary from "../lib/cloudinary.js"
import { saveBaseImage } from "../middleware/saveImage.js"

const createBook = async (req,res) => {
  try {
    const {title, caption, rating, image, user} = req.body

    if(!image || !title || !caption || !rating){
      return res.status(400).json({message: "Please provide all fields"})
    }

    const foundUser = await User.findById(user)
    if(!foundUser) return res.status(404).json({message: "User not found"})

    let imageUrl = null
    if(image){
      imageUrl = await saveBaseImage(image, "books")
    }
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: foundUser._id
    })

    await newBook.save()

    res.status(201).json(newBook)
  } catch (error) {
    console.log("Error in creating book controller", error)
    res.status(500).json({message: error.message})
  }
}

const getBooks = async (req,res) => {
  try {

    const page = req.query.page || 1
    const limit = req.query.limit || 5
    const skip = (page - 1) * limit

    const books = await Book.find()
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .populate("user", "username profileImage")

    const totalBooks = await Book.countDocuments()

    res.status(200).json({
      books,
      currentPage: page,
      totalBooks: Math.ceil(totalBooks / limit)
    })
  } catch (error) {
    console.log("Error in getting the books")
    return res.status(500).json({message: "Internal server error"})
  }
}

const deleteBook = async (req,res) => {

  try {
    const {_id} = req.params || req.body

    const foundBook = await Book.findById(_id)

    const user = foundBook.user

    const foundUser = await User.findById(user)

    if(!foundBook) return res.status(404).json({message: "Book not found"})

    if(!foundUser) return res.status(404).json({message: "User not found"})

    if(foundBook.user.toString() !== foundUser.toString()){
      return res.status(403).json({message: "Unauthorized"})
    }

    if(foundBook.image && foundBook.image.includes("cloudinary")){
      try {
        const publicId = foundBook.image.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.log('Eror deleting image from cloudinary', error)
      }
    }

    await foundBook.deleteOne()
    return res.status(200).json({message: `Book ${foundBook.title} deleted successfully`})
  } catch (error) {
    console.log("Error deleting book", error)
    res.status(500).json({message: "Interal server error deleting the book"})
  }
}

const getRecommended = async (req,res) => {
  try {

    const userId = req.userId

    if(!userId) return res.status(400).json({message: "User id required"})

    const books = await Book.find({user: userId}).sort({createdAt: -1})
    res.json({books})
  } catch (error) {
    console.log("Get user books error:", error.message)
    res.status(500).json({message: "Server error"})
  }
}

const bookController = {createBook, getBooks, deleteBook, getRecommended}
export default bookController