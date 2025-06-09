import Dexie, { type Table } from 'dexie';
import type { IdentityEntry, UserDataEntry } from '../../schema/db';




class IdentitiesDB extends Dexie {
  identities!: Table<IdentityEntry, number>;
  chat_cache!: Table<UserDataEntry, number>;

  constructor() {
    super('identitiesDB');
    this.version(1).stores({
      identities: '++id,id_label,identity',
      user_data: 'id, data'
    });
  }
}

export const db = new IdentitiesDB();
