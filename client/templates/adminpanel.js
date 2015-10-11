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
    createdAtModified: function () {
        var timestamp = this.createdAt;
        return timestamp.toString().slice(15,25);
    }
});

Template.adminPanel.events({
    "submit .new-video": function (event) {
        event.preventDefault();

        var videoLink = event.target.videoLink.value;
        var challengeDate = event.target.challengeDate.value;
        var challengeTitle = event.target.challengeTitle.value;
        var challengeDescription = event.target.challengeDescription.value;

        Meteor.call("addVideo", videoLink);
        Meteor.call("addChallenge", challengeDate, challengeTitle, challengeDescription);

        event.target.videoLink.value = "";
        event.target.challengeDate.value = "";
        event.target.challengeTitle.value = "";
        event.target.challengeDescription.value = "";
    },
    "click .delete-button": function () {
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
    }
});
