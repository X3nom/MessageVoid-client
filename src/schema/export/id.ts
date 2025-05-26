import { type ExportedPasswdEncryptedData } from "./passwd-encrypt";


export interface ExportedOwnedIdentity{
    priv_keys: {
        enc: JsonWebKey;
        sign: JsonWebKey;
    } | ExportedPasswdEncryptedData;
    pub_keys: {
        enc: JsonWebKey;
        sign: JsonWebKey;
    };
}
export interface ExportedIdentity{
    pub_keys: {
        enc: JsonWebKey;
        sign: JsonWebKey;
    };
}