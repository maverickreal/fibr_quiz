const axios = require('axios').create({ validateStatus: false });
const app = require('../../src/index.js');

app.listen(process.env.USERAPIPORT);

// jest.setTimeout(100000);

describe('running tests', () => {
    test('testing sign up', async () => {
        const res = await axios.post(`http://127.0.0.1:${process.env.USERAPIPORT}/user`, {
            firstName: 'alpha',
            lastName: 'beta',
            email: 'abc@xyz.org',
            quizes: [],
            password: '#Password9'
        });
        console.log(1, res.data);
        expect(res.status).toBe(200);
    });
    let token;
    test('testing signing in', async () => {
        const res = await axios.post(`http://127.0.0.1:${process.env.USERAPIPORT}/user/signin`, {
            email: 'abc@xyz.org',
            password: '#Password9'
        });
        console.log(2, res.data);
        token = res.data.token;
        expect(res.status).toBe(200);
    });
    test('testing user update', async () => {
        const res = await axios.patch(`http://127.0.0.1:${process.env.USERAPIPORT}/user`, {
            token: token,
            firstName: 'sigma',
            lastName: 'male'
        });
        console.log(4, res.data);
        expect(res.status).toBe(200);
    });
    test('testing signing out', async () => {
        const res = await axios.post(`http://127.0.0.1:${process.env.USERAPIPORT}/user/signout`, {
            token: token
        });
        console.log(3, res.data);
        expect(res.status).toBe(200);
    });
});