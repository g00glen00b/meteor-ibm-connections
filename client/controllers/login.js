/*jslint nomen: true*/
/*jslint node: true */
/*globals Template, Accounts, Session, $ */
"use strict";

Template.login.events = {
	"submit": function(evt) {
		evt.preventDefault();
		
		Accounts.callLoginMethod({
			methodArguments: [$(evt.target).serializeObject()],
			userCallback: function(data) {
				Session.set("loginFailed", data !== undefined);
				if (data === undefined) {
					Session.set("sort", "alphabet");
				}
			}
		});
	}
};

Template.login.loginFailed = function() {
	return Session.get("loginFailed");
};