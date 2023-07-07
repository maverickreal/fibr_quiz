const app = require('../../src/server.js'),
      st = require('supertest'),
      req = st(app);

//jest.setTimeout(100000);

describe('running tests', () => {

    let userId='abc123', token = '';

    test('testing authorise', async()=>{
        const res = await req.post('/authorise').send({
            user: { userId }
        });
        console.log(1, res.body.message);
        token=res.body.token;
        expect(res.status).toBe(200);
    })

    test('testing verify', async()=>{
        const res = await req.get('/verify').send({ token, userId });
        console.log(2, res.body.message);
        expect(res.status).toBe(200);
    })

    test('testing unauthorise', async()=>{
        const res = await req.put('/unauthorise').send({
            userId: 'abc123'
        });
        console.log(3, res.body.message);
        expect(res.status).toBe(200);
    })
});