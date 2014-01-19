Template.communities.isLoggedIn = function() {
    return Meteor.userId();
};

Template.communities.communities = function() {
	return Communities.find();
};

if (Meteor.userId()) {
	Meteor.call("getCommunities", function(error, communities) {
		for (var idx = 0; idx < communities.length; idx++) {
			Communities.insert(communities[idx]);
		}
	});
}