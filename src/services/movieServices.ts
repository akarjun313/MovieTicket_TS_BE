import { cloudinaryInstance } from "@config/cloudinary.js"
import { MovieDTO, UploadedFiles } from "@interfaces/dto.interfaces.js"
import { IMovie } from "@interfaces/interfaces.js"
import { countOfMoviePlayingInTheatre, createMovie, deleteMovieById, findMovies, findOneMovie } from "@repos/movieRepos.js"

//  function to create a new movie
export const createNewMovie = async (imgFiles: UploadedFiles, movieData: Partial<MovieDTO>): Promise<{ success: boolean; message: string }> => {

    if(!imgFiles.movieImage?.[0]) {
        throw new Error('Movie image/poster not uploaded')
    }

    if(!imgFiles.bgImage?.[0]) {
        throw new Error('Background image/cover not uploaded')
    }
 
    const movieImage = imgFiles.movieImage[0]      //stores movie poster image
    const bgImage = imgFiles.bgImage[0]        //stores background image

    const movieImageUpload = await cloudinaryInstance.uploader.upload(movieImage.path, { folder: "moviesTS" }) //upload movie poster image to cloudinary
    const bgImageUpload = await cloudinaryInstance.uploader.upload(bgImage.path, { folder: "moviesTS" }) //upload background image to cloudinary

    
    const newMovieData= { ...movieData, posterImage: movieImageUpload.url, coverImage: bgImageUpload.url } as MovieDTO   //combine movieData with image urls

    
    createMovie(newMovieData)       // Calling DB function
    
    return { success: true, message: "Movie created successfully" }
}


// function to fetch all movies
export const fetchAllMovies = async (): Promise<IMovie[]> => {
    const movies = await findMovies()
    if(!movies || movies.length === 0) {
        throw new Error('NOT_FOUND')
    }
    return movies
}

//  Function to fetch a specific movie by _id
export const findMovieById = async (id: string): Promise<IMovie> => {
    const movie = await findOneMovie(id)
    if(!movie) {
        throw new Error('NOT_FOUND')
    }

    return movie
}


//  Delete a movie by _id
export const deleteThisMovie = async (id: string): Promise<{ success: boolean; message: string }> => {


    // check if movie is playing in any theatre
    const theatreCountOfMoviePlaying = await countOfMoviePlayingInTheatre(id)
    if(theatreCountOfMoviePlaying > 0) {
        throw new Error(`FAILED !!, Movie is currently playing in ${theatreCountOfMoviePlaying} theatre(s)`)
    }


    //  calling delete movie repo
    const deleteMovie = await deleteMovieById(id)
    if(!deleteMovie) {
        throw new Error('NOT_FOUND')
    }


    // TODO: delete images from cloudinary

    return { success: true, message: "Movie deleted successfully" }
}