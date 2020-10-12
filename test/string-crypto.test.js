const { expect } = require('@jest/globals');

describe('secure-config test suite', () => {

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

    it('tests a successful encryption and decryption with char key from environment var', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted);
        expect(decrypted).toStrictEqual(testString);
        done();
    });

    it('tests a successful encryption and decryption with hex key from environment var', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyHex;
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted);
        expect(decrypted).toStrictEqual(testString);
        done();
    });

    it('tests a successful encryption and decryption with char key from options', async (done) => {
        const options = {
            key: testKeyChar
        }
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, options);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted, options);
        expect(decrypted).toStrictEqual(testString);
        done();
    });

    it('tests a successful encryption and decryption with hex key from options', async (done) => {
        const options = {
            key: testKeyHex
        }
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, options);
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        const decrypted = sc.decrypt(encrypted, options);
        expect(decrypted).toStrictEqual(testString);
        done();
    });

    it('tests a failed encryption because of missing key', async (done) => {
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(testString); }).toThrow('Key not found.');
        done();
    });

    it('tests a failed encryption because of wrong key length from environment var', async (done) => {
        const sc = require('../string-crypto');
        process.env['ENCRYPTION_KEY'] = testKeyCharWrongLength;
        expect(() => { sc.encrypt(testString); }).toThrow('Key length');
        done();
    });

    it('tests a failed encryption because of wrong key length from options', async (done) => {
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(testString, { key: testKeyCharWrongLength }); }).toThrow('Key length');
        done();
    });

    it('tests a failed decryption because of a wrong key', async (done) => {
        const sc = require('../string-crypto');
        const encrypted = sc.encrypt(testString, { key: testKeyChar });
        const encryptedParts = encrypted.split('|');
        expect(encryptedParts.length).toBe(2);
        expect(hexReg.test(encryptedParts[0])).toBeTruthy();
        expect(hexReg.test(encryptedParts[1])).toBeTruthy();
        expect(() => { sc.decrypt(encrypted, { key: testKeyCharBad }); }).toThrow('Decryption failed.');
        done();
    });

    it('tests a failed encryption of null', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(null); }).toThrow('must not be null');
        done();
    });

    it('tests a failed encryption of null with options.passNull set to false', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.encrypt(null, { passNull: false }); }).toThrow('must not be null');
        done();
    });

    it('tests a successful encryption passthrough of null with options.passNull set to true', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(sc.encrypt(null, { passNull: true })).toStrictEqual(null);
        done();
    });

    it('tests a failed decryption of null', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.decrypt(null); }).toThrow('must not be null');
        done();
    });

    it('tests a failed decryption of null with options.passNull set to false', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(() => { sc.decrypt(null, { passNull: false }); }).toThrow('must not be null');
        done();
    });

    it('tests a successful decryption passthrough of null with options.passNull set to true', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        expect(sc.decrypt(null, { passNull: true })).toStrictEqual(null);
        done();
    });

    it('tests a successful encryption and decryption passthrough of null', async (done) => {
        process.env['ENCRYPTION_KEY'] = testKeyChar;
        const sc = require('../string-crypto');
        const test = null;
        const encrypted = sc.encrypt(test, { passNull: true });
        const decrypted = sc.decrypt(encrypted, { passNull: true });
        expect(encrypted).toStrictEqual(null);
        expect(decrypted).toStrictEqual(null);
        done();
    });

});