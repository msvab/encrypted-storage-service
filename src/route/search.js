const service = require('../service/data');

module.exports = async function search(ctx) {
    const id = ctx.query.id;
    const key = ctx.query.encryption_key;

    if (!id || !key) {
        ctx.throw(400, "Query params 'encryption_key' and 'id' cannot be null");
    }

    ctx.body = id == null ? [] : await service.getData(id, key);
};