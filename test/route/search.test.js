process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server');
const service = require('../../src/service/data');
const db = require('../../src/db/db');

describe('routes : search', () => {
    const ID1 = 'id-1';
    const ID2 = 'id-2';
    const ID3 = 'id-3';
    const KEY = 'very-secure-key';
    const VALUE1 = '123';
    const VALUE2 = '456';
    const VALUE_OBJECT = {string: "123", number: 123, bool: true};

    beforeEach(async () => {
        await service.storeData(ID1, KEY, VALUE1);
        await service.storeData(ID2, KEY, VALUE2);
        await service.storeData(ID3, KEY, VALUE_OBJECT);
    });

    afterEach(async () => {
        await db.deleteAll();
    });

    describe('GET /data/search', () => {
        it('should return empty array for unknown ID', async () => {
            const res = await chai.request(server).get(`/data/search?id=unknown&encryption_key=${KEY}`);

            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.should.eql([]);
        });

        it('should return empty array for wrong encryption key', async () => {
            const res = await chai.request(server).get(`/data/search?id=${ID1}&encryption_key=wrong-key`);

            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.should.eql([]);
        });

        it('should return empty array when no ID matches the query', async () => {
            const res = await chai.request(server).get(`/data/search?id=hello*&encryption_key=${KEY}`);

            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.should.eql([]);
        });

        it('should return stored data', async () => {
            const res = await chai.request(server).get(`/data/search?id=${ID1}&encryption_key=${KEY}`);

            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.should.deep.contain({id: ID1, value: VALUE1});
        });

        it('should return stored data with complex object', async () => {
            const res = await chai.request(server).get(`/data/search?id=${ID3}&encryption_key=${KEY}`);

            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.should.deep.contain({id: ID3, value: VALUE_OBJECT});
        });

        it('should perform a search when id contains wildcard', async () => {
            const res = await chai.request(server).get(`/data/search?id=id*&encryption_key=${KEY}`);

            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.should.deep.contain({id: ID1, value: VALUE1}, {id: ID2, value: VALUE2});
        });

        it('should return 400 when required params are not provided', async () => {
            const res = await chai.request(server).get('/data/search');

            res.status.should.eql(400);
        });
    });
});