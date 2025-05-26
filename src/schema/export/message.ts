import type { ExportedIdentity } from "./id";

export interface ExportedMessage{
    recipient: ExportedIdentity;
    send_time: number;
    enc_key: string;
    return_enc_key: string; 
    enc_data: string;
};
