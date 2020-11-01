const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const delimiter = '|';
const defaultKeyEnvVar = 'ENCRYPTION_KEY';

function retrieveKey(options) {
    const hexReg = new RegExp('^[0-9A-F]{64}$', 'i');
    let result = null;
    let keyCandidate = (options && options.key) ? options.key : process.env[defaultKeyEnvVar];
    if (!keyCandidate) {
        throw new Error('Key not found. Set it by passing options.key or setting environment variable ' + defaultKeyEnvVar);
    }
    else if (keyCandidate.toString().length == 32) {
        result = Buffer.from(keyCandidate);
    }
    else if (hexReg.test(keyCandidate)) {
        result = Buffer.from(keyCandidate, 'hex');
    }
    else {
        throw new Error('Key length length must be 32 bytes.');
    }
    return result;
}

module.exports.encrypt = function (text, options = null) {
    if(text === null) {
        if(options && options.passNull) {
            return null;
        }
        else {
            throw new Error('Encryption string must not be null. To pass through null values set options.passNull to true.');
        }
    }
    let key = retrieveKey(options);
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + delimiter + encrypted.toString('hex');
};

module.exports.decrypt = function (text, options = null) {
    if(text === null) {
        if(options && options.passNull) {
            return null;
        }
        else {
            throw new Error('Decryption string must not be null. To pass through null values set options.passNull to true.');
        }
    }
    let key = retrieveKey(options);
    let decrypted = null;
    try {
        let input = text.split(delimiter);
        let iv = Buffer.from(input[0], 'hex');
        let encryptedText = Buffer.from(input[1], 'hex');
        let decipher = crypto.createDecipheriv(algorithm, key, iv);
        decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
    }
    catch (error) {
        throw new Error('Decryption failed. Please check that the encrypted secret is valid');
    }
    return decrypted.toString();
};