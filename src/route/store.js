const service = require('../service/data');

module.exports = async function store(ctx) {
    const id = ctx.params.id;
    const key = ctx.request.body.encryption_key;
    const value = ctx.request.body.value;

    if (!key || !value) {
        ctx.throw(422, 'encryption_key and value cannot be null');
    }

    await service.storeData(id, key, value);

    ctx.status = 200;
};