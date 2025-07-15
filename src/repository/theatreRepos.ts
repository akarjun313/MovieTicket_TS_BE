import { TheatreDTO } from "@interfaces/dto.interfaces.js"
import { ITheatre } from "@interfaces/interfaces.js"
import Theatre from "@models/theatreModel.js"

// create new theatre
export const createNewTheatre = async (theatreData: TheatreDTO): Promise<void> => {
    const newTheatre = new Theatre(theatreData)
    await newTheatre.save()
}

// Update theatre status by its _id (status is boolean)
export const updateTheatreStatusById = async (id: string, status: boolean): Promise<void> => {
    await Theatre.findByIdAndUpdate(id, { status })
}