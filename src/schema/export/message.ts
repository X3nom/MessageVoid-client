
export interface ExportedMessage{
    recipient: string; // ExportedIdentity
    
    send_time: number;

    enc_key: string;
    enc_iv: string;
    enc_data: string;
    // return_enc_key: string; // No
};
