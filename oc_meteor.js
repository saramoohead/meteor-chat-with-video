Comments = new Mongo.Collection("comments");
Videos = new Mongo.Collection("videos");

if (Meteor.isServer) {
    Meteor.publish("comments", function () {
        return Comments.find();
    });

    Meteor.publish("adminPanelUserData", function () {
        return Meteor.users.find({}, {fields: {'adminPanel': 1}});
    });

    Meteor.publish("videos", function () {
        return Videos.find();
    });

    // surely this can't stay?
    // Roles.addUsersToRoles("a9YuAzFmPHaXpPvbS", 'super-admin');

}

if (Meteor.isClient) {
    Meteor.subscribe("comments");
    Meteor.subscribe("adminPanelUserData");
    Meteor.subscribe("videos");

    Router.route('/', function () {
        this.render('home');
    });

    Template.comments.helpers({
        commentList: function () {
            return Comments.find({}, {sort: {createdAt: -1}});
        },
        isOwner: function () {
            var user = Meteor.user();
            if (this.owner === Meteor.userId() || user.adminPanel) {
                return true;
            }
        }
    });

    Template.adminPanel.helpers({
        isAdminPanelOn: function () {
            if (Session.get("adminPanelStatus") == "admin on") {
                return true;
            } else {
                return false;
            }
        },
        toggleAdminPanelStatus: function () {
            return Session.get("adminPanelStatus");
        }
    });

    Template.body.helpers({
        adminPanelAccess: function () {
            var user = Meteor.user();
            if (user) {
                return user.adminPanel;
            }
        },
        adminPanelClass: function () {
            if (Session.get("adminPanelStatus") == "admin off" || !Session.get("adminPanelStatus")) {
                return "slideOutUp";
            } else {
                return "slideInDown";
            }
        }
    });

    Template.body.events({
        "click .admin-button": function(){
            if (!Session.get("adminPanelStatus")) {
                Session.set("adminPanelStatus", "admin on");
            } else if (Session.get("adminPanelStatus") == "admin off") {
                Session.set("adminPanelStatus", "admin on");
            } else {
                Session.set("adminPanelStatus", "admin off");
            }
        }
    });

    Template.comments.events({
        "submit .new-comment": function (event) {
            event.preventDefault();

            var commentText = event.target.commentText.value;

            Meteor.call("addComment", commentText);

            event.target.commentText.value = "";
        },
        "click .delete-comment": function () {
            var commentId = this._id;
            swal({
                title: "Delete comment?",
                type: "warning",
                text: "You can't get it back once it's gone.",
                confirmButtonText: "Delete",
                showCancelButton: true,
                allowOutsideClick: true
            },
            function(response){
                if (response === true) {
                    Meteor.call("deleteComment", commentId);
                    swal("Deleted!", "Comment deleted.", "success");
                } else {
                }
            });
        }
    });

    Template.adminPanel.events({
        "submit .new-video": function (event) {
            console.log("****")
            event.preventDefault();

            var videoLink = event.target.videoLink.value;

            Meteor.call("addVideo", videoLink);

            event.target.videoLink.value = "";
        },
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });

    Meteor.users.deny({
        update: function() {
            return true;
        }
    });
}

Meteor.methods({
    addComment: function (commentText) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Comments.insert({
            commentText: commentText,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    deleteComment: function (commentId) {
        Comments.remove(commentId);
    },
    addVideo: function (videoLink) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Videos.insert({
            videoLink: videoLink,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
});
