# MessageVoid
MessageVoid is an end-2-end encrypted mail / messaging platform with focus on anonymity, security and decentralization.

There's no centralized user accounts.
Instead, users are identified by their **globally unique** `UserID`.

Every message that get's sent becomes "public knowledge" but is useful only to those, who hold decryption keys (only intended recipient) 
  
---


- private parts of userIDs are stored locally, they should never ever leave the users device
  - possibility to export userID?
- list of known contacts is stored locally
  - in UI, contacts show up looking like chats
  - simple username $\rightarrow$ userID resolution by entering address such as *ex.* `hello~world.com` or `foo~77.245.34.145`
    > resolution is "trust on first connect", only used once for fetching the recipient userID
- newest messages panel $\rightarrow$ email inbox like view with newest fetched messages


## How does it work?
`UserID` is an encryption keypair *(priv. key + pub. key)*. User is seen as the owner of private key of their public ID.

### Send process
Suppose situation, where `user1` wants to send message `"hello world"` to `user2`.
- `user1` encypts their message using ID of `user2`, ID being their encryption public key
- `user1` uploads the encrypted message to the "void" - server*(s)* accessible by anyone
- the message get's stored in format such as:
  ```json
  {
    "recipient": "<recipient UserID>",
    "send_time": "<unix timestamp>",
    "enc_key": "<B64 encrypted key for enc_data decryption>",
    "enc_data": "<B64 encrypted message data>",
  }
  ```
  where the encrypted message data has structure like:
  ```json
  {
    "sender": "<sender UserID>",
    "message": "<B64 encrypted message contents>",
    "signature": "<signature of message>",
  }
  ```
- when `user2` goes to read their messages, they fetch all messages that have their ID as recipient
- `user2` decodes the messages `enc_data` using their private key

### UserID
`UserID` is represented as following object:
```json
{
  "encryption_key": "<base64-RSA-OAEP pubkey>",
  "signature_key": "<base64-RSA-PSS pubkey>"
}
```

### Cryptography details

- `4096` bit RSA key


