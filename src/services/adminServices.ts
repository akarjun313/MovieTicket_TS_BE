import { UserInterface } from "@interfaces/interfaces.js"
import { findUserByEmail } from "@repos/userRepos.js"
import { adminTokenGenerate } from "@utils/generateToken.js"
import bcrypt from "bcrypt"



// service func to login admin
export const loginAdmin = async (email: string, password: string): Promise<{ message: string; token?: string }> => {

    // check if admin exists
    const adminExist: UserInterface | null = await findUserByEmail(email)
    if(!adminExist) {
        throw new Error('ADMIN_NOT_FOUND')
    }

    // check role
    if(adminExist.role !== 'admin') {
        throw new Error('YOU_ARE_NOT_ADMIN')
    }

    //  check password
    const matchPassword: boolean = await bcrypt.compare(password, adminExist.hashPassword)
    if(!matchPassword) {
        throw new Error('INVALID_PASSWORD')
    }

    //  generate token
    const token: string = adminTokenGenerate(adminExist)

    return { message: 'Login success', token }      //  success response
}