_ = Npm.require("underscore");

Meteor.startup(function() {
	
});

Meteor.publish("user_meta", function() {
	return Meteor.users.find({
		_id: this.userId
	},  {
		fields: {
			'displayName': 1
		}
	});
});

Meteor.publish("profiles", function() {
	var user = Meteor.users.findOne({
		_id: this.userId
	},  {
		fields: {
			'communities': 1
		}
	});
	var communities = [];
	if (user !== undefined && user.communities !== undefined) {
		communities = user.communities;
	}
	return Profiles.find({
		community: {
			$in: communities
		}
	}, {
		sort: {
			'displayName': 1
		}
	});
});

Accounts.registerLoginHandler(function(loginRequest) {
	var output = null;
	if (loginRequest !== null && loginRequest.username !== undefined && loginRequest.password !== undefined) {
		var service = new ConnectionsService(loginRequest.username, loginRequest.password);
		if (service.isValid()) {
			var userId = null;
			var user = Meteor.users.findOne({
				username: loginRequest.username
			});
		
			if(!user) {
				userId = Meteor.users.insert({
					username: loginRequest.username
				});
			} else {
				userId = user._id;
			}
	
			var stampedToken = Accounts._generateStampedLoginToken();
			Meteor.users.update(userId, {
				$push: {
					'services.resume.loginTokens': stampedToken
				},
				$set: {
					'password': loginRequest.password,
					'displayName': service.getDisplayName(),
					'communities': service.getCommunityUids()
				}
			});
	
			output = {
				id: userId,
				token: stampedToken.token
			};
		}
	}
	return output;
});

var getCredentials = function() {
	return Meteor.users.findOne({
		_id : Meteor.userId()
	}, {
		'username': 1,
		'password': 1
	});
};

Meteor.methods({
	getCommunities: function() {
		var auth = getCredentials();
		var service = new ConnectionsService(auth.username, auth.password);
		return service.getCommunities();
	},
	
	getProfiles: function(communityId) {
		var auth = getCredentials();
		var service = new ConnectionsService(auth.username, auth.password);
		var profiles = service.getProfiles(communityId);
		_.each(profiles, function(profile) {
			Profiles.upsert({
				uid: profile.uid
			}, {
				$set: profile,
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
		var auth = getCredentials();
		var service = new ConnectionsService(auth.username, auth.password);
		return service.getProfiles(communityId);
	}
});