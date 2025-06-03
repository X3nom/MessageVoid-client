import axios from "axios";
import type { ExportedIdentity } from '../../schema/export/id';
import type { ExportedMessage } from "../../schema/export/message";



export async function get_messages(server: string, uid: ExportedIdentity) :Promise<any | null>{
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
        
    );
    return res;
}