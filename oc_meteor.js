Comments = new Mongo.Collection("comments");

if (Meteor.isServer) {
    Meteor.publish("comments", function () {
        return Comments.find();
    });

    // surely this can't stay?
    Roles.addUsersToRoles("a9YuAzFmPHaXpPvbS", 'super-admin');

}

if (Meteor.isClient) {
    Meteor.subscribe("comments");

    Router.route('/', function () {
        this.render('home');
    });

    // Router.route('/ocadmin', function () {
    //     this.render('adminPanel');
    // });

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

    Template.adminPanelOption.helpers({
        isAdmin: function () {
            return true;
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
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
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
