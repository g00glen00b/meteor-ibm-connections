Meteor.startup(function () {
	
});

Meteor.publish("user_meta", function () {
	return Meteor.users.find({
		_id : this.userId
	},  {
		fields: {
			'displayName': 1
		}
	});
});

Accounts.registerLoginHandler(function(loginRequest) {
	var output = null;
	if (loginRequest !== null && loginRequest.username !== undefined && loginRequest.password !== undefined) {
		var service = new ConnectionsService(loginRequest.username, loginRequest.password);
		if (service.isValid()) {
			var userId = null;
			var user = Meteor.users.findOne({
				username: loginRequest.username
			});
		
			if(!user) {
				userId = Meteor.users.insert({
					username: loginRequest.username
				});
			} else {
				userId = user._id;
			}
	
			var stampedToken = Accounts._generateStampedLoginToken();
			Meteor.users.update(userId, {
				$push: {
					'services.resume.loginTokens': stampedToken
				},
				$set: {
					'password': loginRequest.password,
					'displayName': service.getDisplayName()
				}
			});
	
			output = {
				id: userId,
				token: stampedToken.token
			};
		}
	}
	return output;
});