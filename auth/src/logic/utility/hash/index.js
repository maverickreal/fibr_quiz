const bcrypt = require('bcrypt');
const Constant = require('./constant.js');

class Hash {
  static rounds = Constant.hashRounds;

  static async hash(data, salt = null) {
    if (!salt) {
      salt = await bcrypt.genSalt(Hash.rounds);
    }
    return {
      password: await bcrypt.hash(data, salt),
      salt: salt
    }
  }

  static async check(newPassword, salt, existingHash) {
    const { password: npHash } = await Hash.hash(newPassword, salt);
    return (npHash === existingHash);
  }
}

module.exports = Hash;