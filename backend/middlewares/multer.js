import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // os.tmpdir() works on all platforms: Windows, Linux (Render), macOS
        cb(null, os.tmpdir())
    },
    filename: (req, file, cb) => {
        // Prefix with timestamp to avoid filename collisions in shared temp dir
        const uniqueName = `${Date.now()}-${file.originalname}`
        cb(null, uniqueName)
    }
})

export const upload = multer({ storage })