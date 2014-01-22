Profiles = new Meteor.Collection("profiles");

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
