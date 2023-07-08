const axios = require('axios');
const app = require('../../src/index.js');

app.listen(process.env.AUTHAPIPORT);

//jest.setTimeout(100000);

describe('running tests', () => {
    let userId = 'abc123', token = '';

    test('testing authorise', async () => {
        const res = await axios.post(`http://127.0.0.1:${process.env.AUTHAPIPORT}/auth/authorise`, { user: { userId } });
        console.log(1, res.data.message);
        token = res.data.token;
        expect(res.status).toBe(200);
    });

    test('testing verify', async () => {
        const res = await axios.get(`http://127.0.0.1:${process.env.AUTHAPIPORT}/auth/authenticate`, { params: { token, userId } });
        console.log(2, res.data.message);
        expect(res.status).toBe(200);
    });

    test('testing unauthorise', async () => {
        const res = await axios.delete(`http://127.0.0.1:${process.env.AUTHAPIPORT}/auth/unauthorise`, { data: { user: { email: 'abc123' } } });
        console.log(3, res.data.message);
        expect(res.status).toBe(200);
    });
});