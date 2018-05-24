process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const crypto = require('../../src/util/crypto');


describe('util : crypto', () => {
    it('should encrypt and decrypt text with same key', () => {
        const text = 'ferwvewwecwcewcwcwe';
        const key = '1234';

        const encryptedText = crypto.encrypt(text, key);

        encryptedText.should.not.eql(text);

        const decryptedText = crypto.decrypt(encryptedText, key);

        decryptedText.should.eql(text);
    });

    it('should not decrypt with different key', () => {
        const text = 'ferwvewwecwcewcwcwe';
        const key1 = '1234';
        const key2 = '9999';

        const encryptedText = crypto.encrypt(text, key1);

        chai.expect(() => crypto.decrypt(encryptedText, key2)).to.throw('bad decrypt');
    });

    it('should encrypt the same key twice and produce different results', () => {
        const text = 'ferwvewwecwcewcwcwe';
        const key = '1234';

        const encryptedText1 = crypto.encrypt(text, key);
        const encryptedText2 = crypto.encrypt(text, key);

        encryptedText1.should.not.eql(encryptedText2);
    });
});