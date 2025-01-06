import { Request, Response } from "express"
import User from "@models/userModel.js"
import bcrypt from "bcrypt"
import { adminTokenGenerate } from "@utils/generateToken.js"
import { UserInterface } from "@interfaces/interfaces.js"

// admin signIn/Login 
export const adminSignIn = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const { email, password }: { email: string; password: string } = req.body

        // check if user exists
        const adminExist: UserInterface | null = await User.findOne({ email })
        if(!adminExist) {
            res.status(404).json({ message: 'Admin not found', success: false })
            return
        }

        //check role
        if(adminExist.role !== 'admin'){
            res.status(401).json({ message: 'You are not an admin', success: false })
            return
        }

        //check password
        const matchPassword: boolean = await bcrypt.compare(password, adminExist.hashPassword)
        if(!matchPassword) {
            res.status(401).json({ message: 'Invalid password', success: false })
            return
        }

        //generate token
        const token: string = adminTokenGenerate(adminExist)
        res.cookie('adtoken', token, { httpOnly: true })


        res.status(200).json({ message: 'Admin signed in successfully', success: true })
    } catch (error) {
        console.log('Error in admin login', error)
        res.status(500).json({ message: 'Internal server error at admin login', success: false })
    }
}


// admin sign-out/logout

