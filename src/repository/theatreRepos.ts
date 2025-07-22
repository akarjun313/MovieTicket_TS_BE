import { TheatreDTO } from "@interfaces/dto.interfaces.js"
import { ITheatre } from "@interfaces/interfaces.js"
import Theatre from "@models/theatreModel.js"
import { UpdateResult } from "mongoose"

// create new theatre
export const createNewTheatre = async (theatreData: TheatreDTO): Promise<void> => {
    const newTheatre = new Theatre(theatreData)
    await newTheatre.save()
}

// Update theatre status by its _id (status is boolean)
export const updateTheatreStatusById = async (id: string, status: boolean): Promise<void> => {
    await Theatre.findByIdAndUpdate(id, { status })
}

// Find theatre by _id and status
export const findTheatreByIdAndStatus = async (id: string, status: boolean): Promise<ITheatre | null> => {
    return await Theatre.findOne({ _id: id, status })
}


// Save to DB - function will just save any updates happened to theatre
export const saveToDB = async (theatreData: ITheatre): Promise<void> => {
    await theatreData.save()
}