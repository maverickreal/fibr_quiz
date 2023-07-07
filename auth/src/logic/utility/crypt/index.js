const crypto = require('crypto');

class Crypt{
	constructor(){
	 this.key = crypto.randomBytes(32);
	 this.iv = crypto.randomBytes(16);
	}

	encrypt(data) {
		const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
		let encrypted = cipher.update(data, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		return encrypted;
	}

	decrypt(enc) {
		const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
		let decrypted = decipher.update(enc, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}
}

module.exports = Crypt;