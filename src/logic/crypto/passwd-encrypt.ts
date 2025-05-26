import type { ExportedPasswdEncryptedData } from "../../schema/export/passwd-encrypt";


function buffer2Base64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function bufferFromBase64(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
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
export async function passwd_encrypt(text :string, password :string) {
    const algo = {
        name: 'AES-GCM',
        length: 256,
        iv: crypto.getRandomValues(new Uint8Array(12))
    };
    console.log(algo.iv) //TODO:RM
    return {
        cipherText: buffer2Base64(await crypto.subtle.encrypt(
            algo,
            await deriveKey(password),
            new TextEncoder().encode(text)
        )),
        iv: buffer2Base64(algo.iv)
    } as ExportedPasswdEncryptedData;
}
  
// symetric decrypt function
export async function passwd_decrypt(encrypted :ExportedPasswdEncryptedData, password :string) {
    const algo = {
        name: 'AES-GCM',
        /* length: 256, */
        iv: bufferFromBase64(encrypted.iv as string)
    }
    const decrypted = await crypto.subtle.decrypt(
        algo,
        await deriveKey(password),
        bufferFromBase64(encrypted.cipherText as string)
    )
    
    return new TextDecoder().decode(
        decrypted   
    )
}


