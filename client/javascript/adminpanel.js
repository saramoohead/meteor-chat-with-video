Template.adminPanel.rendered = function() {
    var template = this;
    $('#summernote').summernote({
        height: 400,
        maxHeight:600,
        minHeight:250,
    });
};

Template.adminPanel.helpers({
    isAdminPanelOn: function () {
        if (Session.get("adminPanelStatus") == "admin on") {
            return true;
        } else {
            return false;
        }
    },
    challengeList: function () {
        var challengeList = Challenges.find({}, {sort: {challengeDate: -1}});
        if (challengeList) {
            return challengeList;
        }
    },
    adminList: function () {
        var adminList = Meteor.users.find({ adminPanel: true });
        if (adminList) {
            return adminList;
        }
    },
    createdAtModified: function () {
        var timestamp = this.createdAt;
        return timestamp.toString().slice(15,25);
    }
});

Template.adminPanel.events({
    "submit .new-video": function (event) {
        event.preventDefault();

        var sHTML = $('#summernote').code();

        var challengeDate = event.target.challengeDate.value;
        var challengeTitle = event.target.challengeTitle.value;
        var challengeDescription = sHTML;
        var challengeVideoLink = event.target.challengeVideoLink.value;

        Meteor.call("addChallenge", challengeDate, challengeTitle, challengeDescription, challengeVideoLink);

        event.target.challengeDate.value = "";
        event.target.challengeTitle.value = "";
        // event.target.challengeDescription.value = "";
        event.target.challengeVideoLink.value = "";
    },
    "submit .new-admin": function (event) {
        event.preventDefault();

        var userName = event.target.userName.value;

        Meteor.call("addAdmin", userName);

        event.target.userName.value = "";
    },
    "click .delete-video": function () {
        var challengeId = this._id;
        swal({
            title: "Delete challenge?",
            type: "warning",
            text: "You can't get it back once it's gone.",
            confirmButtonText: "Delete",
            showCancelButton: true,
            allowOutsideClick: true
        },
        function(response){
            if (response === true) {
                Meteor.call("deleteChallenge", challengeId);
                swal("Deleted!", "Challenge deleted.", "success");
            } else {
            }
        });
    },
    "click .delete-admin": function () {
        var userId = this._id;

        Meteor.call("deleteAdmin", userId);
    }
});
