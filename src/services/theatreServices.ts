import { ScreenDTO, TheatreDTO } from "@interfaces/dto.interfaces.js"
import { IScreen, IShowTime, ITheatre } from "@interfaces/interfaces.js"
import { findOneMovie } from "@repos/movieRepos.js"
// import { IScreen } from "@interfaces/interfaces.js";
import { createNewTheatre, findTheatreByIdAndStatus, saveToDB, updateTheatreStatusById } from "@repos/theatreRepos.js"
import mongoose from "mongoose"


//      ADMIN CONTROLS
// Updating theatre status
export const theatreStatusUpdate = async (theatreAndStatus: { [key: string]: boolean }): Promise<{ success: boolean, message: string }> => {

    // Updating theatre status one by one
    for (const [key, value] of Object.entries(theatreAndStatus)) {
        await updateTheatreStatusById(key, value)       //   calling repo function
    }

    // returning success message
    return { success: true, message: "Theatre status updated successfully" }
}


//      OWNER CONTROLS

// create new theatre
export const createATheatre = async (userId: string, theatreData: TheatreDTO): Promise<{ success: boolean, message: string }> => {

    //      Mapping screens
    const screens: ScreenDTO[] = theatreData.screens.map((screen: ScreenDTO) => ({
        screenName: screen.screenName,
        seatRow: screen.seatRow,
        seatColumn: screen.seatColumn
    }))


    //   creating new theatre
    const newTheatre: TheatreDTO = {
        theatreName: theatreData.theatreName,
        location: {
            state: theatreData.location.state,
            city: theatreData.location.city,
            landmark: theatreData.location.landmark
        },
        screens: screens,
        owner: userId
    }


    //      save to DB (calling repo function)
    await createNewTheatre(newTheatre)

    return { success: true, message: "Theatre created successfully" }           //  returning success message
}

// Update movie in a theatre
export const updateTheatreMovie = async (theatreId: string, screenName: string, movieId?: string): Promise<{ success: boolean, message: string }> => {


    //      finding theatre
    const theatre: ITheatre | null = await findTheatreByIdAndStatus(theatreId, true)
    if(!theatre) {
        throw new Error('T_NOT_FOUND')
    }


    //      finding target screen
    const targetScreen: IScreen | undefined = theatre.screens.find((screen) => screen.screenName === screenName)
    if(!targetScreen) {
        throw new Error('S_NOT_FOUND')
    }

    //  updating movie
    if(movieId) {
        const movie = await findOneMovie(movieId)
        if(!movie) {
            throw new Error('M_NOT_FOUND')
        }

        targetScreen.movie = movie._id as mongoose.Types.ObjectId
    } else {
        targetScreen.movie = undefined
    }

    targetScreen.showTimes = []         //      clearing show times

    await saveToDB(theatre)         //      calling repo function


    //      returning success message
    return { success: true, message: movieId ? "Movie added successfully" : "Movie removed successfully" }
}


// TODO: Update Show timings & Price
export const updateShowTimingsAndPrice = async (theatreId: string, requestBody: any) => {


    const { dateTime, price, screenName } = requestBody

    const dateObj = new Date(dateTime)

    //  check theatre availability and it status is active
    const theatre: ITheatre | null = await findTheatreByIdAndStatus(theatreId, true)
    if(!theatre) {
        throw new Error('T_NOT_FOUND')
    }

    //      finding the targeted screen
    const targetScreen: IScreen | undefined = theatre.screens.find((screen) => screen.screenName === screenName)
    if(!targetScreen) {
        throw new Error('S_NOT_FOUND')
    }

    //      check if movie is selected
    if(!targetScreen.movie) {
        throw new Error('M_NOT_FOUND')
    }

    //      find the movie duration (will be in mins)
    const movie = await findOneMovie(targetScreen.movie as mongoose.Types.ObjectId)     // fetching movie details




    //      check if showTimes overlaps
    const showTimeOverlaps = targetScreen.showTimes.some((showTime) => {showTime.dateTime.getTime() === dateObj.getTime()})
}