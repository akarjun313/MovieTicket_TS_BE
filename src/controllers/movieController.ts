import { Request, Response } from "express"
import { cloudinaryInstance } from "@config/cloudinary.js"
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary"
import { IMovie } from "@interfaces/interfaces.js"
import Movie from "@models/movieModel.js"

// create new movie 
export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {

        // checking for image file in multer 
        const file = req.file as Express.Multer.File | undefined
        if (!file) {
            res.status(400).json({ message: 'No file uploaded', success: false })
            return
        }

        // uploading image to cloudinary
        cloudinaryInstance.uploader.upload(file.path, { folder: "moviesTS" }, async (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if(err) {
                console.log("Error in cloudinary", err)
                res.status(400).json({ message: "Image upload failed", success: false })
                return
            }

            if(result) {
                const imageUrl: string = result.url

                const { movieName, language, genre, releaseDate, description, duration, status }: IMovie = req.body

                // creating instance 
                const createNewMovie: IMovie = new Movie({
                    movieName,
                    language,
                    genre,
                    releaseDate,
                    description,
                    duration,
                    coverImage: imageUrl,
                    status
                })

                // saving instance
                
                try {
                    await createNewMovie.save()
                    res.status(200).json({ message: 'New movie created successfully', success: true })
                } catch (err) {
                    res.status(400).json({ message: "Error in creating movie", success: false })
                }   
            }
        })
        
    } catch (error) {
        console.log("Error in creating movie", error)
        res.status(500).json({ message: "Internal server error at movie creation", success: false })
    }
}


// show all movie
export const showAllMovies = async (req: Request, res: Response): Promise<Response> => {
    try {

        // getting all movies list from DB 
        const movies: IMovie[] = await Movie.find()
        if(!movies || movies.length === 0){
            return res.status(404).json({ message: "No movies found", success: false })
        }

        return res.status(200).json({ message: movies, success: true })
    } catch (error) {
        console.log("Error in showing movies", error)
        return res.status(500).json({ message: "Internal server error at showing movies", success: false })
    }
}


// show a specific movie 
export const showMovie = async ( req: Request, res: Response): Promise<Response> => {
    try {

        // movie id here
        const { id } = req.params


        // search by movie id 
        const movie: IMovie | null = await Movie.findById(id)
        if(!movie) {
            return res.status(404).json({ message: "Movie not found", success: false })
        }


        return res.status(200).json({ message: movie, success: true })
    } catch (error) {
        console.log("Error in showing movie", error)
        return res.status(500).json({ message: "Internal server error at showing movie", success: false })
    }
}


// delete a movie 
export const deleteMovie = async ( req: Request, res: Response ): Promise<Response> => {
    try {
        //movie id here
        const { id } = req.params

        // search by movie id and delete
        const movie: IMovie | null = await Movie.findByIdAndDelete(id)
        if(!movie) {
            return res.status(404).json({ message: "Movie not found", success: false })
        }

        return res.status(200).json({ message: "Movie deleted successfully", success: true })
    } catch (error) {
        console.log("Error in deleting movie", error)
        return res.status(500).json({ message: "Internal server error at deleting movie", success: false })
    }
}



// update a movie