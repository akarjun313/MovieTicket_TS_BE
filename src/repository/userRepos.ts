import { UserInterface } from "@interfaces/interfaces.js"
import User from "@models/userModel.js"


// func to find user by email
export const findUserByEmail = async (email: string): Promise<UserInterface | null> => {
    return await User.findOne({ email }).exec()
}

// func to find user by id
export const findUserById = async (id: string): Promise<UserInterface | null> => {
    return await User.findById(id).exec()
}


// func to create new user
export const createUser = async (userData: Partial<UserInterface>): Promise<UserInterface> => {
    const user = new User(userData)
    return await user.save()
}


