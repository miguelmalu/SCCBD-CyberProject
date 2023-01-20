import { Request, Response, Router } from 'express'
import * as rsa from 'example-rsa'
import * as bcu from 'bigint-crypto-utils'

import User from '../models/User'

const keypair = rsa.generateRsaKeys(1024)

class RSARoutes {
  public router: Router
  constructor () {
    this.router = Router()
    this.routes()
  }

  public async getServerPublicKey (req: Request, res: Response) : Promise<void> {
    if (!keypair) {
      res.status(404).send('No publicKey available')
    } else {
      //console.log(await keypair).publicKey)
      res.status(200).send((await keypair).publicKey.toString())
    }
  }

  public async getBlindSignature (req: Request, res: Response) : Promise<void> {
    const blindSignatureBigint = (await keypair).privateKey.sign(BigInt(req.params.blindedM))
    const blindSignature = blindSignatureBigint.toString()
    if (!blindSignature) {
      res.status(404).send('Error')
    } else {
      res.status(200).send(blindSignature)
    }
  }

  routes () {
    this.router.get('/getServerPublicKey', this.getServerPublicKey)
    this.router.get('/getBlindSignature/:blindedM', this.getBlindSignature)
  }
}
const rsaRoutes = new RSARoutes()

export default rsaRoutes.router
