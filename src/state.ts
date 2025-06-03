import { reactive, type Reactive } from 'vue'
import { type OwnedUserID } from './schema/inner/id';



// Global state representing currently used user info
export const current_identity :Reactive<{name: string|undefined; id: OwnedUserID|undefined; identicon:string|undefined}> = reactive({
  name: undefined,
  id: undefined,
  identicon: undefined,
});

export const current_server = reactive({
  server: "http://kuba-kubikula.slavetraders.tech" // TODO: make non hard coded
});
