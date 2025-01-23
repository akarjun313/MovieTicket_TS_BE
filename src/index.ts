import express, {Request, Response} from 'express'
import { connectDb } from '@config/dbConnection.js'
import cookieParser from 'cookie-parser'
import userRouter from '@routes/userRoutes.js'
import ownerRouter from '@routes/ownerRoutes.js'
import adminRouter from '@routes/adminRoutes.js'
import cors from 'cors'

const app = express()

const port: Number = 3001   // port

// middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// routes 
app.use('/api/v1/user', userRouter)
app.use('/api/v1/owner', ownerRouter)
app.use('/api/v1/admin', adminRouter)


connectDb() // DB Connection

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Movie Ticket Booking server')
})

app.listen(port, ()=>{
    console.log(`Server is running at port: ${port}`)
})