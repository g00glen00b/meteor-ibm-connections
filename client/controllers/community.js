/*jslint nomen: true*/
/*jslint node: true */
/*globals Template, Session, Profiles, Communities */
"use strict";

Template.community.id = function() {
	return Session.get("communityId");
};

Template.community.community = function() {
	return Communities.findOne({
		uid: Session.get("communityId")
	});
};

Template.community.profiles = function() {
	var activeSort = {}, sort = Session.get("sort");
	if (sort === "alphabet") {
		activeSort = {
			"displayName": 1	
		};
	} else if (sort === "koffiekoeken") {
		activeSort = {
			"koffiekoeken": -1,
			"displayName": 1
		};
	} else if (sort === "alphabetReverse") {
		activeSort = {
			"displayName": -1
		}
	}
	return Profiles.find({
		communities: Session.get("communityId")
	}, {
		sort: activeSort 
	});
};

Template.community.events = {
	"click .alphabetically": function() {
		Session.set("sort", "alphabet");
	},
	
	"click .koffiekoeken": function() {
		Session.set("sort", "koffiekoeken");
	},
	
	"click .alphabeticallyReverse": function() {
		Session.set("sort", "alphabetReverse");
	}
};

Template.profile.events = {
	"click .add": function(evt) {
		Profiles.update({
			_id: this._id
		}, {
			$inc: {
				"koffiekoeken": parseInt($(evt.target).attr("data-amount"))
			}
		});
	}
};