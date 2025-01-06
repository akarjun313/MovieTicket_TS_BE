import multer, { StorageEngine, Multer } from "multer"
import { Request } from "express"

const storage: StorageEngine = multer.diskStorage({
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, file.originalname)
    }
})

const upload: Multer = multer({ storage })
export default upload