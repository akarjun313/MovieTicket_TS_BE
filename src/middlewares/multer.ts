import multer, { StorageEngine } from "multer"
import { Request, RequestHandler } from "express"

const storage: StorageEngine = multer.diskStorage({
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage }).fields([
    {name: 'movieImage', maxCount: 1},
    {name: 'bgImage', maxCount: 1}
])


const uploadMiddleware: RequestHandler = upload as RequestHandler
export default uploadMiddleware;