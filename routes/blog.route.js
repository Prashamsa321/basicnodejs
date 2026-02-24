import { Router } from "express";
import { createBlog, Blogbyid, updateBlog, deleteBlog } from "../controller/blog.Controller.js";
import verifyUser from "../middleware/auth.js";

const blogRoute = Router();
 
blogRoute.route('/create').post(verifyUser, createBlog)
blogRoute.route('/read/:id').get(Blogbyid)
blogRoute.route('/update/:id').put(updateBlog)
blogRoute.route('/delete/:id').delete(deleteBlog)
 
export default blogRoute;
