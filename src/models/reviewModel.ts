import mongoose, { Model, Schema } from "mongoose"
import { IReview } from "@interfaces/interfaces.js"

//creating schema
const reviewSchema = new mongoose.Schema<IReview>({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


//Creating model
const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema)
export default Review