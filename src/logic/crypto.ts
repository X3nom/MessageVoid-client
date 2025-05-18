
export interface UserID{
    enc_key: CryptoKey;
    sign_key: CryptoKey;
}

export interface OwnedUserID{
    priv_id: UserID
    pub_id: UserID;
};

export interface ExportedIdentity{
    priv_keys: {
        enc: JsonWebKey;
        sign: JsonWebKey;
    } | PasswdEncryptedData;
    pub_keys: {
        enc: JsonWebKey;
        sign: JsonWebKey;
    };
}

export interface PubMessage{
    recipient: UserID;
    send_time: number;
    enc_key: string;
    return_enc_key: string; 
    enc_data: string | PrivMessage;
};

// encrypted part of public message
export interface PrivMessage{
    sender: UserID;
    message: string;
    signature: string;
};


interface PasswdEncryptedData{
    cipherText: ArrayBuffer;
    iv: Uint8Array<ArrayBuffer>
}

export interface ExportedKeypair{
    private_key_jwk: string;
    public_key_jwk: string
}




export class VoidMessage{
    recipient: UserID;
    sender: UserID;
    content: string;

    constructor(content :string, recipient :UserID, sender :UserID){
        this.content = content;
        this.sender = sender;
        this.recipient = recipient;
    }

    public static from_json(json_msg :string){
        const pub_msg :PubMessage = JSON.parse(json_msg)
        


    }

}

// TODO:RM
function logBuffer(buf: ArrayBuffer | Uint8Array) {
    const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    console.log([...u8].map(b => b.toString(16).padStart(2, "0")).join(" "));
}
  




async function deriveKey(password :string) {
    const algo = {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: new TextEncoder().encode('a-unique-salt'),
      iterations: 1000
    }
    return crypto.subtle.deriveKey(
      algo,
      await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        {
          name: algo.name
        },
        false,
        ['deriveKey']
      ),
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    )
  }
  
// symetric encrypt function
async function passwd_encrypt(text :string, password :string) {
    const algo = {
        name: 'AES-GCM',
        length: 256,
        iv: crypto.getRandomValues(new Uint8Array(12))
    };
    console.log(algo.iv) //TODO:RM
    return {
        cipherText: await crypto.subtle.encrypt(
            algo,
            await deriveKey(password),
            new TextEncoder().encode(text)
        ),
        iv: algo.iv
    } as PasswdEncryptedData;
}
  
// symetric decrypt function
async function passwd_decrypt(encrypted :PasswdEncryptedData, password :string) {
    console.log("decrypt", encrypted, password); // TODO:RM
    // if (!(encrypted.iv instanceof Uint8Array)) {
    //     encrypted.iv = new Uint8Array(Object.values(encrypted.iv));
    // }
    const algo = {
        name: 'AES-GCM',
        /* length: 256, */
        iv: encrypted.iv
    }
    const decrypted = await crypto.subtle.decrypt(
        algo,
        await deriveKey(password),
        encrypted.cipherText
    )
    console.log("decrypted:", decrypted); // TODO:RM
    return new TextDecoder().decode(
        decrypted   
    )
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

export async function generate_new_identity(passphrase :string) :Promise<ExportedIdentity>{
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
    const exported_id :ExportedIdentity = {
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


async function decrypt_identity(encrypted_id :ExportedIdentity, passphrase :string) :Promise<ExportedIdentity>{    
    // hopefully it deciphers?
    const decrypted_json = await passwd_decrypt(encrypted_id.priv_keys as PasswdEncryptedData, passphrase);
    console.log(decrypted_json); // TODO:RM
    const decrypted_id :ExportedIdentity = {
        priv_keys: JSON.parse(decrypted_json) as {enc: JsonWebKey, sign: JsonWebKey},
        pub_keys: {
            enc: encrypted_id.pub_keys.enc,
            sign: encrypted_id.pub_keys.sign
        }
    }

    return decrypted_id;
}


export async function import_identity(exported_id :ExportedIdentity, passphrase: string) :Promise<OwnedUserID>{
    const decrypted_id = await decrypt_identity(exported_id, passphrase);
    console.log("decrypted meow") // TODO:RM
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