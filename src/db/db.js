const asyncRedis = require("async-redis");
const client = asyncRedis.createClient(6379, 'localhost');

client.on("error", function (err) {
    console.log("Redis error: " + err);
});

async function save(id, data) {
    client.set(id, data);
}

async function findOne(id) {
    return client.get(id);
}

async function findAll(idPrefix) {
    const [cursor, keys] = await client.scan(0, 'MATCH', idPrefix);
    if (keys.length === 0) {
        return [];
    }

    const values = await client.mget(keys);
    return values.map((value, index) => ({id: keys[index], value}));
}

async function deleteAll() {
    client.flushall();
}

module.exports = {
    save,
    findOne,
    findAll,
    deleteAll
};