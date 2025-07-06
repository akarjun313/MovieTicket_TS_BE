import { Router, Request, Response } from "express"
import { getUserDetails, userLogin, userSignUp } from "@controllers/userController.js"
import { showAllMovies, showMovie } from "@controllers/movieController.js"
import { userAuthentication } from "@middlewares/authentication.js"

const userRouter = Router()

userRouter.get('/', (req: Request, res: Response) => {
    res.send('User routes')
})

// Sign-Up
userRouter.post('/signup', userSignUp)



// Login
userRouter.post('/login', userLogin)


//user Details - for profile
userRouter.get('/user-details', userAuthentication, getUserDetails)


userRouter.get('/show-movies', showAllMovies)   // show all movies
userRouter.get('/show-movie/:id', showMovie)   // show specific movie

export default userRouter