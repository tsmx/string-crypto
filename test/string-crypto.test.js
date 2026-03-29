const { expect } = require('@jest/globals');

describe('string-crypto test suite', () => {

    const testString = 'Test123$ üöä';
    const hexReg = new RegExp('^[0-9A-F]*$', 'i');
    const testKeyChar = '0123456789qwertzuiopasdfghjklyxc';
    const testKeyCharBad = '00000000000000000000000000000000';
    const testKeyCharWrongLength = '0123456789qwertzuiopasdfghjklyxc000';
    const testKeyHex = '9af7d400be4705147dc724db25bfd2513aa11d6013d7bf7bdb2bfe050593bd0f';

    beforeEach(() => {
        jest.resetModules();
        delete process.env['ENCRYPTION_KEY'];
    });

    it('tests a successful CBC encryption and decryption with char key from environment var', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted);
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a successful CBC encryption and decryption with hex key from environment var', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyHex;
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted);
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a successful CBC encryption and decryption with explicit algorithm specification', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyHex;
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, { algorithm: 'aes-256-cbc' });
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted);
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a successful CBC encryption and decryption with char key from options', async () => {
        const options = {
            key: testKeyChar
        };
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, options);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted, options);
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a successful CBC encryption and decryption with hex key from options', async () => {
        const options = {
            key: testKeyHex
        };
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, options);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted, options);
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a failed CBC encryption because of missing key', async () => {
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(testString); }).toThrow('Key not found.');
    });

    it('tests a failed CBC encryption because of wrong key length from environment var', async () => {
        const sc = require('../string-crypto');
        process.env['ENCRYPTION_KEY'] = testKeyCharWrongLength;
        expect(() => { sc.encrypt(testString); }).toThrow('Key length');
    });

    it('tests a failed CBC encryption because of wrong key length from options', async () => {
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(testString, { key: testKeyCharWrongLength }); }).toThrow('Key length');
    });

    it('tests a failed CBC decryption because of a wrong key', async () => {
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, { key: testKeyChar });
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        expect(() => { sc.decrypt(encrypted, { key: testKeyCharBad }); }).toThrow('Decryption failed.');
    });

    it('tests a failed CBC encryption of null', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(null); }).toThrow('must not be null');
    });

    it('tests a failed eCBC ncryption of null with options.passNull set to false', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(null, { passNull: false }); }).toThrow('must not be null');
    });

    it('tests a successful CBC encryption passthrough of null with options.passNull set to true', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(sc.encrypt(null, { passNull: true })).toStrictEqual(null);
    });

    it('tests a failed CBC decryption of null', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.decrypt(null); }).toThrow('must not be null');
    });

    it('tests a failed CBC decryption of null with options.passNull set to false', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.decrypt(null, { passNull: false }); }).toThrow('must not be null');
    });

    it('tests a successful CBC decryption passthrough of null with options.passNull set to true', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(sc.decrypt(null, { passNull: true })).toStrictEqual(null);
    });

    it('tests a successful CBC encryption and decryption passthrough of null', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        const test = null;
        const encrypted = sc.encrypt(test, { passNull: true });
        const decrypted = sc.decrypt(encrypted, { passNull: true });
        expect(encrypted).toStrictEqual(null);
        expect(decrypted).toStrictEqual(null);
    });

    it('tests a successful GCM encryption and decryption with char key from environment var', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, { algorithm: 'aes-256-gcm' });
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(3);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        expect(hexReg.test(encryptedParts[2])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted);
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a successful GCM encryption and decryption with hex key from environment var', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyHex;
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, { algorithm: 'aes-256-gcm' });
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(3);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        expect(hexReg.test(encryptedParts[2])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted);
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a successful GCM encryption and decryption with char key from options', async () => {
        const options = { key: testKeyChar, algorithm: 'aes-256-gcm' };
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, options);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(3);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        expect(hexReg.test(encryptedParts[2])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted, { key: testKeyChar });
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests a successful GCM encryption and decryption with hex key from options', async () => {
        const options = { key: testKeyHex, algorithm: 'aes-256-gcm' };
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, options);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(3);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        expect(hexReg.test(encryptedParts[2])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted, { key: testKeyHex });
        expect(decrypted).toStrictEqual(testString);
    });

    it('tests that GCM auth tag tampering causes decryption failure', async () => {
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, { key: testKeyChar, algorithm: 'aes-256-gcm' });
        const parts = encrypted.split('|');
        const tampered = parts[0] + '|' + parts[1] + '|' + 'ff'.repeat(16);
        expect(() => { sc.decrypt(tampered, { key: testKeyChar }); }).toThrow('Decryption failed.');
    });

    it('tests a failed GCM encryption because of unknown algorithm', async () => {
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(testString, { key: testKeyChar, algorithm: 'aes-256-ecb' }); }).toThrow('Unknown algorithm');
    });

    it('tests a successful GCM encryption passthrough of null with options.passNull set to true', async () => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(sc.encrypt(null, { passNull: true, algorithm: 'aes-256-gcm' })).toStrictEqual(null);
    });

});