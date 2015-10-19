    Meteor.publish("comments", function () {
        return Comments.find();
    });

    Meteor.publish("adminPanelUserData", function () {
        return Meteor.users.find({}, {fields: {'username': 1, 'adminPanel': 1}});
    });

    Meteor.publish("challenges", function () {
        return Challenges.find();
    });