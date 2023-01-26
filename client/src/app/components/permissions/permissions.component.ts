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
import { empty } from 'rxjs';

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

  permission:any
  signedPermission:any

  constructor(private socketService: SocketService,
    private fileService: FileService) { }

  async ngOnInit(){
    this.socketService.getNewMessage().subscribe((message: any) => {
      if (message.filename !== undefined) {
        if (message.signature == null) {
          this.permission = message
          this.messageList.push(message.filename + " request by " + message.user);
        } else {
          this.signedPermission = message
          this.messageList.push(message.filename + " request approved by " + message.owner);
        }
      }
    })

    this.username = localStorage.getItem('username')!;

    const publicKeyE = BigInt(localStorage.getItem('publicKeyE')!)
    const publicKeyN = BigInt(localStorage.getItem('publicKeyN')!)
    this.publicKey = new rsa.RsaPublicKey(publicKeyE, publicKeyN)
    const privateKeyD = BigInt(localStorage.getItem('privateKeyD')!)
    const privateKeyN = BigInt(localStorage.getItem('privateKeyN')!)
    this.privateKey = new rsa.RsaPrivateKey(privateKeyD, privateKeyN)

    this.r = bcu.randBetween(this.publicKey.n - 1n)
  }

  async requestPermission() {
    const permission = await perm.createPermission(this.username, this.targetFile);
    this.socketService.sendMessage(permission);
    this.targetFile = '';
  }

  async signPermission() {
    this.fileService.getFile(this.permission.filename).subscribe(async data => {
      const imageOwner = data.aliases
      if (imageOwner == this.username) {
        const signatureContent = BigInt(await perm.prepareSignature(this.permission))
        const encryptedSignatureContent = signatureContent * this.publicKey.encrypt(this.r) % this.publicKey.n
        const signedContent = this.privateKey.sign(encryptedSignatureContent)
        this.signedPermission = await perm.updatePermission(this.permission, this.username, signedContent.toString(), this.r.toString())
        this.socketService.sendMessage(this.signedPermission);
      } else
        console.log("not the Owner");
    }, error => {
      console.log(error);
    })

  }

  async getFileContent() {
    this.fileService.download(this.signedPermission).subscribe(data => {
      const file = new Blob([data], { type: data.type });
      saveAs(file, this.signedPermission.filename);
      /* window.open(window.URL.createObjectURL(data)) */
    }, error => {
      console.log(error);
    })
  }
}