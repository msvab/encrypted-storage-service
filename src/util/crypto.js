'use strict';
const crypto = require('crypto');

const IV_LENGTH = 16;

function hashKey(key) {
    return crypto.createHash('sha256').update(key).digest();
}

function encrypt(text, key) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', hashKey(key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, key) {
    const [iv, encryptedText] = text.split(':');

    const decipher = crypto.createDecipheriv('aes-256-cbc', hashKey(key), Buffer.from(iv, 'hex'));
    const decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));

    return Buffer.concat([decrypted, decipher.final()]).toString();
}

module.exports = { decrypt, encrypt };