import type { UserID } from "./id";


export interface Message{
    recipient: UserID;
    send_time: number;
    enc_key: string;
    sender_enc_key: string;
    enc_data: string;
};

// encrypted part of public message
export interface Message_enc_data{
    sender: UserID;
    message: string;
    signature: string;
};

