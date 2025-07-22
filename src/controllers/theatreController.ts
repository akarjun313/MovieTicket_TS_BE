import { Request, Response } from "express"
import { ITheatre, ILocation, IScreen, UserInterface, IMovie, IShowTime, ISeat, AuthRequest } from "@interfaces/interfaces.js"
import Theatre from "@models/theatreModel.js"
import jwt from "jsonwebtoken"
import User from "@models/userModel.js"
import Movie from "@models/movieModel.js"
import mongoose from "mongoose"
import { generateSeatingArrangement } from "helper/seatingArrangement.js"
import { createATheatre, theatreStatusUpdate, updateTheatreMovie } from "@services/theatreServices.js"

// TODO: create theatre (clean up requries)
export const addNewTheatre = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        
        //      check if user is logged in
        if(!req.user) {
            res.status(401).json({ message: "Unauthorized, login first", success: false })
            return
        }

        
        const { data } = req.user       // get user _id from req
        const theatreData = req.body        // get theatre details from request body


        //      calling service function to create new theatre
        const { message, success} = await createATheatre(data, theatreData)



        //verify token
        // const token: string = req.cookies.token
        // if (!token) {
        //     res.status(401).json({ message: "Unauthorized, login first", success: false })
        //     return
        // }

        // decode token 
        // const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { data: string, role: string }
        // const userId: string = decoded.data

        //verify user
        // const userExist: UserInterface | null = await User.findById(userId)
        // if (!userExist) {
        //     res.status(401).json({ message: "Unauthorized, login first", success: false })
        //     return
        // }

        // if (userExist.role !== 'owner') {
        //     res.status(401).json({ message: "Unauthorized, login as owner", success: false })
        //     return
        // }



        // theatre details
        // const { theatreName }: ITheatre = req.body

        // //location details
        // const { state, city, landmark }: ILocation = req.body.location

        // //screen details
        // // const { screenName, seatRow, seatColumn }: IScreen = req.body
        // const screens = req.body.screens.map((screen: IScreen) => ({
        //     screenName: screen.screenName,
        //     seatRow: screen.seatRow,
        //     seatColumn: screen.seatColumn
        // }))


        // // create new theatre
        // const newTheatre = new Theatre({
        //     theatreName,
        //     location: {
        //         state,
        //         city,
        //         landmark
        //     },
        //     screens,
        //     owner: data
        // })
        // await newTheatre.save()


        res.status(200).json({ message, success })
    } catch (error) {
        console.log("Error in adding new theatre", error)
        res.status(500).json({ message: "Internal server error at adding new theatre", success: false })
    }
}


// TODO: show all theatre (For admin only)
export const showAllTheatre = async (req: Request, res: Response): Promise<void> => {
    try {

        // getting all theatres list from DB 
        const theatres: ITheatre[] = await Theatre.find().select('-__v')
        if (!theatres || theatres.length === 0) {
            res.status(404).json({ message: "No theatres found", success: false })
            return
        }


        //update with owner id with owner details
        const theatreWithOwner = await Promise.all(theatres.map(async (theatre: ITheatre) => {
            const owner = await User.findById(theatre.owner).select('-hashPassword -createdAt -updatedAt -__v')
            return { ...theatre.toObject(), owner }
        }))

        res.status(200).json({ message: theatreWithOwner, success: true })
    } catch (error) {
        console.log("Error in showing all theatres", error)
        res.status(500).json({ message: "Internal server error at showing all theatres", success: false })
    }
}



// TOOD: show a specific theatre
export const showOneTheatre = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        // console.log("Hitted on showOneTheatre")

        // theatre id here
        const { id } = req.params

        // search by theatre id 
        const theatre: ITheatre | null = await Theatre.findById(id)
            .populate({
                path: 'screens.movie',      //populate screen movie
                select: 'movieName _id'     //select only movieName and id
            })
            .select('-screens.showTimes.seats')     //Deselects seats array

        if (!theatre) {
            res.status(404).json({ message: "Theatre not found", success: false })
            return
        }

        res.status(200).json({ message: theatre, success: true })
    } catch (error) {
        console.log("Error in showing one theatre", error)
        res.status(500).json({ message: "Internal server error at showing one theatre", success: false })
    }
}


