var _ = Npm.require("underscore");

Meteor.startup(function() {

});

var getCredentials = function() {
	var myKey = SecurityService.generateKey(Meteor.userId());
	var user = Meteor.users.findOne({
		_id : Meteor.userId()
	}, {
		'username': 1,
		'password': 1
	});
	user.password = SecurityService.decryptData(user.password, myKey);
	return user;
};

var getService = function() {
	var auth = getCredentials();
	return new ConnectionsService(auth.username, auth.password);
};

Meteor.methods({
	getCommunities: function() {
		return getService().getCommunities();
	},
	
	getProfiles: function(communityId) {
		var service = getService(),
			profiles = service.getProfiles(communityId);
		_.each(profiles, function(profile) {
			Profiles.upsert({
				uid: profile.uid
			}, {
				$set: profile
			});
			Profiles.update({
				uid: profile.uid,
				communities: {
					$ne: communityId
				}
			}, {
				$push: {
					communities: communityId
				}
			});
			
			Profiles.update({
				uid: profile.uid,
				koffiekoeken: { 
					$exists: false
				}
			}, {
				$set: {
					koffiekoeken: 0
				}
			});
		});
		return profiles;
	},
	
	getProfile: function(communityId) {
		return getService().getProfiles(communityId);
	},
	
});