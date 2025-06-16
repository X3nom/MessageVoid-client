

export interface UserID{
    enc_key: CryptoKey;
    sign_key: CryptoKey;
}

export interface OwnedUserID{
    priv_id: UserID
    pub_id: UserID;
};


export interface IdEncryptedData{
    aes_iv: string;
    aes_key: string;
    data: string;
}