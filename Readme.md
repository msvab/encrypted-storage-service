# Encrypted storage service

Simple REST service for encrypted data storage.

### API
* #### PUT /data/:id
  ##### Request JSON  
  `encryption_key` Key that will be used to encrypt the data  
  `value=[*]` Can be anything  
  ###### Example
  `{"encryption_key":"...", "value":"..."}`
* #### GET /data/search?id=&encryption_key=
   ##### Query Params (required)  
   `id=[string]` ID can be either an exact value or it can end with an `*` to perform wildcard search.  
   `encryption_key=[string]` Encryption key that was used to store these values
 * ##### Response  
   `[{"id":"...", "value":"..."}]`

### Commands
* `npm run start` To start the service
* `npm run test` To run tests

### Minimum requirements
* Node.js v10
* Redis v2.8.0