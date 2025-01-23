import { AuthRequest, IReview } from "@interfaces/interfaces.js"
import { Request, Response } from "express"




//Write review
export const writeReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // movie id 
        const { id } = req.params

        //user ID
        if(!req.user) {
            res.status(401).json({ message: "Unauthorized, login first", success: false })
            return
        }
        const userId: string = req.user.data

        // rating and review
        const { rating, review }: IReview = req.body

        //NOT COMPLETED -----------------------------------

    } catch (error) {
        console.log("Error in writing review", error)
        res.status(500).json({ message: "Internal server error at writing review", success: false })
    }
}

//Delete review
//Update review
//Get all reviews