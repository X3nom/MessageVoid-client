import Dexie, { type Table } from 'dexie';
import type { IdentityEntry, InnerUserDataEntry, UserDataEntry } from '../../schema/db';
import { id_decrypt, id_encrypt } from '../crypto/id';
import type { OwnedUserID } from '../../schema/inner/id';





class IdentitiesDB extends Dexie {
  identities!: Table<IdentityEntry, number>;
  user_data!: Table<UserDataEntry, number>;

  constructor() {
    super('identitiesDB');
    this.version(1).stores({
      identities: '++id,id_label,identity',
      user_data: 'id, data'
    });
  }
}

export const db = new IdentitiesDB();


export async function load_user_data(db_id :number, userid :OwnedUserID){
  const record = await db.user_data.get(db_id);
  if(!record) return undefined;
  if(record.inner_data == "") return null;
  const data :InnerUserDataEntry = JSON.parse(await id_decrypt(record.inner_data, userid.priv_id.enc_key));
  return data;
}

export async function update_user_data(db_id :number, data :InnerUserDataEntry, userid: OwnedUserID) {
  const record = {
    inner_data: await id_encrypt(JSON.stringify(data), userid.pub_id.enc_key)
  };
  await db.user_data.update(db_id, record);
}
