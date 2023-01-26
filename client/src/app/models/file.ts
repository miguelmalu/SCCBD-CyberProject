export class _File {
    filename: string;
    uploadDate: string;
    aliases: string;

    constructor(filename:string, uploadDate: string, aliases: string) {
        this.filename = filename;
        this.uploadDate = uploadDate;
        this.aliases = aliases;
    }   
}
