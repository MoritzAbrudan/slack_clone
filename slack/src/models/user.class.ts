export class User{
    
    userName: string;
    email: string;
    password: string;


    constructor(obj?: any){
        this.userName = obj ? obj.userName: '';
        this.email = obj ? obj.email: '';
        this.password = obj ? obj.password: '';
    }

    public toJSON(){
        return {
            userName: this.userName,
            email: this.email,
            password: this.password
        };
    }
}