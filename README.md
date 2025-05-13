# MessageVoid
MessageVoid is an end-2-end encrypted mail / messaging platform with focus on anonymity.

There's no centralized user accounts.
Instead, users are identified by their **globally unique** `UserID`.

## How does it work?
`UserID` is an encryption keypair *(priv. key + pub. key)*. User is seen as the owner of private key of their public ID.

### Send process
Suppose situation, where `user1` wants to send message `"hello world"` to `user2`.
- `user1` encypts their message using ID of `user2`, ID being their encryption public key
- `user1` uploads the encrypted message to the "void" - server*(s)* accessible by anyone
- the message get's stored in format such as:
  ```json
  {
    "recipient": "<recipient's public key>",
    "enc_data": "<encrypted message data>"
  }
  ```
  where the encrypted message data has structure like:
  ```json
  {
    "sender": "<sender's public key>",
    "message": "<the actual message>"
  }
  ```
- when `user2` goes to read their messages, they fetch all messages that have their ID as recipient
- `user2` decodes the messages `enc_data` using their private key
