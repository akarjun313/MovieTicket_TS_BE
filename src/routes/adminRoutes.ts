import { adminSignIn } from "@controllers/adminController.js"
import { createMovie, deleteMovie } from "@controllers/movieController.js"
import { showAllTheatre, updateTheatreStatus } from "@controllers/theatreController.js"
import uploadMiddleware from "@middlewares/multer.js"
import express, { Router } from "express"

const adminRouter: Router = express.Router()



adminRouter.post('/admin-login', adminSignIn)    // Login
// Logout 

//      MOVIE CONTROLS
adminRouter.post('/create-movie', uploadMiddleware, createMovie)  // Create movie
adminRouter.delete('/delete-movie/:id', deleteMovie)  // Delete movie


//      THEATRES CONTROLS
adminRouter.get('/show-theatres', showAllTheatre)  // Show all theatres
adminRouter.patch('/approve-theatre', updateTheatreStatus) // approve theatre (Client will be senting Object with one/many theatre's id and status)

export default adminRouter