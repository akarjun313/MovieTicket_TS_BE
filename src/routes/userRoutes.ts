import express, { Router, Request, Response } from "express"
import { userLogin, userSignUp } from "@controllers/userController.js"

const userRouter: Router = express.Router()

userRouter.get('/', (req: Request, res: Response) => {
    res.send('User routes')
})

// Sign-Up
userRouter.post('/signup', userSignUp)



// Login
userRouter.post('/login', userLogin)


// Logout


export default userRouter