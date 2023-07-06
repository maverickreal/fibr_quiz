const bcrypt = require('bcrypt');

class Hash {
  static rounds = 10;

  static async hash(data, salt=null) {
    if(!salt){
      salt = await bcrypt.genSalt(Hash.rounds);
    }
    return {
      password: await bcrypt.hash(data, salt),
      salt: salt
    }
  }

  static async check(newPassword, salt, existingHash) {
    const {password: npHash} = await Hash.hash(newPassword, salt);
    return (npHash === existingHash);
  }
}

module.exports = Hash;