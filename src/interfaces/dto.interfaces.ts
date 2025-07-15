
// user signup dto
export interface UserSignupDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: number;
    role: 'user' | 'admin' | 'owner';
}


//      MOVIE RELATED INTERFACES
// for files uploads in movie creation
export interface UploadedFiles {
    movieImage?: Express.Multer.File[];
    bgImage?: Express.Multer.File[]
}
//      MOVIE INTERFACE
export interface MovieDTO {
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


//      THEATRE RELATED INTERFACES
//     screen interface
export interface ScreenDTO {
    screenName: string;
    seatRow: number;
    seatColumn: number;
}
//     theatre interface
export interface TheatreDTO {
    theatreName: string;
    location: {
        state: string;
        city: string;
        landmark: string;
    }
    screens: ScreenDTO[];
    owner: string;
}