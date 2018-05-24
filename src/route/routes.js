const router = require('koa-router')();
const koaBody = require('koa-body');

const store = require('./store');
const search = require('./search');

router
    .put('/data/:id', koaBody(), store)
    .get('/data/search', search);

module.exports = router.routes();