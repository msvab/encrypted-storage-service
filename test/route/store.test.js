process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server');
const db = require('../../src/db/db');
const service = require('../../src/service/data');

describe('routes : store', () => {
    const ID = 'some-id';
    const KEY = 'veyr-secure-key';
    const VALUE1 = '123';
    const VALUE2 = '456';
    const VALUE_OBJECT = {string: "123", number: 123, bool: true};

    afterEach(async () => {
        await db.deleteAll();
    });

    describe('PUT /data/:id', () => {
        it('should store data', async () => {
            const res = await chai.request(server)
                .put(`/data/${ID}`)
                .send({encryption_key: KEY, value: VALUE1});

            res.status.should.eql(200);

            const updatedValue = await service.getData(ID, KEY);
            updatedValue.should.deep.contain({id: ID, value: VALUE1});
        });

        it('should overwrite data', async () => {
            await service.storeData(ID, KEY, VALUE1);

            const res = await chai.request(server)
                .put(`/data/${ID}`)
                .send({encryption_key: KEY, value: VALUE2});

            res.status.should.eql(200);

            const updatedValue = await service.getData(ID, KEY);
            updatedValue.should.deep.contain({id: ID, value: VALUE2});
        });

        it('should store complex object', async () => {
            const res = await chai.request(server)
                .put(`/data/${ID}`)
                .send({encryption_key: KEY, value: VALUE_OBJECT});

            res.status.should.eql(200);

            const updatedValue = await service.getData(ID, KEY);
            updatedValue.should.deep.contain({id: ID, value: VALUE_OBJECT});
        });

        it('should return 422 on missing attributes', async () => {
            const res = await chai.request(server).put(`/data/${ID}`);

            res.status.should.eql(422);
        });
    });
});