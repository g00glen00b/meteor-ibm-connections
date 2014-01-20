/*jslint nomen: true*/
/*jslint node: true */
/*globals Router, Session, Meteor */
"use strict";

Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function () {
	this.route('communities', {
		path: '/',
		template: 'communities'
	});
	
	this.route('community', {
	    path: '/:uid',
	    template: 'community',
	
	    before: [function () {
            Session.set("communityId", this.params.uid);
            Meteor.call("getProfiles", this.params.uid);
	    }]
	});
});

Meteor.autosubscribe(function() {
    Meteor.subscribe("user_meta");
    Meteor.subscribe("profiles");
});