
export interface UserID{
    encryption_key: CryptoKey;
    signature_key: CryptoKey;
}

export interface OwnedUserID{
    encryption_key: CryptoKeyPair;
    signature_key: CryptoKeyPair;
};

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

    /*
    function seal() :PubMessage{
        const msg :PubMessage;

        return msg;
    }
    */

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
  
// Encrypt function
async function encrypt(text :string, password :string) {
    const algo = {
        name: 'AES-GCM',
        length: 256,
        iv: crypto.getRandomValues(new Uint8Array(12))
    }
    return {
        cipherText: await crypto.subtle.encrypt(
            algo,
            await deriveKey(password),
            new TextEncoder().encode(text)
        ),
        iv: algo.iv
    }
}
  
  // Decrypt function
async function decrypt(encrypted :{cipherText: ArrayBuffer; iv: Uint8Array<ArrayBuffer>;}, password :string) {
    const algo = {
        name: 'AES-GCM',
        length: 256,
        iv: encrypted.iv
    }
    return new TextDecoder().decode(
        await crypto.subtle.decrypt(
            algo,
            await deriveKey(password),
            encrypted.cipherText
        )
    )
}




export async function generate_new_identity(passphrase :string) :Promise<OwnedUserID>{
    const enc_id_key = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"},
        },
        true,
        ["encrypt", "decrypt"]
    );

    const sign_id_key = await window.crypto.subtle.generateKey(
        {
            name: "RSA-PSS",
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"},
        },
        true,
        ["sign", "verify"]
    );

    const userId :OwnedUserID = {
        encryption_key: enc_id_key,
        signature_key: sign_id_key,
    };

    // const keys = {
    //     enc: await crypto.subtle.exportKey("raw", userId.encryption_key.privateKey),
    //     sign: await crypto.subtle.exportKey("raw", userId.signature_key.privateKey)
    // }

    const stringID = JSON.stringify(
        encrypt(
            JSON.stringify(userId),
            passphrase
        )
    )



    return userId;
}


function import_identity(str_id :string){
    
    



}
