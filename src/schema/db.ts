import type { ExportedIdentity, ExportedOwnedIdentity } from "./export/id";
import type { IdEncryptedData } from "./inner/id";

export interface IdentityEntry {
  id?: number; // optional because it's autoIncrement
  label: string;
  identity: ExportedOwnedIdentity;
}

export interface UserDataEntry {
  id?: number;
  inner_data: IdEncryptedData | null
}



export interface StoredMessage{
  own: boolean,
  send_time: number,
  text: string
}

export interface InnerUserDataEntry {
  chats: {
    username: string;
    userId: ExportedIdentity,
    messages: StoredMessage[]
  }[],
  settings: {}
}