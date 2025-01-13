import { Request, Response } from "express"
import { cloudinaryInstance } from "@config/cloudinary.js"
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary"
import { IMovie } from "@interfaces/interfaces.js"
import Movie from "@models/movieModel.js"

// create new movie 
export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {

        // checking for image file in multer 
        const files = req.files as { movieImage: Express.Multer.File[], bgImage: Express.Multer.File[] }
        if (!files.movieImage || files.movieImage.length === 0) {
            res.status(400).json({ message: 'Movie image/poster file not uploaded', success: false })
            return
        }
        if (!files.bgImage || files.bgImage.length === 0) {
            res.status(400).json({ message: 'Background image/cover file not uploaded', success: false })
            return
        }

        const movieImage = files.movieImage[0]      //stores movie poster image
        const bgImage = files.bgImage[0]        //stores background image

        // uploading to cloudinary
        let movieImageUpload
        let bgImageUpload

        try {
            movieImageUpload = await cloudinaryInstance.uploader.upload(movieImage.path, { folder: "moviesTS" })
        } catch (err) {
            console.log('Error in uploading movie image', err)
            res.status(500).json({ message: 'Error in uploading movie image', success: false })
            return
        }
        
        try {
            bgImageUpload = await cloudinaryInstance.uploader.upload(bgImage.path, { folder: "moviesTS" })
        } catch (err) {
            console.log('Error in uploading background image', err)
            res.status(500).json({ message: 'Error in uploading background image', success: false })
            return
        }

        // storing url
        const movieImageUrl: string = movieImageUpload.url
        const bgImageUrl: string = bgImageUpload.url

        const { movieName, language, genre, releaseDate, description, duration, status }: IMovie = req.body

        // creating instance 
        const createNewMovie: IMovie = new Movie({
            movieName,
            language,
            genre,
            releaseDate,
            description,
            duration,
            coverImage: bgImageUrl,
            posterImage: movieImageUrl,
            status
        })

        // saving in DB
        await createNewMovie.save()

        res.status(200).json({ message: "New Movie created successfully", success: true })

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
        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: "No movies found", success: false })
        }

        return res.status(200).json({ message: movies, success: true })
    } catch (error) {
        console.log("Error in showing movies", error)
        return res.status(500).json({ message: "Internal server error at showing movies", success: false })
    }
}


// show a specific movie 
export const showMovie = async (req: Request, res: Response): Promise<Response> => {
    try {

        // movie id here
        const { id } = req.params


        // search by movie id 
        const movie: IMovie | null = await Movie.findById(id)
        if (!movie) {
            return res.status(404).json({ message: "Movie not found", success: false })
        }


        return res.status(200).json({ message: movie, success: true })
    } catch (error) {
        console.log("Error in showing movie", error)
        return res.status(500).json({ message: "Internal server error at showing movie", success: false })
    }
}


// delete a movie 
export const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        //movie id here
        const { id } = req.params

        // search by movie id and delete
        const movie: IMovie | null = await Movie.findByIdAndDelete(id)
        if (!movie) {
            return res.status(404).json({ message: "Movie not found", success: false })
        }

        return res.status(200).json({ message: "Movie deleted successfully", success: true })
    } catch (error) {
        console.log("Error in deleting movie", error)
        return res.status(500).json({ message: "Internal server error at deleting movie", success: false })
    }
}



// update a movie