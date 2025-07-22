import { Request } from "express";
import mongoose, { Document } from "mongoose"


// INTERFACES FOR MONGOOSE MODELS

// USER INTERFACE
export interface UserInterface extends Document {
    firstName: string;
    lastName: string;
    email: string;
    hashPassword: string;
    phone: number;
    role: 'user' | 'admin' | 'owner';

    //this 'id' is used in generating token
    id: string;
}

// MOVIE INTERFACE
export interface IMovie extends Document {
    movieName: string;
    language: string;
    genre: string;
    releaseDate: String;
    description: string;
    rating: number;
    duration: number;
    coverImage: string;
    posterImage: string;
    status: 'RUNNING' | 'UPCOMING';
}


// THEATRE INTERFACES
// seat interface 
export interface ISeat extends Document {
    seatNumber: string
    status: 'AVAILABLE' | 'BOOKED' | 'RESERVED'
}

// showtime interface 
export interface IShowTime extends Document {
    dateTime: Date
    price: number
    seats: ISeat[]
}

// screen interface 
export interface IScreen extends Document {
    screenName: string
    seatRow: number
    seatColumn: number
    movie?: mongoose.Types.ObjectId  | { movieName: string; _id: mongoose.Types.ObjectId } | null | undefined
    showTimes: IShowTime[]
}

// location interface 
export interface ILocation extends Document {
    state: string
    city: string
    landmark: string
}

// theatre interface 
export interface ITheatre extends Document {
    theatreName: string
    location: ILocation
    screens: IScreen[]
    status: boolean
    owner: mongoose.Types.ObjectId
}


//REVIEW INTERFACE
export interface IReview extends Document {
    review: string
    rating: number
    movie: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
}



//RE-DEFINED REQUEST(for authentication) INTERFACE
export interface AuthRequest extends Request {
    user?: {
        data: string;
        role: string;
    }
}
