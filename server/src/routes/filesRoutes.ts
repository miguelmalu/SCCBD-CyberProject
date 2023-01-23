import { Request, Response, Router } from 'express'
import { verifyToken } from '../middlewares/authJWT'
import multer from 'multer';
import {GridFsStorage} from 'multer-gridfs-storage';
import File from '../models/File';

const MONGO_URI = process.env.DB_URL || 'mongodb://localhost:27017/cyber'

const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});
const upload = multer({ storage });

class FilesRoutes {
  public router: Router
  constructor () {
    this.router = Router()
    this.routes()
  }

  public async getFiles (req: Request, res: Response) : Promise<void> {
/*     res.sendFile(req.file!.originalname); */
  }

  public async uploadFile (req: Request, res: Response) : Promise<void> {
    res.json({ file: req.file })
  }

  public async deleteFile (req: Request, res: Response) : Promise<void> {
/*     const fileName = req.params.fileName
    console.log(fileName)
    fs.unlink(userFiles + fileName, (err) => {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        res.status(204).send({})
      }
    }) */
  }

  routes () {
    this.router.get('/', upload.array('file'), this.getFiles)
    this.router.post('/upload', upload.single('file'), [verifyToken], this.uploadFile)
    this.router.delete('/:fileName', [verifyToken], this.deleteFile)
  }
}
const filesRoutes = new FilesRoutes()

export default filesRoutes.router
