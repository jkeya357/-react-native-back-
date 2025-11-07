import jwt from "jsonwebtoken"

const verifyJWT = async (req,res,next) => {

  try {
    const header = req.headers.authorization || req.headers.Authorization

    if(!header?.startsWith("Bearer ")){
      return res.status(403).json({message: "Unauthorized!!"})
    }

  const token = header.split(" ")[1]

  jwt.verify(
    token,
    process.env.JWT_TOKEN,
    (error,decode) => {
      if(error) return res.status(401).json({message: "Unauthorized user"})
      req.userId = decode.userInfo.userId
      req.email = decode.userInfo.email
      next()
    }
  )
  } catch (error) {
    console.error("Authentication error:", error.message)
    return res.status(403).json({message: "Token not valid"})
  }
}

export default verifyJWT