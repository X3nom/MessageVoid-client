import axios from "axios";
import { type ExportedIdentity } from '../../schema/export/id';


export async function resolve_by_name(server: string, name: string) :Promise<any | null>{
    const res = await axios.get(server + '/resolve-name',
        {
            params: {
                username: name
            }
        }
    );
    if(res.status != 200){
        return null;
    }
    return JSON.parse(atob(res.data[0].user_id));
}

export async function publish_name_resolution(server: string, name: string, uid :ExportedIdentity) {
    const res = await axios.post(
        server + '/resolve-name',
        {
            identity: btoa(JSON.stringify(uid))
        },
        {
            params: {
                username: name
            },
            validateStatus: _status => true
        }
    );
    return res;
}