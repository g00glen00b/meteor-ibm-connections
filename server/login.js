var handleLogin = function(loginRequest) {
	var service = new ConnectionsService(loginRequest.username, loginRequest.password),
		userId = null, user = null, stampedToken = null, myKey = null;
	if (service.isValid()) {
		userId = null;
		user = Meteor.users.findOne({
			username: loginRequest.username
		});
	
		if(!user) {
			userId = Meteor.users.insert({
				username: loginRequest.username
			});
		} else {
			userId = user._id;
		}

		stampedToken = Accounts._generateStampedLoginToken();
		myKey = SecurityService.generateKey(userId);
		Meteor.users.update(userId, {
			$push: {
				'services.resume.loginTokens': stampedToken
			},
			$set: {
				'password': SecurityService.encryptData(loginRequest.password, myKey),
				'displayName': service.getDisplayName(),
				'communities': service.getCommunityUids()
			}
		});

		return {
			id: userId,
			token: stampedToken.token
		};
	}  
};

Accounts.registerLoginHandler(function(loginRequest) {
	var output = null;
	if (loginRequest !== null && loginRequest.username !== undefined && loginRequest.password !== undefined) {
		output = handleLogin(loginRequest);
	}
	return output;
});