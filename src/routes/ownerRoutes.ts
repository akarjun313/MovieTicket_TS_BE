import { addNewTheatre, showOneTheatre, showTheatreByOwner, updateMovieInTheatre, updateShowTimings } from "@controllers/theatreController.js"
import express, { Router, Request, Response } from "express"

const ownerRouter: Router = express.Router()


ownerRouter.get('/', (req: Request, res: Response) => {
    res.send('Owner routes')
})


ownerRouter.post('/new-theatre', addNewTheatre)     // create new theatre

ownerRouter.patch('/update-t-movie/:id', updateMovieInTheatre)      // update movie in theatre
ownerRouter.post('/update-showtime/:id', updateShowTimings)     // update showtimings
ownerRouter.get('/show-my-theatres', showTheatreByOwner)        // All theatres filtered by Owner
ownerRouter.get('/show-my-theatre/:id', showOneTheatre)         // specific theatre


export default ownerRouter