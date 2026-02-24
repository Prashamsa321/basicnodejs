import { Router } from "express";
import { register, login, authcheck , getbyid , logout, getallusers   } from "../controller/user.controller.js";
import verifyUser from "../middleware/auth.js";


const userRoute = Router();

userRoute.route('/register').post(register)
userRoute.route('/login').post(login)
userRoute.route('/auth').get(verifyUser, authcheck)
userRoute.route('/getbyid/:id').get(getbyid)
userRoute.route('/logout').post(logout)
userRoute.route('/getallusers').get(getallusers)

export default userRoute;