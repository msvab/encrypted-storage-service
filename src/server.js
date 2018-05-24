"use strict";
const Koa = require('koa');
const logger = require('koa-logger');
const koaQS = require('koa-qs');

const routes = require('./route/routes');

const app = new Koa();
koaQS(app, 'first');

app.use(logger());
app.use(routes);

const server = app.listen(3000, () => {
    console.log(`Server listening on port: 3000`);
});

module.exports = server;