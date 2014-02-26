Profiles.allow({
	'insert': function() {
		return false;
	},

	'update': function(userId, profile) {
		var communities = Meteor.users.findOne({
			_id: userId
		}).communities;
		var profileCommunities = profile.communities,
			match = false;
		for (var idx = 0; idx < communities.length && !match; idx++) {
			match = profileCommunities.indexOf(communities[idx]);
		}
		return match;
	},

	'remove': function() {
		return false;
	}
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
	return Profiles.find({ 
		communities: {
			$in: communities
		}
	}, {
		sort: {
			'displayName': 1
		}
	});
});