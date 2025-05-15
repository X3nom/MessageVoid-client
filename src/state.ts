import { ref } from 'vue'
import { type OwnedUserID } from './logic/crypto';

export namespace SelectedIdentity{
  export let current_user_id :OwnedUserID | null = null;

}

export const currentMenu = ref<'home' | 'generate-id' | 'select-id' | null>('select-id')

export function setMenu(menu: typeof currentMenu.value) {
  currentMenu.value = menu
  // if no user selected, force the select-id dialog
  if(menu == 'home' && SelectedIdentity.current_user_id == null){
    currentMenu.value = 'select-id';
  }
}
