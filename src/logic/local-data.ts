import { type ExportedIdentity } from './crypto.ts'

export namespace IdentitiesDB{
    export interface Entry{
        label :string;
        identity :ExportedIdentity
    }

    // Step 1: Open or create the DB
    function openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("identitiesDB", 1);
    
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const store = db.createObjectStore("identities", { keyPath: "id" , autoIncrement: true}); // id = PK
    
                store.createIndex("id_label", "id_label", { unique: false });
                store.createIndex("identity", "identity", { unique: false });
            };
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    
    export async function addItem(label :string, identity :ExportedIdentity) {
        const db = await openDB();
        const tx = db.transaction("identities", "readwrite");
        const store = tx.objectStore("identities");
    
        const item :Entry = { label, identity: identity };
        store.put(item); // insert or update
    
        return tx.oncomplete;
    }
    
    export async function getItem(id :number) :Promise<Entry>{
        const db = await openDB();
        const tx = db.transaction("identities", "readonly");
        const store = tx.objectStore("identities");
    
        const request = await store.get(id);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    export async function listAllItems() :Promise<Entry[]> {
        const db = await openDB();
        const tx = db.transaction("identities", "readonly");
        const store = tx.objectStore("identities");
    
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
