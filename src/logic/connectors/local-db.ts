import Dexie, { type Table } from 'dexie';
import { type ExportedIdentity, type ExportedOwnedIdentity } from '../../schema/export/id';


export interface IdentityEntry {
  id?: number; // optional because it's autoIncrement
  label: string;
  identity: ExportedOwnedIdentity;
}


export interface ChatCacheEntry {
  id?: number;
  chats: {
    user: ExportedIdentity,
    
  }[]
}


class IdentitiesDB extends Dexie {
  identities!: Table<IdentityEntry, number>;
  chat_cache!: Table<ChatCacheEntry, number>;

  constructor() {
    super('identitiesDB');
    this.version(1).stores({
      identities: '++id,id_label,identity',
      chat_cache: 'id'
    });
  }
}

export const db = new IdentitiesDB();
