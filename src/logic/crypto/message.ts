import type { ExportedIdentity } from "../../schema/export/id";
import type { ExportedMessage } from "../../schema/export/message";
import type { IdEncryptedData } from "../../schema/inner/id";
import type { Message_enc_data, Message } from "../../schema/inner/message";
import { state } from "../../state";
import { export_identity_pub, id_decrypt, id_encrypt, import_identity } from "./id";


export async function build_message(message_text :string, recipient :ExportedIdentity) {
    const recipient_imported = await import_identity(recipient)

    const msg_inner :Message_enc_data = {
        sender: await export_identity_pub(state.userId!.pub_id),
        message: message_text,
        signature: ''
    }

    const enc_data = await id_encrypt(JSON.stringify(msg_inner), recipient_imported.enc_key);

    const msg_outer :ExportedMessage = {
        recipient: btoa(JSON.stringify(recipient)),

        enc_key: enc_data.aes_key,
        enc_iv: enc_data.aes_iv,
        enc_data: enc_data.data,
        
        send_time: Date.now()
    }

    return msg_outer;
}


export async function unwrap_message(message_outer: ExportedMessage) {

    const id_encrypted :IdEncryptedData = {
        aes_key: message_outer.enc_key,
        aes_iv: message_outer.enc_iv,
        data: message_outer.enc_data
    };

    const inner :Message_enc_data = JSON.parse(
        await id_decrypt(id_encrypted, state.userId!.priv_id.enc_key)
    );

    const message :Message = {
        message: inner.message,
        sender: inner.sender,
        send_time: message_outer.send_time
    };
    return message;
}