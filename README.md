# [**@tsmx/string-crypto**](https://github.com/tsmx/string-crypto)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![npm (scoped)](https://img.shields.io/npm/v/@tsmx/string-crypto)
![node-current (scoped)](https://img.shields.io/node/v/@tsmx/string-crypto)
[![Build Status](https://img.shields.io/github/workflow/status/tsmx/string-crypto/git-ci-build)](https://img.shields.io/github/workflow/status/tsmx/string-crypto/git-ci-build)
[![Coverage Status](https://coveralls.io/repos/github/tsmx/string-crypto/badge.svg?branch=master)](https://coveralls.io/github/tsmx/string-crypto?branch=master)

> Encrypt and decrypt strings.

## Usage

### Key passed via environment variable

```js
const sc = require('@tsmx/string-crypto');

let mySecret = 'My secret string';

let encrypted = sc.encrypt(mySecret);
// '28bedae6f6497f68abe403fb88df340e|2071d6458...'

let decrypted = sc.decrypt(encrypted); 
// 'My secret string'

```

### Key passed directly via options

```js
const sc = require('@tsmx/string-crypto');

let mySecret = 'My secret string';

let encrypted = sc.encrypt(mySecret, { key: '0123456789qwertzuiopasdfghjklyxc' });
// 'ba7bbb57674a198ad6cb7ff65801f9c9|a49cff4c9...'

let decrypted = sc.decrypt(encrypted, { key: '0123456789qwertzuiopasdfghjklyxc' }); 
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

Object containing the supported options for encryption. Please also refer to the [notes](#notes).

```js
options = {
    key: 'YOUR KEY HERE',
    passNull: false
};
```

##### options.key

Type: `String`
Default: `null`

The key used for encryption. If not present, the key is retrieved from the environment variable `ENCRYPTION_KEY`.

##### options.passNull

Type: `Boolean`
Default: `false`

Sometimes it is helpful to let a value of `null` pass the encryption though `null` can't be encrypted either. If set to `true` the decrypt function will return `null` if value is `null`. Defaults to `false`, then an exception is thrown if the passed value is `null`.

```js
sc.encrypt(null); // throwing Error
sc.encrypt(null,  { passNull: true }); // null
```

### decrypt(value, options = null)

Decrypts `value` and returns the decrypted string. The key for decryption is taken from `options.key` or the environment variable `ENCRYPTION_KEY` if no options are present.

#### value

Type: `String`

The string that should be decrypted. Must be in the form that `encrypt` puts out.

#### options

Type: `Object`
Default: `null`

Object containing the supported options for decryption. Please also refer to the [notes](#notes).

```js
options = {
    key: 'YOUR KEY HERE',
    passNull: false
};
```

##### options.key

Type: `String`
Default: `null`

The key used for decryption. If not present, the key is retrieved from the environment variable `ENCRYPTION_KEY`.

##### options.passNull

Type: `Boolean`
Default: `false`

Sometimes it is helpful to let a value of `null` pass the decryption though `null` can't be decrypted either. If set to `true` the decrypt function will return `null` if value is `null`. Defaults to `false`, then an exception is thrown if the passed value is `null`.

```js
sc.decrypt(null); // throwing Error
sc.decrypt(null,  { passNull: true }); // null
```

## Notes

Simple helper package to encrypt and decrypt string based on standard NodeJS Crypto functions.
- Used cipher: AES-256-CBC with initialization vector (`crypto.createCipheriv`)
- IV generation with `crypto.randomBytes`
- Key length must be 32 bytes. The key can be provided as
    - a string of 32 characters length, or
    - a hexadecimal value of 64 characters length (= 32 bytes)
- If no key is directly passed via `options.key` it is retrieved from the environment variable `ENCRYPTION_KEY`.
- Result: string containing the initialization vector and the encrypted value separated by `'|'`