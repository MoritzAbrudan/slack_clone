export class User{
    
    userName: string;
    email: string;
    password: string;
    uID: string;


    constructor(obj?: any){
        this.userName = obj ? obj.userName: '';
        this.email = obj ? obj.email: '';
        this.password = obj ? obj.password: '';
        this.uID = obj ? obj.uID: '';
    }

    public toJSON(){
        return {
            userName: this.userName,
            email: this.email,
            password: this.password,
            uID: this.uID
        };
    }
}