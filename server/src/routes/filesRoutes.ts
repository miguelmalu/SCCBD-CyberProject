import { Request, Response, Router } from 'express'
import { verifyToken } from '../middlewares/authJWT';
import File from '../models/File';
import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage'
import path from 'path'
import multer from 'multer'
import crypto from 'crypto'
import * as rsa from 'example-rsa'
import * as perm from 'permission-module'
import * as bcu from 'bigint-crypto-utils'
import User from '../models/User';

const MONGO_URI = process.env.DB_URL || 'mongodb://localhost:27017/cyber'
const storage = new GridFsStorage({
    url: MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                console.log("storage owner: " + req.body.owner)
                /* const filename = buf.toString('hex') + path.extname(file.originalname); */
                const filename = file.originalname
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    aliases: req.body.owner,
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });
const connect = mongoose.createConnection(MONGO_URI);
let gfs;
connect.once('open', () => {
    // initialize stream
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads"
    });
});

class FilesRoutes {
  public router: Router
  constructor () {
    this.router = Router()
    this.routes()
    }

    // GET: Fetches a particular image and render on browser
    public async getImageContent (req: Request, res: Response) : Promise<void> {
/*         console.log("getImageContent")
        console.log(req.params)
        console.log(req.body)

        console.log(req.body.filename)
        console.log(req.body.user)
        console.log(req.body.signedContent) */
        const owner = await User.findOne({ username: req.body.owner })
        let publicKey = new rsa.RsaPublicKey(BigInt(owner!.publicKeyE!), BigInt(owner!.publicKeyN!))
/*         let publicKeyString = owner!.publicKey
        console.log(publicKeyString)
        publicKey = parseInt(publicKeyString!)
        let publicKeyBigInt = BigInt(publicKeyString!) */
        let r = BigInt(req.body.r)

/*         const r = bcu.randBetween(publicKey - 1n) */
        const obtainedSignature = BigInt(req.body.signature) * bcu.modInv(r,publicKey.n)
        const signatureContent = BigInt(await perm.prepareSignature(req.body))

        gfs.find({ filename: req.params.filename }).toArray((err:any, files:any) => {
            if (!files[0] || files.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'No files available',
                });
            } else {
                const image = files[0]
                const imageOwner = image.aliases
                console.log("gfs.find - imageOwner: " + imageOwner)

                if (publicKey.verify(obtainedSignature) !== signatureContent) {
                    console.log("Signature Error")
                    res.status(402).json({
                        err: 'Signature Error',
                    });
                } else {
                    console.log("Signature OK")
                    console.log("owner?.username: " + owner?.username)
                    console.log("imageOwner: " + imageOwner)
                    if (owner?.username == imageOwner) {
                        console.log("File Permission Owner OK")
                        if (image.contentType === 'image/jpeg' || image.contentType === 'image/png' || image.contentType === 'image/svg+xml') {
                            // render image to browser
                            gfs.openDownloadStreamByName(req.body.filename).pipe(res);
                            res.status(200)
                        } else {
                            res.status(404).json({
                                err: 'Not an image',
                            });
                        }
                    } else
                        console.log("File Permission Owner (not target) is not File Owner")
                }
            }
        });
    }

    // GET: Fetches a particular file by filename
    public async getFile (req: Request, res: Response) : Promise<void> {
        gfs.find({ filename: req.params.filename }).toArray((err:any, files:any) => {
            if (!files[0] || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            }
            res.status(200).send(files[0])
        });
    }

    // GET: Fetch most recently added record
    public async getRecent (req: Request, res: Response) : Promise<void> {
        File.findOne({}, {}, { sort: { '_id': -1 } })
        .then((image) => {
            res.status(200).json({
                success: true,
                image,
            });
        })
        .catch(err => res.status(500).json(err));

    }

    // GET: Fetches all the files in the uploads collection
    public async getAllFiles (req: Request, res: Response) : Promise<void> {
        gfs.find().toArray((err: any, files: any) => {
            if (!files || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files available'
                });
            }

            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg') {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });

            res.status(200).send(files)
/*             res.status(200).json({
                success: true,
                files,
            }); */
        });
    }

    // POST: Upload a single image/file to Image collection
    public async uploadFile (req: Request, res: Response) : Promise<void> {
        console.log("uploadFile req.body: ");
        console.log(req.body);
        // check for existing images
        File.findOne({ caption: req.body.caption })
            .then((image) => {
                console.log("uploadFile image: " + image);
                if (image) {
                    return res.status(200).json({
                        success: false,
                        message: 'Image already exists',
                    });
                }
                console.log("owner: " + req.body.owner);
                let newImage = new File({
                    caption: req.body.caption,
                    filename: req.file!.filename,
                    /* owner: req.body.owner */
                    /* fileId: req.file!.id, */
                });
/*                 console.log("newImage.owner: " + newImage.owner) */
                newImage.save()
                    .then((image: any) => {

                        res.status(200).json({
                            success: true,
                            image,
                        });
                    })
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json(err));
        File.find({})
            .then(images => {
                res.status(200).json({
                    success: true,
                    images,
                });
            })
            .catch(err => res.status(500).json(err));
    }

    // POST: Upload multiple files upto 3
    public async uploadMultiple (req: Request, res: Response) : Promise<void> {
        res.status(200).json({
            success: true,
            message: `${req.files!.length} files uploaded successfully`,
        });
    }

    // GET: Delete an image from the collection
    public async deleteImage (req: Request, res: Response) : Promise<void> {
        File.findOne({ _id: req.params.id })
        .then((image) => {
            if (image) {
                File.deleteOne({ _id: req.params.id })
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: `File with ID: ${req.params.id} deleted`,
                        });
                    })
                    .catch(err => { return res.status(500).json(err) });
            } else {
                res.status(200).json({
                    success: false,
                    message: `File with ID: ${req.params.id} not found`,
                });
            }
        })
        .catch(err => res.status(500).json(err));
    }

    // DELETE: Delete a particular file by an ID
    public async deleteFile (req: Request, res: Response) : Promise<void> {
        console.log(req.params.id);
        gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err:any, data:any) => {
            if (err) {
                return res.status(404).json({ err: err });
            }
            res.status(200).json({
                success: true,
                message: `File with ID ${req.params.id} is deleted`,
            });
        });
    }

  routes () {
    this.router.post('/image/:filename', this.getImageContent)
    this.router.get('/recent', this.getRecent)
    this.router.get('/file/:filename', this.getFile)
    this.router.get('/', this.getAllFiles)
    this.router.post('/', [verifyToken], upload.single('file'), this.uploadFile)
    this.router.post('/multiple', [verifyToken], upload.array('file', 3), this.uploadMultiple)
    this.router.post('/image/delete/:id', [verifyToken], this.deleteImage)
    this.router.post('/file/delete/:id', [verifyToken], this.deleteFile)
  }
}
const filesRoutes = new FilesRoutes()

export default filesRoutes.router
