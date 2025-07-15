import { ScreenDTO, TheatreDTO } from "@interfaces/dto.interfaces.js"
import { ITheatre } from "@interfaces/interfaces.js"
// import { IScreen } from "@interfaces/interfaces.js";
import { createNewTheatre, updateTheatreStatusById } from "@repos/theatreRepos.js"


//      ADMIN CONTROLS
// Updating theatre status
export const theatreStatusUpdate = async (theatreAndStatus: { [key: string]: boolean }): Promise<{ success: boolean, message: string }> => {
    
    // Updating theatre status one by one
    for(const [key, value] of Object.entries(theatreAndStatus)) {
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