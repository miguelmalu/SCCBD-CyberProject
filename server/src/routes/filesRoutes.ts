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
    File.find({}, (err: any, files: any) => {
      if (err) {
          console.log(err);
          res.status(500).send(err);
      }
      else {
          /* res.render('uploads', { items: items }); */
          res.status(200).send(files);
      }
  });
}

  public async getFile (req: Request, res: Response) : Promise<void> {
    /* const fileName = req.params.fileName
    try {
      await mongoClient.connect();

      const database = mongoClient.db(dbConfig.database);
      const bucket = new GridFSBucket(database, {
        bucketName: dbConfig.imgBucket,
      });

      let downloadStream = bucket.openDownloadStreamByName(req.params.name);

      downloadStream.on("data", function (data) {
        return res.status(200).write(data);
      });

      downloadStream.on("error", function (err) {
        return res.status(404).send({ message: "Cannot download the Image!" });
      });

      downloadStream.on("end", () => {
        return res.end();
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    } */
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
    this.router.get('/', this.getFiles)
    this.router.get('/:fileName', this.getFiles)
    this.router.post('/upload', upload.single('file'), [verifyToken], this.uploadFile)
    this.router.delete('/:fileName', [verifyToken], this.deleteFile)
  }
}
const filesRoutes = new FilesRoutes()

export default filesRoutes.router
