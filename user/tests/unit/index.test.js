const axios = require('axios').create({ validateStatus: false });
const app = require('../../src/index.js');

app.listen(process.env.USERAPIPORT);

// jest.setTimeout(100000);

describe('running tests', () => {
    test('testing create user (1)', async () => {
        const res = await axios.post(`http://127.0.0.1:${process.env.USERAPIPORT}/user`, {
            firstName: 'alpha',
            lastName: 'beta',
            email: 'abc@xyz.org',
            quizes: []
        });
        console.log(1, res.data.message);
        expect(res.status).toBe(200);
    });
    test('testing get user', async () => {
        const res = await axios.get(`http://127.0.0.1:${process.env.USERAPIPORT}/user`, {
            params: {
                email: 'abc@xyz.org'
            }
        });
        console.log(2, res.data.message);
        expect(res.status).toBe(200);
    });
    test('testing create user (2)', async () => {
        const res = await axios.post(`http://127.0.0.1:${process.env.USERAPIPORT}/user`, {
            firstName: 'alpha',
            lastName: 'beta',
            email: 'abc@xyz.org',
            quizes: []
        });
        console.log(3, res.data.message);
        expect(res.status).toBe(400);
    });
});