import mongoose, { Model } from 'mongoose'
import { UserInterface } from '@interfaces/interfaces.js'


// creating schema 
const userSchema = new mongoose.Schema<UserInterface>({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user'
    }
}, { timestamps: true })


const User: Model<UserInterface> = mongoose.model<UserInterface>('User', userSchema)
export default User