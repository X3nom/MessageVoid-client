import axios from "axios";
import { type ExportedIdentity } from '../../schema/export/id';


async function name_hash(name: string) :Promise<string> {
    const hash = await crypto.subtle.digest('SHA-256', Uint8Array.from(name))
    return String(hash)
}

export async function resolve_by_name(server: string, name: string) :Promise<any | null>{
    const res = await axios.get(server + '/' + await name_hash(name));
    if(res.status != 200){
        return null;
    }
    return res.data;
}

export async function publich_name_resolution(server: string, name: string, uid :ExportedIdentity) {
    const res = await axios.post(
        server + '/' + await name_hash(name),
        uid
    );
    return res;
}