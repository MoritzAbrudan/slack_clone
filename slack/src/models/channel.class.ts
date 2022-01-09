export class Channel {
    title: string;
    // members;

    constructor(obj?: any) {
        // this.members = obj ? obj.members : '';
        this.title = obj ? obj.title : '';
    }

    public toJSON() {
        return {
            // members: this.members,
            title: this.title,
        }
    }
}