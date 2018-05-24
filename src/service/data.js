const crypto = require('../util/crypto');
const db = require('../db/db');

function decryptItem({id, value}, key) {
    try {
        return {id, value: JSON.parse(crypto.decrypt(value, key))};
    } catch {
        console.warn(`Attempt to retrieve data with wrong encryption key! id=${id}, key=${key}`);
        return null;
    }
}

async function getData(id, key) {
    let data = [];

    if (id.includes('*')) {
        data = await db.findAll(id);
    } else if (id) {
        const item = await db.findOne(id);
        if (item) {
            data = [{id: id, value: item}];
        }
    }

    return data.map(item => decryptItem(item, key)).filter(item => item != null);
}

async function storeData(id, key, value) {
    const encryptedData = crypto.encrypt(JSON.stringify(value), key);
    db.save(id, encryptedData);
}

module.exports = { getData, storeData };