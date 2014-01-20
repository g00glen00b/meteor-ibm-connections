/*jslint nomen: true*/
/*jslint node: true */
/*globals Npm, Meteor, Profiles, Accounts, ConnectionsService */
"use strict";

var _ = Npm.require("underscore");

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
	var communities = [],
        user = Meteor.users.findOne({
		_id: this.userId
	},  {
		fields: {
			'communities': 1
		}
	});
	if (user !== undefined && user.communities !== undefined) {
		communities = user.communities;
	}
	return Profiles.find({ }, {
		sort: {
			'displayName': 1
		}
	});
});

var handleLogin = function(loginRequest) {
    var service = new ConnectionsService(loginRequest.username, loginRequest.password),
        userId = null,
        user = null,
        stampedToken = null;
    if (service.isValid()) {
        userId = null;
        user = Meteor.users.findOne({
            username: loginRequest.username
        });
    
        if(!user) {
            userId = Meteor.users.insert({
                username: loginRequest.username
            });
        } else {
            userId = user._id;
        }

        stampedToken = Accounts._generateStampedLoginToken();
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

        return {
            id: userId,
            token: stampedToken.token
        };
    }  
};

var getCredentials = function() {
	return Meteor.users.findOne({
		_id : Meteor.userId()
	}, {
		'username': 1,
		'password': 1
	});
};

var getService = function() {
    var auth = getCredentials();
    return new ConnectionsService(auth.username, auth.password);
};

Accounts.registerLoginHandler(function(loginRequest) {
    var output = null;
    if (loginRequest !== null && loginRequest.username !== undefined && loginRequest.password !== undefined) {
        output = handleLogin(loginRequest);
    }
    return output;
});

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
		return getService().getProfiles(communityId);
	}
});