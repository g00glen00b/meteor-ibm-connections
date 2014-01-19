var API_URL = "http://connections.cronos.be";
ConnectionsService = function(/** String */ username, /** String */ password) {
	this.username = username;;
	this.password = password;
	this.profileData = null;

	this.getAuthentication = function() {
		return this.username + ":" + this.password;
	}
	this.isValid = function() {
		var isValid = true;
		try {
			this.getProfileData();
		} catch (exc) {
			isValid = false;
		}
		return isValid;
	};
	this.getProfileData = function() {
		var auth = this.getAuthentication();
		this.profileData = HTTP.get(API_URL + "/profiles/atom/profileService.do", {
			auth: auth
		});
	};
	this.getDisplayName = function() {
		if (this.profileData === null) {
			this.getProfileData();
		}
		var obj = xml2js.parseStringSync(this.profileData.content);
		console.log(obj.service.workspace[0]['atom:title'][0]._);
		return obj.service.workspace[0]['atom:title'][0]._;
	};
};