import axios from "axios";
import type { ExportedIdentity } from '../../schema/export/id';
import type { ExportedMessage } from "../../schema/export/message";
import { reactive_state, state, current_identity } from "../../state";
import { export_identity_pub } from "../crypto/id";
import { unwrap_message } from "../crypto/message";
import { update_user_data } from "../connectors/local-db";



export async function get_messages(server: string, uid: ExportedIdentity) :Promise<ExportedMessage[] | null>{
    const res = await axios.get(server + '/message', {
        params: {
            recipient: btoa(JSON.stringify(uid))
        }
    });

    if(res.status != 200){
        return null;
    }
    return res.data;
}

export async function send_message(server: string, message: ExportedMessage) {
    const res = await axios.post(
        server + '/message',
        message,
        {

        }
    );
    return res;
}



export async function get_and_save_messages() {
    const messages = await get_messages(reactive_state.server, await export_identity_pub(state.userId!.pub_id));
    if(messages == null) return;

    for(const message of messages){

        const decrypted_msg = await unwrap_message(message);

        // find the corresponding chat
        let chat_index = current_identity.user_data!.chats.findIndex((chat) => 
            JSON.stringify(chat.userId) == JSON.stringify(decrypted_msg.sender)
        );

        if(chat_index == -1){
            // chat does not exist yet, append
            current_identity.user_data!.chats.push({
                username: `new unknown sender`,
                userId: decrypted_msg.sender,
                messages: []
            })

            chat_index = current_identity.user_data!.chats.length -1; // update teh index
        }

        // check if same message does not exist
        const collisions = current_identity.user_data!.chats[chat_index].messages.findIndex((msg) => 
            msg.send_time == decrypted_msg.send_time && msg.text == decrypted_msg.message
        )

        if(collisions == -1){
            // no collision, append the message
            current_identity.user_data!.chats[chat_index].messages.push({
                own: false,
                send_time: decrypted_msg.send_time,
                text: decrypted_msg.message
            })
        }
    }
    update_user_data(current_identity.db_id!, current_identity.user_data!, state.userId!);
}