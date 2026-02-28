import bcrypt from "bcrypt"
import { User } from "../models/User.model.js"
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";



const accessTokensecret = async (user) => {// ye function user ke data ko token me convert krta hai, taki usko verify kr sake ki user kaun hai, aur uske pass kya permissions hai
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
  )
};

const register = async (req, res) => {
  try {
    const {name, email, password, age, role } = req.body

    if (!name || !email || !password || !age || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }


    // const image = req?.files?.avatar?.[0]?.path; // ye line multer se aayi hai, jisme humne avatar naam ka field banaya hai, jisme user apna image upload krta hai, aur uska path humko milta hai, jisko hum database me store kr sakte hai, taki future me usko access kr sake
    // console.log("image",image);
     
    const cloudinaryUrl = await uploadOnCloudinary(req?.files?.avatar?.[0]?.path) // ye function image ko cloudinary pe upload krta hai, aur uska url return krta hai, jo ki database me store hoga user ke avatar ke liye
    console.log("cloudinaryUrl", cloudinaryUrl)
    
    const existingUser = await User.findOne({ email }) // paila check krna h ki user exist krta hai ya nhi, nhi to create krna hai, agar exist krta hai to error dena hai
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const newpassword = await bcrypt.hash(password, 10) // 10 is the number of rounds for hashing, it determines how many times the hashing algorithm will be applied to the password. Higher rounds means more security but also more time to hash and verify passwords.

    const user = await User.create({
      name,
      email,
      password: newpassword,
      age,
      role,
      avatar: cloudinaryUrl
    })

    if (!user) {
      return res.status(400).json({ message: "User registration failed" })
    }

    res.status(201).json({
      message: "User registered successfully",
      username: user.name
    })


  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    })

  }
};
const login = async (req, res) => {

  try {
    const { password, email } = req.body

    if (!password || !email) {
      return res.status(400).json({
        message: "all feilds are required"
      })
    }


    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: "user not found"
      })
    }

    const ispasswordcorrect = await bcrypt.compare(password, user.password) // ye function user ke input password ko database me stored hashed password se compare krta hai, agar match krta hai to true return krta hai, nhi to false return krta hai
    if (!ispasswordcorrect) {
      return res.json({
        message: "password invalid"
      })
    }

    const accessToken = await accessTokensecret(user);

    return res.status(201).cookie('Accesstoken', accessToken, {
      httpOnly: true,
      secure: true //normal attacks se bachav krta hai, https ke sath use krna chahiye
    })
      .json({
        message: "login success  ",

      })

  } catch (error) {
    return res.json({
      message: "internal error",
      error: error.message
    })
  }
};

const authcheck = async (req, res) => {
  const user = req.user // ye user data middleware se aata hai, jisme token verify krne ke baad user data attach krta hai, taki hum usko use kr sake

  res.json({
    message: "auth controller is working",
    data: user
  })
};
const getbyid = async (req, res) => {
  try {
    const userid = req.params.id
    if (!userid) {
      return res.json({
        message: "userId not found"
      })
    }
    const user = await User.findById(userid).select("-password")
    if (!user) {
      return res.json({
        message: "user not found"
      })
    }
    return res.json({
      message: "User Found",
      data: user
    })

  } catch (error) {
    return res.json({
      message: "internal error",
      error: error.message
    })
  }
};
const logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('Accesstoken', {
      httpOnly: true,
      secure: true //normal attacks se bachav krta hai, https ke sath use krna chahiye
    }).json({
      message: "logout success"
    })
  }


  catch (error) {
    return res.json({
      message: "internal error",
      error: error.message
    })

  }
};
const getallusers = async (req, res) => {
  try {
    const alldata = await User.find().select("-password")
    if (!alldata) {
      return res.json({
        message: "no data found"

      })

    }
    return res.json({
      message: "all users data",
      Totaluser: alldata.length,
      data: alldata
    })
  }


  catch (error) {
    return res.json({
      message: "internal error",
      error: error.message
    })

  }
};
const deleteallusers = async (req, res) => {
  try {
    await User.deleteMany()
    return res.json({
      message: "all users deleted"
    })
  }

  catch (error) {
    return res.json({
      message: "Error in deleting users",
      error: error.message
    })
  }
};

export {
  register,
  login,
  authcheck,
  getbyid,
  logout,
  getallusers,
  deleteallusers

}

//clounary ma gayearw clound name , cloud api key , api secret .
//utils folder route create a file cloundinary.js