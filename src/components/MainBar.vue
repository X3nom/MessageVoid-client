<template>
    <div class="w-full h-fit pr-1 pl-1 flex justify-between items-center bg-zinc-950/40 backdrop-blur-sm">

        <div class="p-3 pl-1 pt-1 pb-1 w-[256pt] text-nowrap overflow-clip rounded-lg bg-zinc-800 flex items-center">
            <div class="rounded-lg bg-green-500 w-1 h-1 p-1 m-1"></div>
            <span :title="reactive_state.server">{{reactive_state.server.split('://')[1]}}</span>
        </div>

        
        <Menu as="div">
            <MenuButton>
                <div class="flex items-center w-fit rounded-lg p-1 bg-zinc-800 hover:bg-zinc-700">
                    <div v-html="current_identity.identicon" class="mr-2 bg-zinc-800 rounded-lg border border-zinc-600"></div>
                    <span class="mr-4">{{ current_identity.name }}</span>
                </div>
            </MenuButton>
            <MenuItems as="div"
                class="absolute right-0 mt-2 w-48 origin-top-right rounded-md flex flex-col
                bg-zinc-800 ring-opacity-5 focus:outline-none z-50 backdrop-blur-2xl shadow-2xl shadow-zinc-950">
                <MenuItem v-slot="{ active }" class="rounded-lg p-1">
                    <button :class='{ "bg-amber-800": active }' v-on:click="my_id_dialog_open=true">
                        My userID
                    </button>
                </MenuItem>
                <MenuItem v-slot="{ active }" class="rounded-lg p-1">
                    <button :class='{ "bg-amber-800": active }'>
                        <RouterLink to="/settings">
                            Settings
                        </RouterLink>
                    </button>
                </MenuItem>
                <MenuItem v-slot="{ active }" class="rounded-lg p-1">
                    <button :class='{ "bg-amber-800": active }'
                    v-on:click="logout()">
                        Logout
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    </div>

    <MyIdDialog 
        v-model:is_open="my_id_dialog_open"
    ></MyIdDialog>
</template>

<script setup lang='ts'>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import MyIdDialog from './dialogs/MyIdDialog.vue';
import { current_identity, reactive_state, state } from '../state';
import { ref, type Ref } from 'vue';
import { router } from '../main';

function logout(){
    state.userId = undefined;
    current_identity.name = undefined;
    current_identity.identicon = undefined;
    router.push('/select-id');
}

const my_id_dialog_open = ref(false);

</script>