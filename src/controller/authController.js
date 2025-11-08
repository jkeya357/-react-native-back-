import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const registerUser = async (req,res) => {

  try {
    const {email,username,password} = req.body

    if(!username || !email || !password) {
      return res.status(400).json({message: "All fields are required"})
    }

    if(password.length < 6){
      return res.status(400).json({message: "Password must be atleast 6 characters long"})
    }

    if(username.length < 3){
      return res.status(400).json({message: "Username must be atleast 3 characters long"})
    }

    //CHECK FOR DUPLICATE User
    const duplicateUser = await User.findOne({email, username})
    if(duplicateUser) return res.status(409).json({message: "User already exists"})
    
    //HASH THE PASSWORD
    const hashPwd = await bcrypt.hash(password, 10)

    const profiAPI = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

    const newUser = new User({
      email,
      username,
      password: hashPwd,
      profileImage: profiAPI,
      createdAt: newUser.createdAt
    })

    await newUser.save()

    const accessToken = jwt.sign(
      {
        "userInfo":{
          "userId": newUser._id,
          "email": email
        },
      },
      process.env.JWT_TOKEN,
      {expiresIn: "15d"}
    )

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
      accessToken,
      user:{
        id: newUser._id,
        username: newUser.email,
        profileImage: newUser.profileImage
      }
    })

  } catch (error) {
    console.log("Error in register router", error)
    res.status(500).json({message: "Internal server error creating the user"})
  }
}

const login = async (req,res) => {

  try {
    const {email, password} = req.body

    if(!email || !password) {
      return res.status(400).json({message: "All fields are required"})
    }

    const foundUser = await User.findOne({email})
    if(!foundUser) return res.status(404).json({message: "Invalid credentials"})

    const userPswd = await bcrypt.compare(password, foundUser.password)
    if(!userPswd) return res.status(401).json({message: "Invalid credentials"})

    const accessToken = jwt.sign(
      {
        "userInfo":{
          "userId": foundUser._id,
          "email": foundUser.email
        }
      },
      process.env.JWT_TOKEN,
      {expiresIn: "15d"}
    )

    res.status(200).json({
      accessToken,
      user:{
        id: foundUser._id,
        username: foundUser.email,
        profileImage: foundUser.profileImage,
        createdAt: foundUser.createdAt
      }
    })
  } catch (error) {
    console.log("Error in logging in route", error)
    res.status(500).json({message: "Internal server error logging in"})
  }
}

const getUsers = async (req,res) => {

  try {
    const users = await User.find().select("-password").lean()
    if(!users) return res.status(204)
    res.status(200).json(users)
  } catch (error) {
    console.log("Error getting the users: ",error)
    res.status(500).json({message: "Error retrieving the users"})
  }
}

const authController = {registerUser, login, getUsers}
export default authController