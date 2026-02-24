import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"


const verifyuser = async (req, res, next) => {

    const token = req.cookies.Accesstoken
    if (!token) {
        return res.json({
            message: "Unauthorized please login "

        })// agar token nhi hai to user ko unauthorized message bhejenge


    }
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // token ko verify krne ke liye jwt.verify function ka use krte hai, isme token aur secret key pass krte hai, agar token valid hai to decoded data return krta hai, nhi to error throw krta hai
    console.log(decoded)
    const user = await User.findById(decoded?.id).select("-password")
    console.log(user);


    if (!user) {
        return res.json({
            message: "Unauthorized please login "

        });// agar user nhi mila to user ko unauthorized message bhejenge
    }
    req.user = user;
    next();
}
export default verifyuser