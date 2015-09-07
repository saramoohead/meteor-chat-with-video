    Meteor.publish("comments", function () {
        return Comments.find();
    });

    Meteor.publish("adminPanelUserData", function () {
        return Meteor.users.find({}, {fields: {'adminPanel': 1}});
    });

    Meteor.publish("videos", function () {
        return Videos.find();
    });