
// user signup dto
export interface UserSignupDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: number;
    role: 'user' | 'admin' | 'owner';
}


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