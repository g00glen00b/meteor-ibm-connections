Template.login.events = {
	"submit": function(evt) {
		evt.preventDefault();
		
		Accounts.callLoginMethod({
			methodArguments: [$(evt.target).serializeObject()],
			userCallback: function(data) {
				Session.set("loginFailed", data !== undefined);
				Template.communities.getCommunities();
			}
		});
	}
};

Template.login.loginFailed = function() {
	return Session.get("loginFailed");
};