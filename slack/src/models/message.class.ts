import { Channel } from "./channel.class";
import { User } from "./user.class";

export class Message{

    channel: Channel;
    user: User;
    question: string;
    answers: string;

    constructor(obj?: any){
        this.channel = obj ? obj.channel: '';
        this.user = obj ? obj.user: '';
        this.question = obj ? obj.question: '';
        this.answers = obj ? obj.answers: '';
    }

    public toJSON(){
        return {
            channel: this.channel,
            user: this.user,
            question: this.question,
            answers: this.answers,
        };
    }
}
