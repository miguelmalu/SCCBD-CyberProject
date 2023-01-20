import { Request, Response, Router } from 'express'
import { verifyToken } from '../middlewares/authJWT'
import fs from 'fs'

const userFiles = './user_upload/'

class FilesRoutes {
  public router: Router
  constructor () {
    this.router = Router()
    this.routes()
  }

  public async uploadFile (req: Request, res: Response) : Promise<void> {
    const file = req.body
    console.log(file)
    const base64data = file.content.replace(/^data:.*,/, '')
    fs.writeFile(userFiles + file.name, base64data, 'base64', (err: any) => {
      if (err) {
        console.log(err)
        res.status(500)
      } else {
        res.set('Location', userFiles + file.name)
        res.status(200).send(file)
      }
    })
  }

  public async deleteFile (req: Request, res: Response) : Promise<void> {
    const fileName = req.params.fileName
    console.log(fileName)
    fs.unlink(userFiles + fileName, (err) => {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        res.status(204).send({})
      }
    })
  }

  routes () {
    this.router.post('/', [verifyToken], this.uploadFile)
    this.router.delete('/:fileName', [verifyToken], this.deleteFile)
  }
}
const filesRoutes = new FilesRoutes()

export default filesRoutes.router
