import { type ExportedIdentity, type ExportedOwnedIdentity } from "../../schema/export/id";
import { type OwnedUserID, type UserID } from '../../schema/inner/id';
import { passwd_encrypt, passwd_decrypt } from "./passwd-encrypt";
import { type ExportedPasswdEncryptedData } from '../../schema/export/passwd-encrypt';


export class BadDecryptionError extends Error{
    get message(){
        return "Decrypted data is gibberish"
    }
}




// CRYPTO ALGORITHMS ====================================
const ENC_KEY_ALGORITHM = {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: {name: "SHA-256"},
}

const SIGN_KEY_ALGORITM = {
    name: "RSA-PSS",
    modulusLength: 4096,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: {name: "SHA-256"},
}
// =======================================

export async function generate_new_identity(passphrase :string) :Promise<ExportedOwnedIdentity>{
    const enc_id_key = await window.crypto.subtle.generateKey(
        ENC_KEY_ALGORITHM,
        true,
        ["encrypt", "decrypt"]
    );

    const sign_id_key = await window.crypto.subtle.generateKey(
        SIGN_KEY_ALGORITM,
        true,
        ["sign", "verify"]
    );

    // encrypt_identity
    const exported_id :ExportedOwnedIdentity = {
        priv_keys: await passwd_encrypt(
                JSON.stringify({
                    enc: await crypto.subtle.exportKey('jwk' ,enc_id_key.privateKey),
                    sign: await crypto.subtle.exportKey('jwk' ,sign_id_key.privateKey)
                }),
                passphrase
            ),
        pub_keys: {
            enc: await crypto.subtle.exportKey('jwk' ,enc_id_key.publicKey),
            sign: await crypto.subtle.exportKey('jwk' ,sign_id_key.publicKey)
        },
    }

    return exported_id;
}


async function decrypt_identity(encrypted_id :ExportedOwnedIdentity, passphrase :string) :Promise<ExportedOwnedIdentity>{    
    // hopefully it deciphers?
    try{
        const decrypted_json = await passwd_decrypt(encrypted_id.priv_keys as ExportedPasswdEncryptedData, passphrase);
        const decrypted_id :ExportedOwnedIdentity = {
            priv_keys: JSON.parse(decrypted_json) as {enc: JsonWebKey, sign: JsonWebKey},
            pub_keys: {
                enc: encrypted_id.pub_keys.enc,
                sign: encrypted_id.pub_keys.sign
            }
        }
        return decrypted_id;
    }
    catch{
        throw BadDecryptionError;
    }
}


export async function import_identity(exported_id :ExportedOwnedIdentity, passphrase: string) :Promise<OwnedUserID>{
    const decrypted_id = await decrypt_identity(exported_id, passphrase);
    const imported_id :OwnedUserID = {
        pub_id: {
            // public encryption key
            enc_key: await crypto.subtle.importKey(
                'jwk', 
                (decrypted_id.pub_keys as {enc: JsonWebKey, sign: JsonWebKey}).enc,
                ENC_KEY_ALGORITHM, true, ['encrypt']
            ),
            // public signature key
            sign_key: await crypto.subtle.importKey(
                'jwk', 
                (decrypted_id.pub_keys as {enc: JsonWebKey, sign: JsonWebKey}).sign,
                SIGN_KEY_ALGORITM, true, ['verify']
            )
        },
        priv_id: {
            // private encryption key
            enc_key: await crypto.subtle.importKey(
                'jwk', 
                (decrypted_id.priv_keys as {enc: JsonWebKey, sign: JsonWebKey}).enc,
                ENC_KEY_ALGORITHM, false, ['decrypt']
            ),
            // private signature key
            sign_key: await crypto.subtle.importKey(
                'jwk', 
                (decrypted_id.priv_keys as {enc: JsonWebKey, sign: JsonWebKey}).sign,
                SIGN_KEY_ALGORITM, false, ['sign']
            )
        }
    };
    return imported_id;
}

export async function export_identity_pub(identity :UserID) :Promise<ExportedIdentity>{
    return {
        enc: await crypto.subtle.exportKey('jwk', identity.enc_key),
        sign: await crypto.subtle.exportKey('jwk', identity.sign_key)
    }
}