/*jslint nomen: true*/
/*jslint node: true */
/*globals Template, Meteor */
"use strict";

Template.layout.isLoggedIn = function() {
	return Meteor.userId();
};