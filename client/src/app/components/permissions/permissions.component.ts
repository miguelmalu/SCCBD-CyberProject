import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';  
import { FileService } from 'src/app/services/file.service'; 
import * as rsa from 'example-rsa'
import * as perm from 'permission-module'
import * as bcu from 'bigint-crypto-utils'
import { PrefixNot } from '@angular/compiler';
import { saveAs } from 'file-saver';
import { publicEncrypt } from 'crypto';

import { _File } from 'src/app/models/file';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})

export class PermissionsComponent {
  newMessage!: any;
  messageList: any[] = [];

  username!: string
  targetFile!: string;

  publicKey:any
  privateKey:any
  r:any

  permision:any
  signedPermision:any

  tempURL:any

  constructor(private socketService: SocketService,
    private fileService: FileService) { }

  async ngOnInit(){
    this.socketService.getNewMessage().subscribe((message: any) => {
      /* this.messageList.push(message); */
      console.log("50:")
      console.log(message)
      console.log("60: " + message.filename)
      console.log("70: " + message.signature)
      if (message.signature == null) {
        console.log("permision")
        this.permision = message
      } else {
        console.log("signedPermision")
        this.signedPermision = message
      }
      this.messageList.push(message.filename);
    })
/*     myAsynFunction(),
    console.log(myAsynFunction),
    console.log("dddddd")
     getData(),
    async function getData() {
      const response = await rsa.generateRsaKeys(1024);
      return console.log("2222");
    },
    async function getData2() {
      const response = await rsa.generateRsaKeys(1024);
      return console.log(response);
    },
    get(this) */
    this.username = localStorage.getItem('username')!;

    const publicKeyE = BigInt(localStorage.getItem('publicKeyE')!)
    const publicKeyN = BigInt(localStorage.getItem('publicKeyN')!)
    this.publicKey = new rsa.RsaPublicKey(publicKeyE, publicKeyN)
    const privateKeyD = BigInt(localStorage.getItem('privateKeyD')!)
    const privateKeyN = BigInt(localStorage.getItem('privateKeyN')!)
    this.privateKey = new rsa.RsaPrivateKey(privateKeyD, privateKeyN)

    this.r = bcu.randBetween(this.publicKey.n - 1n)
    console.log("R: " + this.r)
  }

  async requestPermission() {
/*     (async () => {
      console.log(this.targetUser + "," + this.targetFile)
      const permision = await perm.createPermision(this.targetUser,this.targetFile);
      this.socketService.sendMessage(permision);
      this.targetUser = '';
      this.targetFile = '';
    }); */
/*     this.socketService.sendMessage(this.newMessage);
    this.newMessage = ''; */
    console.log(this.username)
    const permision = await perm.createPermision(this.username, this.targetFile);
    console.log("requestPermission:")
    console.log(permision)
    this.socketService.sendMessage(permision);
/*     console.log(this.targetUser)
    console.log(this.targetFile)
    console.log(createPermision) */
    this.targetFile = '';
  }

  async signPermission() {
    /*       this.socketService.sendMessage(await createPermision(this.targetUser, this.targetFile));
          this.targetUser = '';
          this.targetFile = ''; */

    
    this.fileService.getFile(this.permision.filename).subscribe(async data => {
      console.log(data);
      const imageOwner = data.aliases
      console.log("imageOwner: " + imageOwner)
      console.log("this.username: " + this.username)
      if (imageOwner == this.username) {
        const signatureContent = BigInt(await perm.prepareSignature(this.permision))
        const encryptedSignatureContent = signatureContent * this.publicKey.encrypt(this.r) % this.publicKey.n
        const signedContent = this.privateKey.sign(encryptedSignatureContent)
        this.signedPermision = await perm.updatePermision(this.permision, this.username, signedContent.toString(), this.r.toString())
/*         console.log(signatureContent)
        console.log(encryptedSignatureContent)
        console.log(signedContent) */
        console.log("sP: ")
        console.log(this.signedPermision)
        this.socketService.sendMessage(this.signedPermision);
      } else
        console.log("not the Owner");
    }, error => {
      console.log(error);
    })

  }

  async getFileContent() {
    console.log("signature: " + this.signedPermision.signature)
    this.fileService.download(this.signedPermision).subscribe(data => {
      console.log("getFile OK");
      console.log(data);
      const file = new Blob([data], { type: data.type });
      saveAs(file, 'data.png');
      /* window.open(window.URL.createObjectURL(data)) */
      this.tempURL = data;
    }, error => {
      console.log("getFile ERROR");
      console.log(error);
    })
    /*       this.socketService.sendMessage(await createPermision(this.targetUser, this.targetFile));
          this.targetUser = '';
          this.targetFile = ''; */
/*     console.log("Hola")
    const signatureContent = BigInt(await perm.prepareSignature(this.permision))
    const encryptedSignatureContent = signatureContent * this.publicKey.encrypt(this.r) % this.publicKey.n
    const signedContent = this.privateKey.sign(encryptedSignatureContent)
    
    this.socketService.sendMessage(signedContent);
    console.log("sC: " + signedContent) */
  }
  

 /*  async function get() {
    this.keypair = await rsa.generateRsaKeys(1024);
    console.log(this.publicKey)
    this.r = bcu.randBetween(this.publicKey.n - 1n)
  } */
}

  

/* const myAsynFunction2 = async (): Promise<any> => {
  const permision = await perm.createPermision(targetUser, targetFile);
  return permision;
} */

/* async function send() {
  const response = await rsa.generateRsaKeys(1024);
  return console.log("2222");
}


const myAsynFunction = async (): Promise<any> => {
  const keypair = await rsa.generateRsaKeys(1024)
  const publickeyServidor = publicKey
  const privatekeyServidor = privateKey
  console.log(publickeyServidor)
  console.log(privatekeyServidor)
  return {
    publickeyServidor, 
    privatekeyServidor
  } 
} */


/* const myAsynFunction2 = async (): Promise<jose.GenerateKeyPairResult> => {
  const { publicKey, privateKey } = await jose.generateKeyPair('RSA-OAEP')
  publickeyServidor = await jose.exportJWK(publicKey)
  privatekeyServidor = await jose.exportJWK(privateKey) 
  //console.log(publickeyServidor)
  //console.log(privatekeyServidor)
  return {
    publicKey, 
    privateKey
  } 
} */