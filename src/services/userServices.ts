import { UserInterface } from "@interfaces/interfaces.js"
import { createUser, findUserByEmail } from "@repos/userRepos.js"
import bcrypt from "bcrypt"
import { userTokenGenerate } from "@utils/generateToken.js"
import { UserSignupDTO } from "@interfaces/dto.interfaces.js"


// user signup function - creates user and generates token
export const signupUser = async (user: UserSignupDTO): Promise<{ message: string; token?: string }> => {

    //  check if user exists
    const existingUser = await findUserByEmail(user.email)
    if (existingUser) {
        throw new Error('USER_EXISTS')
    }

    // Password hashing
    const saltRounds = 10
    const hashPassword = await bcrypt.hash(user.password, saltRounds)

    const newUser: Partial<UserInterface> = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        hashPassword
    }

    // save new user to db and generate token
    const createdUser: UserInterface = await createUser(newUser)
    const token: string = userTokenGenerate(createdUser)

    return { message: 'User created successfully', token }
}


// user login function - verifies email, password and generates token
export const signinUser = async (email: string, password: string): Promise<{ message: string; token?: string }> => {
    // check if user exists
    const existingUser: UserInterface | null = await findUserByEmail(email)
    if(!existingUser) {
        throw new Error('USER_NOT_FOUND')
    }


    // check password
    const matchPassword: boolean = await bcrypt.compare(password, existingUser.hashPassword)
    if(!matchPassword) {
        throw new Error('INVALID_PASSWORD')
    }


    // generate token
    const token: string = userTokenGenerate(existingUser)


    return { message: 'Login success', token }
}


// TODO: function to get user details by id
