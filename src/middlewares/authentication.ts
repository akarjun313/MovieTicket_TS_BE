import { AuthRequest } from "@interfaces/interfaces.js"
import { NextFunction, Response } from "express"
import jwt from 'jsonwebtoken'



//ADMIN AUTHENTICATION MIDDLEWARE


//OWNER AUTHENTICATION MIDDLEWARE


//USER AUTHENTICATION MIDDLEWARE
export const userAuthentication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token: string | null = await req.cookies.token
        if(!token) {
            res.status(401).json({ message: "Unauthorized, login first", success: false})
            return
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if(err) {
                console.log("jwt verification error; ", err)
                res.status(401).json({ message: "Unauthorized, login first", success: false })
                return
            }

            req.user = decoded as { data: string, role: string }

            if(req.user.role !== 'user') {
                res.status(401).json({ message: "Unauthorized, login as user", success: false })
                return
            }
            next()
        })
    } catch (error) {
        console.log("Error in user authentication middleware", error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}