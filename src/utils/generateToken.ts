import jwt from 'jsonwebtoken'
import { UserInterface } from '@interfaces/interfaces.js'
import dotenv from 'dotenv'

dotenv.config()


// token generator for users/owners 
export const userTokenGenerate = (userExist: UserInterface): string => {
    return jwt.sign(
        { data: userExist.id, role: userExist.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
    )
}


// token generator for admin only 
export const adminTokenGenerate = (adminExist: UserInterface): string => {
    return jwt.sign(
        { data: adminExist.id, role: adminExist.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '3h' }
    )
}