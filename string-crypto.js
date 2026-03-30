const crypto = require('crypto');
const algorithmAes = 'aes-256-cbc';
const algorithmGcm = 'aes-256-gcm';
const delimiter = '|';
const defaultKeyEnvVar = 'ENCRYPTION_KEY';

function retrieveAlgorithm(options) {
    if (!options || !options.algorithm) {
        return algorithmGcm;
    }
    if (options.algorithm === algorithmAes || options.algorithm === algorithmGcm) {
        return options.algorithm;
    }
    throw new Error('Unknown algorithm: ' + options.algorithm + '. Must be \'' + algorithmAes + '\' or \'' + algorithmGcm + '\'.');
}

function retrieveKey(options) {
    const hexReg = new RegExp('^[0-9A-F]{64}$', 'i');
    let result;
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
    if (text === null) {
        if (options && options.passNull) {
            return null;
        }
        else {
            throw new Error('Encryption string must not be null. To pass through null values set options.passNull to true.');
        }
    }
    let key = retrieveKey(options);
    let algo = retrieveAlgorithm(options);
    let iv, cipher, encrypted, authTag;
    switch (algo) {
        case algorithmGcm:
            iv = crypto.randomBytes(12);
            cipher = crypto.createCipheriv(algorithmGcm, key, iv);
            encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            authTag = cipher.getAuthTag();
            return iv.toString('hex') + delimiter + encrypted.toString('hex') + delimiter + authTag.toString('hex');
        case algorithmAes:
            iv = crypto.randomBytes(16);
            cipher = crypto.createCipheriv(algorithmAes, key, iv);
            encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return iv.toString('hex') + delimiter + encrypted.toString('hex');
    }
};

module.exports.decrypt = function (text, options = null) {
    if (text === null) {
        if (options && options.passNull) {
            return null;
        }
        else {
            throw new Error('Decryption string must not be null. To pass through null values set options.passNull to true.');
        }
    }
    let key = retrieveKey(options);
    let decrypted;
    try {
        let input = text.split(delimiter);
        if (input.length === 3) {
            let iv = Buffer.from(input[0], 'hex');
            let encryptedText = Buffer.from(input[1], 'hex');
            let authTag = Buffer.from(input[2], 'hex');
            let decipher = crypto.createDecipheriv(algorithmGcm, key, iv);
            decipher.setAuthTag(authTag);
            decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
        }
        else {
            let iv = Buffer.from(input[0], 'hex');
            let encryptedText = Buffer.from(input[1], 'hex');
            let decipher = crypto.createDecipheriv(algorithmAes, key, iv);
            decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
        }
    }
    catch (error) {
        throw new Error('Decryption failed. Please check that the encrypted secret is valid', { cause: error });
    }
    return decrypted.toString();
};