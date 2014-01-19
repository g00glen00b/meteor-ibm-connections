Template.navigation.user = function() {
	return Meteor.users.findOne({
		_id: Meteor.userId()
	}).displayName;
};

Template.navigation.events = {
	"click .logout": function() {
		Meteor.logout();
	}
};