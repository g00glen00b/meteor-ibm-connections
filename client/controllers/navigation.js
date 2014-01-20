/*jslint nomen: true*/
/*jslint node: true */
/*globals Template, Meteor */
"use strict";

Template.navigation.user = function() {
	var displayName = null, user = Meteor.users.findOne({
		_id: Meteor.userId()
	});
	
	if (user !== undefined) {
        displayName = user.displayName;
    }
    return displayName;
};

Template.navigation.events = {
	"click .logout": function() {
		Meteor.logout();
	}
};