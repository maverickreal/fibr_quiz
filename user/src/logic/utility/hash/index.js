const bcrypt = require('bcrypt');
const Constant = require('../constant/index.js')

class Hash {
    static async hash(data, salt = null) {
        if (!salt) {
            salt = await bcrypt.genSalt(Constant.hashRounds);
        }
        return {
            hash: await bcrypt.hash(data, salt),
            salt: salt
        }
    }

    static async check(newPassword, salt, existingHash) {
        const { hash: npHash } = await Hash.hash(newPassword, salt);
        return (npHash === existingHash);
    }
}

module.exports = Hash;