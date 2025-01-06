import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const dbUrl: string = process.env.DB_URL as string

export const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(dbUrl)
        console.log('DB connected successfully')
    } catch (error) {
        console.log('Failed to connect DB', error)
    }
}