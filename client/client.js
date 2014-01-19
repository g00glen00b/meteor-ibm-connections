Meteor.Router.add({
	'/': 'communities',
});

Meteor.subscribe("user_meta");