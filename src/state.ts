import { ref, type Ref } from 'vue'
import { type OwnedUserID } from './logic/crypto';

export namespace SelectedIdentity{
  export const current_user_id :Ref<OwnedUserID | undefined> = ref(undefined);
  export const curent_user_name :Ref<string | undefined> = ref(undefined);
  export const current_user_identicon :Ref<string | undefined> = ref(undefined);
}

export const currentMenu = ref<'home' | 'generate-id' | 'select-id' | null>('select-id')

export function setMenu(menu: typeof currentMenu.value) {
  currentMenu.value = menu
  // if no user selected, force the select-id dialog
  if(menu == 'home' && SelectedIdentity.current_user_id.value == undefined){
    currentMenu.value = 'select-id';
  }
}
