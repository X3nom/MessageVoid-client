import { reactive, type Reactive } from 'vue'
import { type OwnedUserID } from './schema/inner/id';
import type { InnerUserDataEntry } from './schema/db';



// Global state representing currently used user info
export const current_identity :Reactive<{
  db_id: number|undefined
  name: string|undefined;
  identicon:string|undefined;
  user_data:InnerUserDataEntry|undefined
}> = reactive({
  db_id: undefined,
  name: undefined,
  identicon: undefined,
  user_data: undefined
});  
export const state :{userId :OwnedUserID|undefined, sse_running :boolean}= {
  // this bitch is not reactive because apparently crypto.subtle is picky about keys
  userId: undefined,
  sse_running: false
}

export const reactive_state = reactive({
  server: "https://kuba-kubikula.slavetraders.tech" // TODO: make non hard coded
});
