import { Request, Response } from "express"
import { AuthRequest, UserInterface } from "@interfaces/interfaces.js"
import User from "@models/userModel.js"
import { signinUser, signupUser } from "services/userServices.js"
import { UserSignupDTO } from "@interfaces/dto.interfaces.js"


//      controller function used for user signup 
export const userSignUp = async (req: Request<{}, {}, UserSignupDTO>, res: Response): Promise<void> => {
    try {

        // fetch details from request body { firstName, lastName, email, phone, role, password }
        const userData = req.body


        // calling user signup service
        const { message, token } = await signupUser(userData)

        // set cookie
        res.cookie("token", token)

        res.status(200).json({ message, success: true })        // success response
    } catch (error: any) {

        if (error.message === "USER_EXISTS") {
            res.status(409).json({ message: "User already exists", success: false })
            return
        }

        console.log("Error in User Sign-Up", error)         // Logging the ERROR
        res.status(500).json({ message: "Internal server error at User Sign-Up", success: false })
    }
}


//      controller function used for user sign-In/Login
export const userLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        // fetch details from request body { email, password }
        const { email, password }: { email: string; password: string } = req.body

        // calling user login service
        const { message, token } = await signinUser(email, password)

        // set cookie
        res.cookie("token", token)

        res.status(200).json({ message, success: true })        // success response
    } catch (error: any) {

        //      User not found
        if (error.message === "USER_NOT_FOUND") {
            res.status(404).json({ message: "User not found", success: false })
            return
        }

        //      Password error
        if (error.message === "INVALID_PASSWORD") {
            res.status(401).json({ message: "Invalid password", success: false })
            return
        }


        console.log("Error in user login", error)             // Logging the ERROR
        res.status(500).json({ message: "Internal server error at user login", success: false })
    }
}


//      TODO: controller function to sign-out a user


//      controller function to fetch a user's details
export const getUserDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        //user id
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized, login first", success: false })
            return
        }
        const userId: string = req.user.data


        const userDetails: UserInterface | null = await User.findById(userId)
        if (!userDetails) {
            res.status(404).json({ message: "User not found", success: false })
            return
        }

        res.status(200).json({ message: userDetails, success: true })

    } catch (error) {
        res.status(500).json({ message: "Internal server error at getting user details", success: false })
    }
}
//      TODO: make this above func.[getUserDetails()] into a controller function