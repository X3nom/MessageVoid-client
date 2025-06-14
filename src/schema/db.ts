import type { ExportedIdentity, ExportedOwnedIdentity } from "./export/id";
import type { ExportedPasswdEncryptedData } from "./export/passwd-encrypt";
import { type Message } from './inner/message';

export interface IdentityEntry {
  id?: number; // optional because it's autoIncrement
  label: string;
  identity: ExportedOwnedIdentity;
}

export interface UserDataEntry {
  id?: number;
  inner_data: string
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