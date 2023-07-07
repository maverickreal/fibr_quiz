const MongoClient = require('mongodb').MongoClient,
  Hash = require('../utility/hash.js'),
  container = require('../di/main.js'),
  superagent = require('superagent');

class Db {
  static #crypt = container.resolve('crypt');

  static #db = null;

  static init = async () => {
    const client = new MongoClient(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    await client.connect();
    db = client.db(process.env.DBNAME);
  };

  static async verifyCredentials({ email, phoneNumber }) {
    const resp = await superagent.get(process.env.USERAPI + '/verify')
      .query({ email, phoneNumber });
    return resp.status === 200;
  };

  static async userExists(email, password) {
    const resp = await superagent.get(process.env.USERAPI + '/user')
      .query({ email, password });
    return { data: resp.body.data };
  };

  static async createUser(user) {
    const resp = await superagent.post(process.env.USERAPI + '/user')
      .send(user);
    return resp.body.data;
  };

  static async updateUser(userId, user) {
    const resp = await superagent.patch(process.env.USERAPI + '/user')
      .send({ userId, user });
    return resp.status != 200;
  }

  static async updatePassword(user, newPassword) {
    const resp = await superagent.patch(process.env.USERAPI + '/password')
      .send({ user, newPassword });
    return resp.status != 200;
  }
}

module.exports = Db;