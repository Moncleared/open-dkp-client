export enum Event {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect'
}

export class Message {    
    public From: string;
    public To: string;
    public Action: string;
    public Message: string;
    public Data: any;
    public Timestamp: Date;
}