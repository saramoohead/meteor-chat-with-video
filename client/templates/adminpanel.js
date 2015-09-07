Template.adminPanel.helpers({
    isAdminPanelOn: function () {
        if (Session.get("adminPanelStatus") == "admin on") {
            return true;
        } else {
            return false;
        }
    }
});

Template.adminPanel.events({
    "submit .new-video": function (event) {
        event.preventDefault();

        var videoLink = event.target.videoLink.value;

        Meteor.call("addVideo", videoLink);

        event.target.videoLink.value = "";
    },
});