import { type ExportedIdentity, type ExportedOwnedIdentity } from "../../schema/export/id";
import { type OwnedUserID, type UserID } from '../../schema/inner/id';
import { passwd_encrypt, passwd_decrypt } from "./passwd-encrypt";
import { type ExportedPasswdEncryptedData } from '../../schema/export/passwd-encrypt';
import { buffer2Base64, bufferFromBase64 } from '../utilities/buffer2Base64';


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


export async function import_identity(exported_id :ExportedIdentity) {
    const imported_id :UserID = {
        // public encryption key
        enc_key: await crypto.subtle.importKey(
            'jwk', 
            (exported_id.enc as {enc: JsonWebKey, sign: JsonWebKey}).enc,
            ENC_KEY_ALGORITHM, true, ['encrypt']
        ),
        // public signature key
        sign_key: await crypto.subtle.importKey(
            'jwk', 
            (exported_id.sign as {enc: JsonWebKey, sign: JsonWebKey}).sign,
            SIGN_KEY_ALGORITM, true, ['verify']
        )
    }
    return imported_id;
}


export async function import_owned_identity(exported_id :ExportedOwnedIdentity, passphrase: string) :Promise<OwnedUserID>{
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



export async function id_encrypt(content: string, rsaPublicKey: CryptoKey): Promise<string> {
    // 1. Generate AES key
    const aesKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    // 2. Encrypt content with AES
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit nonce
    const data = new TextEncoder().encode(content);
    const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        data
    );

    // 3. Export AES key & encrypt with RSA
    const rawAESKey = await crypto.subtle.exportKey("raw", aesKey);
    const encryptedAESKey = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        rsaPublicKey,
        rawAESKey
    );

    // 4. Return all as JSON base64-encoded
    return JSON.stringify({
        aes_iv: buffer2Base64(iv),
        aes_key: buffer2Base64(encryptedAESKey),
        data: buffer2Base64(encryptedContent)
    });
}

export async function id_decrypt(encrypted_json: string, rsaPrivateKey: CryptoKey): Promise<string> {
    const payload = JSON.parse(encrypted_json);
    const iv = bufferFromBase64(payload.aes_iv);
    const encryptedAESKey = bufferFromBase64(payload.aes_key);
    const encryptedData = bufferFromBase64(payload.data);

    // 1. Decrypt AES key
    const rawAESKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        rsaPrivateKey,
        encryptedAESKey
    );

    const aesKey = await crypto.subtle.importKey(
        "raw",
        rawAESKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );

    // 2. Decrypt content
    const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aesKey,
        encryptedData
    );

    return new TextDecoder().decode(decryptedData);
}
