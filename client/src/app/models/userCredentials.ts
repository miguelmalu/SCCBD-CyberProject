export class UserCredentials {
    username: string;
    password: string;
    token?: string;
    publicKeyE?: string;
    publicKeyN?: string;

    constructor(username:string, password: string) {
        this.username = username;
        this.password = password;
    }   
}
