import { Router } from "express";
import { register, login, authcheck, getbyid, logout, getallusers, deleteallusers } from "../controller/user.controller.js";
import verifyUser from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";


const userRoute = Router();

userRoute.route('/register').post(
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    register
);
userRoute.route('/login').post(login)
userRoute.route('/auth').get(verifyUser, authcheck)
userRoute.route('/getbyid/:id').get(getbyid)
userRoute.route('/logout').post(logout)
userRoute.route('/getallusers').get(getallusers)
userRoute.route('/deleteallusers').delete(deleteallusers)

export default userRoute;