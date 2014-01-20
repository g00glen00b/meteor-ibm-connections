Template.community.id = function() {
	return Session.get("communityId");
};

Template.community.community = function() {
	return Communities.findOne({
		uid: Session.get("communityId")
	});
};

Template.community.profiles = function() {
	return Profiles.find({
		communities: Session.get("communityId")
	});
};

Template.community.events = {
	"click .add": function(evt) {
		Profiles.update({
			_id: evt.target.value
		}, {
			$inc: {
				'koffiekoeken': 1
			}
		});
	},
	"click .remove": function(evt) {
		var profile = Profiles.findOne({
			_id: evt.target.value
		});
		if (profile.koffiekoeken !== undefined && profile.koffiekoeken > 0) {
			Profiles.update({
				_id: evt.target.value
			}, {
				$inc: {
					'koffiekoeken': -1
				}
			});
		}
	}
};