var API_URL = "http://connections.cronos.be",
	_ = Npm.require("underscore");
	
ConnectionsService = function(/** String */ username, /** String */ password) {
	this.username = username;
	this.password = password;
	this.profileData = null;

	this.getAuthentication = function() {
		return this.username + ":" + this.password;
	};
	
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
		var obj = null;
		if (this.profileData === null) {
			this.getProfileData();
		}
		obj = xml2js.parseStringSync(this.profileData.content);
		return obj.service.workspace[0]['atom:title'][0]._;
	};
	
	this.getCommunities = function() {
		var auth = this.getAuthentication(), data = null, obj = null;
		
		data = HTTP.get(API_URL + "/communities/service/atom/communities/my", {
			auth: auth
		});
		obj = xml2js.parseStringSync(data.content);
		return _.map(obj.feed.entry, function(entry) {
			var summary = _.filter(entry.summary, function(summary) {
				return summary.$.type === "text";
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
	
	this.getCommunityUids = function() {
		var communities = this.getCommunities();
		return _.map(communities, function(community) {
			return community.uid;
		});
	};
	
	this.getProfiles = function(/** String */ communityId) {
		var page = 1, profiles = [], results = null;
		do {
			results = this.getProfilesPage(communityId, page);
			profiles = profiles.concat(results.members);
			page += 1;
		} while (results.startIndex + results.itemsPerPage <= results.totalResults);
		return profiles;
	};
	
	this.getProfilesPage = function(/** String */ communityId, /** Integer */ page) {
		var auth = this.getAuthentication(), data = null, obj = null, members = null;
		
		data = HTTP.get(API_URL + "/communities/service/atom/community/members?communityUuid=" + communityId + "&page=" + page, {
			auth: auth
		});
		obj = xml2js.parseStringSync(data.content);
		members = _.map(obj.feed.entry, function(profile) {
			return {
				displayName: profile.title[0]._,
				uid: profile.contributor[0]['snx:userid'][0]._,
				mail: CryptoJS.MD5(profile.contributor[0]['email'][0]).toString()
			};
		});
		return {
			totalResults: obj.feed['opensearch:totalResults'][0]._,
			itemsPerPage: obj.feed['opensearch:itemsPerPage'][0]._,
			startIndex: obj.feed['opensearch:startIndex'][0]._,
			id: communityId,
			members: members
		};
	};
};