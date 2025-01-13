import mongoose, { Model } from "mongoose"
import { IMovie } from "@interfaces/interfaces.js"


// creating schema 
const movieSchema = new mongoose.Schema<IMovie>({
    movieName: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    duration: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    posterImage: {
      type: String,
      required: true  
    },
    status: {
        type: String,
        enum: ['RUNNING', 'UPCOMING'],
        default: 'RUNNING'
    }

}, { timestamps: true })


const Movie: Model<IMovie> = mongoose.model<IMovie>('Movie', movieSchema)
export default Movie