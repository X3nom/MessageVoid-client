import type { ExportedIdentity, ExportedOwnedIdentity } from "./export/id";

export interface IdentityEntry {
  id?: number; // optional because it's autoIncrement
  label: string;
  identity: ExportedOwnedIdentity;
}


export interface UserDataEntry {
  id?: number;
  chats: {
    user: ExportedIdentity,
    label: string;
    
  }[],
  settings: {}
}