Comments = new Mongo.Collection("comments");

if (Meteor.isServer) {
    Meteor.publish("comments", function () {
        return Comments.find();
    });

    Meteor.publish("adminPanelUserData", function () {
        return Meteor.users.find({}, {fields: {'adminPanel': 1}});
    });

    // surely this can't stay?
    // Roles.addUsersToRoles("a9YuAzFmPHaXpPvbS", 'super-admin');

}

if (Meteor.isClient) {
    Meteor.subscribe("comments");
    Meteor.subscribe("adminPanelUserData");

    Router.route('/', function () {
        this.render('home');
    });

    Template.comments.helpers({
        commentList: function () {
            return Comments.find({}, {sort: {createdAt: -1}});
        }
    });

    Template.deleteComments.helpers({
        isOwner: function () {
            return this.owner === Meteor.userId();
        }
    });

    Template.adminPanel.helpers({
        isAdminPanelOn: function () {
            if (Session.get("adminPanelStatus")) {
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
                console.log("****");
                console.log(user.adminPanel);
                return user.adminPanel;
            }
        }
    });

    Template.body.events({
        "submit .new-comment": function (event) {
            event.preventDefault();

            var commentText = event.target.commentText.value;

            Meteor.call("addComment", commentText);

            event.target.commentText.value = "";
        },
        "click .delete": function () {
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
                    Meteor.call("deleteComment", this._id);
                    swal("Deleted!", "Comment deleted.", "success");
                } else {
                }
            });
        },
        "change .admin-panel-toggle input": function (event) {
            Session.set("adminPanelStatus", event.target.checked);
        }
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
    }
});
