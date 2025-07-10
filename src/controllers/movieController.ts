import { Request, Response } from "express"
import { IMovie } from "@interfaces/interfaces.js"
import Movie from "@models/movieModel.js"
import Theatre from "@models/theatreModel.js"
import { UploadedFiles } from "@interfaces/dto.interfaces.js"
import { createNewMovie, fetchAllMovies, findMovieById } from "@services/movieServices.js"


// controller create new movie 
export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {

        
        const files = req.files as UploadedFiles        // checking for image file in multer 
        const movieData: IMovie = req.body          // getting movie data from request body


        const { success, message } = await createNewMovie(files, movieData)         // calling movie creation service


        res.status(200).json({ message, success })
    } catch (error: any) {
        console.error("Error in creating movie", error)
        res.status(500).json({ message: error.message || "Internal server error at movie creation", success: false })
    }
}


// show all movie
export const showAllMovies = async (req: Request, res: Response): Promise<void> => {
    try {

        const movies = await fetchAllMovies()       // calling movie fetching service

        res.status(200).json({ message: movies, success: true })
    } catch (error: any) {

        if (error.message === "NOT_FOUND") {
            res.status(404).json({ message: "Movies not found", success: false })
            return
        }

        console.log("Error in showing movies", error)
        res.status(500).json({ message: "Internal server error at showing movies", success: false })
    }
}


// show a specific movie 
export const showMovie = async (req: Request, res: Response): Promise<void> => {
    try {

        
        const { id } = req.params       // movie id here

        const movie = await findMovieById(id)       // calling movie fetching service
        

        res.status(200).json({ message: movie, success: true })
    } catch (error: any) {

        if (error.message === "NOT_FOUND") {
            res.status(404).json({ message: "Movie not found", success: false })
            return
        }

        console.log("Error in showing movie", error)
        res.status(500).json({ message: "Internal server error at showing movie", success: false })
    }
}


// TODO: delete a movie 
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        //movie id here
        const { id } = req.params

        const theatreCountOfMoviePlaying: number = await Theatre.countDocuments({'screens.movie': id})
        if(theatreCountOfMoviePlaying > 0) {
            res.json({ message: `FAILED !!, Movie is currently playing in ${theatreCountOfMoviePlaying} theatre(s)`, success: false })
            return
        }


        // search by movie id and delete
        const movie: IMovie | null = await Movie.findByIdAndDelete(id)
        if (!movie) {
            res.status(404).json({ message: "Movie not found", success: false })
            return
        }

        res.status(200).json({ message: "Movie deleted successfully", success: true })
    } catch (error) {
        console.log("Error in deleting movie", error)
        res.status(500).json({ message: "Internal server error at deleting movie", success: false })
    }
}