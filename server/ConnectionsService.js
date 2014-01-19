var API_URL = "http://connections.cronos.be",
	_ = Npm.require("underscore");
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
	
	this.getCommunities = function() {
		var auth = this.getAuthentication();
		var data = HTTP.get(API_URL + "/communities/service/atom/communities/my", {
			auth: auth
		});
		var obj = xml2js.parseStringSync(data.content);
		return _.map(obj.feed.entry, function(entry) {
			var summary = _.filter(entry['summary'], function(summary) {
				return summary['$'].type === "text"
			})[0]._;
			return {
				uid: entry['snx:communityUuid'][0],
				title: entry.title[0]._,
				members: entry['snx:membercount'][0],
				type: entry['snx:communityType'][0],
				summary: summary,
				updated: new Date(entry.updated)
			};
		});
	};
};