/*jslint nomen: true*/
/*jslint node: true */
/*globals Handlebars, jQuery */
"use strict";

Handlebars.registerHelper('formatDate', function(date) {
	return jQuery.timeago(date); 
});

Handlebars.registerHelper('formatSummary', function(summary) {
	if (summary !== undefined) {
		return summary.replace(/[\r\n\t]/gi, "");
	}
});

Handlebars.registerHelper('isPublic', function(community) {
	return community.type !== "private";
});

Handlebars.registerHelper('activeSort', function(sort) {
    return Session.get('sort') === sort ? 'active' : '';
});

Handlebars.registerHelper('koffiekoekenAmount', function(amount) {
	return amount < 0 ? 'red' : '';
});

Handlebars.registerHelper('isLaurens', function(profile) {
	return profile.displayName === 'Peeters Laurens';
});