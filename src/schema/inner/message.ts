import { type ExportedIdentity } from '../export/id';


// encrypted part of public message
export interface Message_enc_data{
    sender: ExportedIdentity;
    message: string;
    signature: string;
};



export interface Message{
    send_time: number;
    message: string,
    sender: ExportedIdentity
};