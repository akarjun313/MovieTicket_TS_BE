import { Request, Response } from "express"
import { IMovie } from "@interfaces/interfaces.js"
import { UploadedFiles } from "@interfaces/dto.interfaces.js"
import { createNewMovie, fetchAllMovies, findMovieById, deleteThisMovie } from "@services/movieServices.js"


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


// delete a movie 
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        //movie id here
        const { id } = req.params

        //      service function to delete movie
        const { success, message } = await deleteThisMovie(id)

        res.status(200).json({ message, success})
    } catch (error: any) {

        if (error.message === "NOT_FOUND") {
            res.status(404).json({ message: "Movie not found", success: false })
            return
        }

        console.log("Error in deleting movie", error)
        res.status(500).json({ message: error.message || "Internal server error at deleting movie", success: false })
    }
}