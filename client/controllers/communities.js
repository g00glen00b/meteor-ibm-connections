/*jslint nomen: true*/
/*jslint node: true */
/*globals Template, Communities, Meteor */
"use strict";

Template.communities.communities = function() {
	return Communities.find({}, {
		sort: {
			'title': 1
		}
	});
};


Template.communities.getCommunities = function() {
	var idx;
	if (Meteor.userId()) {
		Meteor.call("getCommunities", function(error, communities) {
			if (communities.length !== undefined) {
				for (idx = 0; idx < communities.length; idx+=1) {
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

Deps.autorun(function() {
	Template.communities.getCommunities();
});