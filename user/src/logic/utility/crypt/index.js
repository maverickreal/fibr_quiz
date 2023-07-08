const crypto = require('crypto');

class Crypt {
    static #key = crypto.randomBytes(32);
    static #iv = crypto.randomBytes(16);

    static encrypt(data) {
        const cipher = crypto.createCipheriv('aes-256-cbc', Crypt.#key, Crypt.#iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decrypt(enc) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Crypt.#key, Crypt.#iv);
        let decrypted = decipher.update(enc, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = Crypt;