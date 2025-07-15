import { Request, Response } from "express"
import { loginAdmin } from "@services/adminServices.js"

// admin signIn/Login
export const adminSignIn = async (req: Request, res: Response): Promise<void> => {
    try {
        //  fetch details from request body { email, password }
        const { email, password }: { email: string; password: string } = req.body

        const { message, token } = await loginAdmin(email, password)        //  calling admin login service

        // set cookie
        res.cookie('adtoken', token, { httpOnly: true })


        res.status(200).json({ message, success: true })
    } catch (error: any) {

        if (error.message === 'ADMIN_NOT_FOUND') {
            res.status(404).json({ message: 'Admin not found', success: false })
            return
        } else if (error.message === 'YOU_ARE_NOT_ADMIN') {
            res.status(403).json({ message: 'You are not an admin', success: false })
            return
        } else if (error.message === 'INVALID_PASSWORD') {
            res.status(401).json({ message: 'Invalid password', success: false })
            return
        } else {
            console.log('Error in admin login', error)
            res.status(500).json({ message: 'Internal server error at admin login', success: false })
        }
    }
}


// TODO: admin sign-out/logout




//      NOTE:
// Admin profile can only add and delete manually 
