# [**string-crypto**](https://github.com/tsmx/string-crypto)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![npm (scoped)](https://img.shields.io/npm/v/@tsmx/string-crypto)
![node-current (scoped)](https://img.shields.io/node/v/@tsmx/string-crypto)
[![Build Status](https://travis-ci.com/tsmx/string-crypto.svg?branch=master)](https://travis-ci.org/tsmx/string-crypto)
[![Coverage Status](https://coveralls.io/repos/github/tsmx/string-crypto/badge.svg?branch=master)](https://coveralls.io/github/tsmx/string-crypto?branch=master)

> Encrypt and decrypt strings.

## Usage

### Key passed via environment variable

```js
const sc = require('../string-crypto');

let mySecret = 'My secret string';

let encrypted = sc.encrypt(mySecret);
// '28bedae6f6497f68abe403fb88df340e|2071d6458475b8a9313062b434b8feebf67d97d067b510b64133b511ccec313c'

let decrypted = sc.decrypt(encrypted); 
// 'My secret string'

```

### Key passed directly via options

```js
const sc = require('../string-crypto');

let mySecret = 'My secret string';

var encrypted = sc.encrypt(mySecret, { key: '0123456789qwertzuiopasdfghjklyxc' });
// 'ba7bbb57674a198ad6cb7ff65801f9c9|a49cff4c966387f00b0f327fc864fa233b551c62f570f80c63d405c6e3161b3d'

var decrypted = sc.decrypt(encrypted, { key: '0123456789qwertzuiopasdfghjklyxc' }); 
// 'My secret string'
```

## API

### encrypt(value, options = null)

Encrypts `value` and returns the encrypted string. The key for encryption is taken from `options.key` or the environment variable `ENCRYPTION_KEY` if no options are present.

#### value

Type: `String`

The string that should be encrypted.

#### options

Type: `Object`
Default: `null`

Object containing the supported options for encryption.

```js
options = {
    key: 'YOUR KEY HERE'
};
```

### decrypt(value, options = null)

Decrypts `value` and returns the decrypted string. The key for decryption is taken from `options.key` or the environment variable `ENCRYPTION_KEY` if no options are present.

#### value

Type: `String`

The string that should be decrypted. Must be in the form that `encrypt` puts out.

#### options

Type: `Object`
Default: `null`

Object containing the supported options for decryption.

```js
options = {
    key: 'YOUR KEY HERE'
};
```

## Notes

Simple helper package to encrypt and decrypt string based on standard NodeJS Crypto functions.
- Used cipher: AES-256-CBC with initialization vector (`crypto.createCipheriv`)
- IV generation with `crypto.randomBytes`
- Key length must be 32 bytes. The key can be provided as
    - a string of 32 characters length, or
    - a hexadecimal value of 64 characters length (= 32 bytes)
- If no key is directly passed via `options.key` it is retrieved from the environment variable `ENCRYPTION_KEY`.
- Result: string containing the intialization vector and the encrypted value separated by `'|'`