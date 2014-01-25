var Crypto = Npm.require("crypto"), securityData = JSON.parse(Assets.getText("security.json")),
	seed = Math.floor(Math.random() * securityData.maxRandom);

SecurityService = {
	generateKey: function(/** String */ data) {
		var myData = data;
		for (var i = 0; i  < securityData.repeat; i++) {
			var hashing = Crypto.createHash(securityData.algorithms.hash);
			hashing.update(myData + securityData.secret + seed);
			myData = hashing.digest("hex");
		}
		return myData;
	},

	encryptData: function(/** String */ data, /** String */ key) {
		var cipher = Crypto.createCipher(securityData.algorithms.cipher, key), chunks = [];
		chunks.push(cipher.update(data, "utf8", "hex"));
		chunks.push(cipher.final("hex"));
		return chunks.join('');
	},

	decryptData: function(/** String */ data, /** String */ key) {
		var decipher = Crypto.createDecipher(securityData.algorithms.cipher, key), chunks = [];
		chunks.push(decipher.update(data, "hex", "utf8"));
		chunks.push(decipher.final("utf8"));
		return chunks.join('');
	}	
};