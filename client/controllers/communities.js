Template.communities.communities = function() {
	return Communities.find({}, {
		sort: {
			'title': 1
		}
	});
};


Template.communities.getCommunities = function() {
	if (Meteor.userId()) {
		Meteor.call("getCommunities", function(error, communities) {
			if (communities.length !== undefined) {
				for (var idx = 0; idx < communities.length; idx++) {
					Communities.upsert({
						uid: communities[idx].uid
					}, {
						$set: communities[idx]
					});
				}
			}
		});
	}
};

Template.communities.getCommunities();