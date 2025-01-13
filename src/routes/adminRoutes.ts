import { adminSignIn } from "@controllers/adminController.js"
import { createMovie } from "@controllers/movieController.js"
import { showAllTheatre, updateTheatreStatus } from "@controllers/theatreController.js"
import uploadMiddleware from "@middlewares/multer.js"
// import upload from "@middlewares/multer.js"
import express, { Router } from "express"

const adminRouter: Router = express.Router()



adminRouter.post('/admin-login', adminSignIn)    // Login
// Logout 

adminRouter.post('/create-movie', uploadMiddleware, createMovie)  // Create movie

adminRouter.get('/show-theatres', showAllTheatre)  // Show all theatres

adminRouter.patch('/approve-theatre/:id', updateTheatreStatus) // approve theatre

export default adminRouter