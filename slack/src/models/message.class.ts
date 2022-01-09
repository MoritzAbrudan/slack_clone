import { User } from "./user.class";

export class Message{

    user: User;
    question: string;
    answers: [];

    constructor(obj?: any){
        this.user = obj ? obj.user: '';
        this.question = obj ? obj.question: '';
        this.answers = obj ? obj.answers: '';
    }

    public toJSON(){
        return {
            user: this.user,
            question: this.question,
            answers: this.answers,
        };
    }
}