// TODO: Show theatre by owner
export const showTheatreByOwner = async (req: Request, res: Response): Promise<void> => {
    try {
        //verify token
        const token: string = req.cookies.token
        if (!token) {
            res.status(401).json({ message: "Unauthorized, login first", success: false })
            return
        }

        // decode token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { data: string, role: string }
        const userId: string = decoded.data

        //verify user
        const userExist: UserInterface | null = await User.findById(userId)
        if (!userExist) {
            res.status(401).json({ message: "Unauthorized, login first", success: false })
            return
        }

        if (userExist.role !== 'owner') {
            res.status(401).json({ message: "Unauthorized, login as owner", success: false })
            return
        }

        // search & find all theatres by owner
        const theatres: ITheatre[] = await Theatre.find({ owner: userId })
            .populate({
                path: 'screens.movie',      //populate screen movie
                select: 'movieName _id'     //select only movieName and id
            })
            .select('-screens.showTimes.seats')     //Deselects seats array



        //      sending theatre array to frontend
        res.status(200).json({ message: theatres, success: true })
    } catch (error) {
        console.log("Internal server error at fetching theatres by owner", error)
        res.status(500).json({ message: "Internal server error at fetching theatres by owner" })
    }
}


// TODO: delete a theatre
export const deleteOneTheatre = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    try {
        // theatre id here
        const { id } = req.params

        // search by theatre id and delete
        const theatre: ITheatre | null = await Theatre.findByIdAndDelete(id)
        if (!theatre) {
            return res.status(404).json({ message: "Theatre not found", success: false })
        }
        return res.status(200).json({ message: "Theatre deleted successfully", success: true })
    } catch (error) {
        console.log("Error in deleting one theatre", error)
        return res.status(500).json({ message: "Internal server error at deleting one theatre", success: false })
    }
}


// UPDATE THEATRE
// update movie in theatre-screen
export const updateMovieInTheatre = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    console.log("hitted on updateMovieInTheatre")
    try {
        // theatre _id here 
        const { id } = req.params

        // movie _id & screenName here
        const { movieId, screen }: { movieId?: string; screen: string } = req.body

        // calling service func - updating movie and show times
        const { message, success } = await updateTheatreMovie(id, screen, movieId)


        res.status(200).json({ message, success})

    } catch (error: any) {

        // theatre not found
        if( error.message === "T_NOT_FOUND" ) {
            res.status(404).json({ message: "Theatre not found", success: false })
            return
        }

        // screen not found
        if( error.message === "S_NOT_FOUND" ) {
            res.status(404).json({ message: "Screen not found", success: false })
            return
        }

        // movie not found
        if( error.message === "M_NOT_FOUND" ) {
            res.status(404).json({ message: "Movie not found", success: false })
            return
        }


        res.status(500).json({ message: "Internal server error at updating movie in theatre", success: false })
        console.log("error in updating movie in theatre", error)
    }
}


// TODO: update date and times of theatre-screen - update one-by-one show timings
export const updateShowTimings = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        // theatre id here
        const { id } = req.params


        // Getting datas from request - dateTime, price, screenName
        const { dateTime, price, screen }: { dateTime: Date; price: number; screen: string } = req.body

        // finding theatre
        // const theatre: ITheatre | null = await Theatre.findById(id)
        // if (!theatre) {
        //     res.status(404).json({ message: "Theatre not found", success: false })
        //     return
        // }

        // // check if theatre is active
        // if (theatre.status === false) {
        //     res.status(400).json({ message: "Theatre is not active", success: false })
        //     return
        // }


        // find target screen
        // const targetScreen: IScreen | undefined = theatre.screens.find((scr) => scr.screenName === screen)
        // if (!targetScreen) {
        //     res.status(404).json({ message: "Screen not found", success: false })
        //     return
        // }

        // check if show timings already exist
        const showTimeExist = targetScreen.showTimes.some(
            (showTime) => showTime.date === date && showTime.time === time
        )
        if (showTimeExist) {
            res.status(400).json({ message: "Show timings already exist", success: false })
            return
        }

        //fill out seating
        const seats: ISeat[] = generateSeatingArrangement(targetScreen.seatRow, targetScreen.seatColumn)

        // update show timings, price
        targetScreen.showTimes.push({
            date,
            time,
            price,
            seats
        } as IShowTime)

        await theatre.save()


        res.status(200).json({ message: "Show timings updated successfully", success: true })

    } catch (error) {
        console.log("Error in updating show timings", error)
        res.status(500).json({ message: "Internal server error at updating show timings", success: false })
    }
}



// update the status of theatre (for admin only)
export const updateTheatreStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        //      frontend will give theatre id as key and status as value
        const updateTheatre: { [key: string]: boolean } = req.body

        //      calling service func to update theatre status by its _id
        const { message, success } = await theatreStatusUpdate(updateTheatre)


        //      success message
        res.status(200).json({ message, success })
    } catch (error) {
        res.status(500).json({ message: "Internal server error at updating theatre status", success: false })
        console.log("error in updating theatre status", error)
    }
}