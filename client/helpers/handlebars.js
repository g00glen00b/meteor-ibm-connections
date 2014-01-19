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