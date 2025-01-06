import mongoose, { Model, Schema } from "mongoose"
import { ISeat, IShowTime, IScreen, ILocation, ITheatre } from "@interfaces/interfaces.js"


// creating schema 

// seat schema
const seatSchema = new Schema<ISeat>({
    seatNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BOOKED', 'RESERVED'],
        default: 'AVAILABLE'
    }
})

// show time schema 
const showTimeSchema = new Schema<IShowTime>({
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seats: {
        type: [seatSchema],
        required: true
    }
})

// screen schema
const screenSchema = new Schema<IScreen>({
    screenName: {
        type: String,
        required: true,
        unique: true
    },
    seatRow: {
        type: Number,
        required: true
    },
    seatColumn: {
        type: Number,
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },
    showTimes: {
        type: [showTimeSchema]
    }
})

//location schema
const locationSchema = new Schema<ILocation>({
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    }
})


// theatre schema
const theatreSchema = new Schema<ITheatre>({
    theatreName: {
        type: String,
        required: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    screens: {
        type: [screenSchema],
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


// creating model
const Theatre: Model<ITheatre> = mongoose.model<ITheatre>('Theatre', theatreSchema)
export default Theatre