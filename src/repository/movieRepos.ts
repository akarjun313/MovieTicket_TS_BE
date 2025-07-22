import { MovieDTO } from "@interfaces/dto.interfaces.js";
import { IMovie } from "@interfaces/interfaces.js";
import Movie from "@models/movieModel.js";
import Theatre from "@models/theatreModel.js";
import mongoose from "mongoose";



//  Repo function for creating new movie
export const createMovie = async (movieData: MovieDTO): Promise<IMovie | null> =>  {
    const movie = new Movie(movieData)
    return await movie.save()
}


//  Repo function for fetching all movies
export const findMovies = async (): Promise<IMovie[] | null> =>  {
    return await Movie.find().exec()
}


//  Repo function for fetching one movie by _id
export const findOneMovie = async (id: string | mongoose.Types.ObjectId): Promise<IMovie | null> =>  {
    return await Movie.findById(id).exec()
}


//  Repo function for Delete movie by _id
export const deleteMovieById = async (id: string): Promise<IMovie | null> =>  {
    return await Movie.findByIdAndDelete(id).exec()
}


// Gives the count of theatre a specfic movie is playing
export const countOfMoviePlayingInTheatre = async (movieId: string): Promise<number> => {
    return await Theatre.countDocuments({'screens.movie': movieId})
}