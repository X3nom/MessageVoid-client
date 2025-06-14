import { reactive, type Reactive } from 'vue'
import { type OwnedUserID } from './schema/inner/id';
import type { InnerUserDataEntry, UserDataEntry } from './schema/db';



// Global state representing currently used user info
export const current_identity :Reactive<{
  db_id: number|undefined
  name: string|undefined;
  userId: OwnedUserID|undefined;
  identicon:string|undefined;
  user_data:InnerUserDataEntry|undefined
}> = reactive({
  db_id: undefined,
  name: undefined,
  userId: undefined,
  identicon: undefined,
  user_data: undefined
});

export const current_server = reactive({
  server: "http://kuba-kubikula.slavetraders.tech" // TODO: make non hard coded
});
