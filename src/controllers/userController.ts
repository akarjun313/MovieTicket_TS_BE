import { Request, Response } from "express"
import { AuthRequest, UserInterface } from "@interfaces/interfaces.js"
import User from "@models/userModel.js"
import bcrypt from "bcrypt"
import { userTokenGenerate } from "@utils/generateToken.js"


//user sign-up
export const userSignUp = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { firstName, lastName, email, phone, role }: UserInterface = req.body
        const { password }: { password: string } = req.body

        //check if user exists
        const userExist: UserInterface | null = await User.findOne({ email })
        if(userExist) {
            res.status(409).json({ message: "User already exists", success: false })
            return
        }

        //hash password
        const saltRounds: number = 10
        const hashPassword: string = await bcrypt.hash(password, saltRounds)

        //create new user
        const newUser: UserInterface = new User({
            firstName,
            lastName,
            email,
            phone,
            role,
            hashPassword
        })
        await newUser.save()
        
        //generate token
        const token: string = userTokenGenerate(newUser)
        res.cookie("token", token)

        res.status(200).json({ message: "User Sign-Up successful", success: true })
    } catch (error) {
        console.log("Error in User Sign-Up", error)
        res.status(500).json({ message: "Internal server error at User Sign-Up", success: false })
    }
}


//user sign-In/Login
export const userLogin = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { email, password }: { email: string; password: string } = req.body

        //check if user exists
        const userExist: UserInterface | null = await User.findOne({ email })
        if(!userExist) {
            res.status(404).json({ message: "User not found", success: false })
            return
        }

        //check password
        const matchPassword: boolean = await bcrypt.compare(password, userExist.hashPassword)
        if(!matchPassword) {
            res.status(401).json({ message: "Invalid password", success: false })
            return
        }

        //generate token
        const token: string = userTokenGenerate(userExist)
        res.cookie("token", token)

        res.status(200).json({ message: "Login success", success: true })
    } catch (error) {
        console.log("Error in user login", error)
        res.status(500).json({ message: "Internal server error at user login", success: false })
    }
}



//user sign-out/logout

//get user details
export const getUserDetails = async ( req: AuthRequest , res: Response ): Promise<void> => {
    try {
        //user id
        if(!req.user) {
            res.status(401).json({ message: "Unauthorized, login first", success: false })
            return
        }
        const userId: string = req.user.data


        const userDetails: UserInterface | null = await User.findById(userId)
        if(!userDetails) {
            res.status(404).json({ message: "User not found", success: false })
            return
        }

        res.status(200).json({ message: userDetails, success: true })

    } catch (error) {
        res.status(500).json({ message: "Internal server error at getting user details", success: false })
    }
}